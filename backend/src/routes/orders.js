const express = require('express')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { requireRole, requireMinRole, ROLES } = require('../middleware/auth')
const { NotFoundError, ForbiddenError, ValidationError, AppError } = require('../utils/errors')
const { auditLog } = require('../utils/audit')
const { parsePagination, paginatedResponse } = require('../utils/pagination')
const { provisionOrder } = require('../services/provisioningService')

const router = express.Router()

const orderItemSchema = z.object({
  productId: z.string(),
  planId: z.string().optional(),
  seats: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
})

const createOrderSchema = z.object({
  customerId: z.string(),
  billingType: z.enum(['CREDIT_CARD', 'MONTHLY_INVOICE']),
  billingCycle: z.enum(['MONTHLY', 'ANNUAL']).optional(),
  currency: z.string().default('USD'),
  notes: z.string().optional(),
  estimatedUsers: z.number().int().positive().optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
})

// Derive the ownership where-clause for orders
async function ownershipWhere(auth) {
  const { role, orgId } = auth
  if (role === ROLES.SUPER_ADMIN) return {}
  if (role === ROLES.DISTRIBUTOR_ADMIN) return { distributorId: orgId }
  if (role === ROLES.INTEGRATOR_ADMIN) return { integratorId: orgId }
  if (role === ROLES.CUSTOMER_ADMIN || role === ROLES.CUSTOMER_VIEWER) return { customerId: orgId }
  throw new ForbiddenError()
}

async function getOwnedOrder(orderId, auth) {
  const where = await ownershipWhere(auth)
  const order = await prisma.order.findFirst({ where: { id: orderId, ...where }, include: { items: true } })
  if (!order) throw new NotFoundError('Order')
  return order
}

async function logOrderTransition(order, action, actor, extra = {}) {
  await auditLog({
    entityType: 'ORDER',
    entityId: order.id,
    action,
    actor,
    oldState: { status: order.status, paymentStatus: order.paymentStatus, approvalStatus: order.approvalStatus },
    newState: extra,
    orderId: order.id,
    customerId: order.customerId,
  })
}

// POST /api/orders
router.post('/', requireRole([ROLES.INTEGRATOR_ADMIN, ROLES.SUPER_ADMIN]), async (req, res, next) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Invalid input', parsed.error.flatten())

    const { role, orgId } = req.auth
    const payload = parsed.data

    const customer = await prisma.customer.findUnique({ where: { id: payload.customerId } })
    if (!customer) throw new NotFoundError('Customer')

    // Ownership: integrators can only create orders for their own customers
    if (role === ROLES.INTEGRATOR_ADMIN && customer.integratorId !== orgId) throw new ForbiddenError()

    // Validate all products exist
    const productIds = payload.items.map((i) => i.productId)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
    if (products.length !== new Set(productIds).size) throw new ValidationError('One or more products not found')

    // Detect if this is a PP-only (Workspace Security) order
    const productCodeMap = Object.fromEntries(products.map((p) => [p.id, p.code]))
    const allCodes = payload.items.map((i) => productCodeMap[i.productId])
    const isPPOrder = allCodes.length > 0 && allCodes.every((c) => c === 'WORKSPACE_SECURITY')

    // PP orders must use invoice billing (no credit card)
    if (isPPOrder && payload.billingType === 'CREDIT_CARD') {
      throw new ValidationError('Perception Point orders are invoice-only. Use billingType MONTHLY_INVOICE.')
    }

    // Compute total
    const totalAmount = payload.items.reduce((sum, item) => sum + item.seats * item.unitPrice, 0)

    // Initial status depends on billing type and product
    const isCreditCard = payload.billingType === 'CREDIT_CARD'
    let status
    if (isPPOrder) {
      status = 'PENDING_CDATA_APPROVAL'
    } else if (isCreditCard) {
      status = 'PAYMENT_PENDING'
    } else {
      status = 'PENDING_APPROVAL'
    }
    const paymentStatus = isCreditCard ? 'PENDING' : 'NOT_REQUIRED'
    const approvalStatus = isCreditCard ? 'NOT_REQUIRED' : 'PENDING'

    const order = await prisma.order.create({
      data: {
        distributorId: customer.distributorId,
        integratorId: customer.integratorId,
        customerId: customer.id,
        billingType: payload.billingType,
        billingCycle: payload.billingCycle || null,
        totalAmount,
        currency: payload.currency,
        status,
        paymentStatus,
        approvalStatus,
        notes: payload.notes,
        estimatedUsers: payload.estimatedUsers || null,
        submittedAt: new Date(),
        items: {
          create: payload.items.map((item) => ({
            productId: item.productId,
            planId: item.planId || null,
            seats: item.seats,
            unitPrice: item.unitPrice,
            totalPrice: item.seats * item.unitPrice,
          })),
        },
        ...(isCreditCard
          ? {
              payment: {
                create: {
                  amount: totalAmount,
                  currency: payload.currency,
                  status: 'PENDING',
                },
              },
            }
          : {
              invoice: {
                create: {
                  invoiceNumber: `INV-${Date.now()}`,
                  amount: totalAmount,
                  currency: payload.currency,
                  status: 'PENDING',
                  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // net 30
                },
              },
            }),
      },
      include: { items: { include: { product: { select: { code: true, name: true } } } }, payment: true, invoice: true },
    })

    await logOrderTransition(order, 'CREATED', req.auth, { status, totalAmount })

    return res.status(201).json(order)
  } catch (err) {
    next(err)
  }
})

