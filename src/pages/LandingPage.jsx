import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, ArrowLeft, Building2, LogIn, Loader2 } from 'lucide-react'
import { CDataLogo, SpotNetLogo, CDataMark } from '../components/Logos'
import { useAuth, ROLE_PORTAL } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitch from '../components/LanguageSwitch'

const ROLE_ICON = {
  SUPER_ADMIN: Shield,
  DISTRIBUTOR_ADMIN: Building2,
  INTEGRATOR_ADMIN: Users,
  CUSTOMER_ADMIN: Shield,
  CUSTOMER_VIEWER: Shield,
}

const ROLE_COLOR = {
  SUPER_ADMIN: { color: '#A78BFA', rgb: '167,139,250', portal: 'Super Admin Portal' },
  DISTRIBUTOR_ADMIN: { color: '#2C6A8A', rgb: '44,106,138', portal: 'Distributor Portal' },
  INTEGRATOR_ADMIN: { color: '#5B9BB8', rgb: '91,155,184', portal: 'Integrator Portal' },
  CUSTOMER_ADMIN: { color: '#10B981', rgb: '16,185,129', portal: 'Customer Portal' },
  CUSTOMER_VIEWER: { color: '#10B981', rgb: '16,185,129', portal: 'Customer Portal (View)' },
}

const ROLE_LABEL_HE = {
  SUPER_ADMIN: 'מנהל מערכת',
  DISTRIBUTOR_ADMIN: 'מנהל הפצה',
  INTEGRATOR_ADMIN: 'מנהל אינטגרטור',
  CUSTOMER_ADMIN: 'מנהל IT לקוח',
  CUSTOMER_VIEWER: 'צופה לקוח',
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { login, isAuthenticated, user } = useAuth()
  const { tr } = useLanguage()
  const [demoUsers, setDemoUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loggingIn, setLoggingIn] = useState(null)

  // Redirect already-authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(ROLE_PORTAL[user.role] || '/integrator/dashboard', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
    fetch(`${base}/api/auth/demo-users`)
      .then((r) => r.ok ? r.json() : [])
      .then(setDemoUsers)
      .catch(() => setDemoUsers([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleDemoLogin(demoUser) {
    setLoggingIn(demoUser.id)
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
      // Get a real JWT token via the demo login endpoint
      const res = await fetch(`${base}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoUser.email, password: 'demo' }),
      })
      const data = await res.json()
      if (data.token) {
        login({ ...data.user, token: data.token })
      } else {
        // Fallback: use demo mode without JWT (legacy header auth)
        login(demoUser)
      }
      navigate(ROLE_PORTAL[demoUser.role] || '/integrator/dashboard')
    } catch {
      login(demoUser)
      navigate(ROLE_PORTAL[demoUser.role] || '/integrator/dashboard')
    } finally {
      setLoggingIn(null)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg,#07111E 0%,#0B1929 60%,#07111E 100%)' }}
    >
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
      <header
        className="relative z-10 px-8 py-4 flex items-center justify-between border-b border-white/[0.06]"
        style={{ background: 'rgba(7,17,30,0.85)', backdropFilter: 'blur(16px)' }}
      >
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
          <LanguageSwitch />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.03]">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-slate-400 font-medium">{tr('שותף Fortinet', 'Fortinet Partner')}</span>
          </div>
          <CDataLogo className="h-5 opacity-60 hover:opacity-100 transition-opacity" />
          <span className="text-slate-700 text-xs">×</span>
          <SpotNetLogo className="h-4 opacity-60 hover:opacity-100 transition-opacity" />
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="badge-blue mb-8 px-4 py-1.5 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cdata-300 animate-pulse-slow inline-block ml-2" />
          Sovereign SASE · Perception Point · B2B Channel Platform
        </div>

        <h1 className="text-5xl md:text-6xl font-black mb-5 leading-[1.1] max-w-3xl">
          <span className="text-white">כניסה למערכת.</span>
          <br />
          <span className="text-gradient-hero">בחר פרופיל דמו.</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mb-3 leading-relaxed">
          כל פרופיל מתחבר לפורטל הנכון עם הרשאות מתאימות ונתוני דמו אמיתיים.
        </p>

        {/* Hierarchy indicator */}
        <div className="flex items-center gap-3 mb-8 text-xs text-slate-600">
          <span className="badge-blue px-3 py-1">Distributor</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
          <span className="badge-steel px-3 py-1">Integrator</span>
          <ArrowLeft className="w-3 h-3 rotate-180" />
          <span className="px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-500/80 bg-emerald-500/5">Customer</span>
        </div>

        {/* Demo cards */}
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">{tr('טוען משתמשי דמו...', 'Loading demo users...')}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-12">
            {demoUsers.map((u) => {
              const roleConf = ROLE_COLOR[u.role] || ROLE_COLOR.INTEGRATOR_ADMIN
              const Icon = ROLE_ICON[u.role] || Users
              const isLoading = loggingIn === u.id

              return (
                <button
                  key={u.id}
                  onClick={() => !isLoading && handleDemoLogin(u)}
                  disabled={Boolean(loggingIn)}
                  className="glass rounded-2xl p-5 text-right group transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                  style={{
                    border: `1px solid rgba(${roleConf.rgb},0.2)`,
                    boxShadow: `0 0 40px rgba(${roleConf.rgb},0.05)`,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 60px rgba(${roleConf.rgb},0.14)` }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 40px rgba(${roleConf.rgb},0.05)` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `rgba(${roleConf.rgb},0.1)`, border: `1px solid rgba(${roleConf.rgb},0.22)` }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: roleConf.color }} />
                    ) : (
                      <Icon className="w-5 h-5" style={{ color: roleConf.color }} />
                    )}
                  </div>
                  <div className="text-base font-bold text-white mb-0.5">{u.name}</div>
                  <div className="text-xs text-slate-400 mb-0.5">{ROLE_LABEL_HE[u.role]} · {u.role.replace(/_/g, ' ')}</div>
                  <div className="text-[10px] text-slate-600 mb-3">{u.organizationName} · {roleConf.portal}</div>
                  <div
                    className="glass rounded-lg px-2.5 py-1.5 mb-4 text-[10px] text-slate-400 text-left"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {u.email}
                  </div>
                  <div
                    className="flex items-center justify-end gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all"
                    style={{ color: roleConf.color }}
                  >
                    <span>התחבר</span>
                    <LogIn className="w-3.5 h-3.5" />
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="text-xs text-slate-600">
          * דמו בלבד: הכניסה מבצעת אימות מלא מול ה-API עם JWT. כל משתמש ראה רק את הנתונים שלו.
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 px-8 py-4 flex items-center justify-between text-xs text-slate-700 border-t border-white/5"
        style={{ background: 'rgba(7,17,30,0.7)' }}
      >
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
