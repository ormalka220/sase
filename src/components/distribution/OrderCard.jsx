import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import ExpandableCard from './ExpandableCard'

const statusMap = {
  PENDING_APPROVAL: 'pending',
  PENDING_CDATA_APPROVAL: 'pending',
  APPROVED_BY_CDATA: 'approved',
  APPROVED: 'approved',
  PROVISIONING: 'provisioning',
  PROVISIONING_STARTED: 'provisioning',
  READY_FOR_ONBOARDING: 'ready',
  ACTIVE: 'active',
  REJECTED: 'rejected',
  REJECTED_BY_CDATA: 'rejected',
  FAILED: 'failed',
  CANCELLED: 'neutral',
}

export default function OrderCard({
  order,
  onApprove = null,
  onReject = null,
  onProvision = null,
  expandedByDefault = false
}) {
  const [isExpanded, setIsExpanded] = useState(expandedByDefault)
  const [showApprovalUI, setShowApprovalUI] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const customer = order.customer || {}
  const integrator = order.integrator?.organization || {}
  const status = statusMap[order.status] || 'neutral'
  const isPending = ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL'].includes(order.status)

  const headerContent = (
    <div className="flex-1 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-white">#{order.id?.slice(0, 8)}</span>
          <StatusBadge status={status} label={order.status} size="sm" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm text-slate-200">
            <span className="font-semibold">{customer.companyName || 'Unknown'}</span>
            {' · '}
            <span className="text-slate-400">{integrator.name || 'Unknown Integrator'}</span>
          </div>
          <div className="text-xs text-slate-500">
            {order.items?.[0]?.product?.name || 'Perception Point'} ·{' '}
            {order.billingCycle || 'Monthly'} · {(order.estimatedUsers || 0).toLocaleString()} mailboxes
          </div>
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-lg font-bold text-emerald-400">
          ${(order.totalAmount || 0).toFixed(2)}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {new Date(order.createdAt || Date.now()).toLocaleDateString()}
        </div>
      </div>
    </div>
  )

  const expandedContent = (
    <div className="space-y-6">
      {/* Customer Details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">Customer</label>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-white">{customer.companyName}</div>
            {customer.domain && <div className="text-xs text-slate-400">{customer.domain}</div>}
            {customer.adminEmail && <div className="text-xs text-slate-400">{customer.adminEmail}</div>}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-2">Integrator</label>
          <div className="space-y-1">
            <div className="text-sm font-semibold text-white">{integrator.name}</div>
            {integrator.email && <div className="text-xs text-slate-400">{integrator.email}</div>}
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div>
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-3">Package Details</label>
        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-white/[0.03] border border-white/5">
          <div>
            <div className="text-xs text-slate-500 mb-1">Product</div>
            <div className="text-sm font-semibold text-white">{order.items?.[0]?.product?.name || 'Perception Point'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Billing Cycle</div>
            <div className="text-sm font-semibold text-white">{order.billingCycle || 'Monthly'}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Est. Users</div>
            <div className="text-sm font-semibold text-white">{(order.estimatedUsers || 0).toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Est. Amount</div>
            <div className="text-sm font-semibold text-emerald-400">${(order.totalAmount || 0).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Important Billing Note */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-amber-300">Invoice Billing</div>
            <div className="text-xs text-amber-200 mt-1">
              Final invoice is calculated by actual protected mailboxes connected in Perception Point, not estimated users.
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      {order.timeline && order.timeline.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide block mb-3">Timeline</label>
          <div className="space-y-3">
            {order.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-cdata-400 flex-shrink-0 border border-white/10" />
                  {idx < order.timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-gradient-to-b from-slate-500/50 to-transparent" />
                  )}
                </div>
                <div className="py-1">
                  <div className="text-xs font-semibold text-white">{event.label}</div>
                  {event.timestamp && (
                    <div className="text-[10px] text-slate-500">{new Date(event.timestamp).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approval Actions - only for pending orders */}
      {isPending && (
        <div className="space-y-3 pt-4 border-t border-white/5">
          {!showApprovalUI ? (
            <div className="flex gap-2">
              <button
                onClick={() => setShowApprovalUI(true)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 font-medium text-sm transition-all"
              >
                Approve Order
              </button>
              <button
                onClick={() => { setShowApprovalUI('reject') }}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 font-medium text-sm transition-all"
              >
                Reject Order
              </button>
            </div>
          ) : showApprovalUI === 'reject' ? (
            <div className="space-y-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <label className="block text-sm font-semibold text-white">Rejection Reason (required)</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this order is being rejected..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onReject?.(order.id, rejectionReason)
                    setShowApprovalUI(false)
                    setRejectionReason('')
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium text-sm transition-all"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => { setShowApprovalUI(false); setRejectionReason('') }}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <label className="block text-sm font-semibold text-white">Add Internal Note (optional)</label>
              <textarea
                placeholder="Add any notes about this approval..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onApprove?.(order.id)
                    setShowApprovalUI(false)
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition-all"
                >
                  Confirm Approval
                </button>
                <button
                  onClick={() => setShowApprovalUI(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  return (
    <ExpandableCard
      header={headerContent}
      expandedContent={expandedContent}
      onExpand={setIsExpanded}
      defaultExpanded={expandedByDefault}
      className="col-span-full"
    />
  )
}