// POST /api/orders/pp  — simplified PP order creation endpoint
router.post('/pp', requireRole([ROLES.INTEGRATOR_ADMIN, ROLES.SUPER_ADMIN]), async (req, res, next) => {
  try {
    const ppOrderSchema = z.object({
      customerId: z.string(),
      packageCode: z.enum(['ADES', 'EMSB']),
      billingCycle: z.enum(['MONTHLY', 'ANNUAL']).default('MONTHLY'),
      estimatedUsers: z.number().int().positive(),
      pricePerMailbox: z.number().positive(),
      notes: z.string().optional(),
      currency: z.string().default('USD'),
    })

    const parsed = ppOrderSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Invalid input', parsed.error.flatten())

    const { role, orgId } = req.auth
    const payload = parsed.data

    const customer = await prisma.customer.findUnique({ where: { id: payload.customerId } })
    if (!customer) throw new NotFoundError('Customer')
    if (role === ROLES.INTEGRATOR_ADMIN && customer.integratorId !== orgId) throw new ForbiddenError()

    const wsProduct = await prisma.product.findUnique({ where: { code: 'WORKSPACE_SECURITY' } })
    if (!wsProduct) throw new NotFoundError('WORKSPACE_SECURITY product not in catalog')

    const seats = payload.estimatedUsers
    const unitPrice = payload.pricePerMailbox
    const totalAmount = seats * unitPrice

    const order = await prisma.order.create({
      data: {
        distributorId: customer.distributorId,
        integratorId: customer.integratorId,
        customerId: customer.id,
        billingType: 'MONTHLY_INVOICE',
        billingCycle: payload.billingCycle,
        totalAmount,
        currency: payload.currency,
        status: 'PENDING_CDATA_APPROVAL',
        paymentStatus: 'NOT_REQUIRED',
        approvalStatus: 'PENDING',
        notes: payload.notes || null,
        estimatedUsers: seats,
        submittedAt: new Date(),
        items: {
          create: [{
            productId: wsProduct.id,
            seats,
            unitPrice,
            totalPrice: totalAmount,
          }],
        },
        invoice: {
          create: {
            invoiceNumber: `INV-PP-${Date.now()}`,
            amount: totalAmount,
            currency: payload.currency,
            status: 'PENDING',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        items: { include: { product: { select: { code: true, name: true } } } },
        invoice: true,
      },
    })

    await auditLog({
      entityType: 'ORDER',
      entityId: order.id,
      action: 'PP_ORDER_CREATED',
      actor: req.auth,
      newState: { status: 'PENDING_CDATA_APPROVAL', estimatedUsers: seats, packageCode: payload.packageCode },
      orderId: order.id,
      customerId: customer.id,
    })

    return res.status(201).json(order)
  } catch (err) {
    next(err)
  }
})

// GET /api/orders
router.get('/', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const baseWhere = await ownershipWhere(req.auth)
    const { page, limit, skip } = parsePagination(req.query)

    const { status, customerId, productCode } = req.query
    const andFilters = []
    if (status) andFilters.push({ status })
    if (customerId) andFilters.push({ customerId })
    if (productCode) andFilters.push({ items: { some: { product: { code: productCode } } } })

    const where = andFilters.length ? { AND: [baseWhere, ...andFilters] } : baseWhere

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: { include: { product: { select: { code: true, name: true } } } },
          customer: { select: { id: true, companyName: true } },
          payment: true,
          invoice: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return res.json(paginatedResponse(orders, total, { page, limit }))
  } catch (err) {
    next(err)
  }
})

// GET /api/orders/:id
router.get('/:id', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const order = await getOwnedOrder(req.params.id, req.auth)

    const full = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: { include: { product: true, plan: true } },
        customer: { select: { id: true, companyName: true, domain: true } },
        payment: true,
        invoice: true,
        provisioningJobs: { include: { logs: { orderBy: { createdAt: 'desc' } } }, orderBy: { createdAt: 'desc' }, take: 1 },
        auditLogs: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    })

    return res.json(full)
  } catch (err) {
    next(err)
  }
})

