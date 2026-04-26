const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function request(path, { method = 'GET', body, role = 'integrator', userId = 'demo-user' } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-role': role,
      'x-user-id': userId,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

export const workspaceApi = {
  getCustomers: (integratorId) =>
    request(`/api/customers?integratorId=${encodeURIComponent(integratorId)}`, { role: 'integrator' }),

  getOrders: ({ distributorId, integratorId, role }) => {
    const query = new URLSearchParams()
    if (distributorId) query.set('distributorId', distributorId)
    if (integratorId) query.set('integratorId', integratorId)
    return request(`/api/orders?${query.toString()}`, { role })
  },

  createOrder: (payload) => request('/api/orders', { method: 'POST', body: payload, role: 'integrator' }),

  payOrder: (orderId) => request(`/api/orders/${orderId}/pay`, { method: 'POST', role: 'integrator' }),

  approveOrder: (orderId) => request(`/api/orders/${orderId}/approve`, { method: 'POST', role: 'distributor' }),

  rejectOrder: (orderId, reason) =>
    request(`/api/orders/${orderId}/reject`, { method: 'POST', role: 'distributor', body: { reason } }),

  provisionOrder: (orderId, role = 'distributor') =>
    request(`/api/orders/${orderId}/provision`, { method: 'POST', role }),

  getOnboarding: (customerId, role = 'integrator') =>
    request(`/api/workspace-security/customers/${customerId}/onboarding`, { role }),

  getIntegrationStatus: (customerId, role = 'integrator') =>
    request(`/api/workspace-security/customers/${customerId}/integration-status`, { role }),

  resendOnboardingEmail: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/resend-onboarding-email`, { method: 'POST', role: 'integrator' }),

  markIntegrationComplete: (customerId) =>
    request(`/api/workspace-security/customers/${customerId}/mark-integration-complete`, { method: 'POST', role: 'distributor' }),
}
