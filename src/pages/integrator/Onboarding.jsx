import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { getCustomersByIntegrator } from '../../data/mockData'

const INTEGRATOR_ID = 'i1'

const ONBOARDING_STEP_KEYS = ['created', 'invited', 'configured', 'active']
const ONBOARDING_STEP_LABELS = ['נוצר', 'הוזמן', 'מוגדר', 'פעיל']

const getStepIndex = (status) => {
  const idx = ONBOARDING_STEP_KEYS.indexOf(status)
  return idx === -1 ? 0 : idx
}

const onboardingBadge = (status) => {
  const map = { active: 'badge-green', configured: 'badge-blue', invited: 'badge-amber', created: 'badge-steel' }
  return map[status] || 'badge-steel'
}
const onboardingLabel = (status) => {
  const map = { active: 'פעיל', configured: 'מוגדר', invited: 'הוזמן', created: 'חדש' }
  return map[status] || status
}

const daysSince = (dateStr) => {
  if (!dateStr) return '—'
  const then = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - then) / (1000 * 60 * 60 * 24))
  return diff
}

export default function IntegratorOnboarding() {
  const navigate = useNavigate()
  const allCustomers = getCustomersByIntegrator(INTEGRATOR_ID)
  const onboarding = allCustomers.filter(c => c.onboardingStatus !== 'active')

  const invitedCount = onboarding.filter(c => c.onboardingStatus === 'invited').length
  const configuredCount = onboarding.filter(c => c.onboardingStatus === 'configured').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">קליטה</h1>
        <p className="text-slate-500 text-sm mt-0.5">לקוחות בתהליך קליטה</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: 'בתהליך קליטה',
            value: onboarding.length,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-600/15',
          },
          {
            label: 'הוזמנו',
            value: invitedCount,
            icon: ChevronRight,
            color: 'text-cdata-300',
            bg: 'bg-cdata-500/15',
          },
          {
            label: 'מוגדרים',
            value: configuredCount,
            icon: CheckCircle,
            color: 'text-emerald-400',
            bg: 'bg-emerald-600/15',
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

      {/* Onboarding customer cards or empty state */}
      {onboarding.length === 0 ? (
        <div className="glass glow-border rounded-2xl p-14 flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-center">
            <div className="text-base font-semibold text-white">כל הלקוחות פעילים!</div>
            <p className="text-slate-500 text-sm mt-1">אין לקוחות בתהליך קליטה כרגע.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {onboarding.map(c => {
            const currentStep = getStepIndex(c.onboardingStatus)
            const days = daysSince(c.createdAt)
            return (
              <div key={c.id} className="glass glow-border rounded-xl p-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cdata-500/15 border border-cdata-500/15 flex items-center justify-center text-cdata-300 font-bold text-sm flex-shrink-0">
                      {c.companyName.slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{c.companyName}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{c.domain}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={onboardingBadge(c.onboardingStatus)}>
                      {onboardingLabel(c.onboardingStatus)}
                    </span>
                    <span className="text-[10px] text-slate-500">{days} ימים</span>
                  </div>
                </div>

                {/* Steps visualization */}
                <div className="flex items-center mb-5">
                  {ONBOARDING_STEP_LABELS.map((label, i) => {
                    const isCompleted = i <= currentStep
                    const isCurrent = i === currentStep
                    return (
                      <React.Fragment key={label}>
                        <div className="flex flex-col items-center gap-1.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                              isCompleted
                                ? 'bg-cdata-500 text-white'
                                : 'bg-slate-700 text-slate-500'
                            } ${isCurrent ? 'ring-2 ring-cdata-300/30' : ''}`}
                          >
                            {isCompleted && i < currentStep ? (
                              <CheckCircle className="w-3.5 h-3.5" />
                            ) : (
                              <span className="text-[10px] font-bold">{i + 1}</span>
                            )}
                          </div>
                          <span className={`text-[9px] whitespace-nowrap ${
                            isCompleted ? (isCurrent ? 'text-cdata-300' : 'text-slate-400') : 'text-slate-600'
                          }`}>
                            {label}
                          </span>
                        </div>
                        {i < ONBOARDING_STEP_LABELS.length - 1 && (
                          <div className={`flex-1 h-px mx-1 mb-4 ${
                            i < currentStep ? 'bg-cdata-500/50' : 'bg-white/[0.06]'
                          }`} />
                        )}
                      </React.Fragment>
                    )
                  })}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div className="text-[10px] text-slate-500">
                    {c.numberOfUsers} משתמשים · {c.packageName}
                  </div>
                  <button
                    className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3"
                    onClick={() => navigate(`/integrator/customers/${c.id}`)}
                  >
                    המשך תהליך
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
