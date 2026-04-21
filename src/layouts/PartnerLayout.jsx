import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard, Package, GitCompare, TrendingUp,
  BookOpen, Users, Settings, ChevronLeft, Bell, Search,
  LogOut, Star
} from 'lucide-react'
import { CDataLogo, SpotNetLogo, CDataMark } from '../components/Logos'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',     labelHe: 'לוח בקרה',      path: '/partner/dashboard' },
  { icon: Package,         label: 'Solutions',     labelHe: 'פתרונות',        path: '/partner/solutions' },
  { icon: GitCompare,      label: 'Compare',       labelHe: 'השוואה',         path: '/partner/compare' },
  { icon: TrendingUp,      label: 'Opportunities', labelHe: 'הזדמנויות',      path: '/partner/opportunities' },
  { icon: BookOpen,        label: 'Sales Kit',     labelHe: 'חומרי מכירה',   path: '/partner/sales-kit' },
  { icon: Users,           label: 'Customers',     labelHe: 'לקוחות',         path: '/partner/customers' },
]

export default function PartnerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-navy-900 bg-grid flex" style={{ background: 'linear-gradient(160deg,#07111E 0%,#0B1929 100%)' }}>
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-16'} flex-shrink-0 flex flex-col transition-all duration-300 relative z-20 sidebar-cdata`}
        style={{ background: 'rgba(7,17,30,0.95)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo block */}
        <div className="px-4 py-4 flex items-center gap-3 border-b border-white/5">
          <CDataMark className={sidebarOpen ? 'w-8 h-8 flex-shrink-0' : 'w-8 h-8'} />
          {sidebarOpen && (
            <div className="min-w-0 leading-tight">
              <div className="font-black text-white text-sm tracking-tight">SASE<span className="text-cdata-300"> Market</span></div>
              <div className="text-[10px] text-cdata-500 font-medium">Partner Hub · C-Data</div>
            </div>
          )}
        </div>

        {/* Partner badge */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 mb-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-spot-500/15 border border-spot-500/20 flex items-center justify-center flex-shrink-0">
                <Star className="w-3.5 h-3.5 text-spot-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">NetSec Solutions</div>
                <div className="text-[10px] text-spot-500 font-medium">Gold Partner</div>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className={`nav-item ${active ? 'active' : ''}`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {sidebarOpen && (
                  <div className="min-w-0">
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-600">{item.labelHe}</div>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* SpotNet branding strip */}
        {sidebarOpen && (
          <div className="mx-3 mb-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
            <div className="text-[9px] text-slate-600 mb-1.5 text-center">Powered by</div>
            <SpotNetLogo className="h-5 mx-auto" />
          </div>
        )}

        {/* Bottom actions */}
        <div className="px-2 py-3 border-t border-white/5 space-y-0.5">
          <button className="nav-item w-full">
            <Settings className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">Settings</span>}
          </button>
          <button onClick={() => navigate('/')} className="nav-item w-full text-slate-600 hover:text-slate-400">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {sidebarOpen && <span className="text-xs">יציאה</span>}
          </button>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -left-3 top-14 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-white transition-colors"
          style={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.2)' }}
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-white/[0.06]"
          style={{ background: 'rgba(7,17,30,0.8)', backdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
              <input
                type="text"
                placeholder="חיפוש... / Search..."
                className="bg-white/[0.04] border rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none w-52 transition-colors"
                style={{ borderColor: 'rgba(44,106,138,0.15)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(44,106,138,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(44,106,138,0.15)'}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Co-brand in topbar */}
            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/5">
              <CDataLogo className="h-5" />
              <span className="text-slate-700 text-xs">×</span>
              <SpotNetLogo className="h-4" />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors text-slate-500 hover:text-white">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-spot-500 ring-1 ring-navy-900"></span>
            </button>
            <div className="flex items-center gap-2.5 pr-3 border-r border-white/5">
              <div className="text-right">
                <div className="text-xs font-medium text-white">אלון כהן</div>
                <div className="text-[10px] text-slate-500">Sales Manager</div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'linear-gradient(135deg,#2C6A8A,#1F3A54)', border: '1px solid rgba(44,106,138,0.4)' }}>
                אכ
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
