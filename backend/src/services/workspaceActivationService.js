const { prisma } = require('../prisma')
const { auditLog } = require('../utils/audit')

async function syncWorkspaceCustomerActivation({ customerId, actor = { userId: 'system', role: 'SYSTEM' } }) {
  const wsProduct = await prisma.product.findUnique({ where: { code: 'WORKSPACE_SECURITY' }, select: { id: true } })
  if (!wsProduct) return { customerUpdated: 0, customerProductUpdated: 0, orderUpdated: 0 }

  const [customerResult, customerProductResult, orderResult] = await prisma.$transaction([
    prisma.customer.updateMany({
      where: { id: customerId, status: { not: 'ACTIVE' } },
      data: { status: 'ACTIVE' },
    }),
    prisma.customerProduct.updateMany({
      where: { customerId, productId: wsProduct.id, status: { not: 'ACTIVE' } },
      data: { status: 'ACTIVE', activatedAt: new Date() },
    }),
    prisma.order.updateMany({
      where: {
        customerId,
        items: { some: { productId: wsProduct.id } },
        status: { in: ['READY_FOR_ONBOARDING', 'PROVISIONING_STARTED', 'PP_ORG_CREATED', 'PP_ADMIN_INVITED'] },
      },
      data: { status: 'ACTIVE', provisionedAt: new Date() },
    }),
  ])

  if (customerResult.count > 0) {
    await auditLog({
      entityType: 'CUSTOMER',
      entityId: customerId,
      action: 'CUSTOMER_ACTIVATED',
      actor,
      newState: { status: 'ACTIVE' },
      customerId,
    })
  }

  return {
    customerUpdated: customerResult.count,
    customerProductUpdated: customerProductResult.count,
    orderUpdated: orderResult.count,
  }
}

module.exports = { syncWorkspaceCustomerActivation }
