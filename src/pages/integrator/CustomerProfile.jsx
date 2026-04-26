import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Circle, Users, Globe, AlertTriangle,
  ExternalLink, ChevronRight, Mail, Phone, Calendar,
} from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'

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
const ONBOARDING_STEPS = ['נוצר', 'הוזמן', 'מוגדר', 'פעיל']
const ONBOARDING_STEP_KEYS = ['created', 'invited', 'configured', 'active']

const getStepIndex = (status) => {
  const idx = ONBOARDING_STEP_KEYS.indexOf(status)
  return idx === -1 ? 0 : idx
}

export default function CustomerProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError('')
        const data = await workspaceApi.getPpCustomerProfile(id, 'integrator')
        setProfile(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [id])

  const customer = profile?.customer

  if (loading) return <div className="text-sm text-slate-400">טוען פרופיל לקוח...</div>
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

  const env = {
    complianceScore: profile.metrics?.complianceScore || 0,
    alertsCount: profile.metrics?.alertsCount || 0,
    protectedUsers: profile.metrics?.protectedUsers || 0,
    licenseTotal: profile.metrics?.protectedUsers || 0,
    healthStatus: profile.metrics?.complianceScore >= 90 ? 'healthy' : profile.metrics?.complianceScore >= 70 ? 'warning' : 'onboarding',
  }
  const activities = profile.recentActivity || []

  const currentStepIdx = getStepIndex(customer.onboardingStatus)

  const infoRows = [
    { icon: Globe, label: 'דומיין', value: customer.domain },
    { icon: Mail, label: 'מייל אדמין', value: customer.adminEmail },
    { icon: Phone, label: 'טלפון', value: customer.adminPhone },
    { icon: Calendar, label: 'תאריך יצירה', value: customer.createdAt },
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
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
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

      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'משתמשים מוגנים',
            value: `${env.protectedUsers} / ${env.licenseTotal}`,
            icon: Users,
            color: 'text-cdata-300',
            bg: 'bg-cdata-500/15',
          },
          {
            label: 'ציון תאימות',
            value: `${env.complianceScore}%`,
            icon: Globe,
            color: 'text-emerald-400',
            bg: 'bg-emerald-600/15',
          },
          {
            label: 'התראות פתוחות',
            value: env.alertsCount,
            icon: AlertTriangle,
            color: env.alertsCount > 0 ? 'text-red-400' : 'text-slate-500',
            bg: env.alertsCount > 0 ? 'bg-red-600/15' : 'bg-white/5',
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
          <div className="mt-2 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-slate-500">נוצר בתאריך</span>
            <span className="text-xs text-slate-300">{customer.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="text-sm font-semibold text-white">פעילות אחרונה</div>
          <button
            className="text-xs text-cdata-300 hover:text-cdata-300/80 transition-colors flex items-center gap-1"
            onClick={() => navigate('/integrator/onboarding')}
          >
            הצג הכל <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {activities.length === 0 ? (
          <div className="px-5 py-8 text-center text-slate-600 text-xs">אין פעילות זמינה</div>
        ) : (
          activities.slice(0, 8).map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-3 px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0">
                  PP
                </div>
                <div>
                  <div className="text-xs font-medium text-white">{a.status}</div>
                  <div className="text-[10px] text-slate-500">{a.source}</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 truncate">{a.details || '—'}</div>
              <div className="flex items-center justify-end gap-2">
                <span className="badge-steel">{a.createdAt}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
