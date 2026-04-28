const express = require('express')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { requireRole, requireMinRole, ROLES } = require('../middleware/auth')
const { NotFoundError, ForbiddenError, ValidationError } = require('../utils/errors')
const { parsePagination, paginatedResponse } = require('../utils/pagination')

const router = express.Router()

function scopeToDistributor(auth) {
  if (auth.role === ROLES.SUPER_ADMIN) return {}
  if (auth.role === ROLES.DISTRIBUTOR_ADMIN) return { id: auth.orgId }
  return null // forbidden
}

// GET /api/distributors
router.get('/', requireMinRole(ROLES.DISTRIBUTOR_ADMIN), async (req, res, next) => {
  try {
    const scope = scopeToDistributor(req.auth)
    if (scope === null) throw new ForbiddenError()

    const { page, limit, skip } = parsePagination(req.query)
    const where = scope

    const [distributors, total] = await Promise.all([
      prisma.distributor.findMany({
        where,
        skip,
        take: limit,
        include: {
          organization: { select: { id: true, name: true } },
          _count: { select: { integrators: true, customers: true, orders: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.distributor.count({ where }),
    ])

    return res.json(paginatedResponse(distributors, total, { page, limit }))
  } catch (err) {
    next(err)
  }
})

// GET /api/distributors/:id
router.get('/:id', requireMinRole(ROLES.DISTRIBUTOR_ADMIN), async (req, res, next) => {
  try {
    const { role, orgId } = req.auth
    if (role === ROLES.DISTRIBUTOR_ADMIN && orgId !== req.params.id) throw new ForbiddenError()

    const dist = await prisma.distributor.findUnique({
      where: { id: req.params.id },
      include: {
        organization: { select: { id: true, name: true } },
        integrators: {
          include: { organization: { select: { name: true } }, _count: { select: { customers: true } } },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { customers: true, orders: true } },
      },
    })
    if (!dist) throw new NotFoundError('Distributor')

    return res.json(dist)
  } catch (err) {
    next(err)
  }
})

module.exports = router
