// ─── Distributors ────────────────────────────────────────────────────────────
export const distributors = [
  {
    id: 'd1',
    name: 'CDATA',
    fullName: 'C-Data Distribution',
    status: 'active',
    contactName: 'יונתן לוי',
    contactEmail: 'yonatan@cdata.co.il',
    phone: '+972-3-6100100',
    country: 'Israel',
    createdAt: '2022-06-01',
  },
  {
    id: 'd2',
    name: 'CYBCAST',
    fullName: 'CybCast Networks',
    status: 'active',
    contactName: 'מיכל שפירא',
    contactEmail: 'michal@cybcast.com',
    phone: '+972-3-9870077',
    country: 'Israel',
    createdAt: '2022-09-15',
  },
]

// ─── Integrators ─────────────────────────────────────────────────────────────
export const integrators = [
  {
    id: 'i1',
    distributorId: 'd1',
    companyName: 'NetSec Solutions',
    contactName: 'אלון כהן',
    contactEmail: 'alon@netsec.co.il',
    phone: '+972-50-1234567',
    country: 'Israel',
    status: 'active',
    partnerCode: 'NS-2023-001',
    createdAt: '2023-03-10',
    lastActivity: '2024-01-14',
    notes: 'Flagship integrator — government and defense focus.',
  },
  {
    id: 'i2',
    distributorId: 'd1',
    companyName: 'CyberShield Ltd',
    contactName: 'ענת דוד',
    contactEmail: 'anat@cybershield.co.il',
    phone: '+972-52-9876543',
    country: 'Israel',
    status: 'active',
    partnerCode: 'CS-2023-002',
    createdAt: '2023-05-22',
    lastActivity: '2024-01-12',
    notes: 'Mid-market and SMB focus.',
  },
  {
    id: 'i3',
    distributorId: 'd2',
    companyName: 'SecureEdge IL',
    contactName: 'רון בן-דוד',
    contactEmail: 'ron@secureedge.co.il',
    phone: '+972-54-3344556',
    country: 'Israel',
    status: 'active',
    partnerCode: 'SE-2023-003',
    createdAt: '2023-07-01',
    lastActivity: '2024-01-10',
    notes: 'Telecom and enterprise.',
  },
  {
    id: 'i4',
    distributorId: 'd2',
    companyName: 'NetGuard Pro',
    contactName: 'שירה אביב',
    contactEmail: 'shira@netguard.co.il',
    phone: '+972-53-7788990',
    country: 'Israel',
    status: 'suspended',
    partnerCode: 'NG-2023-004',
    createdAt: '2023-08-18',
    lastActivity: '2023-11-30',
    notes: 'Suspended pending contract renewal.',
  },
]

