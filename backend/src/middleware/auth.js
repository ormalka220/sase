function requireRole(allowedRoles) {
  return (req, res, next) => {
    const role = req.header('x-role')
    const userId = req.header('x-user-id') || 'system'
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    req.auth = { role, userId }
    next()
  }
}

module.exports = { requireRole }
