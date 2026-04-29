const { prisma } = require('../prisma')
const { PerceptionPointClient } = require('./perceptionPointClient')
const { EmailService } = require('./emailService')
const { auditLog } = require('../utils/audit')
const { NotFoundError } = require('../utils/errors')
const { syncWorkspaceCustomerActivation } = require('./workspaceActivationService')

const ppClient = new PerceptionPointClient()
const emailService = new EmailService()

async function getCustomerTenant(customerId) {
  return prisma.workspaceSecurityTenant.findUnique({ where: { customerId } })
}

// Create org in Perception Point (called during provisioning — exposed here for re-try flows)
async function createOrganization({ customerId }) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } })
  if (!customer) throw new NotFoundError('Customer')

  const existing = await getCustomerTenant(customerId)
  if (existing?.ppOrgId) return { alreadyExists: true, tenant: existing }

  const org = await ppClient.createOrganization({
    companyName: customer.companyName,
    domain: customer.domain,
    seats: 0,
    adminEmail: customer.adminEmail,
  })

  await auditLog({
    entityType: 'CUSTOMER',
    entityId: customerId,
    action: 'PP_ORG_CREATED',
    actor: { userId: 'system', role: 'SYSTEM' },
    newState: { ppOrgId: org.orgId },
    customerId,
  })

  return { created: true, org }
}

// Invite admin user (called during provisioning — exposed here for re-try flows)
async function inviteAdmin({ customerId }) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } })
  if (!customer) throw new NotFoundError('Customer')

  const tenant = await getCustomerTenant(customerId)
  if (!tenant?.ppOrgId) throw new Error('Organization not yet created')

  const result = await ppClient.inviteAdmin({
    orgId: tenant.ppOrgId,
    adminName: customer.adminName,
    adminEmail: customer.adminEmail,
  })

  await prisma.workspaceSecurityTenant.update({
    where: { customerId },
    data: { adminStatus: 'ADMIN_INVITED', ppAdminUserId: result.userId },
  })

  await auditLog({
    entityType: 'CUSTOMER',
    entityId: customerId,
    action: 'PP_ADMIN_INVITED',
    actor: { userId: 'system', role: 'SYSTEM' },
    newState: { adminEmail: customer.adminEmail },
    customerId,
  })

  return result
}

async function resendOnboardingEmail({ customerId, actor }) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } })
  if (!customer) throw new NotFoundError('Customer')

  const result = await emailService.sendCustomerOnboardingEmail({
    customer,
    portalUrl: process.env.PP_PORTAL_URL || 'https://app.perception-point.io',
  })

  await prisma.integrationStatusLog.create({
    data: {
      customerId,
      status: 'onboarding-email-resent',
      source: 'MANUAL',
      details: 'Onboarding email resent by admin',
      createdBy: actor?.userId || 'system',
    },
  })

  await auditLog({
    entityType: 'CUSTOMER',
    entityId: customerId,
    action: 'ONBOARDING_EMAIL_RESENT',
    actor,
    customerId,
  })

  return { sent: true, result }
}

async function checkHealth({ customerId }) {
  const tenant = await getCustomerTenant(customerId)
  if (!tenant) return { healthy: false, reason: 'No tenant provisioned' }

  const signals = await ppClient.fetchSignals({ orgId: tenant.ppOrgId })
  const healthy = Boolean(signals.health)

  if (healthy) {
    await prisma.workspaceSecurityTenant.update({
      where: { customerId },
      data: { lastHealthCheckAt: new Date() },
    })
  }

  return { healthy, signals }
}

async function checkIntegrationStatus({ customerId, actor }) {
  const { resolveIntegrationStatus } = require('./integrationStatusService')
  return resolveIntegrationStatus(customerId)
}

async function markManualComplete({ customerId, actor }) {
  const tenant = await getCustomerTenant(customerId)
  if (!tenant) throw new NotFoundError('Workspace tenant')

  const updated = await prisma.workspaceSecurityTenant.update({
    where: { customerId },
    data: {
      protectionStatus: 'PROTECTION_ACTIVE',
      microsoftConsentStatus: 'MICROSOFT_CONSENT_COMPLETED',
      dnsMailFlowStatus: 'DNS_MAIL_FLOW_COMPLETED',
      emailServiceStatus: 'EMAIL_SERVICE_CONFIGURATION_STARTED',
      manualCompletedBy: actor?.userId || 'system',
      manualCompletedAt: new Date(),
      lastSuccessfulScanAt: tenant.lastSuccessfulScanAt || new Date(),
      lastHealthCheckAt: tenant.lastHealthCheckAt || new Date(),
    },
  })

  await prisma.integrationStatusLog.create({
    data: {
      customerId,
      status: 'active',
      source: 'MANUAL',
      details: 'Marked complete by admin',
      createdBy: actor?.userId || 'system',
    },
  })

  await auditLog({
    entityType: 'CUSTOMER',
    entityId: customerId,
    action: 'INTEGRATION_MANUALLY_COMPLETED',
    actor,
    newState: { protectionStatus: 'PROTECTION_ACTIVE' },
    customerId,
  })

  await syncWorkspaceCustomerActivation({ customerId, actor })

  return { success: true, tenant: updated }
}

module.exports = {
  createOrganization,
  inviteAdmin,
  resendOnboardingEmail,
  checkHealth,
  checkIntegrationStatus,
  markManualComplete,
}
