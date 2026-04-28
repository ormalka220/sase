import React from 'react'
import { CheckCircle2, Circle, ArrowRight, ExternalLink } from 'lucide-react'

const STEPS = [
  { key: 'organizationCreated', label: 'Organization created in Perception Point', adminNote: null },
  { key: 'adminUserInvited', label: 'Admin user invited', adminNote: 'Check admin email inbox for invitation' },
  { key: 'licensesAssigned', label: 'Licenses assigned', adminNote: null },
  { key: 'emailServiceConnected', label: 'Email service configuration started', adminNote: 'Follow the Email Service Configuration wizard in the portal' },
  { key: 'microsoftConsentCompleted', label: 'Microsoft 365 consent granted', adminNote: 'Admin must approve the Microsoft app consent' },
  { key: 'dnsMailFlowCompleted', label: 'DNS / mail-flow setup complete', adminNote: 'DNS MX records must point through Perception Point' },
  { key: 'protectionActive', label: 'Protection active', adminNote: null },
]

const STATE_COLORS = {
  active: '#10B981',
  in_progress: '#F59E0B',
  dns_mail_flow_pending: '#F97316',
  not_started: '#64748b',
}

export default function OnboardingChecklist({
  checklist = {},
  state = 'not_started',
  message,
  portalUrl,
  deepLinkUrl,
  showAdminNotes = false,
}) {
  const completedCount = Object.values(checklist).filter(Boolean).length
  const totalCount = STEPS.length
  const progressPct = Math.round((completedCount / totalCount) * 100)
  const stateColor = STATE_COLORS[state] || STATE_COLORS.not_started

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-400">Onboarding Progress</span>
          <span className="text-xs font-bold" style={{ color: stateColor }}>
            {completedCount}/{totalCount} steps
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${stateColor}, ${stateColor}cc)` }}
          />
        </div>
      </div>

      {/* Status banner */}
      {message && (
        <div
          className="rounded-lg p-3 text-xs"
          style={{ background: `${stateColor}11`, border: `1px solid ${stateColor}33`, color: stateColor }}
        >
          {message}
        </div>
      )}

      {/* Steps */}
      <div className="space-y-2">
        {STEPS.map(({ key, label, adminNote }) => {
          const done = Boolean(checklist[key])
          return (
            <div
              key={key}
              className="flex items-start gap-3 p-2.5 rounded-lg transition-colors"
              style={{ background: done ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)' }}
            >
              {done ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-600" />
              )}
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${done ? 'text-white' : 'text-slate-400'}`}>{label}</div>
                {showAdminNotes && adminNote && !done && (
                  <div className="text-[10px] text-slate-600 mt-0.5 flex items-center gap-1">
                    <ArrowRight className="w-2.5 h-2.5" />
                    {adminNote}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Portal link */}
      {(portalUrl || deepLinkUrl) && (
        <a
          href={deepLinkUrl || portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 15px rgba(37,99,235,0.25)' }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Open Perception Point Portal
        </a>
      )}
    </div>
  )
}
