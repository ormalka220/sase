const express = require('express')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { requireRole } = require('../middleware/auth')
const { provisionWorkspaceOrder } = require('../services/provisioningService')

const router = express.Router()

const createOrderSchema = z.object({
  distributorId: z.string(),
  integratorId: z.string(),
  customerId: z.string(),
  productType: z.enum(['FORTISASE', 'WORKSPACE_SECURITY']),
  seats: z.number().int().positive(),
  billingType: z.enum(['CREDIT_CARD', 'MONTHLY_INVOICE']),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
})

router.post('/', requireRole(['integrator']), async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const payload = parsed.data

  const customer = await prisma.customer.findUnique({ where: { id: payload.customerId } })
  if (!customer) return res.status(404).json({ error: 'Customer not found' })

  const order = await prisma.order.create({
    data: {
      ...payload,
      status: payload.billingType === 'MONTHLY_INVOICE' ? 'PENDING_DISTRIBUTOR_APPROVAL' : 'PAYMENT_PENDING',
      paymentStatus: payload.billingType === 'CREDIT_CARD' ? 'PENDING' : 'NOT_REQUIRED',
      approvalStatus: payload.billingType === 'MONTHLY_INVOICE' ? 'PENDING' : 'NOT_REQUIRED',
    },
  })

  return res.status(201).json(order)
})

router.post('/:orderId/pay', requireRole(['integrator']), async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (order.billingType !== 'CREDIT_CARD') return res.status(400).json({ error: 'Order is not credit card flow' })

  const paidOrder = await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'PAID', status: 'APPROVED', approvalStatus: 'APPROVED', approvedAt: new Date() },
  })
  await provisionWorkspaceOrder(paidOrder)
  const latest = await prisma.order.findUnique({ where: { id: order.id } })
  return res.json(latest)
})

router.post('/:orderId/approve', requireRole(['distributor']), async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  if (order.billingType !== 'MONTHLY_INVOICE') return res.status(400).json({ error: 'Not an invoice order' })

  const approved = await prisma.order.update({
    where: { id: order.id },
    data: { status: 'APPROVED', approvalStatus: 'APPROVED', approvedAt: new Date() },
  })
  await provisionWorkspaceOrder(approved)
  const latest = await prisma.order.findUnique({ where: { id: order.id } })
  return res.json(latest)
})

router.post('/:orderId/reject', requireRole(['distributor']), async (req, res) => {
  const reason = req.body?.reason || 'Rejected by distributor'
  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } })
  if (!order) return res.status(404).json({ error: 'Order not found' })

  const rejected = await prisma.order.update({
    where: { id: order.id },
    data: {
      status: 'REJECTED',
      approvalStatus: 'REJECTED',
      rejectedAt: new Date(),
      failureReason: reason,
    },
  })
  return res.json(rejected)
})

router.post('/:orderId/provision', requireRole(['distributor', 'integrator']), async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.orderId } })
  if (!order) return res.status(404).json({ error: 'Order not found' })
  await provisionWorkspaceOrder(order)
  const latest = await prisma.order.findUnique({ where: { id: order.id } })
  return res.json(latest)
})

router.get('/', requireRole(['distributor', 'integrator']), async (req, res) => {
  const { distributorId, integratorId, productType } = req.query
  const orders = await prisma.order.findMany({
    where: {
      distributorId: distributorId || undefined,
      integratorId: integratorId || undefined,
      productType: productType || undefined,
    },
    orderBy: { createdAt: 'desc' },
  })
  return res.json(orders)
})

module.exports = router
