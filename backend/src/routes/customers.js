const express = require('express')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { requireRole } = require('../middleware/auth')

const router = express.Router()

const createCustomerSchema = z.object({
  integratorId: z.string(),
  distributorId: z.string(),
  companyName: z.string().min(2),
  domain: z.string().min(3),
  adminName: z.string().min(2),
  adminEmail: z.email(),
  adminPhone: z.string().min(3),
})

router.post('/', requireRole(['integrator']), async (req, res) => {
  const parsed = createCustomerSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() })
  const customer = await prisma.customer.create({ data: parsed.data })
  return res.status(201).json(customer)
})

router.get('/', requireRole(['distributor', 'integrator', 'customer']), async (req, res) => {
  const { integratorId, distributorId } = req.query
  const customers = await prisma.customer.findMany({
    where: {
      integratorId: integratorId || undefined,
      distributorId: distributorId || undefined,
    },
    orderBy: { createdAt: 'desc' },
  })
  return res.json(customers)
})

module.exports = router
