import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { workspaceApi } from '../api/workspaceApi'

const CustomerProductContext = createContext(null)

// Maps backend ProductCode to frontend product keys
const CODE_TO_KEY = {
  FORTISASE: 'sase',
  WORKSPACE_SECURITY: 'perception',
}

export function CustomerProductProvider({ children }) {
  const { user, isAuthenticated } = useAuth()
  const [ownedProducts, setOwnedProducts] = useState([]) // ['sase', 'perception']
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    if (!isAuthenticated || !user) return

    // Only customers have product-scoped access — admins see all
    const isCustomer = user.role === 'CUSTOMER_ADMIN' || user.role === 'CUSTOMER_VIEWER'
    if (!isCustomer) {
      // Admins have access to all products by default
      setOwnedProducts(['sase', 'perception'])
      return
    }

    try {
      setLoading(true)
      const res = await workspaceApi.getCustomer(user.orgId)
      const codes = (res.products || [])
        .filter((p) => p.status === 'ACTIVE')
        .map((p) => CODE_TO_KEY[p.product?.code])
        .filter(Boolean)
      setOwnedProducts(codes.length ? codes : [])
    } catch {
      setOwnedProducts([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const hasSase = ownedProducts.includes('sase')
  const hasPerception = ownedProducts.includes('perception')
  const hasBoth = hasSase && hasPerception
  const defaultProduct = hasBoth ? 'all' : hasSase ? 'sase' : hasPerception ? 'perception' : null

  return (
    <CustomerProductContext.Provider value={{ ownedProducts, loading, hasSase, hasPerception, hasBoth, defaultProduct, refetch: fetchProducts }}>
      {children}
    </CustomerProductContext.Provider>
  )
}

export function useCustomerProducts() {
  const ctx = useContext(CustomerProductContext)
  if (!ctx) throw new Error('useCustomerProducts must be used within CustomerProductProvider')
  return ctx
}
