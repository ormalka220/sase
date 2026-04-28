import React, { useState } from 'react'
import { Monitor, Search, CheckCircle } from 'lucide-react'
import { getDevicesByCustomer, getUsersByCustomer } from '../../data/mockData'
import { useLanguage } from '../../context/LanguageContext'

const CUSTOMER_ID = 'c1'
const allDevices = getDevicesByCustomer(CUSTOMER_ID)
const allUsers   = getUsersByCustomer(CUSTOMER_ID)

function getUserName(userId) {
  if (!userId) return '—'
  const user = allUsers.find(u => u.id === userId)
  return user ? user.fullName : '—'
}

function formatLastSeen(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const FILTERS = [
  { id: 'all',          label: 'הכל' },
  { id: 'Windows',      label: 'Windows' },
  { id: 'macOS',        label: 'macOS' },
  { id: 'Linux',        label: 'Linux' },
  { id: 'non-compliant',label: 'לא תקני' },
]

export default function CustomerDevices() {
  const { tr } = useLanguage()
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = allDevices.filter(d => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'non-compliant') return d.compliance === 'non-compliant'
    return d.os.toLowerCase().startsWith(activeFilter.toLowerCase())
  })

  const totalDevices     = allDevices.length
  const compliantCount   = allDevices.filter(d => d.compliance === 'compliant').length
  const nonCompliantCount = allDevices.filter(d => d.compliance === 'non-compliant').length

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">התקנים</h1>
          <p className="text-slate-500 text-sm mt-0.5">{tr('מלאי התקנים ועמידת תקנים', 'Device Inventory and Compliance')}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-cdata-500">{tr(':מנוהל דרך', 'Managed via:')}</span>
            <code className="text-[10px] text-slate-400 font-mono">ftntsa.saas.fortinet.com</code>
          </div>
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-cdata-500/15 flex items-center justify-center mb-3">
            <Monitor className="w-4 h-4 text-cdata-300" />
          </div>
          <div className="text-2xl font-bold text-white">{totalDevices}</div>
          <div className="text-xs font-medium text-slate-300">סה"כ התקנים</div>
          <div className="text-[10px] text-slate-600">{tr('סה"כ התקנים', 'Total Devices')}</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/15 flex items-center justify-center mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{compliantCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-green">תקני</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">התקנים תקניים</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-red-600/15 flex items-center justify-center mb-3">
            <Monitor className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{nonCompliantCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-red">לא תקני</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">התקנים לא תקניים</div>
        </div>
      </div>

      {/* ── Filter Tabs ─────────────────────────────────────────────────────── */}
      <div className="flex gap-2">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === f.id
                ? 'bg-cdata-500/20 text-cdata-300 border border-cdata-500/30'
                : 'text-slate-500 border border-white/5 hover:border-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Device Table ─────────────────────────────────────────────────────── */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
          <div className="col-span-1">התקן</div>
          <div>משתמש</div>
          <div>מערכת הפעלה</div>
          <div>סטטוס ניהול</div>
          <div>עמידה</div>
          <div>סיכון</div>
          <div>נצפה לאחרונה</div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Search className="w-10 h-10 text-slate-600" />
            <span className="text-slate-500 text-sm">{tr('לא נמצאו התקנים', 'No devices found')}</span>
          </div>
        ) : (
          filtered.map(device => (
            <div
              key={device.id}
              className="grid grid-cols-7 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all items-center"
            >
              {/* Device */}
              <div className="col-span-1">
                <div className="font-medium text-white text-sm">{device.hostname}</div>
                <div className="text-xs text-slate-500">{device.site}</div>
              </div>

              {/* User */}
              <div className="text-sm text-slate-300">{getUserName(device.userId)}</div>

              {/* OS */}
              <div className="text-sm text-slate-400">{device.os}</div>

              {/* Posture / Managed — with FortiSASE badge for managed devices */}
              <div>
                {device.postureStatus === 'managed' ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="badge-blue">מנוהל</span>
                    <span className="text-[9px] text-cdata-500 font-medium">FortiSASE</span>
                  </div>
                ) : (
                  <span className="badge-steel">לא מנוהל</span>
                )}
              </div>

              {/* Compliance */}
              <div>
                {device.compliance === 'compliant'
                  ? <span className="badge-green">תקני</span>
                  : device.compliance === 'non-compliant'
                    ? <span className="badge-red">לא תקני</span>
                    : <span className="badge-amber">חלקי</span>
                }
              </div>

              {/* Risk */}
              <div>
                {device.riskLevel === 'low'
                  ? <span className="badge-green">נמוך</span>
                  : device.riskLevel === 'medium'
                    ? <span className="badge-amber">בינוני</span>
                    : <span className="badge-red">גבוה</span>
                }
              </div>

              {/* Last Seen */}
              <div className="text-xs text-slate-400">{formatLastSeen(device.lastSeen)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
