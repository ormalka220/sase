import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Users, ShoppingCart, FileText, CheckSquare, BarChart3, Settings,
  ChevronLeft, Bell, LogOut, Menu, X, Zap
} from 'lucide-react'
import { CDataLogo, CDataMark } from '../components/Logos'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import ProductSwitch from '../components/ProductSwitch'
import LanguageSwitch from '../components/LanguageSwitch'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/integrator/dashboard' },
  { icon: Users, label: 'Customers', path: '/integrator/customers' },
  { icon: ShoppingCart, label: 'Orders', path: '/integrator/orders' },
  { icon: CheckSquare, label: 'Onboarding', path: '/integrator/onboarding' },
  { icon: FileText, label: 'Billing', path: '/integrator/billing' },
  { icon: BarChart3, label: 'Reports', path: '/integrator/reports' },
  { icon: Settings, label: 'Settings', path: '/integrator/settings' },
]

export default function IntegratorLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { tr } = useLanguage()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const integrator = user?.integrator || { name: 'Channel Partner Inc' }
  const userName = user?.name || 'Sales Manager'
  const userInitials = userName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const appBackground = `
    radial-gradient(circle at 20% 50%, rgba(44,106,138,0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(44,106,138,0.08) 0%, transparent 40%),
    linear-gradient(160deg, #07111E 0%, #0B1929 100%)
  `

  return (
    <div className="min-h-screen bg-navy-900 flex" style={{ background: appBackground }}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 flex flex-col transition-all duration-300 relative z-20`}
        style={{
          background: 'rgba(7,17,30,0.9)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(44,106,138,0.12)'
        }}
      >
        {/* Logo block */}
        <div className="px-4 py-6 flex items-center gap-3 border-b border-white/5">
          <CDataMark className={sidebarOpen ? 'w-8 h-8 flex-shrink-0' : 'w-8 h-8'} />
          {sidebarOpen && (
            <div className="min-w-0 leading-tight">
              <div className="font-black text-white text-sm tracking-tight">Integrator</div>
              <div className="text-[10px] font-medium text-cdata-400">Portal</div>
            </div>
          )}
        </div>

        {/* Entity badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-4 mb-2 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-cdata-500/20 border border-cdata-500/30">
                <Zap className="w-3.5 h-3.5 text-cdata-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">{integrator.name}</div>
                <div className="text-[10px] px-2 py-0.5 rounded-full inline-flex mt-1 bg-cdata-500/15 text-cdata-300 border border-cdata-500/30">
                  Partner
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
                  color: '#5B9BB8',
                  background: 'rgba(44,106,138,0.1)',
                  borderLeft: '2px solid #5B9BB8'
                } : {}}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Branding strip */}
        {sidebarOpen && (
          <div className="mx-3 mb-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-[9px] text-slate-600 mb-1.5 text-center">Powered by</div>
            <CDataLogo className="h-5 mx-auto" />
          </div>
        )}

        {/* Bottom actions */}
        <div className="px-2 py-4 border-t border-white/5 space-y-1">
          <button 
            onClick={() => { logout(); navigate('/integrator/login') }}
            className="nav-item w-full text-slate-600 hover:text-slate-400"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors"
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
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="text-xs text-slate-500">Integrator Portal</div>
              <div className="text-sm font-semibold text-white">{integrator.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ProductSwitch />
            <LanguageSwitch />
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full ring-1 ring-navy-900" style={{ background: '#2C6A8A' }}></span>
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-white/5">
              <div className="text-right">
                <div className="text-xs font-medium text-white">{userName}</div>
                <div className="text-[10px] text-slate-500">Channel Manager</div>
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
