import React from 'react'
import { ShieldCheck, Mail, Layers } from 'lucide-react'
import { useProduct } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'

const ALL_TABS = [
  { key: 'all', label: 'הכל', Icon: Layers, gradient: 'linear-gradient(135deg, #7C3AED, #4C1D95)', glow: 'rgba(124,58,237,0.4)' },
  { key: 'sase', label: 'FortiSASE', Icon: ShieldCheck, gradient: 'linear-gradient(135deg, #DC2626, #F97316)', glow: 'rgba(220,38,38,0.4)' },
  { key: 'perception', label: 'Perception Point', Icon: Mail, gradient: 'linear-gradient(135deg, #2563EB, #7C3AED)', glow: 'rgba(37,99,235,0.4)' },
]

export default function ProductSwitch({ className = '', allowedProducts }) {
  const { product, setProduct } = useProduct()
  const { user } = useAuth()

  // Admin/integrator/distributor users see all tabs (they manage multiple customers)
  const isAdmin = user && !['CUSTOMER_ADMIN', 'CUSTOMER_VIEWER'].includes(user.role)

  // If allowedProducts prop is passed, use it; otherwise show all for admins
  const visibleKeys = allowedProducts
    ? (allowedProducts.length > 1 ? ['all', ...allowedProducts] : allowedProducts)
    : isAdmin
      ? ['all', 'sase', 'perception']
      : ['all', 'sase', 'perception']

  const tabs = ALL_TABS.filter((t) => visibleKeys.includes(t.key))

  if (tabs.length <= 1) return null

  return (
    <div
      className={`flex items-center gap-0.5 p-1 rounded-xl ${className}`}
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {tabs.map(({ key, label, Icon, gradient, glow }) => (
        <button
          key={key}
          onClick={() => setProduct(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
            product === key ? 'text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
          style={product === key ? { background: gradient, boxShadow: `0 2px 8px ${glow}` } : {}}
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
