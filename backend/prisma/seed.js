const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── Wipe existing data ───────────────────────────────────────────────────
  await prisma.auditLog.deleteMany()
  await prisma.integrationStatusLog.deleteMany()
  await prisma.provisioningLog.deleteMany()
  await prisma.provisioningJob.deleteMany()
  await prisma.workspaceSecurityTenant.deleteMany()
  await prisma.customerProduct.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.order.deleteMany()
  await prisma.plan.deleteMany()
  await prisma.product.deleteMany()
  await prisma.integrationCredential.deleteMany()
  await prisma.user.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.integrator.deleteMany()
  await prisma.distributor.deleteMany()
  await prisma.organization.deleteMany()

  // ─── Products ─────────────────────────────────────────────────────────────
  const [fortisase, workspaceSec] = await Promise.all([
    prisma.product.create({
      data: {
        id: 'prod-fortisase',
        code: 'FORTISASE',
        name: 'FortiSASE',
        description: 'Fortinet Secure Access Service Edge — zero-trust cloud-native network security',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod-ws',
        code: 'WORKSPACE_SECURITY',
        name: 'Perception Point Workspace Security',
        description: 'Advanced email + workspace threat prevention by Perception Point',
        isActive: true,
      },
    }),
  ])

  // ─── Plans ────────────────────────────────────────────────────────────────
  await prisma.plan.createMany({
    data: [
      { id: 'plan-sase-starter', productId: fortisase.id, name: 'Starter', pricePerSeat: 8.0, minSeats: 10, maxSeats: 99 },
      { id: 'plan-sase-pro', productId: fortisase.id, name: 'Professional', pricePerSeat: 14.0, minSeats: 100 },
      { id: 'plan-ws-starter', productId: workspaceSec.id, name: 'Starter', pricePerSeat: 5.0, minSeats: 10, maxSeats: 249 },
      { id: 'plan-ws-pro', productId: workspaceSec.id, name: 'Professional', pricePerSeat: 9.0, minSeats: 250 },
    ],
  })

  // ─── Platform org + Super Admin user ─────────────────────────────────────
  const platformOrg = await prisma.organization.create({
    data: { id: 'org-platform', name: 'Sovereign SASE Platform', type: 'PLATFORM' },
  })
  await prisma.user.create({
    data: {
      id: 'user-super',
      organizationId: platformOrg.id,
      email: 'superadmin@platform.local',
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  })

  // ─── Distributor: SpotNet / CData ─────────────────────────────────────────
  const distOrg = await prisma.organization.create({
    data: { id: 'org-dist-1', name: 'C-Data Distribution', type: 'DISTRIBUTOR' },
  })
  const distributor = await prisma.distributor.create({
    data: {
      id: 'dist-1',
      organizationId: distOrg.id,
      contactEmail: 'operations@cdata.co.il',
      contactPhone: '+972-3-6000000',
      country: 'IL',
    },
  })
  await prisma.user.create({
    data: {
      id: 'user-dist',
      organizationId: distOrg.id,
      email: 'yonatan@cdata.co.il',
      name: 'Yonatan Levy',
      role: 'DISTRIBUTOR_ADMIN',
    },
  })

  // ─── Integrator 1: NetSec Solutions ──────────────────────────────────────
  const int1Org = await prisma.organization.create({
    data: { id: 'org-int-1', name: 'NetSec Solutions', type: 'INTEGRATOR' },
  })
  const integrator1 = await prisma.integrator.create({
    data: {
      id: 'int-1',
      organizationId: int1Org.id,
      distributorId: distributor.id,
      contactEmail: 'sales@netsec.co.il',
      contactPhone: '+972-3-7000001',
      country: 'IL',
    },
  })
  await prisma.user.create({
    data: {
      id: 'user-int-1',
      organizationId: int1Org.id,
      email: 'alon@netsec.co.il',
      name: 'Alon Cohen',
      role: 'INTEGRATOR_ADMIN',
    },
  })

  // ─── Integrator 2: CyberShield IT ────────────────────────────────────────
  const int2Org = await prisma.organization.create({
    data: { id: 'org-int-2', name: 'CyberShield IT', type: 'INTEGRATOR' },
  })
  const integrator2 = await prisma.integrator.create({
    data: {
      id: 'int-2',
      organizationId: int2Org.id,
      distributorId: distributor.id,
      contactEmail: 'info@cybershield.co.il',
      contactPhone: '+972-4-8000002',
      country: 'IL',
    },
  })
  await prisma.user.create({
    data: {
      id: 'user-int-2',
      organizationId: int2Org.id,
      email: 'michal@cybershield.co.il',
      name: 'Michal Ben-David',
      role: 'INTEGRATOR_ADMIN',
    },
  })

  // ─── Customer 1: Elbit Systems (Workspace Security, active) ──────────────
  const cust1Org = await prisma.organization.create({
    data: { id: 'org-cust-1', name: 'Elbit Systems', type: 'CUSTOMER' },
  })
  const customer1 = await prisma.customer.create({
    data: {
      id: 'c1',
      organizationId: cust1Org.id,
      integratorId: integrator1.id,
      distributorId: distributor.id,
      companyName: 'Elbit Systems',
      domain: 'elbit.co.il',
      adminName: 'Dana Levi',
      adminEmail: 'it-admin@elbit.co.il',
      adminPhone: '+972-4-8316111',
      status: 'ACTIVE',
    },
  })
  await prisma.user.create({
    data: {
      id: 'user-cust-1',
      organizationId: cust1Org.id,
      email: 'it-admin@elbit.co.il',
      name: 'Dana Levi',
      role: 'CUSTOMER_ADMIN',
    },
  })

  // CustomerProduct + WorkspaceSecurityTenant for Elbit (fully active)
  const cp1 = await prisma.customerProduct.create({
    data: {
      id: 'cp-c1-ws',
      customerId: customer1.id,
      productId: workspaceSec.id,
      planId: 'plan-ws-starter',
      seats: 200,
      status: 'ACTIVE',
      activatedAt: new Date('2025-11-01'),
    },
  })
  await prisma.workspaceSecurityTenant.create({
    data: {
      customerProductId: cp1.id,
      customerId: customer1.id,
      ppOrgId: 'pp-org-elbit-001',
      ppOrgName: 'Elbit Systems',
      ppRegion: 'eu-central',
      ppAdminUserId: 'pp-user-dana',
      seats: 200,
      organizationStatus: 'ORGANIZATION_CREATED',
      adminStatus: 'ADMIN_ACTIVE',
      emailServiceStatus: 'EMAIL_SERVICE_CONFIGURATION_STARTED',
      microsoftConsentStatus: 'MICROSOFT_CONSENT_COMPLETED',
      dnsMailFlowStatus: 'DNS_MAIL_FLOW_COMPLETED',
      protectionStatus: 'PROTECTION_ACTIVE',
      lastHealthCheckAt: new Date(),
      lastSuccessfulScanAt: new Date(),
    },
  })

  // ─── Customer 2: Bank Hapoalim (Workspace Security, onboarding) ──────────
  const cust2Org = await prisma.organization.create({
    data: { id: 'org-cust-2', name: 'Bank Hapoalim', type: 'CUSTOMER' },
  })
  const customer2 = await prisma.customer.create({
    data: {
      id: 'c2',
      organizationId: cust2Org.id,
      integratorId: integrator1.id,
      distributorId: distributor.id,
      companyName: 'Bank Hapoalim',
      domain: 'bankhapoalim.co.il',
      adminName: 'Security Team',
      adminEmail: 'security@bankhapoalim.co.il',
      adminPhone: '+972-3-6673333',
      status: 'ONBOARDING',
    },
  })
  await prisma.user.create({
    data: {
      id: 'user-cust-2',
      organizationId: cust2Org.id,
      email: 'security@bankhapoalim.co.il',
      name: 'Security Team',
      role: 'CUSTOMER_ADMIN',
    },
  })

  const cp2 = await prisma.customerProduct.create({
    data: {
      id: 'cp-c2-ws',
      customerId: customer2.id,
      productId: workspaceSec.id,
      planId: 'plan-ws-pro',
      seats: 500,
      status: 'ACTIVE',
      activatedAt: new Date('2025-12-15'),
    },
  })
  await prisma.workspaceSecurityTenant.create({
    data: {
      customerProductId: cp2.id,
      customerId: customer2.id,
      ppOrgId: 'pp-org-bh-002',
      ppOrgName: 'Bank Hapoalim',
      ppRegion: 'eu-central',
      ppAdminUserId: 'pp-user-security',
      seats: 500,
      organizationStatus: 'ORGANIZATION_CREATED',
      adminStatus: 'ADMIN_INVITED',
      emailServiceStatus: 'EMAIL_SERVICE_CONFIGURATION_STARTED',
      microsoftConsentStatus: 'MICROSOFT_CONSENT_PENDING',
      dnsMailFlowStatus: 'DNS_MAIL_FLOW_PENDING',
      protectionStatus: 'INTEGRATION_IN_PROGRESS',
      lastHealthCheckAt: new Date(),
    },
  })

  // ─── Customer 3: Rafael (FortiSASE) under Integrator 2 ───────────────────
  const cust3Org = await prisma.organization.create({
    data: { id: 'org-cust-3', name: 'Rafael Advanced Defense', type: 'CUSTOMER' },
  })
  const customer3 = await prisma.customer.create({
    data: {
      id: 'c3',
      organizationId: cust3Org.id,
      integratorId: integrator2.id,
      distributorId: distributor.id,
      companyName: 'Rafael Advanced Defense',
      domain: 'rafael.co.il',
      adminName: 'IT Department',
      adminEmail: 'it@rafael.co.il',
      adminPhone: '+972-4-8661111',
      status: 'ACTIVE',
    },
  })
  await prisma.user.create({
    data: {
      id: 'user-cust-3',
      organizationId: cust3Org.id,
      email: 'it@rafael.co.il',
      name: 'IT Department',
      role: 'CUSTOMER_ADMIN',
    },
  })
  await prisma.customerProduct.create({
    data: {
      id: 'cp-c3-sase',
      customerId: customer3.id,
      productId: fortisase.id,
      planId: 'plan-sase-pro',
      seats: 300,
      status: 'ACTIVE',
      activatedAt: new Date('2025-10-01'),
    },
  })

  // ─── Customer 4: Mossad (both products) under Integrator 1 ───────────────
  const cust4Org = await prisma.organization.create({
    data: { id: 'org-cust-4', name: 'Israeli Intelligence Ltd', type: 'CUSTOMER' },
  })
  const customer4 = await prisma.customer.create({
    data: {
      id: 'c4',
      organizationId: cust4Org.id,
      integratorId: integrator1.id,
      distributorId: distributor.id,
      companyName: 'Israeli Intelligence Ltd',
      domain: 'iil.gov.il',
      adminName: 'Admin User',
      adminEmail: 'admin@iil.gov.il',
      adminPhone: '+972-3-9000000',
      status: 'ACTIVE',
    },
  })
  await prisma.user.create({
    data: {
      id: 'user-cust-4',
      organizationId: cust4Org.id,
      email: 'admin@iil.gov.il',
      name: 'Admin User',
      role: 'CUSTOMER_ADMIN',
    },
  })

  const cp4a = await prisma.customerProduct.create({
    data: {
      id: 'cp-c4-ws',
      customerId: customer4.id,
      productId: workspaceSec.id,
      planId: 'plan-ws-pro',
      seats: 150,
      status: 'ACTIVE',
      activatedAt: new Date('2026-01-01'),
    },
  })
  await prisma.workspaceSecurityTenant.create({
    data: {
      customerProductId: cp4a.id,
      customerId: customer4.id,
      ppOrgId: 'pp-org-iil-004',
      ppOrgName: 'Israeli Intelligence Ltd',
      ppRegion: 'eu-central',
      ppAdminUserId: 'pp-user-admin-iil',
      seats: 150,
      organizationStatus: 'ORGANIZATION_CREATED',
      adminStatus: 'ADMIN_ACTIVE',
      emailServiceStatus: 'EMAIL_SERVICE_CONFIGURATION_STARTED',
      microsoftConsentStatus: 'MICROSOFT_CONSENT_COMPLETED',
      dnsMailFlowStatus: 'DNS_MAIL_FLOW_COMPLETED',
      protectionStatus: 'PROTECTION_ACTIVE',
      lastHealthCheckAt: new Date(),
      lastSuccessfulScanAt: new Date(),
    },
  })
  await prisma.customerProduct.create({
    data: {
      id: 'cp-c4-sase',
      customerId: customer4.id,
      productId: fortisase.id,
      planId: 'plan-sase-starter',
      seats: 150,
      status: 'ACTIVE',
      activatedAt: new Date('2026-01-01'),
    },
  })

  // ─── Demo orders ──────────────────────────────────────────────────────────
  // Elbit — past active order (credit card)
  const order1 = await prisma.order.create({
    data: {
      id: 'ord-1',
      distributorId: distributor.id,
      integratorId: integrator1.id,
      customerId: customer1.id,
      billingType: 'CREDIT_CARD',
      totalAmount: 1000,
      currency: 'USD',
      status: 'ACTIVE',
      paymentStatus: 'PAID',
      approvalStatus: 'APPROVED',
      submittedAt: new Date('2025-11-01'),
      approvedAt: new Date('2025-11-01'),
      provisionedAt: new Date('2025-11-01'),
      items: {
        create: [
          { productId: workspaceSec.id, planId: 'plan-ws-starter', seats: 200, unitPrice: 5.0, totalPrice: 1000 },
        ],
      },
      payment: { create: { amount: 1000, currency: 'USD', status: 'PAID', paidAt: new Date('2025-11-01') } },
    },
  })

  // Bank Hapoalim — pending approval (invoice)
  await prisma.order.create({
    data: {
      id: 'ord-2',
      distributorId: distributor.id,
      integratorId: integrator1.id,
      customerId: customer2.id,
      billingType: 'MONTHLY_INVOICE',
      totalAmount: 4500,
      currency: 'USD',
      status: 'PENDING_APPROVAL',
      paymentStatus: 'NOT_REQUIRED',
      approvalStatus: 'PENDING',
      submittedAt: new Date('2026-04-20'),
      notes: 'Net-30 invoice agreed by sales',
      items: {
        create: [
          { productId: workspaceSec.id, planId: 'plan-ws-pro', seats: 500, unitPrice: 9.0, totalPrice: 4500 },
        ],
      },
      invoice: {
        create: {
          invoiceNumber: 'INV-202604-001',
          amount: 4500,
          currency: 'USD',
          status: 'PENDING',
          dueDate: new Date('2026-05-20'),
        },
      },
    },
  })

  // IIL — both products, multi-item order
  await prisma.order.create({
    data: {
      id: 'ord-3',
      distributorId: distributor.id,
      integratorId: integrator1.id,
      customerId: customer4.id,
      billingType: 'CREDIT_CARD',
      totalAmount: 3300,
      currency: 'USD',
      status: 'ACTIVE',
      paymentStatus: 'PAID',
      approvalStatus: 'APPROVED',
      submittedAt: new Date('2026-01-01'),
      approvedAt: new Date('2026-01-01'),
      provisionedAt: new Date('2026-01-01'),
      items: {
        create: [
          { productId: workspaceSec.id, planId: 'plan-ws-pro', seats: 150, unitPrice: 9.0, totalPrice: 1350 },
          { productId: fortisase.id, planId: 'plan-sase-starter', seats: 150, unitPrice: 13.0, totalPrice: 1950 },
        ],
      },
      payment: { create: { amount: 3300, currency: 'USD', status: 'PAID', paidAt: new Date('2026-01-01') } },
    },
  })

  // ─── Audit log samples ────────────────────────────────────────────────────
  await prisma.auditLog.createMany({
    data: [
      {
        entityType: 'ORDER', entityId: 'ord-1', action: 'CREATED', actorId: 'user-int-1', actorRole: 'INTEGRATOR_ADMIN',
        newState: JSON.stringify({ status: 'PAYMENT_PENDING' }), orderId: 'ord-1', customerId: 'c1',
        createdAt: new Date('2025-11-01T08:00:00Z'),
      },
      {
        entityType: 'ORDER', entityId: 'ord-1', action: 'PAID', actorId: 'user-int-1', actorRole: 'INTEGRATOR_ADMIN',
        newState: JSON.stringify({ status: 'APPROVED', paymentStatus: 'PAID' }), orderId: 'ord-1', customerId: 'c1',
        createdAt: new Date('2025-11-01T08:05:00Z'),
      },
      {
        entityType: 'ORDER', entityId: 'ord-1', action: 'PROVISIONED', actorId: 'system', actorRole: 'SYSTEM',
        newState: JSON.stringify({ status: 'ACTIVE', ppOrgId: 'pp-org-elbit-001' }), orderId: 'ord-1', customerId: 'c1',
        createdAt: new Date('2025-11-01T08:07:00Z'),
      },
    ],
  })

  // ─── Integration status log samples ──────────────────────────────────────
  await prisma.integrationStatusLog.createMany({
    data: [
      { customerId: 'c1', status: 'active', source: 'API', details: 'Protection active — 3 scans today', createdBy: 'system', createdAt: new Date('2025-11-15') },
      { customerId: 'c2', status: 'in_progress', source: 'API', details: 'Waiting for Microsoft 365 connection', createdBy: 'system', createdAt: new Date('2026-04-20') },
      { customerId: 'c4', status: 'active', source: 'API', details: 'All checks passing', createdBy: 'system', createdAt: new Date('2026-01-10') },
    ],
  })

  console.log('✅ Seed complete.')
  console.log('  Demo login accounts:')
  console.log('  superadmin@platform.local  → SUPER_ADMIN     (any password)')
  console.log('  yonatan@cdata.co.il        → DISTRIBUTOR_ADMIN  orgId=dist-1')
  console.log('  alon@netsec.co.il          → INTEGRATOR_ADMIN   orgId=int-1')
  console.log('  michal@cybershield.co.il   → INTEGRATOR_ADMIN   orgId=int-2')
  console.log('  it-admin@elbit.co.il       → CUSTOMER_ADMIN     orgId=c1 (WS active)')
  console.log('  security@bankhapoalim.co.il→ CUSTOMER_ADMIN     orgId=c2 (WS onboarding)')
  console.log('  it@rafael.co.il            → CUSTOMER_ADMIN     orgId=c3 (FortiSASE)')
  console.log('  admin@iil.gov.il           → CUSTOMER_ADMIN     orgId=c4 (both products)')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
