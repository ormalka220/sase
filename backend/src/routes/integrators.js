const express = require('express')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { requireMinRole, ROLES } = require('../middleware/auth')
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors')
const { auditLog } = require('../utils/audit')
const { parsePagination, paginatedResponse } = require('../utils/pagination')

const router = express.Router()

const createIntegratorSchema = z.object({
  organizationName: z.string().min(2),
  contactEmail: z.string().email(),
  contactPhone: z.string().optional(),
  country: z.string().optional(),
  distributorId: z.string(),
})

function scopeWhere(auth) {
  const { role, orgId } = auth
  if (role === ROLES.SUPER_ADMIN) return {}
  if (role === ROLES.DISTRIBUTOR_ADMIN) return { distributorId: orgId }
  if (role === ROLES.INTEGRATOR_ADMIN) return { id: orgId }
  return null
}

// GET /api/integrators
router.get('/', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const where = scopeWhere(req.auth)
    if (where === null) throw new ForbiddenError()

    const { page, limit, skip } = parsePagination(req.query)

    const [integrators, total] = await Promise.all([
      prisma.integrator.findMany({
        where,
        skip,
        take: limit,
        include: {
          organization: { select: { id: true, name: true } },
          distributor: { include: { organization: { select: { name: true } } } },
          _count: { select: { customers: true, orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.integrator.count({ where }),
    ])

    return res.json(paginatedResponse(integrators, total, { page, limit }))
  } catch (err) {
    next(err)
  }
})

// GET /api/integrators/:id
router.get('/:id', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const { role, orgId } = req.auth
    if (role === ROLES.INTEGRATOR_ADMIN && orgId !== req.params.id) throw new ForbiddenError()

    const intg = await prisma.integrator.findUnique({
      where: { id: req.params.id },
      include: {
        organization: { select: { id: true, name: true } },
        distributor: { include: { organization: { select: { name: true } } } },
        customers: {
          include: {
            products: { include: { product: { select: { code: true, name: true } } } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        _count: { select: { customers: true, orders: true } },
      },
    })
    if (!intg) throw new NotFoundError('Integrator')

    // Distributors can see any integrator under them
    if (role === ROLES.DISTRIBUTOR_ADMIN && intg.distributorId !== orgId) throw new ForbiddenError()

    return res.json(intg)
  } catch (err) {
    next(err)
  }
})

// POST /api/integrators — distributor creates new integrator
router.post('/', requireMinRole(ROLES.DISTRIBUTOR_ADMIN), async (req, res, next) => {
  try {
    const parsed = createIntegratorSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Invalid input', parsed.error.flatten())

    const { role, orgId } = req.auth
    const distributorId = role === ROLES.DISTRIBUTOR_ADMIN ? orgId : parsed.data.distributorId

    const dist = await prisma.distributor.findUnique({ where: { id: distributorId } })
    if (!dist) throw new NotFoundError('Distributor')

    const org = await prisma.organization.create({
      data: { name: parsed.data.organizationName, type: 'INTEGRATOR' },
    })

    const integrator = await prisma.integrator.create({
      data: {
        organizationId: org.id,
        distributorId,
        contactEmail: parsed.data.contactEmail,
        contactPhone: parsed.data.contactPhone,
        country: parsed.data.country,
      },
      include: { organization: { select: { id: true, name: true } } },
    })

    await auditLog({ entityType: 'INTEGRATOR', entityId: integrator.id, action: 'CREATED', actor: req.auth, newState: { name: org.name } })

    return res.status(201).json(integrator)
  } catch (err) {
    next(err)
  }
})

module.exports = router
