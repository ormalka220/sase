const express = require('express')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { requireRole, requireMinRole, ROLES } = require('../middleware/auth')
const { NotFoundError, ForbiddenError, ValidationError, ConflictError } = require('../utils/errors')
const { auditLog } = require('../utils/audit')
const { parsePagination, paginatedResponse } = require('../utils/pagination')

const router = express.Router()

const createUserSchema = z.object({
  organizationId: z.string(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['SUPER_ADMIN', 'DISTRIBUTOR_ADMIN', 'INTEGRATOR_ADMIN', 'CUSTOMER_ADMIN', 'CUSTOMER_VIEWER']),
})

function canManageRole(actorRole, targetRole) {
  const { SUPER_ADMIN, DISTRIBUTOR_ADMIN, INTEGRATOR_ADMIN } = ROLES
  if (actorRole === SUPER_ADMIN) return true
  if (actorRole === DISTRIBUTOR_ADMIN) {
    return [ROLES.INTEGRATOR_ADMIN, ROLES.CUSTOMER_ADMIN, ROLES.CUSTOMER_VIEWER].includes(targetRole)
  }
  if (actorRole === INTEGRATOR_ADMIN) {
    return [ROLES.CUSTOMER_ADMIN, ROLES.CUSTOMER_VIEWER].includes(targetRole)
  }
  return false
}

// GET /api/users — list users visible to the requester
router.get('/', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const { role, orgId } = req.auth
    const { page, limit, skip } = parsePagination(req.query)

    let where = {}
    if (role === ROLES.SUPER_ADMIN) {
      // No filter — see all
    } else if (role === ROLES.DISTRIBUTOR_ADMIN) {
      // See users in their distributor org + all integrator/customer orgs under them
      const dist = await prisma.distributor.findUnique({ where: { id: orgId } })
      if (!dist) throw new NotFoundError('Distributor')
      const integrators = await prisma.integrator.findMany({ where: { distributorId: orgId }, select: { organizationId: true } })
      const customers = await prisma.customer.findMany({ where: { distributorId: orgId }, select: { organizationId: true } })
      const orgIds = [dist.organizationId, ...integrators.map((i) => i.organizationId), ...customers.map((c) => c.organizationId)]
      where = { organizationId: { in: orgIds } }
    } else if (role === ROLES.INTEGRATOR_ADMIN) {
      const intg = await prisma.integrator.findUnique({ where: { id: orgId } })
      if (!intg) throw new NotFoundError('Integrator')
      const customers = await prisma.customer.findMany({ where: { integratorId: orgId }, select: { organizationId: true } })
      const orgIds = [intg.organizationId, ...customers.map((c) => c.organizationId)]
      where = { organizationId: { in: orgIds } }
    } else {
      throw new ForbiddenError()
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { organization: { select: { id: true, name: true, type: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ])

    return res.json(paginatedResponse(users.map(safeUser), total, { page, limit }))
  } catch (err) {
    next(err)
  }
})

// POST /api/users
router.post('/', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const parsed = createUserSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Invalid input', parsed.error.flatten())

    const { role: actorRole } = req.auth
    if (!canManageRole(actorRole, parsed.data.role)) {
      throw new ForbiddenError('Cannot assign this role')
    }

    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (existing) throw new ConflictError('Email already in use')

    const user = await prisma.user.create({ data: parsed.data, include: { organization: { select: { id: true, name: true, type: true } } } })

    await auditLog({
      entityType: 'USER',
      entityId: user.id,
      action: 'CREATED',
      actor: req.auth,
      newState: { email: user.email, role: user.role },
    })

    return res.status(201).json(safeUser(user))
  } catch (err) {
    next(err)
  }
})

// DELETE /api/users/:id
router.delete('/:id', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } })
    if (!user) throw new NotFoundError('User')
    if (!canManageRole(req.auth.role, user.role)) throw new ForbiddenError()

    await prisma.user.delete({ where: { id: user.id } })
    await auditLog({ entityType: 'USER', entityId: user.id, action: 'DELETED', actor: req.auth, oldState: { email: user.email } })

    return res.json({ success: true })
  } catch (err) {
    next(err)
  }
})

function safeUser(u) {
  const { passwordHash: _, ...rest } = u
  return rest
}

module.exports = router
