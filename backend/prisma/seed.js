const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.integrationStatusLog.deleteMany()
  await prisma.provisioningLog.deleteMany()
  await prisma.order.deleteMany()
  await prisma.workspaceSecurityTenant.deleteMany()
  await prisma.customer.deleteMany()

  await prisma.customer.createMany({
    data: [
      {
        id: 'c1',
        integratorId: 'i1',
        distributorId: 'd1',
        companyName: 'Elbit Systems',
        domain: 'elbit.co.il',
        adminName: 'Dana Levi',
        adminEmail: 'it-admin@elbit.co.il',
        adminPhone: '+972-4-8316111',
      },
      {
        id: 'c2',
        integratorId: 'i1',
        distributorId: 'd1',
        companyName: 'Bank Hapoalim',
        domain: 'bankhapoalim.co.il',
        adminName: 'Security Team',
        adminEmail: 'security@bankhapoalim.co.il',
        adminPhone: '+972-3-6673333',
      },
    ],
  })
}

main().finally(async () => prisma.$disconnect())
