import React from 'react'
import {
  Shield, Users, Monitor, Globe2, AlertTriangle, CheckCircle,
  ExternalLink, Copy, Lock, Globe, Mail, Zap, Clock,
} from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  getCustomerEnvironment,
  getAlertsByCustomer,
  getSitesByCustomer,
  threatData,
} from '../../data/mockData'

const CUSTOMER_ID = 'c1'
const env = getCustomerEnvironment(CUSTOMER_ID)
const customer = {
  companyName: 'Elbit Systems',
  fortisaseUser: 'admin_elbit',
  fortisaseUrl: 'https://ftntsa.saas.fortinet.com',
  packageName: 'Enterprise SASE',
}
const openAlerts = getAlertsByCustomer(CUSTOMER_ID).filter(a => a.status === 'open')
const sites = getSitesByCustomer(CUSTOMER_ID)
const connectedSites = sites.filter(s => s.status === 'online').length

const totalBlocked = threatData.reduce((sum, d) => sum + d.blocked, 0)

const severityConfig = {
  high:   { color: '#ef4444', bg: 'bg-red-500/10',   border: 'border-red-500/20',   icon: AlertTriangle },
  medium: { color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
  low:    { color: '#64748b', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: AlertTriangle },
}

function formatAlertTime(isoStr) {
  const d = new Date(isoStr)
  return d.toLocaleString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// Custom recharts tooltip
function ThreatTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0a1428',
      border: '1px solid rgba(16,185,129,0.2)',
      borderRadius: 10,
      padding: '8px 14px',
      fontSize: 12,
    }}>
      <div style={{ color: '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#10b981', fontWeight: 700 }}>
        {payload[0].value.toLocaleString()} <span style={{ fontWeight: 400, color: '#64748b' }}>איומים שנחסמו</span>
      </div>
    </div>
  )
}

