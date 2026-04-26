const express = require('express')
const { prisma } = require('../prisma')
const { requireRole } = require('../middleware/auth')
const { resolveIntegrationStatus, mapState } = require('../services/integrationStatusService')
const { EmailService } = require('../services/emailService')

const router = express.Router()
const emailService = new EmailService()
const PP_PRODUCT = 'WORKSPACE_SECURITY'

function mapCustomerHealth(tenant) {
  if (!tenant) return { complianceScore: 0, alertsCount: 0 }
  if (tenant.protectionStatus === 'PROTECTION_ACTIVE') return { complianceScore: 96, alertsCount: 0 }
  if (tenant.emailServiceStatus === 'EMAIL_SERVICE_CONFIGURATION_STARTED') return { complianceScore: 74, alertsCount: 1 }
  return { complianceScore: 42, alertsCount: 2 }
}

function mapOnboardingStage(tenant) {
  if (!tenant) return 'created'
  if (tenant.protectionStatus === 'PROTECTION_ACTIVE') return 'active'
  if (tenant.microsoftConsentStatus === 'MICROSOFT_CONSENT_COMPLETED') return 'configured'
  if (tenant.adminStatus !== 'ADMIN_NOT_INVITED') return 'invited'
  return 'created'
}

router.get('/overview', requireRole(['integrator', 'distributor', 'customer']), async (req, res) => {
  const { integratorId, distributorId } = req.query
  const where = {
    integratorId: integratorId || undefined,
    distributorId: distributorId || undefined,
  }
  const customers = await prisma.customer.findMany({
    where,
    include: { workspaceTenant: true, orders: { where: { productType: PP_PRODUCT } } },
    orderBy: { createdAt: 'desc' },
  })
  const orders = await prisma.order.findMany({
    where: {
      productType: PP_PRODUCT,
      integratorId: integratorId || undefined,
      distributorId: distributorId || undefined,
    },
  })

  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c) => c.workspaceTenant?.protectionStatus === 'PROTECTION_ACTIVE').length
  const pendingOnboarding = customers.filter((c) => c.workspaceTenant?.protectionStatus !== 'PROTECTION_ACTIVE').length
  const openAlerts = customers.reduce((sum, c) => sum + mapCustomerHealth(c.workspaceTenant).alertsCount, 0)

  const monthMap = new Map()
  const now = new Date()
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthMap.set(key, { month: d.toLocaleDateString('en-US', { month: 'short' }), customers: 0 })
  }
  customers.forEach((c) => {
    const d = new Date(c.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (monthMap.has(key)) {
      monthMap.get(key).customers += 1
    }
  })

  return res.json({
    kpis: { totalCustomers, activeCustomers, pendingOnboarding, openAlerts, totalOrders: orders.length },
    growthData: Array.from(monthMap.values()),
    customerHealth: customers.slice(0, 8).map((c) => ({
      customerId: c.id,
      companyName: c.companyName,
      onboardingStatus: mapOnboardingStage(c.workspaceTenant),
      ...mapCustomerHealth(c.workspaceTenant),
    })),
    recentCustomers: customers.slice(0, 5).map((c) => ({
      id: c.id,
      companyName: c.companyName,
      domain: c.domain,
      onboardingStatus: mapOnboardingStage(c.workspaceTenant),
      complianceScore: mapCustomerHealth(c.workspaceTenant).complianceScore,
    })),
  })
})

router.get('/customers-list', requireRole(['integrator', 'distributor']), async (req, res) => {
  const { integratorId, distributorId } = req.query
  const customers = await prisma.customer.findMany({
    where: {
      integratorId: integratorId || undefined,
      distributorId: distributorId || undefined,
    },
    include: {
      workspaceTenant: true,
      orders: {
        where: { productType: PP_PRODUCT },
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return res.json(customers.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    domain: c.domain,
    adminEmail: c.adminEmail,
    status: c.status,
    onboardingStatus: mapOnboardingStage(c.workspaceTenant),
    seats: c.workspaceTenant?.seats || c.orders[0]?.seats || 0,
    productType: PP_PRODUCT,
    ppOrgId: c.workspaceTenant?.ppOrgId || null,
    ppAdminUserId: c.workspaceTenant?.ppAdminUserId || null,
    complianceScore: mapCustomerHealth(c.workspaceTenant).complianceScore,
    alertsCount: mapCustomerHealth(c.workspaceTenant).alertsCount,
    createdAt: c.createdAt,
  })))
})

router.get('/customers/:customerId/profile', requireRole(['integrator', 'distributor', 'customer']), async (req, res) => {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.customerId },
    include: {
      workspaceTenant: true,
      orders: { where: { productType: PP_PRODUCT }, orderBy: { createdAt: 'desc' } },
      integrationStatusLog: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  })
  if (!customer) return res.status(404).json({ error: 'Customer not found' })

  const tenant = customer.workspaceTenant
  const health = mapCustomerHealth(tenant)
  return res.json({
    customer: {
      id: customer.id,
      companyName: customer.companyName,
      domain: customer.domain,
      adminName: customer.adminName,
      adminEmail: customer.adminEmail,
      adminPhone: customer.adminPhone,
      status: customer.status,
      onboardingStatus: mapOnboardingStage(tenant),
      createdAt: customer.createdAt,
    },
    tenant,
    metrics: {
      protectedUsers: tenant?.seats || 0,
      complianceScore: health.complianceScore,
      alertsCount: health.alertsCount,
      activeOrders: customer.orders.length,
    },
    recentActivity: customer.integrationStatusLog.map((l) => ({
      id: l.id,
      status: l.status,
      source: l.source,
      details: l.details,
      createdAt: l.createdAt,
    })),
  })
})

