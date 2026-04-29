import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Circle, Globe, AlertTriangle,
  ExternalLink, ChevronRight, Mail, Phone, Calendar,
  ShoppingCart, Clock, Send, PackageCheck, Zap, ShieldCheck, Trash2
} from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'
import { getCommonLabels } from '../../i18n/labels'

// ── Order lifecycle for PP ─────────────────────────────────────────────────────

function getPpStatusConfig(labels, tr) {
  return {
    PENDING_CDATA_APPROVAL: { label: labels.statuses.PENDING_CDATA_APPROVAL, color: '#f59e0b', icon: Clock },
    APPROVED_BY_CDATA:      { label: labels.statuses.APPROVED_BY_CDATA, color: '#6366f1', icon: CheckCircle },
    PROVISIONING_STARTED:   { label: labels.statuses.PROVISIONING_STARTED, color: '#6366f1', icon: Zap },
    PP_ORG_CREATED:         { label: labels.statuses.PP_ORG_CREATED, color: '#0ea5e9', icon: PackageCheck },
    PP_ADMIN_INVITED:       { label: labels.statuses.PP_ADMIN_INVITED, color: '#0ea5e9', icon: Send },
    PENDING_SPOTNET_ASSIGNMENT: { label: tr('ממתין להקצאת חבילה ע״י CData', 'Pending CData Bundle Assignment'), color: '#8b5cf6', icon: Clock },
    READY_FOR_ONBOARDING:   { label: labels.statuses.READY_FOR_ONBOARDING, color: '#10b981', icon: CheckCircle },
    ACTIVE:                 { label: labels.statuses.ACTIVE, color: '#10b981', icon: CheckCircle },
    FAILED:                 { label: labels.statuses.FAILED, color: '#ef4444', icon: AlertTriangle },
    REJECTED_BY_CDATA:      { label: labels.statuses.REJECTED_BY_CDATA, color: '#ef4444', icon: AlertTriangle },
    CANCELLED:              { label: labels.statuses.CANCELLED, color: '#6b7280', icon: Circle },
    PENDING_APPROVAL:       { label: labels.statuses.PENDING_APPROVAL, color: '#f59e0b', icon: Clock },
    APPROVED:               { label: labels.statuses.APPROVED, color: '#6366f1', icon: CheckCircle },
    PROVISIONING:           { label: labels.statuses.PROVISIONING, color: '#6366f1', icon: Zap },
  }
}

const PP_LIFECYCLE = [
  'PENDING_CDATA_APPROVAL',
  'APPROVED_BY_CDATA',
  'PROVISIONING_STARTED',
  'PP_ORG_CREATED',
  'PP_ADMIN_INVITED',
  'PENDING_SPOTNET_ASSIGNMENT',
  'READY_FOR_ONBOARDING',
  'ACTIVE',
]

