import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// Maps new canonical roles to the legacy header value the backend still accepts in dev mode
const ROLE_TO_LEGACY_HEADER = {
  SUPER_ADMIN: 'super_admin',
  DISTRIBUTOR_ADMIN: 'distributor',
  INTEGRATOR_ADMIN: 'integrator',
  CUSTOMER_ADMIN: 'customer',
  CUSTOMER_VIEWER: 'customer',
}

// Which portal path to use after login
export const ROLE_PORTAL = {
  SUPER_ADMIN: '/distribution/dashboard',
  DISTRIBUTOR_ADMIN: '/distribution/dashboard',
  INTEGRATOR_ADMIN: '/integrator/dashboard',
  CUSTOMER_ADMIN: '/customer/overview',
  CUSTOMER_VIEWER: '/customer/overview',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((userData) => {
    // userData: { id, email, name, role, orgId, orgType, organizationName, token? }
    const normalized = { ...userData, legacyRole: ROLE_TO_LEGACY_HEADER[userData.role] || 'integrator' }
    localStorage.setItem('auth_user', JSON.stringify(normalized))
    if (userData.token) localStorage.setItem('auth_token', userData.token)
    setUser(normalized)
    return normalized
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
