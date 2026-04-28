import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Circle, Globe, AlertTriangle,
  ExternalLink, ChevronRight, Mail, Phone, Calendar,
  ShoppingCart, Clock, Send, PackageCheck, Zap, ShieldCheck
} from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'

// ── Order lifecycle for PP ─────────────────────────────────────────────────────

const PP_STATUS_CONFIG = {
  PENDING_CDATA_APPROVAL: { label: 'Waiting for CData Approval',  color: '#f59e0b', icon: Clock },
  APPROVED_BY_CDATA:      { label: 'Approved by CData',           color: '#6366f1', icon: CheckCircle },
  PROVISIONING_STARTED:   { label: 'Provisioning Started',        color: '#6366f1', icon: Zap },
  PP_ORG_CREATED:         { label: 'PP Organization Created',     color: '#0ea5e9', icon: PackageCheck },
  PP_ADMIN_INVITED:       { label: 'Admin Invitation Sent',       color: '#0ea5e9', icon: Send },
  READY_FOR_ONBOARDING:   { label: 'Ready for Onboarding',        color: '#10b981', icon: CheckCircle },
  ACTIVE:                 { label: 'Active',                      color: '#10b981', icon: CheckCircle },
  FAILED:                 { label: 'Failed',                      color: '#ef4444', icon: AlertTriangle },
  REJECTED_BY_CDATA:      { label: 'Rejected by CData',           color: '#ef4444', icon: AlertTriangle },
  CANCELLED:              { label: 'Cancelled',                   color: '#6b7280', icon: Circle },
  // legacy statuses
  PENDING_APPROVAL:       { label: 'Pending Approval',            color: '#f59e0b', icon: Clock },
  APPROVED:               { label: 'Approved',                    color: '#6366f1', icon: CheckCircle },
  PROVISIONING:           { label: 'Provisioning',                color: '#6366f1', icon: Zap },
}

const PP_LIFECYCLE = [
  'PENDING_CDATA_APPROVAL',
  'APPROVED_BY_CDATA',
  'PROVISIONING_STARTED',
  'PP_ORG_CREATED',
  'PP_ADMIN_INVITED',
  'READY_FOR_ONBOARDING',
  'ACTIVE',
]

