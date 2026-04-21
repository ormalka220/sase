import React from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Home, Shield, Users, Activity, Layers, FileText,
  HelpCircle, Bell, LogOut, CheckCircle
} from 'lucide-react'
import { CDataLogo, CDataMark } from '../components/Logos'

const navItems = [
  { icon: Home,      label: 'Overview',        labelHe: 'סקירה כללית',   path: '/customer/overview' },
  { icon: Shield,    label: 'Security Status', labelHe: 'סטטוס הגנה',    path: '/customer/security' },
  { icon: Users,     label: 'Users',           labelHe: 'משתמשים',        path: '/customer/users' },
  { icon: Activity,  label: 'Activity',        labelHe: 'פעילות',         path: '/customer/activity' },
  { icon: Layers,    label: 'Services',        labelHe: 'שירותים',        path: '/customer/services' },
  { icon: FileText,  label: 'Reports',         labelHe: 'דוחות',          path: '/customer/reports' },
  { icon: HelpCircle,label: 'Support',         labelHe: 'תמיכה',          path: '/customer/support' },
]

export default function CustomerLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg,#07111E 0%,#0B1929 100%)' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col sidebar-cdata"
        style={{ background: 'rgba(7,17,30,0.95)', backdropFilter: 'blur(20px)' }}>

        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/5">
          <CDataMark className="w-8 h-8 flex-shrink-0" />
          <div>
            <div className="font-black text-white text-sm">Security<span className="text-cdata-300"> Hub</span></div>
            <div className="text-[10px] text-cdata-500">Customer Portal · C-Data</div>
          </div>
        </div>

        {/* Company badge */}
        <div className="mx-3 mt-3 mb-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-cdata-300 font-black text-xs flex-shrink-0"
              style={{ background: 'rgba(44,106,138,0.15)', border: '1px solid rgba(44,106,138,0.2)' }}>
              TG
            </div>
            <div>
              <div className="text-xs font-semibold text-white">TechGlobal Ltd.</div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                <CheckCircle className="w-2.5 h-2.5" />
                Protected
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`nav-item ${active ? 'nav-item-customer active' : ''}`}
                style={active ? { color: '#87BFDA', background: 'rgba(44,106,138,0.1)', borderRight: '2px solid #5B9BB8' } : {}}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-600">{item.labelHe}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* C-Data branding strip */}
        <div className="mx-3 mb-3 p-2.5 rounded-xl border border-white/5 bg-white/[0.02]">
          <div className="text-[9px] text-slate-600 mb-1.5 text-center">Powered by</div>
          <CDataLogo className="h-5 mx-auto" />
        </div>

        <div className="px-2 py-3 border-t border-white/5">
          <button onClick={() => navigate('/')} className="nav-item w-full text-slate-600 hover:text-slate-400">
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs">יציאה</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-3.5 flex items-center justify-between flex-shrink-0 border-b border-white/[0.06]"
          style={{ background: 'rgba(7,17,30,0.8)', backdropFilter: 'blur(16px)' }}>
          <div>
            <div className="text-xs text-slate-500">ברוך הבא,</div>
            <div className="text-sm font-semibold text-white">TechGlobal Ltd.</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="badge-green">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow inline-block"></span>
              מוגן | Protected
            </span>
            <button className="relative p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2.5 pr-3 border-r border-white/5">
              <div className="text-right">
                <div className="text-xs font-medium text-white">דנה לוי</div>
                <div className="text-[10px] text-slate-500">IT Manager</div>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                style={{ background: 'linear-gradient(135deg,#2C6A8A,#1F3A54)', border: '1px solid rgba(44,106,138,0.4)' }}>
                דל
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
