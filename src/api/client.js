const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

function getStoredAuth() {
  try {
    const token = localStorage.getItem('auth_token')
    const user = JSON.parse(localStorage.getItem('auth_user') || 'null')
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export async function request(path, { method = 'GET', body, auth } = {}) {
  const { token, user } = auth ? { token: null, user: auth } : getStoredAuth()

  const headers = { 'Content-Type': 'application/json' }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  } else if (user) {
    // Legacy demo mode — backend accepts x-role / x-user-id / x-org-id
    headers['x-role'] = user.legacyRole || user.role?.toLowerCase() || 'integrator'
    headers['x-user-id'] = user.id || 'demo-user'
    if (user.orgId) headers['x-org-id'] = user.orgId
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Request failed' }))
    const msg = typeof err.error === 'string'
      ? err.error
      : err?.error?.formErrors?.[0] || err?.details?.fieldErrors
        ? 'Invalid form data'
        : 'Request failed'
    throw new Error(msg)
  }

  return response.json()
}
