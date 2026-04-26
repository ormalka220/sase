const express = require('express')
const { prisma } = require('../prisma')
const { requireRole } = require('../middleware/auth')
const { resolveIntegrationStatus, mapState } = require('../services/integrationStatusService')
const { EmailService } = require('../services/emailService')

const router = express.Router()
const emailService = new EmailService()

router.get('/customers/:customerId/onboarding', requireRole(['integrator', 'customer', 'distributor']), async (req, res) => {
  const tenant = await prisma.workspaceSecurityTenant.findUnique({
    where: { customerId: req.params.customerId },
    include: { customer: true },
  })
  if (!tenant) return res.status(404).json({ error: 'Workspace tenant not found' })
  const state = mapState(tenant)

  return res.json({
    title: 'Connect Microsoft 365 to activate Workspace Security',
    subtitle:
      'Your organization has been created. To start protecting email traffic, complete the Email Service Configuration wizard in the FortiMail Workspace Security portal.',
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
