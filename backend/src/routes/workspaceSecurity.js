const express = require('express')
const { prisma } = require('../prisma')
const { requireRole, requireMinRole, ROLES } = require('../middleware/auth')
const { mapState } = require('../services/integrationStatusService')
const {
  resendOnboardingEmail,
  checkHealth,
  checkIntegrationStatus,
  markManualComplete,
} = require('../services/workspaceSecurityService')
const { NotFoundError, ForbiddenError } = require('../utils/errors')
const { parsePagination, paginatedResponse } = require('../utils/pagination')

const router = express.Router()

const PP_CODE = 'WORKSPACE_SECURITY'

// ─── Ownership helpers ────────────────────────────────────────────────────────

function buildCustomerWhere(auth) {
  const { role, orgId } = auth
  if (role === ROLES.SUPER_ADMIN) return {}
  if (role === ROLES.DISTRIBUTOR_ADMIN) return { distributorId: orgId }
  if (role === ROLES.INTEGRATOR_ADMIN) return { integratorId: orgId }
  if (role === ROLES.CUSTOMER_ADMIN || role === ROLES.CUSTOMER_VIEWER) return { id: orgId }
  throw new ForbiddenError()
}

function mapOnboardingStage(tenant) {
  if (!tenant) return 'created'
  if (tenant.protectionStatus === 'PROTECTION_ACTIVE') return 'active'
  if (tenant.microsoftConsentStatus === 'MICROSOFT_CONSENT_COMPLETED') return 'configured'
  if (tenant.adminStatus !== 'ADMIN_NOT_INVITED') return 'invited'
  return 'created'
}

function mapHealth(tenant) {
  if (!tenant) return { complianceScore: 0, alertsCount: 0 }
  if (tenant.protectionStatus === 'PROTECTION_ACTIVE') return { complianceScore: 96, alertsCount: 0 }
  if (tenant.emailServiceStatus === 'EMAIL_SERVICE_CONFIGURATION_STARTED') return { complianceScore: 74, alertsCount: 1 }
  return { complianceScore: 42, alertsCount: 2 }
}

// ─── Overview ─────────────────────────────────────────────────────────────────

router.get('/overview', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customers = await prisma.customer.findMany({
      where,
      include: {
        products: { where: { product: { code: PP_CODE } }, include: { workspaceTenant: true } },
        orders: { where: { items: { some: { product: { code: PP_CODE } } } } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const ppCustomers = customers.filter((c) => c.products.length > 0)
    const totalCustomers = ppCustomers.length
    const activeCustomers = ppCustomers.filter(
      (c) => c.products[0]?.workspaceTenant?.protectionStatus === 'PROTECTION_ACTIVE'
    ).length

    const monthMap = new Map()
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthMap.set(key, { month: d.toLocaleDateString('en-US', { month: 'short' }), customers: 0 })
    }
    ppCustomers.forEach((c) => {
      const d = new Date(c.createdAt)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (monthMap.has(key)) monthMap.get(key).customers++
    })

    return res.json({
      kpis: {
        totalCustomers,
        activeCustomers,
        pendingOnboarding: totalCustomers - activeCustomers,
        openAlerts: ppCustomers.reduce((s, c) => s + mapHealth(c.products[0]?.workspaceTenant).alertsCount, 0),
        totalOrders: ppCustomers.reduce((s, c) => s + c.orders.length, 0),
      },
      growthData: Array.from(monthMap.values()),
      customerHealth: ppCustomers.slice(0, 8).map((c) => ({
        customerId: c.id,
        companyName: c.companyName,
        onboardingStatus: mapOnboardingStage(c.products[0]?.workspaceTenant),
        ...mapHealth(c.products[0]?.workspaceTenant),
      })),
      recentCustomers: ppCustomers.slice(0, 5).map((c) => ({
        id: c.id,
        companyName: c.companyName,
        domain: c.domain,
        onboardingStatus: mapOnboardingStage(c.products[0]?.workspaceTenant),
        complianceScore: mapHealth(c.products[0]?.workspaceTenant).complianceScore,
      })),
    })
  } catch (err) {
    next(err)
  }
})

// ─── Customers list ───────────────────────────────────────────────────────────

router.get('/customers-list', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const { page, limit, skip } = parsePagination(req.query)

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        include: {
          products: {
            where: { product: { code: PP_CODE } },
            include: { workspaceTenant: true, product: { select: { code: true } } },
          },
          orders: {
            where: { items: { some: { product: { code: PP_CODE } } } },
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { items: { include: { product: { select: { code: true } } } } },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.customer.count({ where }),
    ])

    const data = customers.map((c) => {
      const cp = c.products[0]
      const tenant = cp?.workspaceTenant
      return {
        id: c.id,
        companyName: c.companyName,
        domain: c.domain,
        adminEmail: c.adminEmail,
        status: c.status,
        onboardingStatus: mapOnboardingStage(tenant),
        hasWorkspaceSecurity: Boolean(cp),
        seats: cp?.seats || 0,
        ppOrgId: tenant?.ppOrgId || null,
        ppAdminUserId: tenant?.ppAdminUserId || null,
        complianceScore: mapHealth(tenant).complianceScore,
        alertsCount: mapHealth(tenant).alertsCount,
        createdAt: c.createdAt,
      }
    })

    return res.json(paginatedResponse(data, total, { page, limit }))
  } catch (err) {
    next(err)
  }
})