// ─── Customers ───────────────────────────────────────────────────────────────
export const customers = [
  {
    id: 'c1',
    integratorId: 'i1',
    distributorId: 'd1',
    companyName: 'Elbit Systems',
    numberOfUsers: 320,
    adminEmail: 'it-admin@elbit.co.il',
    phone: '+972-4-8316111',
    domain: 'elbit.co.il',
    country: 'Israel',
    status: 'active',
    onboardingStatus: 'active',
    packageName: 'Enterprise SASE',
    deploymentType: 'Cloud-Native',
    startDate: '2023-06-01',
    createdAt: '2023-05-20',
    notes: 'Defense industry — requires data sovereignty compliance.',
    fortisaseUser: 'admin_elbit',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
  {
    id: 'c2',
    integratorId: 'i1',
    distributorId: 'd1',
    companyName: 'Bank Hapoalim',
    numberOfUsers: 580,
    adminEmail: 'security@bankhapoalim.co.il',
    phone: '+972-3-6673333',
    domain: 'bankhapoalim.co.il',
    country: 'Israel',
    status: 'active',
    onboardingStatus: 'active',
    packageName: 'Enterprise SASE',
    deploymentType: 'Hybrid',
    startDate: '2023-09-01',
    createdAt: '2023-08-15',
    notes: 'Financial sector — PCI-DSS and regulatory requirements.',
    fortisaseUser: 'admin_hapoalim',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
  {
    id: 'c3',
    integratorId: 'i1',
    distributorId: 'd1',
    companyName: 'Clalit Health',
    numberOfUsers: 120,
    adminEmail: 'itsec@clalit.co.il',
    phone: '+972-3-7474747',
    domain: 'clalit.co.il',
    country: 'Israel',
    status: 'onboarding',
    onboardingStatus: 'configured',
    packageName: 'Business SASE',
    deploymentType: 'Cloud-Native',
    startDate: '2024-01-10',
    createdAt: '2024-01-05',
    notes: 'Healthcare — HIPAA-equivalent compliance needed.',
    fortisaseUser: 'admin_clalit',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
  {
    id: 'c4',
    integratorId: 'i2',
    distributorId: 'd1',
    companyName: 'Rafael Advanced Defense',
    numberOfUsers: 450,
    adminEmail: 'ciso@rafael.co.il',
    phone: '+972-4-8792222',
    domain: 'rafael.co.il',
    country: 'Israel',
    status: 'active',
    onboardingStatus: 'active',
    packageName: 'Enterprise SASE',
    deploymentType: 'On-Premise Gateway',
    startDate: '2023-07-15',
    createdAt: '2023-07-01',
    notes: 'Air-gapped segments — special routing required.',
    fortisaseUser: 'admin_rafael',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
  {
    id: 'c5',
    integratorId: 'i2',
    distributorId: 'd1',
    companyName: 'Malam Team',
    numberOfUsers: 95,
    adminEmail: 'ops@malam.com',
    phone: '+972-3-7676767',
    domain: 'malam.com',
    country: 'Israel',
    status: 'active',
    onboardingStatus: 'active',
    packageName: 'Business SASE',
    deploymentType: 'Cloud-Native',
    startDate: '2023-10-01',
    createdAt: '2023-09-20',
    notes: '',
    fortisaseUser: 'admin_malam',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
  {
    id: 'c6',
    integratorId: 'i3',
    distributorId: 'd2',
    companyName: 'ECI Telecom',
    numberOfUsers: 210,
    adminEmail: 'noc@ecitelecom.com',
    phone: '+972-3-9261000',
    domain: 'ecitelecom.com',
    country: 'Israel',
    status: 'active',
    onboardingStatus: 'active',
    packageName: 'Enterprise SASE',
    deploymentType: 'Hybrid',
    startDate: '2023-11-01',
    createdAt: '2023-10-20',
    notes: '',
    fortisaseUser: 'admin_eci',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
  {
    id: 'c7',
    integratorId: 'i3',
    distributorId: 'd2',
    companyName: 'Amdocs Israel',
    numberOfUsers: 340,
    adminEmail: 'security@amdocs.com',
    phone: '+972-9-7765000',
    domain: 'amdocs.com',
    country: 'Israel',
    status: 'suspended',
    onboardingStatus: 'active',
    packageName: 'Enterprise SASE',
    deploymentType: 'Cloud-Native',
    startDate: '2023-04-01',
    createdAt: '2023-03-25',
    notes: 'Suspended — payment dispute pending.',
    fortisaseUser: 'admin_amdocs',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
  {
    id: 'c8',
    integratorId: 'i4',
    distributorId: 'd2',
    companyName: 'Elta Systems',
    numberOfUsers: 180,
    adminEmail: 'it@elta.co.il',
    phone: '+972-8-9462000',
    domain: 'elta.co.il',
    country: 'Israel',
    status: 'onboarding',
    onboardingStatus: 'invited',
    packageName: 'Business SASE',
    deploymentType: 'Cloud-Native',
    startDate: '2024-01-15',
    createdAt: '2024-01-10',
    notes: 'New customer — invite sent, awaiting configuration.',
    fortisaseUser: 'admin_elta',
    fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  },
]

// ─── Customer Environments (SASE data) ───────────────────────────────────────
export const customerEnvironments = [
  {
    id: 'env1',
    customerId: 'c1',
    healthStatus: 'healthy',
    protectedUsers: 314,
    activeDevices: 287,
    connectedSites: 8,
    alertsCount: 3,
    complianceScore: 97,
    licenseUsed: 314,
    licenseTotal: 320,
    lastSyncAt: '2024-01-15T10:30:00Z',
    gatewayHealth: 100,
    tunnelStatus: 'all-up',
    policyCompliance: 98,
  },
  {
    id: 'env2',
    customerId: 'c2',
    healthStatus: 'warning',
    protectedUsers: 561,
    activeDevices: 523,
    connectedSites: 14,
    alertsCount: 12,
    complianceScore: 89,
    licenseUsed: 561,
    licenseTotal: 580,
    lastSyncAt: '2024-01-15T09:15:00Z',
    gatewayHealth: 92,
    tunnelStatus: '1-degraded',
    policyCompliance: 91,
  },
  {
    id: 'env3',
    customerId: 'c3',
    healthStatus: 'onboarding',
    protectedUsers: 0,
    activeDevices: 0,
    connectedSites: 0,
    alertsCount: 0,
    complianceScore: 0,
    licenseUsed: 0,
    licenseTotal: 120,
    lastSyncAt: null,
    gatewayHealth: 0,
    tunnelStatus: 'not-configured',
    policyCompliance: 0,
  },
  {
    id: 'env4',
    customerId: 'c4',
    healthStatus: 'healthy',
    protectedUsers: 442,
    activeDevices: 398,
    connectedSites: 11,
    alertsCount: 1,
    complianceScore: 99,
    licenseUsed: 442,
    licenseTotal: 450,
    lastSyncAt: '2024-01-15T10:45:00Z',
    gatewayHealth: 100,
    tunnelStatus: 'all-up',
    policyCompliance: 99,
  },
  {
    id: 'env5',
    customerId: 'c5',
    healthStatus: 'healthy',
    protectedUsers: 93,
    activeDevices: 88,
    connectedSites: 3,
    alertsCount: 0,
    complianceScore: 96,
    licenseUsed: 93,
    licenseTotal: 95,
    lastSyncAt: '2024-01-15T08:00:00Z',
    gatewayHealth: 100,
    tunnelStatus: 'all-up',
    policyCompliance: 96,
  },
]

// ─── SASE Users ───────────────────────────────────────────────────────────────
export const saseUsers = [
  { id: 'u1', customerId: 'c1', fullName: 'דנה לוי', email: 'dana.levy@elbit.co.il', role: 'IT Manager', status: 'protected', riskLevel: 'low', lastSeen: '2024-01-15T10:20:00Z', department: 'IT' },
  { id: 'u2', customerId: 'c1', fullName: 'יוסי כהן', email: 'yossi.cohen@elbit.co.il', role: 'Engineer', status: 'protected', riskLevel: 'low', lastSeen: '2024-01-15T09:45:00Z', department: 'R&D' },
  { id: 'u3', customerId: 'c1', fullName: 'מיכל אברהם', email: 'michal.avraham@elbit.co.il', role: 'Analyst', status: 'alert', riskLevel: 'high', lastSeen: '2024-01-14T17:30:00Z', department: 'Finance' },
  { id: 'u4', customerId: 'c1', fullName: 'אבי שלום', email: 'avi.shalom@elbit.co.il', role: 'Developer', status: 'protected', riskLevel: 'medium', lastSeen: '2024-01-15T11:00:00Z', department: 'R&D' },
  { id: 'u5', customerId: 'c1', fullName: 'נועה ברק', email: 'noa.barak@elbit.co.il', role: 'HR Manager', status: 'protected', riskLevel: 'low', lastSeen: '2024-01-15T08:15:00Z', department: 'HR' },
  { id: 'u6', customerId: 'c1', fullName: 'תום שפיר', email: 'tom.shapir@elbit.co.il', role: 'CISO', status: 'protected', riskLevel: 'low', lastSeen: '2024-01-15T10:55:00Z', department: 'Security' },
  { id: 'u7', customerId: 'c1', fullName: 'רועי אלון', email: 'roi.alon@elbit.co.il', role: 'Developer', status: 'inactive', riskLevel: 'low', lastSeen: '2024-01-08T14:00:00Z', department: 'R&D' },
  { id: 'u8', customerId: 'c1', fullName: 'שרה פרץ', email: 'sara.perez@elbit.co.il', role: 'Operations', status: 'protected', riskLevel: 'low', lastSeen: '2024-01-15T07:30:00Z', department: 'Ops' },
]

// ─── Devices ──────────────────────────────────────────────────────────────────
export const devices = [
  { id: 'dv1', customerId: 'c1', hostname: 'ELBIT-WS-0042', userId: 'u1', os: 'Windows 11', postureStatus: 'managed', compliance: 'compliant', riskLevel: 'low', lastSeen: '2024-01-15T10:20:00Z', site: 'HQ Haifa' },
  { id: 'dv2', customerId: 'c1', hostname: 'ELBIT-WS-0117', userId: 'u2', os: 'Windows 11', postureStatus: 'managed', compliance: 'compliant', riskLevel: 'low', lastSeen: '2024-01-15T09:45:00Z', site: 'HQ Haifa' },
  { id: 'dv3', customerId: 'c1', hostname: 'ELBIT-MB-0023', userId: 'u3', os: 'macOS Sonoma', postureStatus: 'managed', compliance: 'non-compliant', riskLevel: 'high', lastSeen: '2024-01-14T17:30:00Z', site: 'Tel Aviv Office' },
  { id: 'dv4', customerId: 'c1', hostname: 'ELBIT-WS-0088', userId: 'u4', os: 'Windows 10', postureStatus: 'managed', compliance: 'compliant', riskLevel: 'medium', lastSeen: '2024-01-15T11:00:00Z', site: 'HQ Haifa' },
  { id: 'dv5', customerId: 'c1', hostname: 'ELBIT-BYOD-011', userId: 'u5', os: 'macOS Ventura', postureStatus: 'unmanaged', compliance: 'partial', riskLevel: 'medium', lastSeen: '2024-01-15T08:15:00Z', site: 'Remote' },
  { id: 'dv6', customerId: 'c1', hostname: 'ELBIT-SRV-004', userId: null, os: 'Ubuntu 22.04', postureStatus: 'managed', compliance: 'compliant', riskLevel: 'low', lastSeen: '2024-01-15T10:55:00Z', site: 'HQ Haifa' },
  { id: 'dv7', customerId: 'c1', hostname: 'ELBIT-WS-0201', userId: 'u6', os: 'Windows 11', postureStatus: 'managed', compliance: 'compliant', riskLevel: 'low', lastSeen: '2024-01-15T10:50:00Z', site: 'HQ Haifa' },
  { id: 'dv8', customerId: 'c1', hostname: 'ELBIT-MB-0055', userId: 'u8', os: 'macOS Sonoma', postureStatus: 'managed', compliance: 'compliant', riskLevel: 'low', lastSeen: '2024-01-15T07:30:00Z', site: 'Beer Sheva' },
]

// ─── Sites ────────────────────────────────────────────────────────────────────
export const sites = [
  { id: 's1', customerId: 'c1', name: 'HQ Haifa', status: 'online', tunnelHealth: 100, bandwidthUsage: 68, alertsCount: 0, users: 186, uptime: '99.98%' },
  { id: 's2', customerId: 'c1', name: 'Tel Aviv Office', status: 'online', tunnelHealth: 97, bandwidthUsage: 42, alertsCount: 1, users: 74, uptime: '99.91%' },
  { id: 's3', customerId: 'c1', name: 'Beer Sheva Branch', status: 'online', tunnelHealth: 100, bandwidthUsage: 31, alertsCount: 0, users: 28, uptime: '100%' },
  { id: 's4', customerId: 'c1', name: 'Jerusalem Office', status: 'degraded', tunnelHealth: 61, bandwidthUsage: 18, alertsCount: 2, users: 26, uptime: '98.40%' },
  { id: 's5', customerId: 'c1', name: 'Remote Workers', status: 'online', tunnelHealth: 99, bandwidthUsage: 55, alertsCount: 0, users: 0, uptime: '99.95%' },
]

// ─── Alerts ───────────────────────────────────────────────────────────────────
export const alerts = [
  { id: 'a1', customerId: 'c1', severity: 'high', title: 'Non-compliant device accessing sensitive resources', source: 'Zero Trust', status: 'open', createdAt: '2024-01-15T09:12:00Z', relatedUser: 'מיכל אברהם', relatedDevice: 'ELBIT-MB-0023', relatedSite: 'Tel Aviv Office' },
  { id: 'a2', customerId: 'c1', severity: 'medium', title: 'Tunnel degradation detected — Jerusalem Office', source: 'SASE Gateway', status: 'open', createdAt: '2024-01-15T07:45:00Z', relatedUser: null, relatedDevice: null, relatedSite: 'Jerusalem Office' },
  { id: 'a3', customerId: 'c1', severity: 'low', title: 'Unusual access time detected for user', source: 'Behavior Analytics', status: 'open', createdAt: '2024-01-14T23:18:00Z', relatedUser: 'מיכל אברהם', relatedDevice: null, relatedSite: null },
  { id: 'a4', customerId: 'c1', severity: 'high', title: 'Phishing email blocked — executive impersonation', source: 'Email Security', status: 'resolved', createdAt: '2024-01-14T14:30:00Z', relatedUser: 'יוסי כהן', relatedDevice: null, relatedSite: 'HQ Haifa' },
  { id: 'a5', customerId: 'c1', severity: 'medium', title: 'Malware download attempt blocked', source: 'Web Filter', status: 'resolved', createdAt: '2024-01-13T11:05:00Z', relatedUser: 'אבי שלום', relatedDevice: 'ELBIT-WS-0088', relatedSite: 'HQ Haifa' },
]

// ─── Policies ─────────────────────────────────────────────────────────────────
export const policies = [
  { id: 'p1', customerId: 'c1', category: 'Internet Access', name: 'Block High-Risk Categories', scope: 'All Users', status: 'active', lastModified: '2024-01-10', rules: 14 },
  { id: 'p2', customerId: 'c1', category: 'Internet Access', name: 'Social Media — Business Hours Only', scope: 'Non-IT Departments', status: 'active', lastModified: '2024-01-08', rules: 3 },
  { id: 'p3', customerId: 'c1', category: 'Zero Trust', name: 'Least-Privilege App Access', scope: 'All Users', status: 'active', lastModified: '2024-01-05', rules: 22 },
  { id: 'p4', customerId: 'c1', category: 'Zero Trust', name: 'Contractor Network Segmentation', scope: 'Guest / Contractor', status: 'active', lastModified: '2023-12-20', rules: 8 },
  { id: 'p5', customerId: 'c1', category: 'Posture Enforcement', name: 'Compliance Gate — Managed Devices Only', scope: 'All Users', status: 'active', lastModified: '2024-01-12', rules: 5 },
  { id: 'p6', customerId: 'c1', category: 'Posture Enforcement', name: 'OS Patch Level Enforcement', scope: 'R&D Department', status: 'disabled', lastModified: '2023-11-30', rules: 4 },
  { id: 'p7', customerId: 'c1', category: 'Segmentation', name: 'R&D Lab Isolation', scope: 'R&D Network', status: 'active', lastModified: '2024-01-03', rules: 11 },
  { id: 'p8', customerId: 'c1', category: 'Segmentation', name: 'Finance Data Segmentation', scope: 'Finance Department', status: 'draft', lastModified: '2024-01-15', rules: 7 },
]

// ─── Chart / Trend Data ───────────────────────────────────────────────────────
export const growthData = [
  { month: 'אוג', customers: 4, users: 680, integrators: 2 },
  { month: 'ספט', customers: 5, users: 830, integrators: 3 },
  { month: 'אוק', customers: 6, users: 980, integrators: 3 },
  { month: 'נוב', customers: 7, users: 1100, integrators: 4 },
  { month: 'דצמ', customers: 8, users: 1420, integrators: 4 },
  { month: 'ינו', customers: 9, users: 1620, integrators: 4 },
]

export const threatData = [
  { day: 'א', blocked: 142 },
  { day: 'ב', blocked: 98 },
  { day: 'ג', blocked: 215 },
  { day: 'ד', blocked: 167 },
  { day: 'ה', blocked: 389 },
  { day: 'ו', blocked: 256 },
  { day: 'ש', blocked: 78 },
]

export const licenseData = [
  { month: 'אוג', used: 280, total: 320 },
  { month: 'ספט', used: 290, total: 320 },
  { month: 'אוק', used: 298, total: 320 },
  { month: 'נוב', used: 305, total: 320 },
  { month: 'דצמ', used: 310, total: 320 },
  { month: 'ינו', used: 314, total: 320 },
]

// ─── Selectors ────────────────────────────────────────────────────────────────
export const getIntegratorsByDistributor = (distributorId) =>
  integrators.filter((i) => i.distributorId === distributorId)

export const getCustomersByIntegrator = (integratorId) =>
  customers.filter((c) => c.integratorId === integratorId)

export const getCustomersByDistributor = (distributorId) =>
  customers.filter((c) => c.distributorId === distributorId)

export const getCustomerEnvironment = (customerId) =>
  customerEnvironments.find((e) => e.customerId === customerId) || null

export const getUsersByCustomer = (customerId) =>
  saseUsers.filter((u) => u.customerId === customerId)

export const getDevicesByCustomer = (customerId) =>
  devices.filter((d) => d.customerId === customerId)

export const getSitesByCustomer = (customerId) =>
  sites.filter((s) => s.customerId === customerId)

export const getAlertsByCustomer = (customerId) =>
  alerts.filter((a) => a.customerId === customerId)

export const getPoliciesByCustomer = (customerId) =>
  policies.filter((p) => p.customerId === customerId)

export const getIntegrator = (id) => integrators.find((i) => i.id === id)
export const getCustomer = (id) => customers.find((c) => c.id === id)
export const getDistributor = (id) => distributors.find((d) => d.id === id)
