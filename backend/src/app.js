const express = require('express')
const cors = require('cors')
const { errorHandler } = require('./utils/errors')

const authRoutes = require('./routes/auth')
const usersRoutes = require('./routes/users')
const distributorsRoutes = require('./routes/distributors')
const integratorsRoutes = require('./routes/integrators')
const customersRoutes = require('./routes/customers')
const ordersRoutes = require('./routes/orders')
const workspaceRoutes = require('./routes/workspaceSecurity')

const app = express()

app.use(cors())
app.use(express.json())

// Health probe — no auth
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'sase-marketplace-backend', version: '2.0.0' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/distributors', distributorsRoutes)
app.use('/api/integrators', integratorsRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/workspace-security', workspaceRoutes)

// Centralized error handler (must be last middleware)
app.use(errorHandler)

module.exports = { app }
