const { prisma } = require('../prisma')
const { PerceptionPointClient } = require('./perceptionPointClient')
const { auditLog } = require('../utils/audit')

const ppClient = new PerceptionPointClient()

// Create a PP organization for a customer order and step the order through PP_ORG_CREATED
async function createPPCustomerOrganization(customer, order) {
  const org = await ppClient.createOrganization({
    companyName: customer.companyName,
    domain: customer.domain,
    seats: order.estimatedUsers || 10,
    adminEmail: customer.adminEmail,
  })

  await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PP_ORG_CREATED' },
  })

  await auditLog({
    entityType: 'ORDER',
    entityId: order.id,
    action: 'PP_ORG_CREATED',
    actor: { userId: 'system', role: 'SYSTEM' },
    newState: { ppOrgId: org.orgId, orgName: org.orgName },
    orderId: order.id,
    customerId: customer.id,
  })

  return org
}

// Invite the customer admin to their PP organization and step the order to PP_ADMIN_INVITED
async function createOrInvitePPAdmin(customer, organizationId, orderId) {
  const result = await ppClient.inviteAdmin({
    orgId: organizationId,
    adminName: customer.adminName,
    adminEmail: customer.adminEmail,
  })

  if (orderId) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PP_ADMIN_INVITED' },
    })
  }

  await auditLog({
    entityType: 'CUSTOMER',
    entityId: customer.id,
    action: 'PP_ADMIN_INVITED',
    actor: { userId: 'system', role: 'SYSTEM' },
    newState: { adminEmail: customer.adminEmail, ppAdminUserId: result.userId },
    customerId: customer.id,
    orderId: orderId || undefined,
  })

  return result
}

// Generate onboarding instructions for a newly provisioned PP org
function generateOnboardingInstructions(organizationId) {
  const portalUrl = process.env.PP_PORTAL_URL || 'https://app.perception-point.io'
  return {
    organizationId,
    portalUrl,
    steps: [
      {
        step: 1,
        title: 'Accept Admin Invitation',
        description: 'Check your email for the Perception Point admin invitation and accept it to access the portal.',
        action: 'Check email and click the invitation link',
      },
      {
        step: 2,
        title: 'Connect Microsoft 365',
        description: 'In the Perception Point portal, navigate to Settings > Integrations and connect your Microsoft 365 tenant.',
        action: 'Grant Microsoft 365 consent in the portal',
        deepLink: `${portalUrl}/settings/integrations/microsoft365`,
      },
      {
        step: 3,
        title: 'Configure DNS & Mail Flow',
        description: 'Update your MX records to route mail through Perception Point for scanning.',
        action: 'Update MX records as shown in the portal',
        deepLink: `${portalUrl}/settings/mail-flow`,
      },
      {
        step: 4,
        title: 'Verify Protection is Active',
        description: 'Send a test email and confirm it appears in the Perception Point threat dashboard.',
        action: 'Send test email and verify scan results',
        deepLink: `${portalUrl}/threats`,
      },
    ],
    estimatedSetupMinutes: 30,
  }
}

// Return connection instructions for a specific email provider
function getPPConnectionInstructions(providerType) {
  const base = {
    microsoft365: {
      provider: 'Microsoft 365',
      steps: [
        'Log into the Perception Point portal as admin.',
        'Go to Settings → Integrations → Microsoft 365.',
        "Click 'Connect' and grant consent with a Global Admin account.",
        'Perception Point will automatically discover your mailboxes.',
        'Update your MX record to: <pp-mx-record>.protection.outlook.com',
        'Verify mail flow in the portal threat log.',
      ],
      docsUrl: 'https://portal.perception-point.io/docs/microsoft365',
      estimatedMinutes: 20,
    },
    gmail: {
      provider: 'Google Workspace',
      steps: [
        'Log into the Perception Point portal as admin.',
        'Go to Settings → Integrations → Google Workspace.',
        "Click 'Connect' and authorize with a Google Workspace Super Admin.",
        'Configure the inbound gateway in Google Admin Console.',
        'Update your MX record to point to Perception Point.',
        'Verify mail flow in the portal threat log.',
      ],
      docsUrl: 'https://portal.perception-point.io/docs/gmail',
      estimatedMinutes: 25,
    },
  }

  return base[providerType] || base.microsoft365
}

// Get current provisioning status for a PP order
async function getPPProvisioningStatus(orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      provisioningJobs: {
        where: { productType: 'WORKSPACE_SECURITY' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: { logs: { orderBy: { createdAt: 'desc' }, take: 10 } },
      },
      customer: {
        select: {
          id: true,
          companyName: true,
          adminEmail: true,
          products: {
            where: { product: { code: 'WORKSPACE_SECURITY' } },
            include: { workspaceTenant: true },
          },
        },
      },
    },
  })

  if (!order) return null

  const job = order.provisioningJobs[0] || null
  const tenant = order.customer?.products[0]?.workspaceTenant || null

  return {
    orderId,
    orderStatus: order.status,
    provisioningJob: job
      ? { status: job.status, currentStep: job.currentStep, errorMessage: job.errorMessage, logs: job.logs }
      : null,
    tenant: tenant
      ? {
          ppOrgId: tenant.ppOrgId,
          ppOrgName: tenant.ppOrgName,
          organizationStatus: tenant.organizationStatus,
          adminStatus: tenant.adminStatus,
          emailServiceStatus: tenant.emailServiceStatus,
          microsoftConsentStatus: tenant.microsoftConsentStatus,
          dnsMailFlowStatus: tenant.dnsMailFlowStatus,
          protectionStatus: tenant.protectionStatus,
        }
      : null,
  }
}

module.exports = {
  createPPCustomerOrganization,
  createOrInvitePPAdmin,
  generateOnboardingInstructions,
  getPPConnectionInstructions,
  getPPProvisioningStatus,
}
