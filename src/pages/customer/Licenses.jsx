import React from 'react'
import { Key, AlertTriangle, CheckCircle, ArrowUp } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'
import { getCustomerEnvironment, licenseData } from '../../data/mockData'

const CUSTOMER_ID = 'c1'
const env = getCustomerEnvironment(CUSTOMER_ID)
const licenseUsedPct = env ? Math.round((env.licenseUsed / env.licenseTotal) * 100) : 0

const features = [
  'Zero Trust Network Access (ZTNA)',
  'Secure Web Gateway (SWG)',
  'Cloud Access Security Broker (CASB)',
  'Data Loss Prevention (DLP)',
  'Advanced Threat Prevention',
  'Cloud Application Control',
  'SSL/TLS Inspection',
  'Remote Browser Isolation (RBI)',
]

export default function CustomerLicenses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">רישיונות</h1>
        <p className="text-slate-500 text-sm mt-0.5">ניהול מנויים ורישיונות — License Management</p>
      </div>

      {/* License utilization warning */}
      {licenseUsedPct > 85 && (
        <div className="rounded-xl p-4 border border-amber-500/20 flex items-center gap-3"
          style={{ background: 'rgba(245,158,11,0.07)' }}>
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">כמות הרישיונות מתקרבת למגבלה</div>
            <div className="text-xs text-slate-500 mt-0.5">שקול הרחבת המנוי לפני שתגיע למגבלה המלאה</div>
          </div>
          <button className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5">
            <ArrowUp className="w-3 h-3" />
            שדרג מנוי
          </button>
        </div>
      )}

      {/* Main license card */}
      {env && (
        <div className="glass glow-border rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(44,106,138,0.15)', border: '1px solid rgba(44,106,138,0.25)' }}>
                <Key className="w-6 h-6 text-cdata-300" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Enterprise SASE</div>
                <div className="text-sm text-slate-500 mt-0.5">Sovereign SASE · Full Stack Bundle</div>
              </div>
            </div>
            <div className="text-left">
              <span className="badge-green">מנוי פעיל</span>
              <div className="text-xs text-slate-600 mt-2">מתחדש: 1 ינואר 2025</div>
            </div>
          </div>

          {/* Seat utilization */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">מושבים בשימוש</span>
              <span className="text-white font-semibold">{env.licenseUsed} / {env.licenseTotal}</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{
                  width: licenseUsedPct + '%',
                  background: licenseUsedPct > 90 ? '#EF4444' : licenseUsedPct > 75 ? '#F59E0B' : '#10B981'
                }} />
            </div>
            <div className="flex justify-between text-xs text-slate-600 mt-1.5">
              <span>{licenseUsedPct}% מהרישיונות בשימוש</span>
              <span>{env.licenseTotal - env.licenseUsed} רישיונות פנויים</span>
            </div>
          </div>

          {/* License stats row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'רישיונות כולל', value: env.licenseTotal, color: 'text-white' },
              { label: 'בשימוש', value: env.licenseUsed, color: 'text-cdata-300' },
              { label: 'פנויים', value: env.licenseTotal - env.licenseUsed, color: licenseUsedPct > 85 ? 'text-amber-400' : 'text-emerald-400' },
            ].map((s, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
                <div className="text-xs text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage trend */}
      <div className="glass glow-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-5">מגמת ניצול רישיונות</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={licenseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8, fontSize: 12 }} />
            <Line type="monotone" dataKey="used" stroke="#2C6A8A" strokeWidth={2.5} dot={false} name="בשימוש" />
            <Line type="monotone" dataKey="total" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="כולל" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Features included */}
      <div className="glass glow-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">פיצ'רים כלולים בפאקג'</h3>
        <div className="grid grid-cols-2 gap-2">
          {features.map(f => (
            <div key={f} className="flex items-center gap-2.5 py-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="text-sm text-slate-400">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
