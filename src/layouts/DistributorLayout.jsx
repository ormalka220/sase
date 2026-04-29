import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Building2, BarChart3, Settings2,
  ChevronLeft, Bell, LogOut, ShoppingCart
} from 'lucide-react'
import { CDataLogo, CDataMark } from '../components/Logos'
import ProductSwitch from '../components/ProductSwitch'
import { useProduct } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitch from '../components/LanguageSwitch'
import { getCommonLabels } from '../i18n/labels'

const createNavItems = (labels) => [
  { icon: LayoutDashboard, label: labels.navigation.dashboard, path: '/distribution/dashboard' },
  { icon: Building2, label: labels.navigation.integrators, path: '/distribution/integrators' },
  { icon: ShoppingCart, label: labels.navigation.orders, path: '/distribution/orders' },
  { icon: BarChart3, label: labels.navigation.reports, path: '/distribution/reports' },
  { icon: Settings2, label: labels.navigation.settings, path: '/distribution/settings' },
]

export default function DistributorLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { product, config } = useProduct()
  const { user, logout } = useAuth()
  const { tr, isHebrew } = useLanguage()
  const labels = getCommonLabels(tr)
  const navItems = createNavItems(labels)

  const orgName = user?.organizationName || tr('C-DATA הפצה', 'C-DATA Distribution')
  const userName = user?.name || labels.roles.admin
  const roleLabel = user?.role?.replace(/_/g, ' ') || labels.roles.distributorAdmin
  const userInitials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const productLabel = product === 'all'
    ? labels.products.allProducts
    : (product === 'perception' ? labels.products.perceptionPoint : labels.products.fortiSASE)
  const appBackground = `
    radial-gradient(circle at 10% 22%, rgba(${config.glowRgb},0.17) 0%, transparent 34%),
    radial-gradient(circle at 86% 80%, rgba(${config.glowRgb},0.11) 0%, transparent 30%),
    linear-gradient(160deg,#07111E 0%,#0B1929 100%)
  `

  return (
    <div className="min-h-screen bg-navy-900 flex rtl:flex-row-reverse" style={{ background: appBackground }}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-16'} flex-shrink-0 flex flex-col transition-all duration-300 relative z-20 sidebar-cdata`}
        style={{
          background: 'rgba(7,17,30,0.9)',
          backdropFilter: 'blur(20px)',
          borderLeft: isHebrew ? 'none' : `1px solid ${config.primaryColor}20`,
          borderRight: isHebrew ? `1px solid ${config.primaryColor}20` : 'none'
        }}
      >
        {/* Logo block */}
        <div className="px-4 py-4 flex items-center gap-3 border-b border-white/5">
          <CDataMark className={sidebarOpen ? 'w-8 h-8 flex-shrink-0' : 'w-8 h-8'} />
          {sidebarOpen && (
            <div className="min-w-0 leading-tight">
              <div className="font-black text-white text-sm tracking-tight">{labels.portals.distribution}<span style={{ color: config.navActiveColor }}>{labels.portals.distributionHub}</span></div>
              <div className="text-[10px] font-medium" style={{ color: config.primaryColor }}>{labels.portals.distributionPortal} · {productLabel}</div>
            </div>
          )}
        </div>

        {/* Entity badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 mb-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${config.primaryColor}24`, border: `1px solid ${config.primaryColor}33` }}
              >
                <Building2 className="w-3.5 h-3.5" style={{ color: config.navActiveColor }} />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{orgName}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full inline-flex mt-0.5"
                  style={{ color: config.navActiveColor, background: `${config.primaryColor}1f`, border: `1px solid ${config.primaryColor}33` }}>
                  {labels.portals.distribution}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${active ? 'active' : ''}`}
                style={active ? {
                  color: config.navActiveColor,
                  background: config.navActiveBg,
                  borderRight: isHebrew ? 'none' : `2px solid ${config.navActiveBorder}`,
                  borderLeft: isHebrew ? `2px solid ${config.navActiveBorder}` : 'none'
                } : {}}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <div className="min-w-0">
                    <div className="text-xs">{item.label}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Branding strip */}
        {sidebarOpen && (
          <div className="mx-3 mb-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-[9px] text-slate-600 mb-1.5 text-center">{labels.ui.poweredBy}</div>
            <CDataLogo className="h-5 mx-auto" />
          </div>
        )}

        {/* Bottom actions */}
        <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
          <button onClick={() => { logout(); navigate('/') }} className="nav-item w-full text-slate-600 hover:text-slate-400">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">{labels.navigation.logout}</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute top-14 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors ${isHebrew ? '-right-3 rtl:rotate-180' : '-left-3'}`}
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
          style={{ background: `linear-gradient(90deg, rgba(7,17,30,0.82), rgba(${config.glowRgb},0.08))`, backdropFilter: 'blur(16px)' }}
        >
          <div>
            <div className="text-xs text-slate-500">{labels.distribution.channelManagement}</div>
            <div className="text-sm font-semibold text-white">{orgName}</div>
            <div className="text-[10px] mt-0.5" style={{ color: config.navActiveColor }}>{labels.distribution.channelManagementAndOrders}</div>
          </div>

          <div className="flex items-center gap-3">
            <ProductSwitch />
            <LanguageSwitch />
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-1 ring-navy-900" style={{ background: config.primaryColor }}></span>
            </button>
            <div className="flex items-center gap-2.5 pr-3 border-r border-white/5">
              <div className="text-right">
                <div className="text-xs font-medium text-white">{userName}</div>
                <div className="text-[10px] text-slate-500">{roleLabel}</div>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: `linear-gradient(135deg,${config.primaryColor},${config.darkColor})`, border: `1px solid ${config.primaryColor}66` }}
              >
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
