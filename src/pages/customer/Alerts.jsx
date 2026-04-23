import React, { useState } from 'react'
import { AlertTriangle, AlertOctagon, CheckCircle, Info } from 'lucide-react'
import { getAlertsByCustomer } from '../../data/mockData'

const myAlerts = getAlertsByCustomer('c1')

const FILTERS = [
  { id: 'all', label: 'הכל' },
  { id: 'critical', label: 'קריטי' },
  { id: 'high', label: 'גבוה' },
  { id: 'medium', label: 'בינוני' },
  { id: 'open', label: 'פתוח' },
  { id: 'resolved', label: 'נפתר' },
]

export default function CustomerAlerts() {
  const [activeFilter, setActiveFilter] = useState('all')

  const criticalCount = myAlerts.filter(a => a.severity === 'critical').length
  const highCount = myAlerts.filter(a => a.severity === 'high').length
  const mediumCount = myAlerts.filter(a => a.severity === 'medium').length
  const resolvedCount = myAlerts.filter(a => a.status === 'resolved').length

  const filtered = myAlerts.filter(a => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'open') return a.status === 'open'
    if (activeFilter === 'resolved') return a.status === 'resolved'
    return a.severity === activeFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">התראות</h1>
          <p className="text-slate-500 text-sm mt-0.5">מרכז ניהול התראות</p>
        </div>
        <button className="btn-ghost text-xs">סמן הכל כנקרא</button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-red-600/15 flex items-center justify-center mb-3">
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{criticalCount}</div>
          <div className="text-xs font-medium text-slate-300">קריטי</div>
          <div className="text-[10px] text-slate-600">Critical</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-amber-600/15 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{highCount}</div>
          <div className="text-xs font-medium text-slate-300">גבוה</div>
          <div className="text-[10px] text-slate-600">High</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-yellow-600/15 flex items-center justify-center mb-3">
            <Info className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{mediumCount}</div>
          <div className="text-xs font-medium text-slate-300">בינוני</div>
          <div className="text-[10px] text-slate-600">Medium</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/15 flex items-center justify-center mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{resolvedCount}</div>
          <div className="text-xs font-medium text-slate-300">נפתרו</div>
          <div className="text-[10px] text-slate-600">Resolved</div>
        </div>
      </div>

      {/* Filter Tabs */}
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

      {/* Alert List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <CheckCircle className="w-12 h-12 text-emerald-500" />
          <span className="text-slate-500 text-sm">אין התראות פתוחות</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => (
            <div key={alert.id} className="glass rounded-xl p-4" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-start gap-4">
                {/* Severity icon */}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'critical'
                      ? 'bg-red-500/15'
                      : alert.severity === 'high'
                        ? 'bg-amber-500/15'
                        : 'bg-yellow-500/10'
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      alert.severity === 'critical'
                        ? 'text-red-400'
                        : alert.severity === 'high'
                          ? 'text-amber-400'
                          : 'text-yellow-400'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-white text-sm">{alert.title}</span>
                    <span
                      className={
                        alert.status === 'resolved'
                          ? 'badge-green text-[10px]'
                          : 'badge-amber text-[10px]'
                      }
                    >
                      {alert.status === 'resolved' ? 'נפתר' : 'פתוח'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1">מקור: {alert.source}</div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                    {alert.relatedUser && <span>👤 {alert.relatedUser}</span>}
                    {alert.relatedDevice && <span>💻 {alert.relatedDevice}</span>}
                    {alert.relatedSite && <span>📍 {alert.relatedSite}</span>}
                  </div>
                </div>

                {/* Time */}
                <div className="text-xs text-slate-600 flex-shrink-0">
                  {new Date(alert.createdAt).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