export default function CustomerOverview() {
  const handleCopyUser = () => {
    navigator.clipboard.writeText(customer.fortisaseUser).catch(() => {})
  }

  return (
    <div className="space-y-6">

      {/* ── 1. Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">סקירה כללית</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {customer.companyName} · FortiSASE {customer.packageName}
          </p>
        </div>
        <a
          href={customer.fortisaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          FortiSASE Console
        </a>
      </div>

      {/* ── 2. FortiSASE Environment Banner ───────────────────────────────────── */}
      <div
        className="rounded-2xl p-5 flex items-center gap-6"
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(44,106,138,0.08) 100%)',
          border: '1px solid rgba(16,185,129,0.2)',
        }}
      >
        {/* Left: Status */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
            <Shield className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">הארגון מוגן ופעיל</div>
            <div className="text-sm text-emerald-400 mt-0.5">All FortiSASE services operational</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              סונכרן לאחרונה: היום בשעה 10:30
            </div>
          </div>
        </div>

        {/* Center: Score */}
        <div className="text-center px-8 border-r border-l border-white/5">
          <div className="text-4xl font-black text-emerald-400">98%</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">Security Posture</div>
          <div className="text-[10px] text-slate-600 mt-0.5">ציון אבטחה כולל</div>
        </div>

        {/* Right: FortiSASE access */}
        <div className="flex flex-col items-end gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">FortiSASE User:</span>
            <code className="text-sm font-mono font-bold text-cdata-300 bg-cdata-500/10 px-2.5 py-0.5 rounded border border-cdata-500/20">
              {customer.fortisaseUser}
            </code>
          </div>
          <a
            href={customer.fortisaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            פתח FortiSASE Console
          </a>
        </div>
      </div>

      {/* ── 3. KPI Row — 6 cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-6 gap-3">

        {/* Protected Users */}
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-cdata-500/15 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-cdata-300" />
          </div>
          <div className="text-xl font-bold text-white">
            {env.protectedUsers}
            <span className="text-sm font-normal text-slate-500"> / {env.licenseTotal}</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-0.5">משתמשים מוגנים</div>
          <div className="text-[10px] text-slate-600">Protected Users</div>
        </div>

        {/* Active Devices */}
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center mb-3">
            <Monitor className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-xl font-bold text-white">{env.activeDevices}</div>
          <div className="text-xs font-medium text-slate-300 mt-0.5">התקנים פעילים</div>
          <div className="text-[10px] text-slate-600">Active Devices</div>
        </div>

        {/* Connected Sites */}
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/15 flex items-center justify-center mb-3">
            <Globe2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">{env.connectedSites}</div>
          <div className="text-xs font-medium text-slate-300 mt-0.5">אתרים מחוברים</div>
          <div className="text-[10px] text-slate-600">Connected Sites</div>
        </div>

        {/* Open Alerts */}
        <div className="stat-card">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${openAlerts.length > 0 ? 'bg-red-600/15' : 'bg-emerald-600/15'}`}>
            <AlertTriangle className={`w-4 h-4 ${openAlerts.length > 0 ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div className={`text-xl font-bold ${openAlerts.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {openAlerts.length}
          </div>
          <div className="text-xs font-medium text-slate-300 mt-0.5">התראות פתוחות</div>
          <div className="text-[10px] text-slate-600">Open Alerts</div>
        </div>

        {/* Compliance Score */}
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center mb-3">
            <CheckCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">{env.complianceScore}%</div>
          <div className="text-xs font-medium text-slate-300 mt-0.5">ציות לתקנות</div>
          <div className="text-[10px] text-slate-600">Compliance Score</div>
        </div>

        {/* Gateway Health */}
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-3">
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{env.gatewayHealth}%</div>
          <div className="text-xs font-medium text-slate-300 mt-0.5">בריאות Gateway</div>
          <div className="text-[10px] text-slate-600">Gateway Health</div>
        </div>

      </div>

      {/* ── 4. Charts Section ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Threat Area Chart */}
        <div className="col-span-2 glass glow-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-semibold text-white text-sm">חסימות איומים — 7 ימים</div>
              <div className="text-xs text-slate-500 mt-0.5">Threat Blocking Activity</div>
            </div>
            <span className="badge-green text-xs px-3 py-1">{totalBlocked.toLocaleString()} Blocked This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={148}>
            <AreaChart data={threatData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ThreatTooltip />} />
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#threatGrad)"
                dot={{ fill: '#10b981', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#10b981', stroke: 'rgba(16,185,129,0.3)', strokeWidth: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sites connectivity list */}
        <div className="glass glow-border rounded-xl p-5 flex flex-col">
          <div className="font-semibold text-white text-sm mb-0.5">אתרים — קישוריות</div>
          <div className="text-xs text-slate-500 mb-4">Sites Connectivity Status</div>
          <div className="space-y-3 flex-1">
            {sites.map(site => (
              <div key={site.id}>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      site.status === 'online'
                        ? 'bg-emerald-400'
                        : site.status === 'degraded'
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                    }`}
                  />
                  <span className="text-xs font-medium text-white flex-1 truncate">{site.name}</span>
                  <span className="text-[10px] text-slate-500 tabular-nums font-medium">{site.tunnelHealth}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full ml-4">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: site.tunnelHealth + '%',
                      background:
                        site.tunnelHealth >= 90
                          ? '#10b981'
                          : site.tunnelHealth >= 70
                            ? '#f59e0b'
                            : '#ef4444',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Summary footer */}
          <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
            <span className="text-[10px] text-slate-600">Tunnel Health Average</span>
            <span className="text-xs font-semibold text-emerald-400">
              {Math.round(sites.reduce((s, x) => s + x.tunnelHealth, 0) / sites.length)}%
            </span>
          </div>
        </div>
      </div>

      {/* ── 5. Bottom Section ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-5">

        {/* Security Posture Breakdown */}
        <div className="glass glow-border rounded-xl p-5">
          <div className="font-semibold text-white text-sm mb-0.5">Security Posture — פירוט</div>
          <div className="text-xs text-slate-500 mb-4">Service-Level Security Scores</div>
          <div className="space-y-1 divide-y divide-white/[0.04]">
            {[
              { label: 'Zero Trust Network Access', score: 99, icon: Lock },
              { label: 'Secure Web Gateway',        score: 97, icon: Globe },
              { label: 'Cloud Access Security Broker', score: 96, icon: Shield },
              { label: 'Email Security',            score: 98, icon: Mail },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 py-2.5">
                <div className="w-7 h-7 rounded-lg bg-cdata-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-cdata-300" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white font-semibold">{item.score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500/70 transition-all duration-700"
                      style={{ width: item.score + '%' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Open Alerts */}
        <div className="glass glow-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-white text-sm">התראות אחרונות</div>
              <div className="text-xs text-slate-500 mt-0.5">Recent Open Alerts</div>
            </div>
            {openAlerts.length > 0 && (
              <span className="badge-red">{openAlerts.length} פתוחות</span>
            )}
          </div>

          {openAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-sm text-emerald-400 font-medium">אין התראות פתוחות</span>
              <span className="text-xs text-slate-600">No open alerts at this time</span>
            </div>
          ) : (
            <div className="space-y-2">
              {openAlerts.slice(0, 4).map(alert => {
                const cfg = severityConfig[alert.severity] || severityConfig.low
                return (
                  <div
                    key={alert.id}
                    className={`flex items-start gap-3 p-3 rounded-xl ${cfg.bg} border ${cfg.border}`}
                  >
                    <cfg.icon
                      className="w-4 h-4 flex-shrink-0 mt-0.5"
                      style={{ color: cfg.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-200 leading-snug">{alert.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{alert.source}</div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-600 whitespace-nowrap flex-shrink-0 mt-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatAlertTime(alert.createdAt)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── 6. FortiSASE Quick Access ─────────────────────────────────────────── */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-sm font-semibold text-white mb-2.5">FortiSASE Quick Access</div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-14">Console:</span>
                <code className="text-xs font-mono text-slate-300 select-all">{customer.fortisaseUrl}</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 w-14">User:</span>
                <code className="text-xs font-mono text-cdata-300 font-bold select-all">{customer.fortisaseUser}</code>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyUser}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              <Copy className="w-4 h-4" />
              העתק יוזר
            </button>
            <a
              href={customer.fortisaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              פתח Console
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