// POST /api/orders/:id/pay  (credit card flow — simulated)
router.post('/:id/pay', requireRole([ROLES.INTEGRATOR_ADMIN, ROLES.SUPER_ADMIN]), async (req, res, next) => {
  try {
    const order = await getOwnedOrder(req.params.id, req.auth)
    if (order.billingType !== 'CREDIT_CARD') throw new AppError('Order is not a credit card order', 400)
    if (order.paymentStatus === 'PAID') throw new AppError('Order already paid', 400)

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'PAID',
        approvalStatus: 'APPROVED',
        status: 'APPROVED',
        approvedAt: new Date(),
        payment: { update: { status: 'PAID', paidAt: new Date() } },
      },
    })

    await logOrderTransition(order, 'PAID', req.auth, { status: 'APPROVED', paymentStatus: 'PAID' })

    await provisionOrder(updated)

    const latest = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true, payment: true } })
    return res.json(latest)
  } catch (err) {
    next(err)
  }
})

// POST /api/orders/:id/approve  (distributor/CData approves invoice order)
router.post('/:id/approve', requireRole([ROLES.DISTRIBUTOR_ADMIN, ROLES.SUPER_ADMIN]), async (req, res, next) => {
  try {
    const order = await getOwnedOrder(req.params.id, req.auth)
    if (order.billingType !== 'MONTHLY_INVOICE') throw new AppError('Not an invoice order', 400)

    const approvableStatuses = ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL']
    if (!approvableStatuses.includes(order.status)) {
      throw new AppError(`Order status '${order.status}' is not pending approval`, 400)
    }

    // PP orders transition to APPROVED_BY_CDATA; legacy orders to APPROVED
    const isPPOrder = order.status === 'PENDING_CDATA_APPROVAL'
    const newStatus = isPPOrder ? 'APPROVED_BY_CDATA' : 'APPROVED'

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        approvalStatus: 'APPROVED',
        status: newStatus,
        approvedAt: new Date(),
        invoice: { update: { status: 'PAID', paidAt: new Date() } },
      },
    })

    await logOrderTransition(order, 'APPROVED', req.auth, { status: newStatus })

    await provisionOrder(updated)

    const latest = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true, invoice: true } })
    return res.json(latest)
  } catch (err) {
    next(err)
  }
})

// POST /api/orders/:id/reject
router.post('/:id/reject', requireRole([ROLES.DISTRIBUTOR_ADMIN, ROLES.SUPER_ADMIN]), async (req, res, next) => {
  try {
    const order = await getOwnedOrder(req.params.id, req.auth)
    const reason = req.body?.reason || 'Rejected by distributor'

    // PP orders get REJECTED_BY_CDATA; legacy orders get CANCELLED
    const isPPOrder = order.status === 'PENDING_CDATA_APPROVAL'
    const newStatus = isPPOrder ? 'REJECTED_BY_CDATA' : 'CANCELLED'

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: {
        approvalStatus: 'REJECTED',
        status: newStatus,
        rejectedAt: new Date(),
        failureReason: reason,
      },
    })

    await logOrderTransition(order, 'REJECTED', req.auth, { status: 'CANCELLED', reason })

    return res.json(updated)
  } catch (err) {
    next(err)
  }
})

// POST /api/orders/:id/cancel
router.post('/:id/cancel', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const order = await getOwnedOrder(req.params.id, req.auth)
    const cancelable = ['DRAFT', 'PAYMENT_PENDING', 'PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL']
    if (!cancelable.includes(order.status)) throw new AppError(`Cannot cancel order in status ${order.status}`, 400)

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: { status: 'CANCELLED', failureReason: req.body?.reason || 'Cancelled by user' },
    })

    await logOrderTransition(order, 'CANCELLED', req.auth, { status: 'CANCELLED' })

    return res.json(updated)
  } catch (err) {
    next(err)
  }
})

// POST /api/orders/:id/provision  (manual re-trigger)
router.post('/:id/provision', requireRole([ROLES.DISTRIBUTOR_ADMIN, ROLES.INTEGRATOR_ADMIN, ROLES.SUPER_ADMIN]), async (req, res, next) => {
  try {
    const order = await getOwnedOrder(req.params.id, req.auth)
    if (order.status !== 'APPROVED' && order.status !== 'FAILED') {
      throw new AppError(`Cannot provision order in status ${order.status}`, 400)
    }

    await provisionOrder(order)
    await logOrderTransition(order, 'PROVISION_TRIGGERED', req.auth)

    const latest = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } })
    return res.json(latest)
  } catch (err) {
    next(err)
  }
})

module.exports = router
