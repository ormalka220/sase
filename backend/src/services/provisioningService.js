const { prisma } = require('../prisma')
const { PerceptionPointClient } = require('./perceptionPointClient')
const { EmailService } = require('./emailService')
const { redact } = require('../utils/redact')
const { auditLog } = require('../utils/audit')
const { syncWorkspaceCustomerActivation } = require('./workspaceActivationService')

const ppClient = new PerceptionPointClient()
const emailService = new EmailService()

async function logStep(jobId, orderId, customerId, step, status, reqPayload, resPayload, errorMessage) {
  await prisma.provisioningLog.create({
    data: {
      jobId,
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

async function provisionWorkspaceSecurity(job, order, customer) {
  await prisma.provisioningJob.update({
    where: { id: job.id },
    data: { status: 'IN_PROGRESS', currentStep: 'create-organization', startedAt: new Date() },
  })
  // PP orders step through granular statuses; legacy orders use PROVISIONING
  const isPPFlow = [
    'APPROVED_BY_CDATA',
    'PROVISIONING_STARTED',
    'PP_ORG_CREATED',
    'PP_ADMIN_INVITED',
    'PENDING_SPOTNET_ASSIGNMENT',
  ].includes(order.status)
  await prisma.order.update({ where: { id: order.id }, data: { status: isPPFlow ? 'PROVISIONING_STARTED' : 'PROVISIONING' } })

  // Find or create the CustomerProduct record for workspace security
  const wsProduct = await prisma.product.findUnique({ where: { code: 'WORKSPACE_SECURITY' } })
  if (!wsProduct) throw new Error('WORKSPACE_SECURITY product not found in catalog')

  // Derive seats from the first matching order item (or fallback to legacy field)
  const wsItem = order.items?.find((i) => i.productId === wsProduct.id)
  const seats = wsItem?.seats || order.seats || 1

  // Check for existing tenant (idempotent re-provision)
  const existingTenant = await prisma.workspaceSecurityTenant.findUnique({ where: { customerId: customer.id } })
  if (existingTenant?.ppOrgId) {
    await prisma.order.update({ where: { id: order.id }, data: { status: 'ACTIVE', provisionedAt: new Date() } })
    await syncWorkspaceCustomerActivation({ customerId: customer.id, actor: { userId: 'system', role: 'SYSTEM' } })
    await prisma.provisioningJob.update({
      where: { id: job.id },
      data: { status: 'SUCCESS', currentStep: 'already-provisioned', completedAt: new Date() },
    })
    return existingTenant
  }

  try {
    // Step 1: create organization
    const org = await ppClient.createOrganization({
      companyName: customer.companyName,
      domain: customer.domain,
      seats,
      adminEmail: customer.adminEmail,
    })
    await logStep(job.id, order.id, customer.id, 'create-organization', 'SUCCESS', { companyName: customer.companyName }, org)
    await prisma.provisioningJob.update({ where: { id: job.id }, data: { currentStep: 'invite-admin' } })
    // Advance PP order status
    if (isPPFlow) {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'PP_ORG_CREATED' } })
    }

    // Step 2: invite admin
    const admin = await ppClient.inviteAdmin({
      orgId: org.orgId,
      adminName: customer.adminName,
      adminEmail: customer.adminEmail,
    })
    await logStep(job.id, order.id, customer.id, 'invite-admin', 'SUCCESS', { orgId: org.orgId, adminEmail: customer.adminEmail }, admin)
    await prisma.provisioningJob.update({ where: { id: job.id }, data: { currentStep: 'assign-seats' } })
    // Advance PP order status
    if (isPPFlow) {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'PP_ADMIN_INVITED' } })
    }

    // Step 3: assign seats (no-op in mock — done at org creation)
    const seatsResult = await ppClient.assignSeats({ orgId: org.orgId, seats })
    await logStep(job.id, order.id, customer.id, 'assign-seats', 'SUCCESS', { seats }, seatsResult)

    // Step 4: upsert CustomerProduct + WorkspaceSecurityTenant
    const customerProduct = await prisma.customerProduct.upsert({
      where: { customerId_productId: { customerId: customer.id, productId: wsProduct.id } },
      create: {
        customerId: customer.id,
        productId: wsProduct.id,
        planId: wsItem?.planId || null,
        seats,
        status: 'ACTIVE',
        activatedAt: new Date(),
      },
      update: { seats, status: 'ACTIVE', activatedAt: new Date() },
    })

    await prisma.workspaceSecurityTenant.upsert({
      where: { customerId: customer.id },
      create: {
        customerProductId: customerProduct.id,
        customerId: customer.id,
        ppOrgId: org.orgId,
        ppOrgName: org.orgName,
        ppRegion: org.region,
        ppAdminUserId: admin.userId,
        seats,
        organizationStatus: 'ORGANIZATION_CREATED',
        adminStatus: 'ADMIN_INVITED',
      },
      update: {
        customerProductId: customerProduct.id,
        ppOrgId: org.orgId,
        ppOrgName: org.orgName,
        ppRegion: org.region,
        ppAdminUserId: admin.userId,
        seats,
      },
    })

    // Step 5: PP orders wait for manual SpotNet bundle assignment before onboarding can start.
    const finalStatus = isPPFlow ? 'PENDING_SPOTNET_ASSIGNMENT' : 'ACTIVE'
    await prisma.order.update({
      where: { id: order.id },
      data: { status: finalStatus, provisionedAt: new Date() },
    })
    if (isPPFlow) {
      await logStep(
        job.id,
        order.id,
        customer.id,
        'wait-spotnet-bundle-assignment',
        'SUCCESS',
        { orderStatus: finalStatus },
        { message: 'Waiting for manual SpotNet bundle assignment before onboarding' }
      )
    }

    await prisma.provisioningJob.update({
      where: { id: job.id },
      data: { status: 'SUCCESS', currentStep: 'completed', completedAt: new Date() },
    })

    await emailService.sendCustomerOnboardingEmail({
      customer,
      portalUrl: process.env.PP_PORTAL_URL || 'https://app.perception-point.io',
    })
    await emailService.sendIntegratorProvisionedEmail({ integratorId: order.integratorId, orderId: order.id })
    await emailService.sendDistributorProvisionedEmail({ distributorId: order.distributorId, orderId: order.id })

    await auditLog({
      entityType: 'ORDER',
      entityId: order.id,
      action: 'PROVISIONED',
      actor: { userId: 'system', role: 'SYSTEM' },
      newState: { status: 'ACTIVE', ppOrgId: org.orgId },
      orderId: order.id,
      customerId: customer.id,
    })

    return await prisma.workspaceSecurityTenant.findUnique({ where: { customerId: customer.id } })
  } catch (err) {
    await logStep(job.id, order.id, customer.id, 'provision-failed', 'FAILED', {}, {}, err.message)
    await prisma.order.update({ where: { id: order.id }, data: { status: 'FAILED', failureReason: err.message } })
    await prisma.provisioningJob.update({
      where: { id: job.id },
      data: { status: 'FAILED', errorMessage: err.message, completedAt: new Date() },
    })
    await auditLog({
      entityType: 'ORDER',
      entityId: order.id,
      action: 'PROVISION_FAILED',
      actor: { userId: 'system', role: 'SYSTEM' },
      newState: { status: 'FAILED', error: err.message },
      orderId: order.id,
      customerId: customer.id,
    })
    throw err
  }
}

