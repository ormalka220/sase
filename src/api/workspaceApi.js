import { request } from './client'

export const workspaceApi = {
  // ─── Customers ────────────────────────────────────────────────────────────
  createCustomer: (payload) =>
    request('/api/customers', { method: 'POST', body: payload }),

  getCustomers: ({ search, status, productCode, page, limit } = {}) => {
    const q = new URLSearchParams()
    if (search) q.set('search', search)
    if (status) q.set('status', status)
    if (productCode) q.set('productCode', productCode)
    if (page) q.set('page', page)
    if (limit) q.set('limit', limit)
    return request(`/api/customers?${q}`)
  },

  getCustomer: (id) => request(`/api/customers/${id}`),

  updateCustomer: (id, data) =>
    request(`/api/customers/${id}`, { method: 'PATCH', body: data }),

  // ─── Orders ───────────────────────────────────────────────────────────────
  getOrders: ({ status, customerId, productCode, page, limit } = {}) => {
    const q = new URLSearchParams()
    if (status) q.set('status', status)
    if (customerId) q.set('customerId', customerId)
    if (productCode) q.set('productCode', productCode)
    if (page) q.set('page', page)
    if (limit) q.set('limit', limit)
    return request(`/api/orders?${q}`)
  },

  getOrder: (id) => request(`/api/orders/${id}`),

  createOrder: (payload) =>
    request('/api/orders', { method: 'POST', body: payload }),

  createPPOrder: (payload) =>
    request('/api/orders/pp', { method: 'POST', body: payload }),

  payOrder: (orderId) =>
    request(`/api/orders/${orderId}/pay`, { method: 'POST' }),

  approveOrder: (orderId) =>
    request(`/api/orders/${orderId}/approve`, { method: 'POST' }),

  rejectOrder: (orderId, reason) =>
    request(`/api/orders/${orderId}/reject`, { method: 'POST', body: { reason } }),

  cancelOrder: (orderId, reason) =>
    request(`/api/orders/${orderId}/cancel`, { method: 'POST', body: { reason } }),

  provisionOrder: (orderId) =>
    request(`/api/orders/${orderId}/provision`, { method: 'POST' }),

  // ─── Workspace Security (Perception Point) ────────────────────────────────
  getPpOverview: () => request('/api/workspace-security/overview'),

  getPpCustomersList: ({ page, limit } = {}) => {
    const q = new URLSearchParams()
    if (page) q.set('page', page)
    if (limit) q.set('limit', limit)
    return request(`/api/workspace-security/customers-list?${q}`)
  },

  getPpCustomerProfile: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/profile`),

  getPpReportsSummary: () =>
    request('/api/workspace-security/reports-summary'),

  getPpAudit: (customerId, { page, limit } = {}) => {
    const q = new URLSearchParams()
    if (page) q.set('page', page)
    if (limit) q.set('limit', limit)
    return request(`/api/workspace-security/customers/${customerId}/audit?${q}`)
  },

  getOnboarding: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/onboarding`),

  getIntegrationStatus: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/integration-status`),

  resendOnboardingEmail: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/resend-onboarding-email`, { method: 'POST' }),

  markIntegrationComplete: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/mark-integration-complete`, { method: 'POST' }),

  checkHealth: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/health`),

  // ─── Integrators / Distributors ───────────────────────────────────────────
  getIntegrators: ({ page, limit } = {}) => {
    const q = new URLSearchParams()
    if (page) q.set('page', page)
    if (limit) q.set('limit', limit)
    return request(`/api/integrators?${q}`)
  },

  getIntegrator: (id) => request(`/api/integrators/${id}`),

  createIntegrator: (payload) =>
    request('/api/integrators', { method: 'POST', body: payload }),

  getDistributors: () => request('/api/distributors'),

  getDistributor: (id) => request(`/api/distributors/${id}`),

  // ─── Auth helpers ─────────────────────────────────────────────────────────
  getDemoUsers: () => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
    return fetch(`${base}/api/auth/demo-users`).then((r) => r.json())
  },
}
