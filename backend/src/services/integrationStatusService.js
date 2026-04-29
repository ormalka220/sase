const { prisma } = require('../prisma')
const { PerceptionPointClient } = require('./perceptionPointClient')
const { syncWorkspaceCustomerActivation } = require('./workspaceActivationService')

const ppClient = new PerceptionPointClient()

function mapState(tenant, { bundleAssignmentPending = false } = {}) {
  if (bundleAssignmentPending) {
    return {
      state: 'bundle_assignment_pending',
      message: 'Waiting for SpotNet bundle assignment before email service connection can begin.',
    }
  }
  if (tenant.protectionStatus === 'PROTECTION_ACTIVE') {
    return { state: 'active', message: 'Microsoft 365 is connected and Perception Point is active.' }
  }
  if (tenant.microsoftConsentStatus === 'MICROSOFT_CONSENT_COMPLETED' && tenant.dnsMailFlowStatus === 'DNS_MAIL_FLOW_PENDING') {
    return { state: 'dns_mail_flow_pending', message: 'Microsoft 365 consent may be completed, but DNS or mail-flow setup still appears incomplete.' }
  }
  if (tenant.emailServiceStatus === 'EMAIL_SERVICE_CONFIGURATION_STARTED') {
    return { state: 'in_progress', message: 'Waiting for Microsoft 365 connection to complete.' }
  }
  return { state: 'not_started', message: 'Email service has not been connected yet.' }
}

async function resolveIntegrationStatus(customerId) {
  const tenant = await prisma.workspaceSecurityTenant.findUnique({ where: { customerId } })
  if (!tenant) {
    return { state: 'not_started', message: 'Organization is not created yet.' }
  }
  const latestPpOrder = await prisma.order.findFirst({
    where: {
      customerId,
      items: { some: { product: { code: 'WORKSPACE_SECURITY' } } },
    },
    orderBy: { createdAt: 'desc' },
    select: { status: true },
  })
  if (latestPpOrder?.status === 'PENDING_SPOTNET_ASSIGNMENT') {
    const state = mapState(tenant, { bundleAssignmentPending: true })
    await prisma.integrationStatusLog.create({
      data: {
        customerId,
        status: state.state,
        source: 'SYSTEM',
        details: JSON.stringify({ orderStatus: latestPpOrder.status }),
        createdBy: 'system',
      },
    })
    return {
      ...state,
      tenant,
      manualCompletionAvailable: false,
    }
  }

  const signals = await ppClient.fetchSignals({ orgId: tenant.ppOrgId })
  const updates = {
    organizationStatus: signals.orgExists ? 'ORGANIZATION_CREATED' : tenant.organizationStatus,
    lastHealthCheckAt: signals.health ? new Date() : tenant.lastHealthCheckAt,
    emailServiceStatus:
      signals.health || signals.waitingForActivity
        ? 'EMAIL_SERVICE_CONFIGURATION_STARTED'
        : tenant.emailServiceStatus,
    microsoftConsentStatus: signals.consent ? 'MICROSOFT_CONSENT_COMPLETED' : tenant.microsoftConsentStatus,
    dnsMailFlowStatus: signals.dnsReady ? 'DNS_MAIL_FLOW_COMPLETED' : tenant.dnsMailFlowStatus,
    protectionStatus: signals.scans > 0 ? 'PROTECTION_ACTIVE' : tenant.protectionStatus,
    lastSuccessfulScanAt: signals.scans > 0 ? new Date() : tenant.lastSuccessfulScanAt,
  }

  const saved = await prisma.workspaceSecurityTenant.update({
    where: { customerId },
    data: updates,
  })

  const state = mapState(saved)
  const message =
    signals.waitingForActivity && saved.protectionStatus !== 'PROTECTION_ACTIVE'
      ? 'Waiting for first successful health check / scan activity.'
      : state.message
  await prisma.integrationStatusLog.create({
    data: {
      customerId,
      status: state.state,
      source: 'API',
      details: JSON.stringify(signals),
      createdBy: 'system',
    },
  })

  if (saved.protectionStatus === 'PROTECTION_ACTIVE') {
    await syncWorkspaceCustomerActivation({ customerId, actor: { userId: 'system', role: 'SYSTEM' } })
  }

  return {
    ...state,
    message,
    tenant: saved,
    manualCompletionAvailable: saved.protectionStatus !== 'PROTECTION_ACTIVE',
  }
}

module.exports = { resolveIntegrationStatus, mapState }