// Entry point: dispatches provisioning by product type
async function provisionOrder(order) {
  const customer = await prisma.customer.findUnique({ where: { id: order.customerId } })
  if (!customer) throw new Error('Customer not found for provisioning')

  // Resolve product types from order items
  const items = order.items || (await prisma.orderItem.findMany({ where: { orderId: order.id }, include: { product: true } }))
  const productCodes = [...new Set(items.map((i) => i.product?.code).filter(Boolean))]

  for (const code of productCodes) {
    const job = await prisma.provisioningJob.create({
      data: {
        orderId: order.id,
        customerId: customer.id,
        productType: code,
        status: 'PENDING',
      },
    })

    if (code === 'WORKSPACE_SECURITY') {
      await provisionWorkspaceSecurity(job, { ...order, items }, customer)
    } else if (code === 'FORTISASE') {
      // FortiSASE provisioning is deferred to real API integration
      await prisma.provisioningJob.update({
        where: { id: job.id },
        data: { status: 'SUCCESS', currentStep: 'mock-placeholder', completedAt: new Date() },
      })

      const saseProduct = await prisma.product.findUnique({ where: { code: 'FORTISASE' } })
      if (saseProduct) {
        const saseItem = items.find((i) => i.product?.code === 'FORTISASE')
        await prisma.customerProduct.upsert({
          where: { customerId_productId: { customerId: customer.id, productId: saseProduct.id } },
          create: { customerId: customer.id, productId: saseProduct.id, seats: saseItem?.seats || 0, status: 'ACTIVE', activatedAt: new Date() },
          update: { seats: saseItem?.seats || 0, status: 'ACTIVE', activatedAt: new Date() },
        })
      }

      await prisma.order.update({ where: { id: order.id }, data: { status: 'ACTIVE', provisionedAt: new Date() } })
    }
  }
}

// Kept for backward compat with old route code
async function provisionWorkspaceOrder(order) {
  return provisionOrder(order)
}

module.exports = { provisionOrder, provisionWorkspaceOrder }
