const express = require('express')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { requireRole, requireMinRole, ROLES } = require('../middleware/auth')
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors')
const { auditLog } = require('../utils/audit')
const { parsePagination, paginatedResponse } = require('../utils/pagination')

const router = express.Router()

const createCustomerSchema = z.object({
  integratorId: z.string(),
  companyName: z.string().min(2),
  domain: z.string().min(3),
  adminName: z.string().min(2),
  adminEmail: z.string().email(),
  adminPhone: z.string().min(3),
})

// Derive the Prisma `where` filter that enforces ownership for the calling user
async function ownershipWhere(auth) {
  const { role, orgId } = auth
  if (role === ROLES.SUPER_ADMIN) return {}
  if (role === ROLES.DISTRIBUTOR_ADMIN) return { distributorId: orgId }
  if (role === ROLES.INTEGRATOR_ADMIN) return { integratorId: orgId }
  if (role === ROLES.CUSTOMER_ADMIN || role === ROLES.CUSTOMER_VIEWER) {
    // orgId for customer roles is the Customer.id
    return { id: orgId }
  }
  throw new ForbiddenError()
}

// POST /api/customers
router.post('/', requireRole([ROLES.INTEGRATOR_ADMIN, ROLES.SUPER_ADMIN]), async (req, res, next) => {
  try {
    const parsed = createCustomerSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Invalid input', parsed.error.flatten())

    const { role, orgId } = req.auth
    const integratorId = role === ROLES.INTEGRATOR_ADMIN ? orgId : parsed.data.integratorId

    const integrator = await prisma.integrator.findUnique({ where: { id: integratorId } })
    if (!integrator) throw new NotFoundError('Integrator')

    const org = await prisma.organization.create({
      data: { name: parsed.data.companyName, type: 'CUSTOMER' },
    })

    const customer = await prisma.customer.create({
      data: {
        organizationId: org.id,
        integratorId,
        distributorId: integrator.distributorId,
        companyName: parsed.data.companyName,
        domain: parsed.data.domain,
        adminName: parsed.data.adminName,
        adminEmail: parsed.data.adminEmail,
        adminPhone: parsed.data.adminPhone,
      },
      include: { organization: { select: { id: true, name: true } } },
    })

    await auditLog({
      entityType: 'CUSTOMER',
      entityId: customer.id,
      action: 'CREATED',
      actor: req.auth,
      newState: { companyName: customer.companyName },
      customerId: customer.id,
    })

    return res.status(201).json(customer)
  } catch (err) {
    next(err)
  }
})

// GET /api/customers
router.get('/', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const baseWhere = await ownershipWhere(req.auth)
    const { page, limit, skip } = parsePagination(req.query)

    // Optional filters
    const { search, status, productCode } = req.query
    const andFilters = []

    if (search) {
      andFilters.push({
        OR: [
          { companyName: { contains: search } },
          { domain: { contains: search } },
          { adminEmail: { contains: search } },
        ],
      })
    }
    if (status) andFilters.push({ status })

    if (productCode) {
      andFilters.push({
        products: {
          some: { product: { code: productCode } },
        },
      })
    }

    const where = andFilters.length > 0 ? { AND: [baseWhere, ...andFilters] } : baseWhere

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          products: {
            include: { product: { select: { id: true, code: true, name: true } } },
          },
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ])

    return res.json(paginatedResponse(customers, total, { page, limit }))
  } catch (err) {
    next(err)
  }
})

// GET /api/customers/:id
router.get('/:id', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const baseWhere = await ownershipWhere(req.auth)

    const customer = await prisma.customer.findFirst({
      where: { id: req.params.id, ...baseWhere },
      include: {
        organization: { select: { id: true, name: true, type: true } },
        integrator: { include: { organization: { select: { name: true } } } },
        distributor: { include: { organization: { select: { name: true } } } },
        products: {
          include: {
            product: true,
            plan: true,
            workspaceTenant: true,
          },
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { items: { include: { product: { select: { code: true, name: true } } } } },
        },
        auditLogs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })

    if (!customer) throw new NotFoundError('Customer')

    return res.json(customer)
  } catch (err) {
    next(err)
  }
})

// PATCH /api/customers/:id
router.patch('/:id', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const baseWhere = await ownershipWhere(req.auth)
    const existing = await prisma.customer.findFirst({ where: { id: req.params.id, ...baseWhere } })
    if (!existing) throw new NotFoundError('Customer')

    const allowed = ['companyName', 'adminName', 'adminEmail', 'adminPhone', 'status']
    const data = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) data[key] = req.body[key]
    }

    const updated = await prisma.customer.update({ where: { id: existing.id }, data })

    await auditLog({
      entityType: 'CUSTOMER',
      entityId: existing.id,
      action: 'UPDATED',
      actor: req.auth,
      oldState: existing,
      newState: data,
      customerId: existing.id,
    })

    return res.json(updated)
  } catch (err) {
    next(err)
  }
})

module.exports = router