function PPOrderTimeline({ order, ppStatusConfig, tr }) {
  if (!order) return null
  const cfg = ppStatusConfig[order.status] || { label: order.status, color: '#6b7280', icon: Circle }
  const currentIdx = PP_LIFECYCLE.indexOf(order.status)
  const isFailed = ['FAILED', 'REJECTED_BY_CDATA', 'CANCELLED'].includes(order.status)

  return (
    <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-white">{tr('סטטוס הזמנת PP', 'PP Order Status')}</div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ background: `${cfg.color}18`, border: `1px solid ${cfg.color}30`, color: cfg.color }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: cfg.color }} />
          {cfg.label}
        </span>
      </div>

      {/* Lifecycle steps */}
      <div className="space-y-0">
        {PP_LIFECYCLE.map((statusKey, i) => {
          const stepCfg = ppStatusConfig[statusKey]
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
                  <div className="text-[10px] mt-0.5" style={{ color: stepCfg.color }}>{tr('שלב נוכחי', 'Current step')}</div>
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
            <div className="text-slate-600 mb-0.5">{tr('תיבות מייל משוערות', 'Estimated Mailboxes')}</div>
            <div className="text-white font-semibold">{order.estimatedUsers.toLocaleString()}</div>
          </div>
        )}
        {order.billingCycle && (
          <div>
            <div className="text-slate-600 mb-0.5">{tr('מחזור חיוב', 'Billing Cycle')}</div>
            <div className="text-white font-semibold">{order.billingCycle}</div>
          </div>
        )}
        <div>
          <div className="text-slate-600 mb-0.5">{tr('שיטת חיוב', 'Billing Method')}</div>
          <div className="text-indigo-300 font-semibold">{tr('חשבונית בלבד', 'Invoice Only')}</div>
        </div>
        <div>
          <div className="text-slate-600 mb-0.5">{tr('נשלח בתאריך', 'Submitted')}</div>
          <div className="text-white font-semibold">
            {order.submittedAt ? new Date(order.submittedAt).toLocaleDateString() : '—'}
          </div>
        </div>
      </div>

      {order.status === 'READY_FOR_ONBOARDING' || order.status === 'ACTIVE' ? (
        <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="font-semibold text-emerald-400 mb-1">{tr('הוראות קליטה זמינות', 'Onboarding Instructions Available')}</div>
          <p className="text-slate-500">
            {tr('ארגון Perception Point מוכן. בקשו מהלקוח לאשר את הזמנת האדמין ולחבר את שירות הדוא"ל שלו (Microsoft 365 או Gmail) בפורטל PP.', 'The Perception Point organization is ready. Ask the customer to accept their admin invitation and connect their email service (Microsoft 365 or Gmail) in the PP portal.')}
          </p>
        </div>
      ) : null}
      {order.status === 'PENDING_SPOTNET_ASSIGNMENT' && (
        <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <div className="font-semibold text-violet-300 mb-1">{tr('נדרשת הקצאת חבילה', 'Bundle assignment required')}</div>
          <p className="text-slate-500">
            {tr('יש להמתין להקצאת החבילה ע״י CData לפני שניתן להתחיל חיבור Microsoft 365/Gmail.', 'Wait for CData bundle assignment before Microsoft 365/Gmail onboarding can start.')}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Status helpers ─────────────────────────────────────────────────────────────

const statusBadge = (status) => {
  const map = { ACTIVE: 'badge-green', ONBOARDING: 'badge-amber', SUSPENDED: 'badge-red' }
  return map[status?.toUpperCase()] || 'badge-steel'
}
const statusLabel = (status) => {
  return status || ''
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function CustomerProfile() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { tr } = useLanguage()
  const labels = getCommonLabels(tr)
  const ppStatusConfig = getPpStatusConfig(labels, tr)
  const [customer, setCustomer] = useState(null)
  const [ppOrder, setPPOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

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

  if (loading) return <div className="text-sm text-slate-400 p-6">{tr('טוען פרופיל לקוח...', 'Loading customer profile...')}</div>

  if (!customer) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-slate-400 text-lg font-semibold">{tr('לא נמצא', 'Not Found')}</div>
          <p className="text-slate-600 text-sm">{tr('הלקוח המבוקש אינו קיים.', 'The requested customer does not exist.')}</p>
          <button className="btn-ghost flex items-center gap-2" onClick={() => navigate('/integrator/customers')}>
            <ArrowLeft className="w-4 h-4" />
            {tr('חזרה ללקוחות', 'Back to Customers')}
          </button>
        </div>
      </div>
    )
  }

  const infoRows = [
    { icon: Globe, label: tr('דומיין', 'Domain'), value: customer.domain },
    { icon: Mail, label: tr('מייל אדמין', 'Admin Email'), value: customer.adminEmail },
    { icon: Phone, label: tr('טלפון', 'Phone'), value: customer.adminPhone },
    { icon: Calendar, label: tr('נוצר בתאריך', 'Created'), value: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—' },
  ]

  const hasPPOrder = !!ppOrder
  const ppActive = ppOrder && ['READY_FOR_ONBOARDING', 'ACTIVE'].includes(ppOrder.status)
  const ppPending = ppOrder && ['PENDING_CDATA_APPROVAL', 'APPROVED_BY_CDATA', 'PROVISIONING_STARTED', 'PP_ORG_CREATED', 'PP_ADMIN_INVITED'].includes(ppOrder.status)

  async function handleDeleteCustomer() {
    const ok = window.confirm(
      tr(
        `למחוק את הלקוח ${customer.companyName}? הפעולה אינה הפיכה.`,
        `Delete customer ${customer.companyName}? This action cannot be undone.`
      )
    )
    if (!ok) return

    try {
      setDeleting(true)
      setError('')
      await workspaceApi.deleteCustomer(id)
      navigate('/integrator/customers')
    } catch (e) {
      const msg = String(e?.message || '')
      if (msg.includes('existing orders')) {
        setError(tr('לא ניתן למחוק לקוח שיש לו הזמנות קיימות. אפשר להשעות אותו במקום זאת.', 'Cannot delete customer with existing orders. Suspend it instead.'))
      } else {
        setError(e.message || tr('נכשל במחיקת הלקוח', 'Failed to delete customer'))
      }
    } finally {
      setDeleting(false)
    }
  }

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
              <span className={statusBadge(customer.status)}>{labels.statuses[customer.status] || statusLabel(customer.status)}</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{customer.domain}</p>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDeleteCustomer}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-60"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {deleting ? tr('מוחק...', 'Deleting...') : tr('מחק לקוח', 'Delete Customer')}
          </button>
          {!hasPPOrder && (
            <button
              onClick={() => navigate(`/integrator/orders/new?customerId=${id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
              <ShoppingCart className="w-3.5 h-3.5" />
              {tr('צור הזמנת PP', 'Create PP Order')}
            </button>
          )}
          {ppPending && (
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}>
              <Clock className="w-3.5 h-3.5" />
              {labels.statuses.PENDING_CDATA_APPROVAL}
            </div>
          )}
          <button className="btn-primary flex items-center gap-2 text-xs"
            onClick={() => navigate('/customer/overview')}>
            <ExternalLink className="w-3.5 h-3.5" />
            {tr('פתח פורטל לקוח', 'Open Customer Portal')}
          </button>
        </div>
      </div>

      {/* Products overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          {
            label: 'Perception Point',
            value: ppActive ? labels.statuses.ACTIVE : hasPPOrder ? tr('בתהליך', 'In Progress') : tr('לא הוזמן', 'Not Ordered'),
            icon: Mail,
            color: ppActive ? '#10b981' : hasPPOrder ? '#6366f1' : '#374151',
            bg: ppActive ? 'bg-emerald-600/15' : hasPPOrder ? 'bg-indigo-600/15' : 'bg-white/5',
          },
          {
            label: 'FortiSASE',
            value: customer.products?.some(p => p.product?.code === 'FORTISASE' && p.status === 'ACTIVE') ? labels.statuses.ACTIVE : tr('לא הוזמן', 'Not Ordered'),
            icon: ShieldCheck,
            color: '#2C6A8A',
            bg: 'bg-cdata-500/10',
          },
          {
            label: tr('אינטגרטור', 'Integrator'),
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
          <div className="text-sm font-semibold text-white mb-4">{tr('פרטי לקוח', 'Customer Details')}</div>
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
                <div className="text-xs text-slate-500 mb-1">{tr('הערות', 'Notes')}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* PP order timeline OR order CTA */}
        {hasPPOrder ? (
          <PPOrderTimeline order={ppOrder} ppStatusConfig={ppStatusConfig} tr={tr} />
        ) : (
          <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center gap-4 text-center"
            style={{ border: '1px solid rgba(5,150,105,0.15)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)' }}>
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-1">{tr('עדיין אין הזמנת PP', 'No PP Order Yet')}</div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                {tr('צרו הזמנת Perception Point כדי להקים אבטחת מייל עבור הלקוח הזה.', 'Create a Perception Point order to provision email security for this customer.')}
              </p>
            </div>
            <button
              onClick={() => navigate(`/integrator/orders/new?customerId=${id}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 12px rgba(5,150,105,0.3)' }}>
              <ShoppingCart className="w-3.5 h-3.5" />
              {tr('צור הזמנת PP', 'Create PP Order')}
            </button>
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="text-sm font-semibold text-white">{tr('הזמנות', 'Orders')}</div>
          <button className="text-xs text-cdata-300 hover:text-cdata-300/80 transition-colors flex items-center gap-1"
            onClick={() => navigate('/integrator/orders')}>
            {tr('הצג הכל', 'View All')} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        {!ppOrder ? (
          <div className="px-5 py-8 text-center text-slate-600 text-xs">{tr('אין הזמנות עדיין', 'No orders yet')}</div>
        ) : (
          <div className="px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-white">Perception Point — {ppOrder.items?.[0]?.product?.name || tr('אבטחת מייל', 'Email Security')}</div>
                <div className="text-[10px] text-slate-500">
                  {ppOrder.estimatedUsers?.toLocaleString() || '?'} {tr('תיבות משוערות', 'est. mailboxes')} · {ppOrder.billingCycle || 'MONTHLY'} · {tr('חשבונית', 'Invoice')}
                </div>
              </div>
            </div>
            <div className="text-right">
              {(() => {
                const cfg = ppStatusConfig[ppOrder.status] || { label: ppOrder.status, color: '#6b7280' }
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
