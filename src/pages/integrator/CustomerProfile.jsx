import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Circle, Users, Monitor, Globe, AlertTriangle,
  ExternalLink, ChevronRight, Mail, Phone, Package, Calendar, Shield, Copy,
} from 'lucide-react'
import {
  getCustomer,
  getCustomerEnvironment,
  getUsersByCustomer,
  getAlertsByCustomer,
} from '../../data/mockData'

const onboardingBadge = (status) => {
  const map = { active: 'badge-green', configured: 'badge-blue', invited: 'badge-amber', created: 'badge-steel' }
  return map[status] || 'badge-steel'
}
const onboardingLabel = (status) => {
  const map = { active: 'פעיל', configured: 'מוגדר', invited: 'הוזמן', created: 'חדש' }
  return map[status] || status
}
const statusBadge = (status) => {
  const map = { active: 'badge-green', onboarding: 'badge-amber', suspended: 'badge-red' }
  return map[status] || 'badge-steel'
}
const statusLabel = (status) => {
  const map = { active: 'פעיל', onboarding: 'קליטה', suspended: 'מושהה' }
  return map[status] || status
}
const riskBadge = (r) => {
  const map = { low: 'badge-green', medium: 'badge-amber', high: 'badge-red' }
  return map[r] || 'badge-steel'
}
const riskLabel = (r) => {
  const map = { low: 'נמוך', medium: 'בינוני', high: 'גבוה' }
  return map[r] || r
}
const userStatusBadge = (s) => {
  const map = { protected: 'badge-green', alert: 'badge-red', inactive: 'badge-steel' }
  return map[s] || 'badge-steel'
}
const userStatusLabel = (s) => {
  const map = { protected: 'מוגן', alert: 'התראה', inactive: 'לא פעיל' }
  return map[s] || s
}
const severityIcon = (sev) => {
  if (sev === 'high') return <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
  if (sev === 'medium') return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
  return <AlertTriangle className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
}

const formatTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const ONBOARDING_STEPS = ['נוצר', 'הוזמן', 'מוגדר', 'פעיל']
const ONBOARDING_STEP_KEYS = ['created', 'invited', 'configured', 'active']

const getStepIndex = (status) => {
  const idx = ONBOARDING_STEP_KEYS.indexOf(status)
  return idx === -1 ? 0 : idx
}

