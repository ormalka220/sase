import React from 'react'
import { Globe2, AlertTriangle, Wifi, CheckCircle } from 'lucide-react'
import { getSitesByCustomer } from '../../data/mockData'

const mySites = getSitesByCustomer('c1')

export default function CustomerSites() {
  const onlineSites   = mySites.filter(s => s.status === 'online').length
  const degradedSites = mySites.filter(s => s.status === 'degraded').length
  const totalSites    = mySites.length
  const alertSitesCount = mySites.filter(s => s.alertsCount > 0).length

  return (
    <div className="space-y-6">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-white">אתרים</h1>
        <p className="text-slate-500 text-sm mt-0.5">אתרי רשת ומנהרות FortiSASE SD-WAN</p>
      </div>

      {/* ── SD-WAN Summary Banner ────────────────────────────────────────────── */}
      <div className="glass glow-border rounded-2xl p-5 flex items-center gap-6">
        <div className="w-11 h-11 rounded-xl bg-cdata-500/15 border border-cdata-500/20 flex items-center justify-center flex-shrink-0">
          <Wifi className="w-5 h-5 text-cdata-300" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white mb-1">FortiSASE SD-WAN — סטטוס רשת</div>
          <div className="text-xs text-slate-500">כל האתרים מנוהלים דרך סביבת FortiSASE אחת</div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-xl font-bold text-emerald-400">{onlineSites}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">מחוברים</div>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <div className="text-xl font-bold text-amber-400">{degradedSites}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">מדרדרים</div>
          </div>
          <div className="w-px bg-white/5" />
          <div>
            <div className="text-xl font-bold text-cdata-300">{totalSites}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">סה"כ</div>
          </div>
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/15 flex items-center justify-center mb-3">
            <Globe2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{onlineSites}</div>
          <div className="text-xs font-medium text-slate-300">אתרים מחוברים</div>
          <div className="text-[10px] text-slate-600">Connected Sites</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-amber-600/15 flex items-center justify-center mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{degradedSites}</div>
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

      {/* ── Sites Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        {mySites.map(site => (
          <div key={site.id} className="glass glow-border rounded-xl p-5">

            {/* FortiSASE SD-WAN label */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cdata-400" />
              <span className="text-[10px] font-semibold text-cdata-400 tracking-wide uppercase">FortiSASE SD-WAN</span>
            </div>

            {/* Site header */}
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
                <span className={
                  site.tunnelHealth >= 90
                    ? 'text-emerald-400'
                    : site.tunnelHealth >= 70
                      ? 'text-amber-400'
                      : 'text-red-400'
                }>{site.tunnelHealth}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: site.tunnelHealth + '%',
                    background:
                      site.tunnelHealth >= 90
                        ? '#10B981'
                        : site.tunnelHealth >= 70
                          ? '#F59E0B'
                          : '#EF4444',
                  }}
                />
              </div>
            </div>

            {/* Bandwidth / traffic bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>סה״כ תעבורה</span>
                <span className={
                  site.bandwidthUsage >= 80
                    ? 'text-red-400'
                    : site.bandwidthUsage >= 60
                      ? 'text-amber-400'
                      : 'text-slate-400'
                }>{site.bandwidthUsage}% ניצול</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: site.bandwidthUsage + '%',
                    background:
                      site.bandwidthUsage >= 80
                        ? '#ef4444'
                        : site.bandwidthUsage >= 60
                          ? '#f59e0b'
                          : '#2c6a8a',
                  }}
                />
              </div>
            </div>

            {/* Stats footer */}
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2.5 border-t border-white/[0.04]">
              <span>Uptime: <span className="text-slate-300 font-medium">{site.uptime}</span></span>
              {site.alertsCount > 0 ? (
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {site.alertsCount} התראות
                </span>
              ) : (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  אין התראות
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
