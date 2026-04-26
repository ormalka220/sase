const express = require('express')
const cors = require('cors')
const ordersRoutes = require('./routes/orders')
const workspaceRoutes = require('./routes/workspaceSecurity')
const customersRoutes = require('./routes/customers')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'workspace-security-backend' })
})

app.use('/api/orders', ordersRoutes)
app.use('/api/customers', customersRoutes)
app.use('/api/workspace-security', workspaceRoutes)

module.exports = { app }
