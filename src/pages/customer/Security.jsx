import React from 'react'
import { Shield, CheckCircle, AlertTriangle, Lock, Globe, Zap, Mail, Eye } from 'lucide-react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'

const protections = [
  {
    name: 'Email Security',
    nameHe: 'אבטחת אימייל',
    icon: Mail,
    status: 'active',
    score: 100,
    color: '#10b981',
    stats: [
      { label: 'מיילים שנסרקו היום', value: '2,341' },
      { label: 'איומים שנחסמו', value: '28' },
      { label: 'False Positives', value: '0' },
    ],
    details: 'Microsoft 365 · הגנה מלאה',
  },
  {
    name: 'Browser Security',
    nameHe: 'אבטחת דפדפן',
    icon: Globe,
    status: 'active',
    score: 98,
    color: '#5B9BB8',
    stats: [
      { label: 'כתובות URL שנחסמו', value: '14' },
      { label: 'נסיונות Phishing', value: '6' },
      { label: 'משתמשים מוגנים', value: '247' },
    ],
    details: 'Chrome Extension · פעיל',
  },
  {
    name: 'Network Access (SASE)',
    nameHe: 'גישה לרשת',
    icon: Zap,
    status: 'active',
    score: 96,
    color: '#8b5cf6',
    stats: [
      { label: 'חיבורים פעילים', value: '89' },
      { label: 'חיבורים חסומים', value: '3' },
      { label: 'Data Transferred', value: '14.2 GB' },
    ],
    details: 'Sovereign SASE · Israel DC',
  },
  {
    name: 'Cloud Storage',
    nameHe: 'אחסון ענן',
    icon: Lock,
    status: 'active',
    score: 100,
    color: '#f59e0b',
    stats: [
      { label: 'קבצים שנסרקו', value: '1,890' },
      { label: 'קבצים חשודים', value: '0' },
      { label: 'DLP Events', value: '2' },
    ],
    details: 'OneDrive · SharePoint',
  },
]

export default function CustomerSecurity() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">סטטוס הגנה</h1>
        <p className="text-slate-500 text-sm mt-0.5">Security Status — Real Time</p>
      </div>

      {/* Overall Score */}
      <div className="glass glow-border rounded-2xl p-6 flex items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="50"
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 50 * 0.98} ${2 * Math.PI * 50}`}
              strokeLinecap="round"
              style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">98</span>
            <span className="text-xs text-slate-500">Score</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xl font-bold text-white mb-1">Security Score מצוין</div>
          <div className="text-sm text-emerald-400 mb-3">הארגון שלך מוגן ברמה גבוהה מאוד</div>
          <div className="flex gap-3">
            <div className="badge-green">4 שירותים פעילים</div>
            <div className="badge-green">0 אירועים פתוחים</div>
            <div className="badge-blue">עדכון אחרון: עכשיו</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500 mb-2">רמת הגנה</div>
          <div className="text-2xl font-black text-gradient">Protected</div>
        </div>
      </div>

      {/* Protection Modules */}
      <div className="grid grid-cols-2 gap-4">
        {protections.map(p => (
          <div
            key={p.name}
            className="glass rounded-xl p-5 transition-all hover:scale-[1.01]"
            style={{ border: `1px solid ${p.color}25`, boxShadow: `0 0 30px ${p.color}08` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${p.color}18`, border: `1px solid ${p.color}30` }}
                >
                  <p.icon className="w-5 h-5" style={{ color: p.color }} />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{p.name}</div>
                  <div className="text-xs text-slate-500">{p.nameHe}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: p.color }}></div>
                <span className="text-xs font-semibold" style={{ color: p.color }}>Active</span>
              </div>
            </div>

            {/* Score Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-500">Security Score</span>
                <span className="font-bold text-white">{p.score}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: `${p.score}%`, background: p.color, boxShadow: `0 0 8px ${p.color}60` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {p.stats.map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg bg-white/[0.025] border border-white/5">
                  <div className="font-bold text-white text-sm">{s.value}</div>
                  <div className="text-[9px] text-slate-600 mt-0.5 leading-tight">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[10px] text-slate-600">{p.details}</div>
          </div>
        ))}
      </div>

      {/* Compliance */}
      <div className="glass glow-border rounded-xl p-5">
        <div className="font-semibold text-white text-sm mb-4">עמידה בתקנים | Compliance Status</div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'ISO 27001', status: true },
            { name: 'GDPR', status: true },
            { name: 'SOC 2', status: true },
            { name: 'ITAR', status: false },
          ].map(c => (
            <div key={c.name} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.025] border border-white/5">
              {c.status
                ? <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                : <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              }
              <span className="text-xs font-medium text-white">{c.name}</span>
              <span className={`text-[10px] mr-auto ${c.status ? 'text-emerald-500' : 'text-amber-500'}`}>
                {c.status ? '✓' : '⚠'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
