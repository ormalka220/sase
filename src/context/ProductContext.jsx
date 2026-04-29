import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

export const PRODUCTS = {
  all: {
    id: 'all',
    name: 'All Products',
    nameHe: 'כל המוצרים',
    primaryColor: '#7C3AED',
    accentColor: '#A78BFA',
    lightColor: '#C4B5FD',
    darkColor: '#4C1D95',
    glowRgb: '124, 58, 237',
    gradient: 'linear-gradient(135deg, #7C3AED, #4C1D95)',
    navActiveColor: '#C4B5FD',
    navActiveBg: 'rgba(124, 58, 237, 0.14)',
    navActiveBorder: '#A78BFA',
  },
  sase: {
    id: 'sase',
    name: 'FortiSASE',
    nameHe: 'פורטי SASE',
    primaryColor: '#DC2626',
    accentColor: '#F97316',
    lightColor: '#FDBA74',
    darkColor: '#7F1D1D',
    glowRgb: '220, 38, 38',
    gradient: 'linear-gradient(135deg, #DC2626, #F97316)',
    navActiveColor: '#FDBA74',
    navActiveBg: 'rgba(220, 38, 38, 0.12)',
    navActiveBorder: '#F97316',
  },
  perception: {
    id: 'perception',
    name: 'Perception Point',
    nameHe: 'Perception Point',
    primaryColor: '#2563EB',
    accentColor: '#7C3AED',
    lightColor: '#A5B4FC',
    darkColor: '#1E1B4B',
    glowRgb: '37, 99, 235',
    gradient: 'linear-gradient(135deg, #2563EB, #7C3AED)',
    navActiveColor: '#A5B4FC',
    navActiveBg: 'rgba(37, 99, 235, 0.12)',
    navActiveBorder: '#7C3AED',
  },
}

const ProductContext = createContext(null)
const PRODUCT_STORAGE_KEY = 'customerPortal.selectedProduct'
const VALID_PRODUCTS = new Set(Object.keys(PRODUCTS))

export function ProductProvider({ children }) {
  const { user } = useAuth()
  const [product, setProductState] = useState(() => {
    if (typeof window === 'undefined') return 'all'
    const saved = window.localStorage.getItem(PRODUCT_STORAGE_KEY) || 'all'
    return VALID_PRODUCTS.has(saved) ? saved : 'all'
  })

  const setProduct = (nextProduct) => {
    const normalized = VALID_PRODUCTS.has(nextProduct) ? nextProduct : 'all'
    setProductState(normalized)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PRODUCT_STORAGE_KEY, normalized)
    }
  }

  // Keep a stable default across user changes; do not force perception.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem(PRODUCT_STORAGE_KEY)
    if (saved && VALID_PRODUCTS.has(saved)) {
      setProductState(saved)
      return
    }
    setProductState('all')
  }, [user?.id])

  return (
    <ProductContext.Provider value={{ product, setProduct, config: PRODUCTS[product] || PRODUCTS.all }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProduct() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProduct must be used within ProductProvider')
  return ctx
}
