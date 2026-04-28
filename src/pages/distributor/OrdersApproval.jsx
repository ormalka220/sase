import React, { useEffect, useState } from 'react'
import {
  ShoppingCart, CheckCircle2, XCircle, Clock, Mail, ShieldCheck,
  AlertTriangle, Search, RotateCcw, FileText, Users, Info,
  Building2, Zap
} from 'lucide-react'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'
import { getCommonLabels } from '../../i18n/labels'

// ── Status config ─────────────────────────────────────────────────────────────

function getStatusConfig(labels) {
  return {
    DRAFT:                  { label: labels.statuses.DRAFT, color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
    PAYMENT_PENDING:        { label: labels.statuses.PAYMENT_PENDING, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    PENDING_APPROVAL:       { label: labels.statuses.PENDING_APPROVAL, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    PENDING_CDATA_APPROVAL: { label: labels.statuses.PENDING_CDATA_APPROVAL, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    APPROVED:               { label: labels.statuses.APPROVED, color: '#2C6A8A', bg: 'rgba(44,106,138,0.12)' },
    APPROVED_BY_CDATA:      { label: labels.statuses.APPROVED_BY_CDATA, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    PROVISIONING:           { label: labels.statuses.PROVISIONING, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    PROVISIONING_STARTED:   { label: labels.statuses.PROVISIONING_STARTED, color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
    PP_ORG_CREATED:         { label: labels.statuses.PP_ORG_CREATED, color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
    PP_ADMIN_INVITED:       { label: labels.statuses.PP_ADMIN_INVITED, color: '#0ea5e9', bg: 'rgba(14,165,233,0.12)' },
    READY_FOR_ONBOARDING:   { label: labels.statuses.READY_FOR_ONBOARDING, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    ACTIVE:                 { label: labels.statuses.ACTIVE, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    REJECTED:               { label: labels.statuses.REJECTED, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    REJECTED_BY_CDATA:      { label: labels.statuses.REJECTED_BY_CDATA, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    FAILED:                 { label: labels.statuses.FAILED, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    CANCELLED:              { label: labels.statuses.CANCELLED, color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  }
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.DRAFT
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      {cfg.label}
    </span>
  )
}

function fmt(dt, locale) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function fmtUsd(amount) {
  if (!amount && amount !== 0) return '—'
  return `$${Number(amount).toFixed(2)}`
}

// ── PP Order Detail Panel ─────────────────────────────────────────────────────

function PPOrderDetail({ order }) {
  const customer = order.customer || {}
  const items = order.items || []
  const productName = items[0]?.product?.name || 'Perception Point'

  return (
    <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Customer info */}
      <div className="space-y-2">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Customer</div>
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="text-xs text-white font-semibold">{customer.companyName || order.customerId}</span>
        </div>
        {customer.domain && (
          <div className="text-[10px] text-slate-500 ml-5">{customer.domain}</div>
        )}
        {customer.adminEmail && (
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="text-[10px] text-slate-400">{customer.adminEmail}</span>
          </div>
        )}
      </div>

      {/* PP Order specifics */}
      <div className="space-y-2">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Perception Point</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-slate-600 mb-0.5">Package</div>
            <div className="text-white font-semibold">{productName}</div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5">Billing Cycle</div>
            <div className="text-white font-semibold">{order.billingCycle || '—'}</div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5">Est. Mailboxes</div>
            <div className="text-white font-semibold">
              {order.estimatedUsers ? order.estimatedUsers.toLocaleString() : '—'}
            </div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5">Est. Monthly</div>
            <div className="text-emerald-400 font-semibold">{fmtUsd(order.totalAmount)}</div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5">Billing Method</div>
            <div className="text-indigo-300 font-semibold flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Invoice Only
            </div>
          </div>
          <div>
            <div className="text-slate-600 mb-0.5">Submitted</div>
            <div className="text-white font-semibold">{fmt(order.submittedAt, isHebrew ? 'he-IL' : 'en-US')}</div>
          </div>
        </div>
      </div>

      {/* Usage-based billing notice */}
      <div className="md:col-span-2 flex items-start gap-2 p-3 rounded-lg text-[10px] text-slate-500 leading-relaxed"
        style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
        <Info className="w-3 h-3 flex-shrink-0 mt-0.5 text-indigo-400" />
        <span>
          <span className="text-indigo-300 font-semibold">Usage-Based Billing: </span>
          Final invoice is calculated by actual protected mailboxes connected in Perception Point,
          not by the estimate above. No credit card payment required — invoice only.
        </span>
      </div>

      {order.notes && (
        <div className="md:col-span-2">
          <div className="text-[10px] text-slate-600 mb-1">Notes from integrator</div>
          <p className="text-xs text-slate-400">{order.notes}</p>
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

const PENDING_APPROVAL_STATUSES = ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL']

export default function OrdersApproval() {
  const { product, config } = useProduct()
  const { tr, isHebrew } = useLanguage()
  const labels = getCommonLabels(tr)
  const statusConfig = getStatusConfig(labels)
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [productFilter, setProductFilter] = useState(product === 'all' ? 'all' : product)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [error, setError] = useState('')

  async function loadOrders() {
    try {
      setError('')
      const res = await workspaceApi.getOrders({ limit: 100 })
      const list = res?.data || res || []
      const normalized = list.map(o => {
        const codes = o.items?.map(i => i.product?.code) || []
        const isPP = codes.includes('WORKSPACE_SECURITY') && !codes.includes('FORTISASE')
        return {
          ...o,
          orderNumber: o.id.slice(0, 8).toUpperCase(),
          productType: isPP ? 'perception' : codes.includes('FORTISASE') ? 'sase' : 'sase',
          isPPOrder: isPP,
        }
      })
      setOrders(normalized)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => { loadOrders() }, [])

  async function approveOrder(orderId) {
    try {
      await workspaceApi.approveOrder(orderId)
      await loadOrders()
    } catch (e) {
      setError(e.message)
    }
  }

  async function rejectOrder(orderId) {
    if (!rejectReason.trim()) return
    try {
      await workspaceApi.rejectOrder(orderId, rejectReason)
      await loadOrders()
      setRejectTarget(null)
      setRejectReason('')
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    setProductFilter(product === 'all' ? 'all' : product)
  }, [product])

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer?.companyName || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    const matchProduct = productFilter === 'all' || o.productType === productFilter
    return matchSearch && matchFilter && matchProduct
  })

  const pendingCount = orders.filter(o => PENDING_APPROVAL_STATUSES.includes(o.status)).length
  const ppPendingCount = orders.filter(o => o.status === 'PENDING_CDATA_APPROVAL').length
  const approvedCount = orders.filter(o => ['APPROVED', 'APPROVED_BY_CDATA', 'ACTIVE', 'READY_FOR_ONBOARDING'].includes(o.status)).length
  const rejectedCount = orders.filter(o => ['REJECTED_BY_CDATA', 'CANCELLED'].includes(o.status)).length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-5 h-5" style={{ color: config.navActiveColor }} />
            <h1 className="text-xl font-black text-white">
              {tr('אישור', 'Orders')} <span style={{ color: config.navActiveColor }}>{tr('הזמנות', 'Approval')}</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500">{tr('סקירה ואישור הזמנות Perception Point ו-SASE', 'Review and approve Perception Point and SASE orders')}</p>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">{pendingCount} {tr('הזמנות ממתינות לאישור', 'orders pending approval')}</span>
          </div>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending CData Approval', count: ppPendingCount,  color: '#f59e0b', status: 'PENDING_CDATA_APPROVAL' },
          { label: 'Pending (Legacy)',        count: orders.filter(o => o.status === 'PENDING_APPROVAL').length, color: '#f59e0b', status: 'PENDING_APPROVAL' },
          { label: 'Approved / Active',       count: approvedCount,  color: '#10b981', status: null },
          { label: 'Rejected / Cancelled',    count: rejectedCount,  color: '#ef4444', status: null },
        ].map(card => (
          <button key={card.label}
            onClick={() => card.status && setFilter(filter === card.status ? 'all' : card.status)}
            className={`glass rounded-xl p-4 text-left transition-all hover:scale-[1.02] ${filter === card.status ? 'scale-[1.02]' : 'opacity-80 hover:opacity-100'}`}
            style={{
              border: `1px solid ${card.color}${filter === card.status ? '40' : '18'}`,
              boxShadow: filter === card.status ? `0 0 14px ${card.color}20` : 'none',
            }}>
            <div className="text-2xl font-black mb-1" style={{ color: card.color }}>{card.count}</div>
            <div className="text-[10px] text-slate-500">{card.label}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-3 flex flex-wrap items-center gap-2" style={{ border: '1px solid rgba(44,106,138,0.12)' }}>
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={tr('חיפוש לפי מספר הזמנה או לקוח...', 'Search by order # or customer...')}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none" />
        </div>
        {product === 'all' && (
          <select value={productFilter} onChange={e => setProductFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none">
            <option value="all">{tr('כל המוצרים', 'All Products')}</option>
            <option value="sase">Forti SASE</option>
            <option value="perception">Perception Point</option>
          </select>
        )}
        <button onClick={() => { setSearch(''); setFilter('all'); setProductFilter(product === 'all' ? 'all' : product) }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 border border-white/10 hover:text-white hover:border-white/20 transition-colors">
          <RotateCcw className="w-3.5 h-3.5" />
          {tr('נקה', 'Clear')}
        </button>
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass rounded-xl py-16 text-center text-slate-600">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="text-sm">{tr('אין הזמנות תואמות', 'No matching orders')}</div>
          </div>
        )}

        {filtered.map(order => {
          const isPending = PENDING_APPROVAL_STATUSES.includes(order.status)
          const isPPOrder = order.isPPOrder
          const isExpanded = expandedOrderId === order.id
          const prodColor = isPPOrder ? '#059669' : '#2C6A8A'
          const ProdIcon = isPPOrder ? Mail : ShieldCheck

          return (
            <div key={order.id}
              className={`glass rounded-xl transition-all duration-200 ${isPending ? 'ring-1 ring-amber-400/20' : ''}`}
              style={{ border: `1px solid ${isPending ? 'rgba(245,158,11,0.25)' : 'rgba(44,106,138,0.12)'}` }}>

              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Order info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${prodColor}12`, border: `1px solid ${prodColor}25` }}>
                      <ProdIcon className="w-4 h-4" style={{ color: prodColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-white font-mono">{order.orderNumber}</span>
                        <StatusBadge status={order.status} />
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{ background: `${prodColor}12`, color: prodColor }}>
                          {isPPOrder ? 'Perception Point' : 'Forti SASE'}
                        </span>
                        {isPPOrder && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                            style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                            <FileText className="w-2.5 h-2.5 inline mr-0.5" />
                            Invoice
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-300 font-medium mb-1">
                        {order.customer?.companyName || order.customerId}
                      </div>

                      <div className="flex items-center gap-2 flex-wrap text-[10px] text-slate-500">
                        {isPPOrder && order.estimatedUsers && (
                          <>
                            <span className="flex items-center gap-0.5">
                              <Users className="w-3 h-3" />
                              {order.estimatedUsers.toLocaleString()} est. mailboxes
                            </span>
                            <span className="text-slate-700">·</span>
                          </>
                        )}
                        {order.billingCycle && (
                          <>
                            <span>{order.billingCycle}</span>
                            <span className="text-slate-700">·</span>
                          </>
                        )}
                        <span>Integrator: <span className="text-slate-400">{order.integrator?.organization?.name || order.integratorId}</span></span>
                        <span className="text-slate-700">·</span>
                        <span>{tr('נוצר', 'Created')}: {fmt(order.createdAt, isHebrew ? 'he-IL' : 'en-US')}</span>
                        {order.totalAmount != null && (
                          <>
                            <span className="text-slate-700">·</span>
                            <span className="text-emerald-400">{fmtUsd(order.totalAmount)} / mo (est.)</span>
                          </>
                        )}
                      </div>

                      {order.failureReason && (
                        <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1.5">
                          <XCircle className="w-3 h-3" />
                          {order.failureReason}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                    {isPPOrder && (
                      <button onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors text-slate-400 hover:text-white border border-white/10 hover:border-white/20">
                        {isExpanded ? tr('פחות', 'Less') : tr('פרטים', 'Details')}
                      </button>
                    )}

                    {isPending && (
                      <>
                        <button onClick={() => approveOrder(order.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                          style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {tr('אשר', 'Approve')}
                        </button>
                        <button onClick={() => setRejectTarget(order.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                          <XCircle className="w-3.5 h-3.5" />
                          {tr('דחה', 'Reject')}
                        </button>
                      </>
                    )}

                    {order.status === 'APPROVED' && !isPPOrder && (
                      <button
                        onClick={async () => { await workspaceApi.provisionOrder(order.id); await loadOrders() }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #2C6A8A, #1F5070)', boxShadow: '0 2px 8px rgba(44,106,138,0.3)' }}>
                        <Zap className="w-3.5 h-3.5" />
                        {tr('בצע הקמה', 'Provision')}
                      </button>
                    )}
                  </div>
                </div>

                {/* PP order detail expansion */}
                {isPPOrder && isExpanded && <PPOrderDetail order={order} />}
              </div>

              {/* Rejection input */}
              {rejectTarget === order.id && (
                <div className="px-5 pb-4 border-t border-white/5 pt-3">
                  <div className="text-xs font-semibold text-slate-300 mb-2">{tr('סיבת דחייה *', 'Rejection Reason *')}</div>
                  <div className="flex gap-2">
                    <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                      placeholder={tr('הסבר את סיבת הדחייה...', 'Explain the reason for rejection...')}
                      className="flex-1 bg-white/[0.03] border border-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50" />
                    <button onClick={() => rejectOrder(order.id)} disabled={!rejectReason.trim()}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-colors"
                      style={{ background: 'rgba(239,68,68,0.8)' }}>
                      {tr('אשר דחייה', 'Confirm Reject')}
                    </button>
                    <button onClick={() => { setRejectTarget(null); setRejectReason('') }}
                      className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white border border-white/10">
                      {tr('בטל', 'Cancel')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