function PPOrderTimeline({ order }) {
  if (!order) return null
  const cfg = PP_STATUS_CONFIG[order.status] || { label: order.status, color: '#6b7280', icon: Circle }
  const currentIdx = PP_LIFECYCLE.indexOf(order.status)
  const isFailed = ['FAILED', 'REJECTED_BY_CDATA', 'CANCELLED'].includes(order.status)

  return (
    <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-white">PP Order Status</div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: cfg.color }} />
          {cfg.label}
        </span>
      </div>

      {/* Lifecycle steps */}
      <div className="space-y-0">
        {PP_LIFECYCLE.map((statusKey, i) => {
          const stepCfg = PP_STATUS_CONFIG[statusKey]
          const StepIcon = stepCfg.icon
          const isCompleted = currentIdx > i
          const isCurrent = currentIdx === i && !isFailed
          const isUpcoming = currentIdx < i

          return (
            <div key={statusKey} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted ? 'bg-emerald-500/20' :
                  isCurrent ? 'bg-indigo-500/20' :
                  'bg-white/[0.04]'
                }`}>
                  <StepIcon className="w-3.5 h-3.5" style={{
                    color: isCompleted ? '#10b981' : isCurrent ? stepCfg.color : '#374151'
                  }} />
                </div>
                {i < PP_LIFECYCLE.length - 1 && (
                  <div className={`w-px my-1 ${isCompleted ? 'bg-emerald-500/30' : 'bg-white/[0.06]'}`}
                    style={{ height: 20 }} />
                )}
              </div>
              <div className="pb-2">
                <div className={`text-xs font-medium ${
                  isCompleted ? 'text-emerald-400' :
                  isCurrent ? 'text-white' :
                  'text-slate-600'
                }`}>
                  {stepCfg.label}
                </div>
                {isCurrent && !isFailed && (
                  <div className="text-[10px] mt-0.5" style={{ color: stepCfg.color }}>Current step</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {isFailed && (
        <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div className="text-xs font-semibold text-red-400 mb-0.5">{cfg.label}</div>
          {order.failureReason && <p className="text-[10px] text-red-400/80">{order.failureReason}</p>}
        </div>
      )}

      {/* Order details */}
      <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-2 text-xs">
        {order.estimatedUsers && (
          <div>
            <div className="text-slate-600 mb-0.5">Estimated Mailboxes</div>
            <div className="text-white font-semibold">{order.estimatedUsers.toLocaleString()}</div>
          </div>
        )}
        {order.billingCycle && (
          <div>
            <div className="text-slate-600 mb-0.5">Billing Cycle</div>
            <div className="text-white font-semibold">{order.billingCycle}</div>
          </div>
        )}
        <div>
          <div className="text-slate-600 mb-0.5">Billing Method</div>
          <div className="text-indigo-300 font-semibold">Invoice Only</div>
        </div>
        <div>
          <div className="text-slate-600 mb-0.5">Submitted</div>
          <div className="text-white font-semibold">
            {order.submittedAt ? new Date(order.submittedAt).toLocaleDateString() : '—'}
          </div>
        </div>
      </div>

      {order.status === 'READY_FOR_ONBOARDING' || order.status === 'ACTIVE' ? (
        <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="font-semibold text-emerald-400 mb-1">Onboarding Instructions Available</div>
          <p className="text-slate-500">
            The Perception Point organization is ready. Ask the customer to accept their admin invitation
            and connect their email service (Microsoft 365 or Gmail) in the PP portal.
          </p>
        </div>
      ) : null}
    </div>
  )
}

// ── Status helpers ─────────────────────────────────────────────────────────────

const statusBadge = (status) => {
  const map = { ACTIVE: 'badge-green', ONBOARDING: 'badge-amber', SUSPENDED: 'badge-red' }
  return map[status?.toUpperCase()] || 'badge-steel'
}
const statusLabel = (status) => {
  const map = { ACTIVE: 'Active', ONBOARDING: 'Onboarding', SUSPENDED: 'Suspended' }
  return map[status?.toUpperCase()] || (status || '')
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CustomerProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [customer, setCustomer] = useState(null)
  const [ppOrder, setPPOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError('')

        // Load customer details
        const cust = await workspaceApi.getCustomer(id)
        setCustomer(cust)

        // Load PP orders for this customer
        const ordersRes = await workspaceApi.getOrders({ customerId: id, productCode: 'WORKSPACE_SECURITY' })
        const orderList = ordersRes?.data || ordersRes || []
        if (orderList.length > 0) {
          // Show the most recent PP order
          const sorted = [...orderList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          setPPOrder(sorted[0])
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div className="text-sm text-slate-400 p-6">Loading customer profile...</div>

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-slate-400 text-lg font-semibold">Not Found</div>
          <p className="text-slate-600 text-sm">The requested customer does not exist.</p>
          <button className="btn-ghost flex items-center gap-2" onClick={() => navigate('/integrator/customers')}>
            <ArrowLeft className="w-4 h-4" />
            Back to Customers
          </button>
        </div>
      </div>
    )
  }

  const infoRows = [
    { icon: Globe, label: 'Domain', value: customer.domain },
    { icon: Mail, label: 'Admin Email', value: customer.adminEmail },
    { icon: Phone, label: 'Phone', value: customer.adminPhone },
    { icon: Calendar, label: 'Created', value: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—' },
  ]

  const hasPPOrder = !!ppOrder
  const ppActive = ppOrder && ['READY_FOR_ONBOARDING', 'ACTIVE'].includes(ppOrder.status)
  const ppPending = ppOrder && ['PENDING_CDATA_APPROVAL', 'APPROVED_BY_CDATA', 'PROVISIONING_STARTED', 'PP_ORG_CREATED', 'PP_ADMIN_INVITED'].includes(ppOrder.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/integrator/customers')}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{customer.companyName}</h1>
              <span className={statusBadge(customer.status)}>{statusLabel(customer.status)}</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{customer.domain}</p>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!hasPPOrder && (
            <button
              onClick={() => navigate(`/integrator/orders/new?customerId=${id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
              <ShoppingCart className="w-3.5 h-3.5" />
              Create PP Order
            </button>
          )}
          {ppPending && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
              <Clock className="w-3.5 h-3.5" />
              PP Order Pending Approval
            </div>
          )}
          <button className="btn-primary flex items-center gap-2 text-xs"
            onClick={() => navigate('/customer/overview')}>
            <ExternalLink className="w-3.5 h-3.5" />
            Open Customer Portal
          </button>
        </div>
      </div>

      {/* Products overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          {
            label: 'Perception Point',
            value: ppActive ? 'Active' : hasPPOrder ? 'In Progress' : 'Not Ordered',
            icon: Mail,
            color: ppActive ? '#10b981' : hasPPOrder ? '#6366f1' : '#374151',
            bg: ppActive ? 'bg-emerald-600/15' : hasPPOrder ? 'bg-indigo-600/15' : 'bg-white/5',
          },
          {
            label: 'FortiSASE',
            value: customer.products?.some(p => p.product?.code === 'FORTISASE' && p.status === 'ACTIVE') ? 'Active' : 'Not Ordered',
            icon: ShieldCheck,
            color: '#2C6A8A',
            bg: 'bg-cdata-500/10',
          },
          {
            label: 'Integrator',
            value: customer.integrator?.organization?.name || '—',
            icon: Globe,
            color: '#64748b',
            bg: 'bg-white/5',
          },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className="w-4 h-4" style={{ color: k.color }} />
            </div>
            <div className="text-sm font-bold text-white">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer info */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-4">Customer Details</div>
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
                <div className="text-xs text-slate-500 mb-1">Notes</div>
                <p className="text-xs text-slate-400 leading-relaxed">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* PP order timeline OR order CTA */}
        {hasPPOrder ? (
          <PPOrderTimeline order={ppOrder} />
        ) : (
          <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-4 text-center"
            style={{ border: '1px solid rgba(5,150,105,0.15)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-1">No PP Order Yet</div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                Create a Perception Point order to provision email security for this customer.
              </p>
            </div>
            <button
              onClick={() => navigate(`/integrator/orders/new?customerId=${id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
              <ShoppingCart className="w-3.5 h-3.5" />
              Create PP Order
            </button>
          </div>
        )}
      </div>

      {/* Onboarding instructions panel — shown once provisioned */}
      {(ppOrder?.status === 'READY_FOR_ONBOARDING' || ppOrder?.status === 'ACTIVE') && (
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(16,185,129,0.18)' }}>
          <div className="text-sm font-semibold text-white mb-4">Onboarding Checklist</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Microsoft 365 */}
            <div className="p-4 rounded-xl space-y-2"
              style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
              <div className="text-xs font-semibold text-sky-400">Microsoft 365 Connection</div>
              <ol className="space-y-1.5 text-[10px] text-slate-400">
                <li className="flex gap-2"><span className="font-bold text-sky-400">1.</span> Accept the Perception Point admin email invitation.</li>
                <li className="flex gap-2"><span className="font-bold text-sky-400">2.</span> Log in to the PP portal and go to Settings → Integrations → Microsoft 365.</li>
                <li className="flex gap-2"><span className="font-bold text-sky-400">3.</span> Grant consent with a Microsoft Global Admin account.</li>
                <li className="flex gap-2"><span className="font-bold text-sky-400">4.</span> Update MX record to route mail through PP.</li>
                <li className="flex gap-2"><span className="font-bold text-sky-400">5.</span> Verify protection is active in the threat dashboard.</li>
              </ol>
            </div>
            {/* Gmail */}
            <div className="p-4 rounded-xl space-y-2"
              style={{ background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.15)' }}>
              <div className="text-xs font-semibold text-yellow-400">Google Workspace Connection</div>
              <ol className="space-y-1.5 text-[10px] text-slate-400">
                <li className="flex gap-2"><span className="font-bold text-yellow-400">1.</span> Accept the Perception Point admin email invitation.</li>
                <li className="flex gap-2"><span className="font-bold text-yellow-400">2.</span> Log in to the PP portal and go to Settings → Integrations → Google Workspace.</li>
                <li className="flex gap-2"><span className="font-bold text-yellow-400">3.</span> Authorize with a Google Workspace Super Admin.</li>
                <li className="flex gap-2"><span className="font-bold text-yellow-400">4.</span> Configure inbound gateway in Google Admin Console.</li>
                <li className="flex gap-2"><span className="font-bold text-yellow-400">5.</span> Verify protection is active in the threat dashboard.</li>
              </ol>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-slate-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Final invoice will be calculated by actual protected mailboxes connected in Perception Point.
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="text-sm font-semibold text-white">Orders</div>
          <button className="text-xs text-cdata-300 hover:text-cdata-300/80 transition-colors flex items-center gap-1"
            onClick={() => navigate('/integrator/orders')}>
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {!ppOrder ? (
          <div className="px-5 py-8 text-center text-slate-600 text-xs">No orders yet</div>
        ) : (
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-white">Perception Point — {ppOrder.items?.[0]?.product?.name || 'Email Security'}</div>
                <div className="text-[10px] text-slate-500">
                  {ppOrder.estimatedUsers?.toLocaleString() || '?'} est. mailboxes · {ppOrder.billingCycle || 'MONTHLY'} · Invoice
                </div>
              </div>
            </div>
            <div className="text-right">
              {(() => {
                const cfg = PP_STATUS_CONFIG[ppOrder.status] || { label: ppOrder.status, color: '#6b7280' }
                return (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    {cfg.label}
                  </span>
                )
              })()}
              <div className="text-[10px] text-slate-600 mt-1">
                {ppOrder.createdAt ? new Date(ppOrder.createdAt).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