router.get('/reports-summary', requireRole(['integrator', 'distributor']), async (req, res) => {
  const { integratorId, distributorId } = req.query
  const orders = await prisma.order.findMany({
    where: {
      productType: PP_PRODUCT,
      integratorId: integratorId || undefined,
      distributorId: distributorId || undefined,
    },
    orderBy: { createdAt: 'desc' },
  })
  const customers = await prisma.customer.findMany({
    where: {
      integratorId: integratorId || undefined,
      distributorId: distributorId || undefined,
    },
    include: { workspaceTenant: true },
  })
  const activeCount = customers.filter((c) => c.workspaceTenant?.protectionStatus === 'PROTECTION_ACTIVE').length
  return res.json({
    totals: {
      customers: customers.length,
      activeCustomers: activeCount,
      orders: orders.length,
      provisionedOrders: orders.filter((o) => ['PROVISIONED', 'ONBOARDING_PENDING', 'ACTIVE'].includes(o.status)).length,
    },
    recentOrders: orders.slice(0, 10),
    downloadableReports: [
      { id: 'security-monthly', title: 'Perception Point Monthly Security Summary', type: 'PDF' },
      { id: 'onboarding-status', title: 'Perception Point Onboarding Status', type: 'CSV' },
    ],
  })
})

router.get('/customers/:customerId/audit', requireRole(['integrator', 'distributor', 'customer']), async (req, res) => {
  const logs = await prisma.integrationStatusLog.findMany({
    where: { customerId: req.params.customerId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })
  return res.json({
    customerId: req.params.customerId,
    entries: logs.map((l) => ({
      id: l.id,
      status: l.status,
      source: l.source,
      details: l.details,
      createdBy: l.createdBy,
      createdAt: l.createdAt,
    })),
  })
})

router.get('/customers/:customerId/onboarding', requireRole(['integrator', 'customer', 'distributor']), async (req, res) => {
  const tenant = await prisma.workspaceSecurityTenant.findUnique({
    where: { customerId: req.params.customerId },
    include: { customer: true },
  })
  if (!tenant) return res.status(404).json({ error: 'Workspace tenant not found' })
  const state = mapState(tenant)

  return res.json({
    title: 'Connect Microsoft 365 to activate Perception Point',
    subtitle:
      'Your organization has been created. For now, onboarding is completed only in the Perception Point portal through the Email Service Configuration wizard.',
    checklist: {
      organizationCreated: tenant.organizationStatus === 'ORGANIZATION_CREATED',
      adminUserInvited: tenant.adminStatus !== 'ADMIN_NOT_INVITED',
      licensesAssigned: tenant.seats > 0,
      emailServiceNotConnected: tenant.emailServiceStatus === 'EMAIL_SERVICE_NOT_CONNECTED',
      microsoftConsentPending: tenant.microsoftConsentStatus === 'MICROSOFT_CONSENT_PENDING',
      dnsMailFlowPending: tenant.dnsMailFlowStatus === 'DNS_MAIL_FLOW_PENDING',
      protectionActive: tenant.protectionStatus === 'PROTECTION_ACTIVE',
    },
    state: state.state,
    message: state.message,
    portalUrl: process.env.PP_PORTAL_URL || 'https://app.perception-point.io',
    deepLinkUrl: tenant.ppOrgId ? `${process.env.PP_PORTAL_URL || 'https://app.perception-point.io'}/org/${tenant.ppOrgId}` : null,
  })
})

router.get('/customers/:customerId/integration-status', requireRole(['integrator', 'customer', 'distributor']), async (req, res) => {
  const status = await resolveIntegrationStatus(req.params.customerId)
  return res.json(status)
})

router.post('/customers/:customerId/resend-onboarding-email', requireRole(['integrator', 'distributor']), async (req, res) => {
  const customer = await prisma.customer.findUnique({ where: { id: req.params.customerId } })
  if (!customer) return res.status(404).json({ error: 'Customer not found' })
  const result = await emailService.sendCustomerOnboardingEmail({
    customer,
    portalUrl: process.env.PP_PORTAL_URL || 'https://app.perception-point.io',
  })
  return res.json({ sent: true, result })
})

router.post('/customers/:customerId/mark-integration-complete', requireRole(['distributor', 'integrator']), async (req, res) => {
  const tenant = await prisma.workspaceSecurityTenant.findUnique({ where: { customerId: req.params.customerId } })
  if (!tenant) return res.status(404).json({ error: 'Workspace tenant not found' })
  const updated = await prisma.workspaceSecurityTenant.update({
    where: { customerId: req.params.customerId },
    data: {
      protectionStatus: 'PROTECTION_ACTIVE',
      microsoftConsentStatus: 'MICROSOFT_CONSENT_COMPLETED',
      dnsMailFlowStatus: 'DNS_MAIL_FLOW_COMPLETED',
      emailServiceStatus: 'EMAIL_SERVICE_CONFIGURATION_STARTED',
      manualCompletedBy: req.auth.userId,
      manualCompletedAt: new Date(),
      lastSuccessfulScanAt: tenant.lastSuccessfulScanAt || new Date(),
      lastHealthCheckAt: tenant.lastHealthCheckAt || new Date(),
    },
  })

  await prisma.integrationStatusLog.create({
    data: {
      customerId: req.params.customerId,
      status: 'active',
      source: 'MANUAL',
      details: 'Marked complete by admin fallback',
      createdBy: req.auth.userId,
    },
  })

  return res.json({ success: true, tenant: updated })
})

module.exports = router
