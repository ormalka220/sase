const express = require('express')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const { prisma } = require('../prisma')
const { authenticate } = require('../middleware/auth')
const { ValidationError } = require('../utils/errors')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-prod'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// POST /api/auth/login
// In demo mode returns a signed JWT for any valid demo user (no password check).
// In production, verify passwordHash with bcrypt before issuing token.
router.post('/login', async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) throw new ValidationError('Invalid input', parsed.error.flatten())

    const { email } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: {
          include: {
            distributor: true,
            integrator: true,
            customer: true,
          },
        },
      },
    })

    if (!user) {
      // Return generic message — don't reveal whether user exists
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // TODO: compare parsed.data.password with user.passwordHash using bcrypt
    // For now, demo mode accepts any password for seeded users
    if (process.env.NODE_ENV === 'production' && !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

    const orgId = user.organization.distributor?.id
      || user.organization.integrator?.id
      || user.organization.customer?.id
      || null

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
        orgId,
        orgType: user.organization.type,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        orgId,
        orgType: user.organization.type,
        organizationName: user.organization.name,
      },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      include: {
        organization: {
          include: {
            distributor: true,
            integrator: true,
            customer: true,
          },
        },
      },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const orgId = user.organization.distributor?.id
      || user.organization.integrator?.id
      || user.organization.customer?.id
      || null

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      orgId,
      orgType: user.organization.type,
      organizationName: user.organization.name,
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/auth/demo-users — returns demo login shortcuts (dev only)
router.get('/demo-users', async (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).json({ error: 'Not found' })
  }
  try {
    const users = await prisma.user.findMany({
      include: {
        organization: {
          include: {
            distributor: true,
            integrator: true,
            customer: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const demoUsers = users.map((u) => {
      const orgId = u.organization.distributor?.id
        || u.organization.integrator?.id
        || u.organization.customer?.id
        || null
      return {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        orgId,
        orgType: u.organization.type,
        organizationName: u.organization.name,
      }
    })

    return res.json(demoUsers)
  } catch (err) {
    next(err)
  }
})

module.exports = router
