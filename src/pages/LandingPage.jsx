import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, ArrowLeft, Building2, LogIn } from 'lucide-react'
import { CDataLogo, SpotNetLogo, CDataMark } from '../components/Logos'

const demoUsers = [
  {
    id: 'demo-distributor',
    userName: 'Yonatan Levy',
    role: 'Distributor Admin',
    roleHe: 'מנהל הפצה',
    route: '/distribution/dashboard',
    icon: Building2,
    color: '#2C6A8A',
    colorRgb: '44,106,138',
    textColor: 'text-cdata-300',
    portal: 'Distributor Portal',
    portalHe: 'פורטל מפיץ',
    email: 'distributor@demo.local',
    cta: 'התחבר כמפיץ',
  },
  {
    id: 'demo-integrator',
    userName: 'Alon Cohen',
    role: 'Integrator Admin',
    roleHe: 'מנהל אינטגרטור',
    route: '/integrator/dashboard',
    icon: Users,
    color: '#5B9BB8',
    colorRgb: '91,155,184',
    textColor: 'text-cdata-400',
    portal: 'Integrator Portal',
    portalHe: 'פורטל אינטגרטור',
    email: 'integrator@demo.local',
    cta: 'התחבר כאינטגרטור',
  },
  {
    id: 'demo-customer',
    userName: 'Dana Levy',
    role: 'Customer IT Manager',
    roleHe: 'מנהל IT לקוח',
    route: '/customer/overview',
    icon: Shield,
    color: '#10B981',
    colorRgb: '16,185,129',
    textColor: 'text-emerald-400',
    portal: 'Customer Portal',
    portalHe: 'פורטל לקוח',
    email: 'customer@demo.local',
    cta: 'התחבר כלקוח',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg,#07111E 0%,#0B1929 60%,#07111E 100%)' }}>

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full opacity-[0.12]"
          style={{ background: 'radial-gradient(circle,#2C6A8A,transparent 70%)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle,#10B981,transparent 70%)' }} />
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle,#5B9BB8,transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-4 flex items-center justify-between border-b border-white/[0.06]"
        style={{ background: 'rgba(7,17,30,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3">
          <CDataMark className="w-9 h-9" />
          <div>
            <div className="font-black text-white text-sm tracking-tight">
              Sovereign <span className="text-cdata-300">SASE</span>
            </div>
            <div className="text-[10px] text-slate-600 font-medium tracking-widest uppercase">B2B Management Platform</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03]">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-xs text-slate-400 font-medium">Fortinet Partner</span>
          </div>
          <CDataLogo className="h-5 opacity-60 hover:opacity-100 transition-opacity" />
          <span className="text-slate-700 text-xs">×</span>
          <SpotNetLogo className="h-4 opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

        <div className="badge-blue mb-8 px-4 py-1.5 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cdata-300 animate-pulse-slow inline-block ml-2"></span>
          Sovereign SASE · Workspace Security · B2B Channel Platform
        </div>

        <h1 className="text-5xl md:text-6xl font-black mb-5 leading-[1.1] max-w-3xl">
          <span className="text-white">כניסה למערכת.</span>
          <br />
          <span className="text-gradient-hero">שלושה משתמשי דמו.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-3 leading-relaxed">
          בחר משתמש דמה אחד כדי להתחבר ישירות לפורטל המתאים.
        </p>
        <p className="text-sm text-slate-600 mb-8 tracking-widest uppercase">
          Demo Login · Distributor · Integrator · Customer
        </p>

        {/* Hierarchy indicator */}
        <div className="flex items-center gap-3 mb-5 text-xs text-slate-600">
          <span className="badge-blue px-3 py-1">Distributor</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
          <span className="badge-steel px-3 py-1">Integrator</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
          <span className="px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-500/80 bg-emerald-500/5">Customer</span>
        </div>

        {/* Powered by Fortinet strip */}
        <div className="flex items-center gap-3 text-xs text-slate-600 mb-8">
          <div className="h-px w-12 bg-white/10" />
          <span>Powered by</span>
          <span className="text-red-400 font-semibold">Fortinet FortiSASE</span>
          <span>·</span>
          <span>Distributed by</span>
          <span className="text-cdata-400 font-semibold">C-Data</span>
          <div className="h-px w-12 bg-white/10" />
        </div>

        {/* Login cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mb-14">
          {demoUsers.map((u) => {
            const Icon = u.icon
            return (
              <button
                key={u.id}
                onClick={() => navigate(u.route)}
                className="glass rounded-2xl p-6 text-right group transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: `1px solid rgba(${u.colorRgb},0.2)`,
                  boxShadow: `0 0 40px rgba(${u.colorRgb},0.05)`,
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 60px rgba(${u.colorRgb},0.14)`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 40px rgba(${u.colorRgb},0.05)`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `rgba(${u.colorRgb},0.1)`, border: `1px solid rgba(${u.colorRgb},0.22)` }}>
                  <Icon className="w-6 h-6" style={{ color: u.color }} />
                </div>
                <div className="text-lg font-bold text-white mb-0.5">{u.userName}</div>
                <div className="text-xs text-slate-400 mb-1">{u.roleHe} · {u.role}</div>
                <div className="text-[11px] text-slate-600 mb-4">{u.portalHe} · {u.portal}</div>
                <div className="glass rounded-lg px-3 py-2 mb-5 text-[11px] text-slate-400" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  {u.email}
                </div>
                <div className={`flex items-center justify-end gap-2 text-xs font-semibold group-hover:gap-3 transition-all ${u.textColor}`}>
                  <span>{u.cta}</span>
                  <LogIn className="w-3.5 h-3.5" />
                  <ArrowLeft className="w-3.5 h-3.5" />
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-xs text-slate-600">
          * דמו בלבד: הכניסה מבצעת מעבר ישיר לפורטל ללא סיסמה.
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 flex items-center justify-between text-xs text-slate-700 border-t border-white/5"
        style={{ background: 'rgba(7,17,30,0.7)' }}>
        <span>© 2025 C-Data Distribution · All rights reserved</span>
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <CDataLogo className="h-4 opacity-40" />
          <span>×</span>
          <SpotNetLogo className="h-3.5 opacity-40" />
        </div>
      </footer>
    </div>
  )
}
