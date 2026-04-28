import React, { useEffect, useState } from 'react'
import {
  Mail, ShieldOff, Bug, AlertTriangle, CheckCircle2,
  TrendingUp, TrendingDown, Clock, Eye, ExternalLink
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

const severityConfig = {
  critical: { label: 'קריטי', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
  high:     { label: 'גבוה',  color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
  medium:   { label: 'בינוני',color: '#eab308', bg: 'rgba(234,179,8,0.12)',  border: 'rgba(234,179,8,0.25)' },
  low:      { label: 'נמוך',  color: '#6b7280', bg: 'rgba(107,114,128,0.12)',border: 'rgba(107,114,128,0.2)' },
}

const typeIcon = { Phishing: ShieldOff, Malware: Bug, Spam: Mail }

function ThreatBadge({ severity }) {
  const cfg = severityConfig[severity] || severityConfig.low
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  )
}

function fmt(dt) {
  return new Date(dt).toLocaleString('he-IL', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
}

function StatCard({ icon: Icon, label, labelHe, value, sub, color, glow }) {
  return (
    <div className="glass rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]"
      style={{ border: `1px solid ${color}25`, boxShadow: `0 0 24px ${glow || color}10` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-xs font-semibold text-slate-300">{label}</div>
      <div className="text-[10px] text-slate-600 mt-0.5">{labelHe}</div>
      {sub && <div className="text-[10px] mt-1.5" style={{ color }}>{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs border border-white/10">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-300">{p.name === 'scanned' ? 'נסרקו' : 'נחסמו'}:</span>
          <span className="font-bold text-white">{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function PerceptionOverview() {
  const { tr } = useLanguage()
  const customerId = 'c1'
  const [activeTab, setActiveTab] = useState('all')
  const [profile, setProfile] = useState(null)
  const [audit, setAudit] = useState([])
  const [onboarding, setOnboarding] = useState(null)
  const [integrationStatus, setIntegrationStatus] = useState(null)
  const [checkLoading, setCheckLoading] = useState(false)
  const [error, setError] = useState('')
  const stats = {
    emailsScanned: audit.length * 20,
    threatsBlocked: audit.filter((e) => e.status !== 'active').length,
    safeEmails: Math.max((audit.length * 20) - audit.filter((e) => e.status !== 'active').length, 0),
    protectedMailboxes: profile?.metrics?.protectedUsers || 0,
    totalMailboxes: profile?.metrics?.protectedUsers || 0,
  }
  const ppEmailTrend = audit.slice(0, 7).reverse().map((e, idx) => ({ day: `D${idx + 1}`, scanned: 20, blocked: e.status !== 'active' ? 1 : 0 }))
  const ppThreatBreakdown = [
    { category: 'Phishing', count: audit.filter((e) => e.source === 'API').length, pct: 60, color: '#ef4444' },
    { category: 'Manual', count: audit.filter((e) => e.source === 'MANUAL').length, pct: 30, color: '#f97316' },
    { category: 'System', count: audit.filter((e) => e.source === 'SYSTEM').length, pct: 10, color: '#eab308' },
  ]
  const threats = audit.map((e) => ({
    id: e.id,
    type: e.source === 'MANUAL' ? 'Spam' : 'Phishing',
    severity: e.status === 'active' ? 'low' : 'medium',
    subject: e.status,
    sender: e.createdBy || 'system',
    recipient: profile?.customer?.adminEmail || 'customer@domain.local',
    blockedAt: e.createdAt,
  }))
  const blockRate = stats ? ((stats.threatsBlocked / stats.emailsScanned) * 100).toFixed(1) : 0

  useEffect(() => {
    workspaceApi.getOnboarding(customerId, 'customer').then(setOnboarding).catch((e) => setError(e.message))
    workspaceApi.getIntegrationStatus(customerId, 'customer').then(setIntegrationStatus).catch((e) => setError(e.message))
    workspaceApi.getPpCustomerProfile(customerId, 'customer').then(setProfile).catch((e) => setError(e.message))
    workspaceApi.getPpAudit(customerId, 'customer').then((d) => setAudit(d.entries || [])).catch((e) => setError(e.message))
  }, [])

  async function checkConnection() {
    setCheckLoading(true)
    try {
      const status = await workspaceApi.getIntegrationStatus(customerId, 'customer')
      setIntegrationStatus(status)
      const onboardingData = await workspaceApi.getOnboarding(customerId, 'customer')
      setOnboarding(onboardingData)
    } finally {
      setCheckLoading(false)
    }
  }

  if (integrationStatus && integrationStatus.state !== 'active') {
    return (
      <div className="space-y-4">
        <div className="glass rounded-xl p-5 border border-indigo-500/20">
            <h1 className="text-xl font-black text-white mb-2">{tr('חברו את Microsoft 365 להפעלת Perception Point', 'Connect Microsoft 365 to enable Perception Point')}</h1>
          <p className="text-xs text-slate-400">{integrationStatus.message}</p>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={onboarding?.deepLinkUrl || onboarding?.portalUrl || 'https://app.perception-point.io'} target="_blank" rel="noreferrer" className="btn-primary text-xs">
              {tr('פתח הגדרת שירות דוא"ל', 'Open Email Service Setup')}
            </a>
            <button className="btn-ghost text-xs" onClick={checkConnection}>
              {checkLoading ? tr('בודק...', 'Checking...') : tr('בדוק חיבור', 'Check Connection')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white">{tr('לוח בקרה', 'Email Security ')}<span className="text-emerald-400">{tr('אבטחת דוא"ל', 'Dashboard')}</span></h1>
          </div>
          <p className="text-xs text-slate-500">{tr('מופעל על ידי Perception Point · Elbit Systems', 'Powered by Perception Point · Elbit Systems')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(5,150,105,0.12)', border: '1px solid rgba(5,150,105,0.3)', color: '#34D399' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow inline-block" />
            {tr('הגנה פעילה', 'Active Protection')}
          </span>
          <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            <ExternalLink className="w-3.5 h-3.5" />
            {tr('פורטל', 'Portal')}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Mail}       label="Emails Scanned"   labelHe="מיילים נסרקו"      value={stats?.emailsScanned?.toLocaleString() ?? '–'}  color="#10B981" sub="24 שעות אחרונות" />
        <StatCard icon={ShieldOff}  label="Threats Blocked"  labelHe="איומים נחסמו"       value={stats?.threatsBlocked?.toLocaleString() ?? '–'}  color="#ef4444" sub={`שיעור חסימה ${blockRate}%`} />
        <StatCard icon={CheckCircle2} label="Safe Emails"    labelHe="מיילים תקינים"       value={stats?.safeEmails?.toLocaleString() ?? '–'}     color="#34D399" />
        <StatCard icon={Eye}         label="Mailboxes"       labelHe="תיבות דואר מוגנות"   value={`${stats?.protectedMailboxes ?? 0}/${stats?.totalMailboxes ?? 0}`} color="#6366f1" sub="מוגנות" />
      </div>

      {/* Charts + Threat Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Email Volume Chart */}
        <div className="lg:col-span-2 glass rounded-xl p-5" style={{ border: '1px solid rgba(5,150,105,0.15)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-bold text-white">{tr('נפח מיילים (7 ימים)', 'Email Volume (7 Days)')}</div>
              <div className="text-[10px] text-slate-600">נפח מיילים — 7 ימים אחרונים</div>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />נסרקו</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />נחסמו</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={ppEmailTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="ppGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ppRedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="scanned" stroke="#10B981" strokeWidth={2} fill="url(#ppGreenGrad)" />
              <Area type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={2} fill="url(#ppRedGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Breakdown */}
        <div className="glass rounded-xl p-5" style={{ border: '1px solid rgba(5,150,105,0.15)' }}>
          <div className="text-sm font-bold text-white mb-1">{tr('קטגוריות איומים', 'Threat Categories')}</div>
          <div className="text-[10px] text-slate-600 mb-4">פירוט לפי סוג איום</div>
          <div className="space-y-3">
            {ppThreatBreakdown.map(t => (
              <div key={t.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                    <span className="text-xs font-medium text-slate-300">{t.category}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: t.color }}>{t.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${t.pct}%`, background: t.color }} />
                </div>
                <div className="text-[10px] text-slate-600 mt-0.5 text-left">{t.pct}%</div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.12)' }}>
                <div className="text-lg font-black text-emerald-400">{blockRate}%</div>
                <div className="text-[10px] text-slate-500">{tr('שיעור חסימה', 'Block Rate')}</div>
              </div>
              <div className="p-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                <div className="text-lg font-black text-red-400">0</div>
                <div className="text-[10px] text-slate-500">{tr('False Negatives', 'False Negatives')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="glass rounded-xl" style={{ border: '1px solid rgba(5,150,105,0.12)' }}>
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="text-sm font-bold text-white">{tr('איומים שנחסמו לאחרונה', 'Recent Threats Blocked')}</div>
            <div className="text-[10px] text-slate-600">איומים שנחסמו לאחרונה</div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/[0.03] rounded-lg p-1">
            {['all', 'Phishing', 'Malware', 'Spam'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors ${
                  activeTab === tab ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:text-white'}`}>
                {tab === 'all' ? 'הכל' : tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {threats
            .filter(t => activeTab === 'all' || t.type === activeTab)
            .map(threat => {
              const Icon = typeIcon[threat.type] || Mail
              const sev = severityConfig[threat.severity]
              return (
                <div key={threat.id} className="px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${sev?.color}14`, border: `1px solid ${sev?.color}25` }}>
                      <Icon className="w-4 h-4" style={{ color: sev?.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-white truncate">{threat.subject}</span>
                        <ThreatBadge severity={threat.severity} />
                        <span className="text-[10px] text-slate-600 px-1.5 py-0.5 rounded bg-white/[0.03]">{threat.type}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-[10px] text-slate-500">מ: <span className="text-red-400">{threat.sender}</span></span>
                        <span className="text-[10px] text-slate-500">אל: <span className="text-slate-400">{threat.recipient}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {fmt(threat.blockedAt)}
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
