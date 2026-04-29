import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Shield, CheckSquare, AlertTriangle, BarChart3, FileText, Settings,
  ChevronLeft, Bell, LogOut, Lock, Users, Monitor, Globe2, SlidersHorizontal, Siren, KeyRound
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useProduct, PRODUCTS } from '../context/ProductContext'
import { useCustomerProducts } from '../context/CustomerProductContext'
import ProductSwitch from '../components/ProductSwitch'
import LanguageSwitch from '../components/LanguageSwitch'
import { useLanguage } from '../context/LanguageContext'
import { getCommonLabels } from '../i18n/labels'

const createNavItems = (labels, tr, product) => {
  const items = [
    { icon: LayoutDashboard, label: labels.navigation.overview, path: '/customer/overview' },
    { icon: Shield, label: labels.navigation.security, path: '/customer/security' },
    { icon: CheckSquare, label: labels.navigation.onboarding, path: '/customer/onboarding' },
    { icon: BarChart3, label: labels.navigation.reports, path: '/customer/reports' },
    { icon: FileText, label: labels.navigation.billing, path: '/customer/billing' },
  ]

  if (product !== 'perception') {
    items.push(
      { icon: Users, label: tr('משתמשים', 'Users'), path: '/customer/users' },
      { icon: Monitor, label: tr('התקנים', 'Devices'), path: '/customer/devices' },
      { icon: Globe2, label: tr('אתרים', 'Sites'), path: '/customer/sites' },
      { icon: SlidersHorizontal, label: tr('מדיניות', 'Policies'), path: '/customer/policies' },
      { icon: Siren, label: tr('התראות', 'Alerts'), path: '/customer/alerts' },
      { icon: KeyRound, label: tr('רישיונות', 'Licenses'), path: '/customer/licenses' },
    )
  }

  if (product !== 'sase') {
    items.push({ icon: AlertTriangle, label: labels.navigation.threats, path: '/customer/threats' })
  }

  items.push({ icon: Settings, label: labels.navigation.settings, path: '/customer/settings' })
  return items
}

export default function CustomerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { product, setProduct, config } = useProduct()
  const { ownedProducts, defaultProduct, loading } = useCustomerProducts()
  const { tr, isHebrew } = useLanguage()
  const labels = getCommonLabels(tr)
  const navItems = createNavItems(labels, tr, product)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const customer = user?.customer || { name: 'Acme Corporation' }
  const userName = user?.name || 'Admin User'
  const userInitials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const appBackground = `
    radial-gradient(circle at 20% 50%, rgba(44,106,138,0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(44,106,138,0.08) 0%, transparent 40%),
    linear-gradient(160deg, #07111E 0%, #0B1929 100%)
  `

  React.useEffect(() => {
    if (loading || !defaultProduct) return
    if (ownedProducts.length === 1 && product !== defaultProduct) {
      setProduct(defaultProduct)
      return
    }
    if (ownedProducts.length > 0 && product !== 'all' && !ownedProducts.includes(product)) {
      setProduct(defaultProduct)
    }
  }, [defaultProduct, loading, ownedProducts, product, setProduct])

  const currentProductName = product === 'all'
    ? tr('כל המוצרים', 'All Products')
    : product === 'sase'
      ? labels.products.fortiSASE
      : labels.products.perceptionPoint

  return (
    <div
      className="min-h-screen bg-navy-900 flex"
      style={{ background: appBackground, flexDirection: 'row' }}
    >
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 flex flex-col transition-all duration-300 relative z-20`}
        style={{
          background: 'rgba(7,17,30,0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: isHebrew ? 'none' : '1px solid rgba(44,106,138,0.12)',
          borderLeft: isHebrew ? '1px solid rgba(44,106,138,0.12)' : 'none',
        }}
      >
        {/* Logo block */}
        <div className="px-4 py-6 flex items-center gap-3 border-b border-white/5">
          <Lock className="w-8 h-8 text-cdata-400 flex-shrink-0" />
          {sidebarOpen && (
            <div className="min-w-0 leading-tight">
              <div className="font-black text-white text-sm tracking-tight">{currentProductName}</div>
              <div className="text-[10px] font-medium text-cdata-400">{labels.portals.customerPortal}</div>
            </div>
          )}
        </div>

        {/* Entity badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-cdata-500/20 border border-cdata-500/30">
                <Shield className="w-3.5 h-3.5 text-cdata-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{customer.name}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full inline-flex mt-1 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {tr('פעיל', 'Active')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.pathname.startsWith(item.path)
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? 'active' : ''}`}
                style={active ? { 
                  color: config?.navActiveColor || PRODUCTS.all.navActiveColor,
                  background: config?.navActiveBg || PRODUCTS.all.navActiveBg,
                } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom actions */}
        <div className="px-2 py-4 border-t border-white/5 space-y-1">
          <button
            onClick={() => { logout(); navigate('/customer/login') }}
            className="nav-item w-full text-slate-600 hover:text-slate-400"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">{labels.navigation.logout}</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-20 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors ${isHebrew ? '-left-3' : '-right-3'}`}
          style={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.2)' }}
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header
          className="px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-white/[0.06]"
          style={{
            background: `linear-gradient(90deg, rgba(7,17,30,0.82), rgba(44,106,138,0.08))`,
            backdropFilter: 'blur(16px)'
          }}
        >
          <div className="flex items-center gap-2">
            <div>
            <div className="text-xs text-slate-500">{labels.customer.overviewTitle}</div>
            <div className="text-sm font-semibold text-white">{currentProductName}</div>
          </div>
          </div>

          <div className="flex items-center gap-3">
            {!loading && <ProductSwitch allowedProducts={ownedProducts} />}
            <LanguageSwitch />
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/5">
              <div className="text-right">
                <div className="text-xs font-medium text-white">{userName}</div>
                <div className="text-[10px] text-slate-500">{tr('מנהל לקוח', 'Customer Admin')}</div>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'linear-gradient(135deg, #2C6A8A, #1F5070)', border: '1px solid rgba(44,106,138,0.66)' }}
              >
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
