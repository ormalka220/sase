import React from 'react'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Home, Users, Monitor, Globe2, ShieldCheck, AlertTriangle,
  Key, FileText, Settings2, Bell, LogOut, CheckCircle,
  Mail, ShieldOff
} from 'lucide-react'
import { CDataLogo, CDataMark } from '../components/Logos'
import ProductSwitch from '../components/ProductSwitch'
import { useProduct } from '../context/ProductContext'

const saseNavItems = [
  { icon: Home,          label: 'Overview',  labelHe: 'סקירה כללית', path: '/customer/overview' },
  { icon: Users,         label: 'Users',     labelHe: 'משתמשים',     path: '/customer/users' },
  { icon: Monitor,       label: 'Devices',   labelHe: 'התקנים',      path: '/customer/devices' },
  { icon: Globe2,        label: 'Sites',     labelHe: 'אתרים',       path: '/customer/sites' },
  { icon: ShieldCheck,   label: 'Policies',  labelHe: 'מדיניות',     path: '/customer/policies' },
  { icon: AlertTriangle, label: 'Alerts',    labelHe: 'התראות',      path: '/customer/alerts' },
  { icon: Key,           label: 'Licenses',  labelHe: 'רישיונות',    path: '/customer/licenses' },
  { icon: FileText,      label: 'Reports',   labelHe: 'דוחות',       path: '/customer/reports' },
  { icon: Settings2,     label: 'Settings',  labelHe: 'הגדרות',      path: '/customer/settings' },
]

const ppNavItems = [
  { icon: Home,        label: 'Overview',    labelHe: 'סקירה כללית', path: '/customer/overview' },
  { icon: ShieldOff,   label: 'Threats',     labelHe: 'איומים',      path: '/customer/threats' },
  { icon: Mail,        label: 'Email Scan',  labelHe: 'סריקת מייל',  path: '/customer/email-scan' },
  { icon: FileText,    label: 'Reports',     labelHe: 'דוחות',       path: '/customer/reports' },
  { icon: Settings2,   label: 'Settings',    labelHe: 'הגדרות',      path: '/customer/settings' },
]

export default function CustomerLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { product, config } = useProduct()

  const navItems = product === 'perception' ? ppNavItems : saseNavItems
  const activeColor = config.navActiveColor
  const activeBg = config.navActiveBg
  const activeBorder = config.navActiveBorder

  const productLabel = product === 'perception' ? 'Perception Point' : 'Forti SASE'
  const statusLabel = product === 'perception' ? 'Protected Email' : 'Protected'
  const statusColor = product === 'perception' ? '#34D399' : '#10B981'

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(160deg,#07111E 0%,#0B1929 100%)' }}>
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 flex flex-col"
        style={{
          background: 'rgba(7,17,30,0.95)',
          backdropFilter: 'blur(20px)',
          borderLeft: `1px solid ${config.primaryColor}14`,
        }}>

        {/* Logo */}
        <div className="px-5 py-4 flex items-center gap-3 border-b border-white/5">
          <CDataMark className="w-8 h-8 flex-shrink-0" />
          <div>
            <div className="font-black text-white text-sm">Security<span style={{ color: activeColor }}> Hub</span></div>
            <div className="text-[10px]" style={{ color: config.primaryColor }}>Customer Portal · {productLabel}</div>
          </div>
        </div>

        {/* Company badge */}
        <div className="mx-3 mt-3 mb-1 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0"
              style={{ background: `${config.primaryColor}20`, border: `1px solid ${config.primaryColor}30`, color: activeColor }}>
              TG
            </div>
            <div>
              <div className="text-xs font-semibold text-white">TechGlobal Ltd.</div>
              <div className="flex items-center gap-1 text-[10px] font-medium" style={{ color: statusColor }}>
                <CheckCircle className="w-2.5 h-2.5" />
                {statusLabel}
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
                className={`nav-item ${active ? 'active' : ''}`}
                style={active ? { color: activeColor, background: activeBg, borderRight: `2px solid ${activeBorder}` } : {}}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <div>
                  <div className="text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-600">{item.labelHe}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Branding strip */}
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
        <header className="px-6 py-3 flex items-center justify-between flex-shrink-0 border-b border-white/[0.06]"
          style={{ background: 'rgba(7,17,30,0.8)', backdropFilter: 'blur(16px)' }}>
          <div>
            <div className="text-xs text-slate-500">ברוך הבא,</div>
            <div className="text-sm font-semibold text-white">TechGlobal Ltd.</div>
          </div>
          <div className="flex items-center gap-3">
            <ProductSwitch />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: `${statusColor}12`, border: `1px solid ${statusColor}30`, color: statusColor }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow inline-block" style={{ background: statusColor }} />
              {statusLabel}
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
                style={{ background: `linear-gradient(135deg,${config.primaryColor},${config.darkColor})`, border: `1px solid ${config.primaryColor}40` }}>
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
