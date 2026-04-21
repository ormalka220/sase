import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, Shield, Clock, Filter, Mail, Globe, Lock, Zap } from 'lucide-react'

const events = [
  { time: '11:42', date: 'היום', type: 'email', severity: 'high', title: 'מייל Phishing נחסם', desc: 'From: billing@fake-bank.cc → dana.levi@techglobal.co.il', user: 'דנה לוי' },
  { time: '11:24', date: 'היום', type: 'browser', severity: 'high', title: 'קישור זדוני נחסם', desc: 'URL: hxxp://malware-download.ru/invoice.exe', user: 'ידידיה כהן' },
  { time: '10:58', date: 'היום', type: 'sase', severity: 'low', title: 'כניסה מאומתת (MFA)', desc: 'Remote access from Tel Aviv · Device: MacBook Pro', user: 'שרה לוי' },
  { time: '10:31', date: 'היום', type: 'email', severity: 'high', title: 'BEC Attempt נחסם', desc: 'CEO Impersonation attempt — wire transfer request', user: 'מיכל ברק' },
  { time: '09:45', date: 'היום', type: 'browser', severity: 'medium', title: 'אתר חשוד נחסם', desc: 'Category: Phishing Site · URL blocked by policy', user: 'דנה מור' },
  { time: '09:12', date: 'היום', type: 'email', severity: 'low', title: 'Malware בקובץ נחסם', desc: 'Attachment: invoice_final.docm (macro malware)', user: 'רון שפיר' },
  { time: '08:30', date: 'היום', type: 'sase', severity: 'low', title: 'מדיניות רשת הופעלה', desc: 'Policy: Block P2P · User attempted torrent download', user: 'אמיר נחום' },
  { time: '23:14', date: 'אתמול', type: 'email', severity: 'low', title: 'Spam Campaign נחסמה', desc: '14 emails from same campaign blocked automatically', user: 'מספר משתמשים' },
]

const typeConfig = {
  email: { icon: Mail, color: '#5B9BB8', bg: 'bg-cdata-500/10', label: 'Email' },
  browser: { icon: Globe, color: '#8b5cf6', bg: 'bg-violet-500/10', label: 'Browser' },
  sase: { icon: Zap, color: '#10b981', bg: 'bg-emerald-500/10', label: 'Network' },
}
const severityConfig = {
  high: { color: '#ef4444', label: 'חמור', badge: 'badge-red' },
  medium: { color: '#f59e0b', label: 'בינוני', badge: 'badge-amber' },
  low: { color: '#10b981', label: 'נמוך', badge: 'badge-green' },
}

export default function CustomerActivity() {
  const [filter, setFilter] = useState('all')

  const filtered = events.filter(e => filter === 'all' || e.type === filter || e.severity === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">פעילות</h1>
        <p className="text-slate-500 text-sm mt-0.5">Security Activity Log</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'חסימות היום', value: '28', color: 'text-emerald-400', bg: 'bg-emerald-600/15', icon: Shield },
          { label: 'Phishing', value: '9', color: 'text-red-400', bg: 'bg-red-600/15', icon: Mail },
          { label: 'Malware', value: '6', color: 'text-amber-400', bg: 'bg-amber-600/15', icon: AlertTriangle },
          { label: 'Browser Blocks', value: '13', color: 'text-violet-400', bg: 'bg-violet-600/15', icon: Globe },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'הכול' },
          { id: 'email', label: 'Email' },
          { id: 'browser', label: 'Browser' },
          { id: 'sase', label: 'Network' },
          { id: 'high', label: '🔴 חמור' },
          { id: 'medium', label: '🟡 בינוני' },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f.id ? 'bg-cdata-500/20 text-cdata-300 border border-cdata-500/30' : 'text-slate-500 border border-white/5 hover:border-white/10'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-2">
        {filtered.map((ev, i) => {
          const tc = typeConfig[ev.type]
          const sc = severityConfig[ev.severity]
          return (
            <div
              key={i}
              className="glass rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-all"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className={`w-10 h-10 rounded-xl ${tc.bg} flex items-center justify-center flex-shrink-0`}>
                <tc.icon className="w-5 h-5" style={{ color: tc.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-white text-sm">{ev.title}</span>
                  <span className={`text-[10px] ${sc.badge}`}>{sc.label}</span>
                </div>
                <div className="text-xs text-slate-500 truncate">{ev.desc}</div>
                <div className="text-[10px] text-slate-600 mt-0.5">משתמש: {ev.user}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-medium text-slate-400">{ev.time}</div>
                <div className="text-[10px] text-slate-600">{ev.date}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
