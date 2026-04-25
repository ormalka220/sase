import React, { createContext, useContext, useState } from 'react'

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
    name: 'Forti SASE',
    nameHe: 'פורטי SASE',
    primaryColor: '#2C6A8A',
    accentColor: '#5B9BB8',
    lightColor: '#87BFDA',
    darkColor: '#1F3A54',
    glowRgb: '44, 106, 138',
    gradient: 'linear-gradient(135deg, #2C6A8A, #1F5070)',
    navActiveColor: '#87BFDA',
    navActiveBg: 'rgba(44, 106, 138, 0.1)',
    navActiveBorder: '#5B9BB8',
  },
  perception: {
    id: 'perception',
    name: 'Perception Point',
    nameHe: 'פרספשן פוינט',
    primaryColor: '#059669',
    accentColor: '#10B981',
    lightColor: '#34D399',
    darkColor: '#064E3B',
    glowRgb: '5, 150, 105',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    navActiveColor: '#34D399',
    navActiveBg: 'rgba(5, 150, 105, 0.1)',
    navActiveBorder: '#10B981',
  },
}

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [product, setProduct] = useState('all')
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