export default function CustomerProfile() {
  const navigate = useNavigate()
  const { id } = useParams()

  const customer = getCustomer(id)

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-slate-400 text-lg font-semibold">לא נמצא</div>
          <p className="text-slate-600 text-sm">הלקוח המבוקש אינו קיים במערכת.</p>
          <button
            className="btn-ghost flex items-center gap-2"
            onClick={() => navigate('/integrator/customers')}
          >
            <ArrowLeft className="w-4 h-4" />
            חזור לרשימה
          </button>
        </div>
      </div>
    )
  }

  const env = getCustomerEnvironment(id)
  const users = getUsersByCustomer(id)
  const allAlerts = getAlertsByCustomer(id)
  const openAlerts = allAlerts.filter(a => a.status === 'open')

  const currentStepIdx = getStepIndex(customer.onboardingStatus)

  const infoRows = [
    { icon: Globe, label: 'דומיין', value: customer.domain },
    { icon: Mail, label: 'מייל אדמין', value: customer.adminEmail },
    { icon: Phone, label: 'טלפון', value: customer.phone },
    { icon: Package, label: 'פאקג׳', value: customer.packageName },
    { icon: Monitor, label: 'פריסה', value: customer.deploymentType },
    { icon: Calendar, label: 'תאריך התחלה', value: customer.startDate },
  ]

  const healthColor = (score) =>
    score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/integrator/customers')}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white">{customer.companyName}</h1>
              <span className={statusBadge(customer.status)}>{statusLabel(customer.status)}</span>
              <span className={onboardingBadge(customer.onboardingStatus)}>
                {onboardingLabel(customer.onboardingStatus)}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{customer.domain}</p>
          </div>
        </div>
        <button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={() => navigate('/customer/overview')}
        >
          <ExternalLink className="w-4 h-4" />
          פתח פורטל לקוח
        </button>
      </div>

      {/* FortiSASE access panel */}
      {customer.fortisaseUser && (
        <div className="rounded-2xl p-5 flex items-center gap-5"
          style={{ background: 'linear-gradient(135deg, rgba(44,106,138,0.15) 0%, rgba(44,106,138,0.05) 100%)', border: '1px solid rgba(44,106,138,0.3)' }}>

          {/* Fortinet/FortiSASE icon area */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(44,106,138,0.2)', border: '1px solid rgba(44,106,138,0.35)' }}>
            <Shield className="w-6 h-6 text-cdata-300" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="text-xs text-cdata-500 font-medium mb-0.5">FortiSASE Environment</div>
            <div className="text-sm font-bold text-white mb-1">{customer.fortisaseUrl}</div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Admin User:</span>
              <code className="text-sm font-mono font-bold text-cdata-300 bg-cdata-500/10 border border-cdata-500/20 px-2.5 py-0.5 rounded-md">
                {customer.fortisaseUser}
              </code>
              <button
                onClick={() => navigator.clipboard?.writeText(customer.fortisaseUser)}
                className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-cdata-300 transition-colors"
                title="העתק יוזר"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Open button */}
          <a
            href={customer.fortisaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-sm flex-shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            פתח FortiSASE
          </a>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'משתמשים מוגנים',
            value: env ? `${env.protectedUsers} / ${env.licenseTotal}` : '— / —',
            icon: Users,
            color: 'text-cdata-300',
            bg: 'bg-cdata-500/15',
          },
          {
            label: 'מכשירים פעילים',
            value: env?.activeDevices ?? '—',
            icon: Monitor,
            color: 'text-violet-400',
            bg: 'bg-violet-600/15',
          },
          {
            label: 'אתרים מחוברים',
            value: env?.connectedSites ?? '—',
            icon: Globe,
            color: 'text-emerald-400',
            bg: 'bg-emerald-600/15',
          },
          {
            label: 'התראות פתוחות',
            value: env?.alertsCount ?? 0,
            icon: AlertTriangle,
            color: (env?.alertsCount ?? 0) > 0 ? 'text-red-400' : 'text-slate-500',
            bg: (env?.alertsCount ?? 0) > 0 ? 'bg-red-600/15' : 'bg-white/5',
          },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <div className="text-xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Info + Onboarding timeline */}
      <div className="grid grid-cols-2 gap-4">
        {/* Customer info */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-4">פרטי לקוח</div>
          <div className="space-y-3">
            {infoRows.map(r => (
              <div key={r.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <r.icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-xs text-slate-500">{r.label}</span>
                  <span className="text-xs text-slate-200 font-medium">{r.value || '—'}</span>
                </div>
              </div>
            ))}
            {customer.notes && (
              <div className="mt-3 pt-3 border-t border-white/[0.06]">
                <div className="text-xs text-slate-500 mb-1">הערות</div>
                <p className="text-xs text-slate-400 leading-relaxed">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Onboarding timeline */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-6">מצב קליטה</div>
          <div className="space-y-0">
            {ONBOARDING_STEPS.map((label, i) => {
              const isCompleted = i <= currentStepIdx
              const isCurrent = i === currentStepIdx
              return (
                <div key={label} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCompleted ? 'bg-cdata-500/25' : 'bg-white/5'
                    }`}>
                      {isCompleted
                        ? <CheckCircle className="w-4 h-4 text-cdata-300" />
                        : <Circle className="w-4 h-4 text-slate-600" />
                      }
                    </div>
                    {i < ONBOARDING_STEPS.length - 1 && (
                      <div className={`w-px flex-1 my-1 ${isCompleted ? 'bg-cdata-500/30' : 'bg-white/[0.06]'}`} style={{ height: 24 }} />
                    )}
                  </div>
                  <div className="pb-5">
                    <div className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-slate-600'} ${isCurrent ? 'text-cdata-300' : ''}`}>
                      {label}
                    </div>
                    {isCurrent && (
                      <div className="text-[10px] text-cdata-300/70 mt-0.5">שלב נוכחי</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          {customer.createdAt && (
            <div className="mt-2 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-500">נוצר בתאריך</span>
              <span className="text-xs text-slate-300">{customer.createdAt}</span>
            </div>
          )}
        </div>
      </div>

      {/* Environment health */}
      {env && (
        <div className="glass glow-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">סביבת SASE</div>
            <span className={
              env.healthStatus === 'healthy' ? 'badge-green' :
              env.healthStatus === 'warning' ? 'badge-amber' :
              env.healthStatus === 'onboarding' ? 'badge-blue' : 'badge-steel'
            }>
              {env.healthStatus === 'healthy' ? 'תקין' :
               env.healthStatus === 'warning' ? 'אזהרה' :
               env.healthStatus === 'onboarding' ? 'בקליטה' : env.healthStatus}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">ציון עמידה (Compliance)</span>
                <span className="text-xs font-semibold" style={{ color: healthColor(env.complianceScore) }}>
                  {env.complianceScore}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${env.complianceScore}%`, background: healthColor(env.complianceScore) }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">רישיונות</span>
                <span className="text-xs font-semibold text-slate-300">
                  {env.licenseUsed} / {env.licenseTotal}
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-cdata-500 transition-all"
                  style={{ width: `${Math.round((env.licenseUsed / env.licenseTotal) * 100)}%` }}
                />
              </div>
            </div>
          </div>
          {env.lastSyncAt && (
            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs text-slate-500">סנכרון אחרון</span>
              <span className="text-xs text-slate-400">{formatTime(env.lastSyncAt)}</span>
            </div>
          )}
        </div>
      )}

      {/* Users mini table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="text-sm font-semibold text-white">משתמשים</div>
          <button
            className="text-xs text-cdata-300 hover:text-cdata-300/80 transition-colors flex items-center gap-1"
            onClick={() => navigate('/customer/users')}
          >
            הצג הכל <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {users.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-600 text-xs">אין משתמשים</div>
        ) : (
          users.slice(0, 5).map(u => (
            <div
              key={u.id}
              className="grid grid-cols-3 px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0">
                  {u.fullName.slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-medium text-white">{u.fullName}</div>
                  <div className="text-[10px] text-slate-500">{u.role}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 truncate">{u.email}</div>
              <div className="flex items-center justify-end gap-2">
                <span className={userStatusBadge(u.status)}>{userStatusLabel(u.status)}</span>
                <span className={riskBadge(u.riskLevel)}>{riskLabel(u.riskLevel)}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alerts mini table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="text-sm font-semibold text-white">התראות פתוחות</div>
          <button
            className="text-xs text-cdata-300 hover:text-cdata-300/80 transition-colors flex items-center gap-1"
            onClick={() => navigate('/customer/alerts')}
          >
            הצג הכל <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {openAlerts.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-600 text-xs flex flex-col items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500/40" />
            אין התראות פתוחות
          </div>
        ) : (
          openAlerts.slice(0, 3).map(a => (
            <div
              key={a.id}
              className="flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
            >
              <div className="mt-0.5">{severityIcon(a.severity)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-white font-medium truncate">{a.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{a.source}</div>
              </div>
              <div className="text-[10px] text-slate-600 flex-shrink-0 mt-0.5">
                {formatTime(a.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
