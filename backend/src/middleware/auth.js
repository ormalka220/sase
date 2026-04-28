const jwt = require('jsonwebtoken')

const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  DISTRIBUTOR_ADMIN: 'DISTRIBUTOR_ADMIN',
  INTEGRATOR_ADMIN: 'INTEGRATOR_ADMIN',
  CUSTOMER_ADMIN: 'CUSTOMER_ADMIN',
  CUSTOMER_VIEWER: 'CUSTOMER_VIEWER',
}

// Legacy demo header values → new canonical roles
const LEGACY_ROLE_MAP = {
  distributor: ROLES.DISTRIBUTOR_ADMIN,
  integrator: ROLES.INTEGRATOR_ADMIN,
  customer: ROLES.CUSTOMER_ADMIN,
  super_admin: ROLES.SUPER_ADMIN,
}

// Numeric level used by requireMinRole
const ROLE_LEVEL = {
  [ROLES.CUSTOMER_VIEWER]: 0,
  [ROLES.CUSTOMER_ADMIN]: 1,
  [ROLES.INTEGRATOR_ADMIN]: 2,
  [ROLES.DISTRIBUTOR_ADMIN]: 3,
  [ROLES.SUPER_ADMIN]: 4,
}

function extractAuth(req) {
  // 1. JWT Bearer token
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-change-in-prod')
    return {
      userId: decoded.sub,
      role: decoded.role,
      orgId: decoded.orgId,
      orgType: decoded.orgType,
      email: decoded.email,
      isDemo: false,
    }
  }

  // 2. Legacy demo headers (dev / staging only)
  if (process.env.NODE_ENV !== 'production') {
    const legacyRole = req.header('x-role')
    if (legacyRole) {
      const role = LEGACY_ROLE_MAP[legacyRole] || legacyRole
      return {
        userId: req.header('x-user-id') || 'demo-user',
        role,
        orgId: req.header('x-org-id') || null,
        orgType: null,
        email: null,
        isDemo: true,
      }
    }
  }

  return null
}

function authenticate(req, res, next) {
  try {
    const auth = extractAuth(req)
    if (!auth) return res.status(401).json({ error: 'Authentication required' })
    req.auth = auth
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function requireRole(allowedRoles) {
  return [
    authenticate,
    (req, res, next) => {
      if (!allowedRoles.includes(req.auth.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' })
      }
      next()
    },
  ]
}

function requireMinRole(minRole) {
  return [
    authenticate,
    (req, res, next) => {
      const userLevel = ROLE_LEVEL[req.auth.role] ?? -1
      const minLevel = ROLE_LEVEL[minRole] ?? 999
      if (userLevel < minLevel) {
        return res.status(403).json({ error: 'Forbidden: insufficient role' })
      }
      next()
    },
  ]
}

module.exports = { authenticate, requireRole, requireMinRole, ROLES, ROLE_LEVEL }
