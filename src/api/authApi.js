import { request } from './client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export const authApi = {
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } }),

  me: () => request('/api/auth/me'),

  getDemoUsers: async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/demo-users`)
    if (!res.ok) throw new Error('Failed to load demo users')
    return res.json()
  },
}
