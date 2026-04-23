import React from 'react'
import { Globe2, AlertTriangle } from 'lucide-react'
import { getSitesByCustomer } from '../../data/mockData'

const mySites = getSitesByCustomer('c1')

export default function CustomerSites() {
  const connectedCount = mySites.filter(s => s.status === 'online').length
  const degradedCount = mySites.filter(s => s.status === 'degraded').length
  const alertSitesCount = mySites.filter(s => s.alertsCount > 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">אתרים</h1>
        <p className="text-slate-500 text-sm mt-0.5">אתרי רשת ומנהרות SASE</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/15 flex items-center justify-center mb-3">
            <Globe2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{connectedCount}</div>
          <div className="text-xs font-medium text-slate-300">אתרים מחוברים</div>
          <div className="text-[10px] text-slate-600">Connected Sites</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-amber-600/15 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{degradedCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-amber">מדרדר</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">אתרים מדרדרים</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-red-600/15 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{alertSitesCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-red">התראות</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">אתרים עם התראות</div>
        </div>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-2 gap-4">
        {mySites.map(site => (
          <div key={site.id} className="glass glow-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(44,106,138,0.12)' }}
                >
                  <Globe2 className="w-4 h-4 text-cdata-300" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{site.name}</div>
                  <div className="text-xs text-slate-500">{site.users} משתמשים</div>
                </div>
              </div>
              <span
                className={
                  site.status === 'online'
                    ? 'badge-green'
                    : site.status === 'degraded'
                      ? 'badge-amber'
                      : 'badge-red'
                }
              >
                {site.status === 'online'
                  ? 'מחובר'
                  : site.status === 'degraded'
                    ? 'מדרדר'
                    : 'לא מחובר'}
              </span>
            </div>

            {/* Tunnel health bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>בריאות מנהרה</span>
                <span>{site.tunnelHealth}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: site.tunnelHealth + '%',
                    background:
                      site.tunnelHealth > 90
                        ? '#10B981'
                        : site.tunnelHealth > 70
                          ? '#F59E0B'
                          : '#EF4444',
                  }}
                />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-4 text-xs text-slate-500">
              <span>Bandwidth: {site.bandwidthUsage}%</span>
              <span>Uptime: {site.uptime}</span>
              {site.alertsCount > 0 && (
                <span className="text-amber-400">{site.alertsCount} התראות</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
