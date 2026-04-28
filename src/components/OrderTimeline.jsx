import React from 'react'
import { CheckCircle2, Circle, XCircle, Clock, CreditCard, ThumbsUp, Loader2, Zap, AlertTriangle, Ban } from 'lucide-react'

const STATUS_CONFIG = {
  DRAFT:            { label: 'Draft',            icon: Circle,        color: '#64748b' },
  SUBMITTED:        { label: 'Submitted',         icon: Clock,         color: '#F59E0B' },
  PAYMENT_PENDING:  { label: 'Payment Pending',   icon: CreditCard,    color: '#F59E0B' },
  PAID:             { label: 'Paid',              icon: CreditCard,    color: '#10B981' },
  PENDING_APPROVAL: { label: 'Awaiting Approval', icon: Clock,         color: '#F59E0B' },
  APPROVED:         { label: 'Approved',          icon: ThumbsUp,      color: '#10B981' },
  PROVISIONING:     { label: 'Provisioning',      icon: Loader2,       color: '#3B82F6' },
  ACTIVE:           { label: 'Active',            icon: CheckCircle2,  color: '#10B981' },
  FAILED:           { label: 'Failed',            icon: AlertTriangle, color: '#EF4444' },
  CANCELLED:        { label: 'Cancelled',         icon: Ban,           color: '#64748b' },
}

const FLOW_CREDIT_CARD = ['PAYMENT_PENDING', 'PAID', 'APPROVED', 'PROVISIONING', 'ACTIVE']
const FLOW_INVOICE      = ['PENDING_APPROVAL', 'APPROVED', 'PROVISIONING', 'ACTIVE']

function formatDate(dt) {
  if (!dt) return null
  return new Date(dt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function OrderTimeline({ order, auditLogs = [] }) {
  if (!order) return null

  const flow = order.billingType === 'CREDIT_CARD' ? FLOW_CREDIT_CARD : FLOW_INVOICE
  const currentIdx = flow.indexOf(order.status)
  const isFailed = order.status === 'FAILED'
  const isCancelled = order.status === 'CANCELLED'

  // Build a map from action → timestamp using audit logs
  const actionTimestamp = {}
  for (const log of auditLogs) {
    if (!actionTimestamp[log.action]) {
      actionTimestamp[log.action] = log.createdAt
    }
  }

  const statusTimestamps = {
    PAYMENT_PENDING: order.createdAt,
    PENDING_APPROVAL: order.createdAt,
    PAID: actionTimestamp['PAID'],
    APPROVED: order.approvedAt,
    PROVISIONING: actionTimestamp['PROVISION_TRIGGERED'] || order.approvedAt,
    ACTIVE: order.provisionedAt,
    FAILED: actionTimestamp['PROVISION_FAILED'],
    CANCELLED: order.rejectedAt,
  }

  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-500 font-medium mb-3 uppercase tracking-wider">Order Timeline</div>
      <div className="relative">
        {/* Connector line */}
        <div className="absolute left-4 top-5 bottom-5 w-px bg-white/[0.06]" />

        {flow.map((status, idx) => {
          const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT
          const Icon = cfg.icon
          const isPast = idx < currentIdx
          const isCurrent = idx === currentIdx && !isFailed && !isCancelled
          const isFuture = idx > currentIdx && !isFailed && !isCancelled
          const ts = statusTimestamps[status]

          return (
            <div key={status} className="relative flex items-start gap-4 pb-5 last:pb-0">
              {/* Icon */}
              <div
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: isFuture ? 'rgba(255,255,255,0.04)' : `${cfg.color}22`,
                  border: `1.5px solid ${isFuture ? 'rgba(255,255,255,0.08)' : cfg.color}`,
                  boxShadow: isCurrent ? `0 0 12px ${cfg.color}44` : 'none',
                }}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`}
                  style={{ color: isFuture ? '#475569' : cfg.color }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isFuture ? '#475569' : isCurrent ? '#fff' : '#94a3b8' }}
                  >
                    {cfg.label}
                  </span>
                  {isCurrent && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                {ts && !isFuture && (
                  <div className="text-[10px] text-slate-600 mt-0.5">{formatDate(ts)}</div>
                )}
              </div>
            </div>
          )
        })}

        {/* Terminal state: failed or cancelled */}
        {(isFailed || isCancelled) && (() => {
          const cfg = STATUS_CONFIG[order.status]
          const Icon = cfg.icon
          return (
            <div className="relative flex items-start gap-4">
              <div
                className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: `${cfg.color}22`, border: `1.5px solid ${cfg.color}`, boxShadow: `0 0 12px ${cfg.color}44` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
              </div>
              <div className="flex-1 pt-1">
                <div className="text-xs font-semibold" style={{ color: cfg.color }}>{cfg.label}</div>
                {order.failureReason && (
                  <div className="text-[10px] text-slate-500 mt-1">{order.failureReason}</div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
