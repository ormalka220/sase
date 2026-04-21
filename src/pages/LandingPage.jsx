import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Shield, Globe, Lock, Zap, ArrowLeft, CheckCircle } from 'lucide-react'
import { CDataLogo, SpotNetLogo, CDataMark } from '../components/Logos'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-grid flex flex-col"
      style={{ background: 'linear-gradient(160deg,#07111E 0%,#0B1929 60%,#07111E 100%)' }}>

      {/* Radial glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle,#2C6A8A,transparent 70%)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle,#F57C20,transparent 70%)' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-4 flex items-center justify-between border-b border-white/[0.06]"
        style={{ background: 'rgba(7,17,30,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="flex items-center gap-3">
          <CDataMark className="w-9 h-9" />
          <div>
            <div className="font-black text-white text-sm tracking-tight">
              SASE<span className="text-cdata-300"> Market</span>
            </div>
            <div className="text-[10px] text-cdata-600 font-medium">Cyber Channel Platform</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <CDataLogo className="h-5 opacity-70 hover:opacity-100 transition-opacity" />
            <span className="text-slate-700">×</span>
            <SpotNetLogo className="h-4 opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 py-16 text-center">

        {/* Badge */}
        <div className="badge-blue mb-7 px-4 py-1.5 text-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cdata-300 animate-pulse-slow inline-block ml-1.5"></span>
          B2B Cyber Channel Platform | פלטפורמת סייבר
        </div>

        {/* Headline */}
        <h1 className="text-6xl font-black mb-5 leading-[1.1] max-w-3xl">
          <span className="text-white">הגנה חכמה.</span>
          <br />
          <span className="text-gradient-hero">שיווק חכם יותר.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mb-3 leading-relaxed">
          פלטפורמה אחת לכל שרשרת הערך — מהמפיץ, דרך האינטגרטורים, ועד הלקוח הסופי.
        </p>
        <p className="text-sm text-slate-600 mb-12 tracking-widest uppercase">
          Distribute · Sell · Manage · Protect
        </p>

        {/* Portal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-14">

          {/* Partner Hub */}
          <button onClick={() => navigate('/partner/dashboard')}
            className="glass rounded-2xl p-7 text-right group transition-all duration-300 hover:scale-[1.02]"
            style={{ border: '1px solid rgba(44,106,138,0.2)', boxShadow: '0 0 40px rgba(44,106,138,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(44,106,138,0.15)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(44,106,138,0.06)'}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors"
              style={{ background: 'rgba(44,106,138,0.12)', border: '1px solid rgba(44,106,138,0.25)' }}>
              <Users className="w-7 h-7 text-cdata-300" />
            </div>
            <div className="text-xl font-bold text-white mb-1">Partner Hub</div>
            <div className="text-sm text-slate-400 mb-1">פורטל שותפים ואינטגרטורים</div>
            <div className="text-xs text-slate-600 mb-5">C-Data Partner Portal</div>
            <div className="space-y-1.5 text-xs text-slate-500 mb-6">
              {['ניהול הזדמנויות ומכירות', 'השוואת פתרונות', 'חומרי מכירה ו-POC'].map(t => (
                <div key={t} className="flex items-center gap-2 justify-end">
                  <span>{t}</span>
                  <div className="w-1 h-1 rounded-full bg-cdata-500/50"></div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 text-sm font-semibold group-hover:gap-3 transition-all text-cdata-300">
              <span>כניסה לפורטל שותפים</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>

          {/* Customer Portal */}
          <button onClick={() => navigate('/customer/overview')}
            className="glass rounded-2xl p-7 text-right group transition-all duration-300 hover:scale-[1.02]"
            style={{ border: '1px solid rgba(16,185,129,0.15)', boxShadow: '0 0 40px rgba(16,185,129,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 60px rgba(16,185,129,0.10)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 40px rgba(16,185,129,0.04)'}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors"
              style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Shield className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white mb-1">Customer Portal</div>
            <div className="text-sm text-slate-400 mb-1">פורטל לקוח סופי</div>
            <div className="text-xs text-slate-600 mb-5">Security Dashboard</div>
            <div className="space-y-1.5 text-xs text-slate-500 mb-6">
              {['סטטוס הגנה בזמן אמת', 'ניהול משתמשים ושירותים', 'דוחות ואירועי אבטחה'].map(t => (
                <div key={t} className="flex items-center gap-2 justify-end">
                  <span>{t}</span>
                  <div className="w-1 h-1 rounded-full bg-emerald-500/50"></div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-2 text-sm font-semibold group-hover:gap-3 transition-all text-emerald-400">
              <span>כניסה לפורטל לקוח</span>
              <ArrowLeft className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Products strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
          {[
            { icon: Globe, label: 'Sovereign SASE', color: '#2C6A8A' },
            { icon: Lock,  label: 'Workspace Security', color: '#2C6A8A' },
            { icon: Zap,   label: 'Perception Point', color: '#F57C20' },
            { icon: Shield,label: 'FortiSASE', color: '#2C6A8A' },
          ].map((p, i) => (
            <React.Fragment key={p.label}>
              {i > 0 && <div className="w-1 h-1 rounded-full bg-slate-800"></div>}
              <div className="flex items-center gap-1.5">
                <p.icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                <span>{p.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 flex items-center justify-between text-xs text-slate-700 border-t border-white/5"
        style={{ background: 'rgba(7,17,30,0.7)' }}>
        <span>© 2025 C-Data Distribution · All rights reserved</span>
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <CDataLogo className="h-4 opacity-50" />
          <span>×</span>
          <SpotNetLogo className="h-3.5 opacity-50" />
        </div>
      </footer>
    </div>
  )
}