// ─── Customer profile ─────────────────────────────────────────────────────────

router.get('/customers/:customerId/profile', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customer = await prisma.customer.findFirst({
      where: { id: req.params.customerId, ...where },
      include: {
        products: {
          where: { product: { code: PP_CODE } },
          include: { workspaceTenant: true },
        },
        orders: {
          where: { items: { some: { product: { code: PP_CODE } } } },
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { product: { select: { code: true, name: true } } } } },
        },
        integrationStatusLog: { orderBy: { createdAt: 'desc' }, take: 20 },
      },
    })
    if (!customer) throw new NotFoundError('Customer')

    const cp = customer.products[0]
    const tenant = cp?.workspaceTenant
    const health = mapHealth(tenant)

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
      customerProduct: cp ? { id: cp.id, seats: cp.seats, status: cp.status, activatedAt: cp.activatedAt } : null,
      metrics: {
        protectedUsers: cp?.seats || 0,
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
  } catch (err) {
    next(err)
  }
})

// ─── Reports ──────────────────────────────────────────────────────────────────

router.get('/reports-summary', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customers = await prisma.customer.findMany({
      where,
      include: {
        products: { where: { product: { code: PP_CODE } }, include: { workspaceTenant: true } },
        orders: { where: { items: { some: { product: { code: PP_CODE } } } }, orderBy: { createdAt: 'desc' } },
      },
    })

    const ppCustomers = customers.filter((c) => c.products.length > 0)
    const allOrders = ppCustomers.flatMap((c) => c.orders)

    return res.json({
      totals: {
        customers: ppCustomers.length,
        activeCustomers: ppCustomers.filter((c) => c.products[0]?.workspaceTenant?.protectionStatus === 'PROTECTION_ACTIVE').length,
        orders: allOrders.length,
        activeOrders: allOrders.filter((o) => o.status === 'ACTIVE').length,
      },
      recentOrders: allOrders.slice(0, 10),
      downloadableReports: [
        { id: 'security-monthly', title: 'Perception Point Monthly Security Summary', type: 'PDF' },
        { id: 'onboarding-status', title: 'Perception Point Onboarding Status', type: 'CSV' },
      ],
    })
  } catch (err) {
    next(err)
  }
})

// ─── Audit logs ───────────────────────────────────────────────────────────────

