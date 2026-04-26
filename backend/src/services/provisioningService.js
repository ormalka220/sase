const { prisma } = require('../prisma')
const { PerceptionPointClient } = require('./perceptionPointClient')
const { EmailService } = require('./emailService')
const { redact } = require('../utils/redact')

const ppClient = new PerceptionPointClient()
const emailService = new EmailService()

async function logProvision(orderId, customerId, step, status, reqPayload, resPayload, errorMessage) {
  await prisma.provisioningLog.create({
    data: {
      orderId,
      customerId,
      step,
      status,
      requestPayload: redact(reqPayload),
      responsePayload: redact(resPayload),
      errorMessage,
    },
  })
}

async function provisionWorkspaceOrder(order) {
  if (order.productType !== 'WORKSPACE_SECURITY') return order

  const customer = await prisma.customer.findUnique({ where: { id: order.customerId } })
  if (!customer) throw new Error('Customer not found for provisioning')

  const existingTenant = await prisma.workspaceSecurityTenant.findUnique({ where: { customerId: customer.id } })
  if (existingTenant && existingTenant.ppOrgId) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PROVISIONED', provisionedAt: new Date() },
    })
    return existingTenant
  }

  await prisma.order.update({ where: { id: order.id }, data: { status: 'PROVISIONING' } })

  try {
    const org = await ppClient.createOrganization({
      companyName: customer.companyName,
      domain: customer.domain,
      seats: order.seats,
    })
    await logProvision(order.id, customer.id, 'create-organization', 'SUCCESS', { companyName: customer.companyName }, org)

    const admin = await ppClient.inviteAdmin({
      orgId: org.orgId,
      adminName: customer.adminName,
      adminEmail: customer.adminEmail,
    })
    await logProvision(order.id, customer.id, 'invite-admin', 'SUCCESS', { orgId: org.orgId, adminEmail: customer.adminEmail }, admin)

    const seats = await ppClient.assignSeats({ orgId: org.orgId, seats: order.seats })
    await logProvision(order.id, customer.id, 'assign-seats', 'SUCCESS', { seats: order.seats }, seats)

    const tenant = await prisma.workspaceSecurityTenant.upsert({
      where: { customerId: customer.id },
      create: {
        customerId: customer.id,
        ppOrgId: org.orgId,
        ppOrgName: org.orgName,
        ppRegion: org.region,
        ppAdminUserId: admin.userId,
        seats: order.seats,
        organizationStatus: 'ORGANIZATION_CREATED',
        adminStatus: 'ADMIN_INVITED',
        emailServiceStatus: 'EMAIL_SERVICE_NOT_CONNECTED',
        microsoftConsentStatus: 'MICROSOFT_CONSENT_PENDING',
        dnsMailFlowStatus: 'DNS_MAIL_FLOW_PENDING',
        protectionStatus: 'INTEGRATION_IN_PROGRESS',
      },
      update: {
        ppOrgId: org.orgId,
        ppOrgName: org.orgName,
        ppRegion: org.region,
        ppAdminUserId: admin.userId,
        seats: order.seats,
      },
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'ONBOARDING_PENDING',
        provisionedAt: new Date(),
      },
    })

    await emailService.sendCustomerOnboardingEmail({
      customer,
      portalUrl: process.env.PP_PORTAL_URL || 'https://app.perception-point.io',
    })
    await emailService.sendIntegratorProvisionedEmail({ integratorId: order.integratorId, orderId: order.id })
    await emailService.sendDistributorProvisionedEmail({ distributorId: order.distributorId, orderId: order.id })

    return tenant
  } catch (error) {
    await logProvision(order.id, customer.id, 'provision-failed', 'FAILED', {}, {}, error.message)
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'FAILED', failureReason: error.message },
    })
    throw error
  }
}

module.exports = { provisionWorkspaceOrder }