router.get('/customers/:customerId/audit', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customer = await prisma.customer.findFirst({ where: { id: req.params.customerId, ...where } })
    if (!customer) throw new NotFoundError('Customer')

    const { page, limit, skip } = parsePagination(req.query)
    const [logs, total] = await Promise.all([
      prisma.integrationStatusLog.findMany({
        where: { customerId: customer.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.integrationStatusLog.count({ where: { customerId: customer.id } }),
    ])

    return res.json(paginatedResponse(logs, total, { page, limit }))
  } catch (err) {
    next(err)
  }
})

// ─── Onboarding state ─────────────────────────────────────────────────────────

router.get('/customers/:customerId/onboarding', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customer = await prisma.customer.findFirst({ where: { id: req.params.customerId, ...where } })
    if (!customer) throw new NotFoundError('Customer')

    const tenant = await prisma.workspaceSecurityTenant.findUnique({
      where: { customerId: customer.id },
    })
    if (!tenant) return res.status(404).json({ error: 'Workspace tenant not found' })

    const state = mapState(tenant)
    const ppPortal = process.env.PP_PORTAL_URL || 'https://app.perception-point.io'

    return res.json({
      title: 'Connect Microsoft 365 to activate Perception Point',
      subtitle: 'Your organization has been created. Onboarding is completed in the Perception Point portal through the Email Service Configuration wizard.',
      checklist: {
        organizationCreated: tenant.organizationStatus === 'ORGANIZATION_CREATED',
        adminUserInvited: tenant.adminStatus !== 'ADMIN_NOT_INVITED',
        licensesAssigned: tenant.seats > 0,
        emailServiceConnected: tenant.emailServiceStatus === 'EMAIL_SERVICE_CONFIGURATION_STARTED',
        microsoftConsentCompleted: tenant.microsoftConsentStatus === 'MICROSOFT_CONSENT_COMPLETED',
        dnsMailFlowCompleted: tenant.dnsMailFlowStatus === 'DNS_MAIL_FLOW_COMPLETED',
        protectionActive: tenant.protectionStatus === 'PROTECTION_ACTIVE',
      },
      state: state.state,
      message: state.message,
      portalUrl: ppPortal,
      deepLinkUrl: tenant.ppOrgId ? `${ppPortal}/org/${tenant.ppOrgId}` : null,
    })
  } catch (err) {
    next(err)
  }
})

// ─── Integration status ───────────────────────────────────────────────────────

router.get('/customers/:customerId/integration-status', requireMinRole(ROLES.CUSTOMER_VIEWER), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customer = await prisma.customer.findFirst({ where: { id: req.params.customerId, ...where } })
    if (!customer) throw new NotFoundError('Customer')

    const status = await checkIntegrationStatus({ customerId: customer.id, actor: req.auth })
    return res.json(status)
  } catch (err) {
    next(err)
  }
})

// ─── Resend onboarding email ──────────────────────────────────────────────────

router.post('/customers/:customerId/resend-onboarding-email', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customer = await prisma.customer.findFirst({ where: { id: req.params.customerId, ...where } })
    if (!customer) throw new NotFoundError('Customer')

    const result = await resendOnboardingEmail({ customerId: customer.id, actor: req.auth })
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// ─── Mark integration complete (admin override) ───────────────────────────────

router.post('/customers/:customerId/mark-integration-complete', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customer = await prisma.customer.findFirst({ where: { id: req.params.customerId, ...where } })
    if (!customer) throw new NotFoundError('Customer')

    const result = await markManualComplete({ customerId: customer.id, actor: req.auth })
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

// ─── Health check ─────────────────────────────────────────────────────────────

router.get('/customers/:customerId/health', requireMinRole(ROLES.INTEGRATOR_ADMIN), async (req, res, next) => {
  try {
    const where = buildCustomerWhere(req.auth)
    const customer = await prisma.customer.findFirst({ where: { id: req.params.customerId, ...where } })
    if (!customer) throw new NotFoundError('Customer')

    const result = await checkHealth({ customerId: customer.id })
    return res.json(result)
  } catch (err) {
    next(err)
  }
})

module.exports = router
