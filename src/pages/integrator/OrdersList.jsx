import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, PlusCircle, Clock, CheckCircle2, XCircle,
  PackageCheck, FileText, Search, ShieldCheck, Mail
} from 'lucide-react'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

const INTEGRATOR_ID = 'i1'

const STATUS_ALIASES = {
  SUBMITTED: 'PENDING_DISTRIBUTOR_APPROVAL',
  PENDING_APPROVAL: 'PENDING_DISTRIBUTOR_APPROVAL',
  PENDING_CDATA_APPROVAL: 'PENDING_DISTRIBUTOR_APPROVAL',
  PAID: 'APPROVED',
  APPROVED_BY_CDATA: 'APPROVED',
  PROVISIONING_STARTED: 'PROVISIONING',
  PP_ORG_CREATED: 'PROVISIONED',
  PP_ADMIN_INVITED: 'ONBOARDING_PENDING',
  PENDING_SPOTNET_ASSIGNMENT: 'ONBOARDING_PENDING',
  READY_FOR_ONBOARDING: 'INTEGRATION_IN_PROGRESS',
  CANCELLED: 'REJECTED',
}

function getStatusConfig(tr) {
  return {
    DRAFT: { label: tr('טיוטה', 'Draft'), color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: FileText },
    PAYMENT_PENDING: { label: tr('ממתין לתשלום', 'Payment Pending'), color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: Clock },
    PENDING_DISTRIBUTOR_APPROVAL: { label: tr('ממתין לאישור מפיץ', 'Awaiting Distributor Approval'), color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: Clock },
    APPROVED: { label: tr('אושר', 'Approved'), color: '#2C6A8A', bg: 'rgba(44,106,138,0.12)', icon: CheckCircle2 },
    PROVISIONING: { label: tr('בפרוביז׳נינג', 'Provisioning'), color: '#6366f1', bg: 'rgba(99,102,241,0.12)', icon: PackageCheck },
    PROVISIONED: { label: tr('הוקם', 'Provisioned'), color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: PackageCheck },
    ONBOARDING_PENDING: { label: tr('ממתין לאונבורדינג', 'Onboarding Pending'), color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', icon: Clock },
    INTEGRATION_IN_PROGRESS: { label: tr('אינטגרציה בתהליך', 'Integration in Progress'), color: '#06b6d4', bg: 'rgba(6,182,212,0.12)', icon: Clock },
    ACTIVE: { label: tr('פעיל', 'Active'), color: '#10B981', bg: 'rgba(16,185,129,0.12)', icon: CheckCircle2 },
    REJECTED: { label: tr('נדחה', 'Rejected'), color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: XCircle },
    FAILED: { label: tr('נכשל', 'Failed'), color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: XCircle },
  }
}

function getProductConfig() {
  return {
    FORTISASE: { label: 'FortiSASE', color: '#2C6A8A', icon: ShieldCheck },
    WORKSPACE_SECURITY: { label: 'Perception Point', color: '#059669', icon: Mail },
    UNKNOWN: { label: '—', color: '#64748b', icon: Mail },
  }
}

function StatusBadge({ status, statusConfig }) {
  const cfg = statusConfig[status] || statusConfig.DRAFT
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function ProductBadge({ product, productConfig }) {
  const cfg = productConfig[product] || productConfig.UNKNOWN
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
      style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function fmt(dt, locale) {
  return new Date(dt).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function normalizeOrderStatus(order) {
  const raw = String(order?.status || '').trim().toUpperCase() || 'DRAFT'

  // Backward-compat for older records where status stayed DRAFT despite transitions.
  if (raw === 'DRAFT') {
    if (order?.approvedAt || order?.approvalStatus === 'APPROVED' || order?.paymentStatus === 'PAID') {
      return 'APPROVED'
    }
    if (order?.paymentStatus === 'PENDING') {
      return 'PAYMENT_PENDING'
    }
    if (order?.submittedAt || order?.approvalStatus === 'PENDING') {
      return 'PENDING_DISTRIBUTOR_APPROVAL'
    }
  }

  return STATUS_ALIASES[raw] || raw
}

export default function OrdersList() {
  const navigate = useNavigate()
  const { product } = useProduct()
  const { tr, isHebrew } = useLanguage()
  const statusConfig = getStatusConfig(tr)
  const productConfig = getProductConfig()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    async function loadOrders() {
      try {
        setError('')
        setLoading(true)
        const apiOrders = await workspaceApi.getOrders({ integratorId: INTEGRATOR_ID, role: 'integrator' })
        setOrders(Array.isArray(apiOrders) ? apiOrders : (apiOrders?.data || []))
      } catch (loadError) {
        setError(loadError.message)
      } finally {
        setLoading(false)
      }
    }
    loadOrders()
  }, [])

  function getOrderProductCodes(order) {
    return (order.items || []).map((item) => item?.product?.code).filter(Boolean)
  }

  function getOrderSeats(order) {
    return (order.items || []).reduce((sum, item) => sum + (item?.seats || 0), 0)
  }

  const productOrders = useMemo(() => {
    if (product === 'all') return orders
    const mapped = product === 'sase' ? 'FORTISASE' : 'WORKSPACE_SECURITY'
    return orders.filter((o) => getOrderProductCodes(o).includes(mapped))
  }, [orders, product])

  const filtered = productOrders.filter(o => {
    const normalizedStatus = normalizeOrderStatus(o)
    const matchSearch = !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerId.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || normalizedStatus === statusFilter
    return matchSearch && matchStatus
  })

  const statusCounts = Object.keys(statusConfig).reduce((acc, k) => {
    acc[k] = productOrders.filter((o) => normalizeOrderStatus(o) === k).length
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-5 h-5 text-cdata-300" />
            <h1 className="text-xl font-black text-white">{tr('הזמנות', 'Orders')} <span className="text-cdata-300">{tr('רישויים', 'Licensing')}</span></h1>
          </div>
          <p className="text-xs text-slate-500">{tr('הזמנות רישוי של האינטגרטור', 'Integrator licensing orders')}</p>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
        <button
          onClick={() => navigate('/integrator/orders/new')}
          className="btn-primary flex items-center gap-2 text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          {tr('הזמנה חדשה +', 'New Order +')}
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const Icon = cfg.icon
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
              className={`glass rounded-xl p-3.5 text-center transition-all duration-200 hover:scale-[1.02] ${statusFilter === key ? '' : 'opacity-70 hover:opacity-100'}`}
              style={{
                border: `1px solid ${cfg.color}${statusFilter === key ? '40' : '18'}`,
                boxShadow: statusFilter === key ? `0 0 16px ${cfg.color}20` : 'none'
              }}
            >
              <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color: cfg.color }} />
              <div className="text-lg font-black" style={{ color: cfg.color }}>{statusCounts[key] || 0}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tr('חיפוש לפי מספר הזמנה / לקוח...', 'Search by order number / customer...')}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cdata-500/40"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-xl overflow-hidden" style={{ border: '1px solid rgba(44,106,138,0.12)' }}>
        <div className="px-5 py-3.5 border-b border-white/5">
          <span className="text-sm font-bold text-white">
            {tr('הזמנות', 'Orders')} <span className="text-cdata-400 font-normal text-xs mr-2">{filtered.length} {tr('נמצאו', 'found')}</span>
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">{tr('טוען הזמנות...', 'Loading orders...')}</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-600">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="text-sm">{tr('אין הזמנות תואמות', 'No matching orders')}</div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(order => (
              <div
                key={order.id}
                className="px-5 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                onClick={() => navigate(`/integrator/orders/${order.id}`)}
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{order.id.slice(0, 8).toUpperCase()}</span>
                        <StatusBadge status={normalizeOrderStatus(order)} statusConfig={statusConfig} />
                        <ProductBadge product={getOrderProductCodes(order)[0]} productConfig={productConfig} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{order.customerId}</span>
                        <span className="text-[10px] text-slate-600">
                          {getOrderSeats(order).toLocaleString()} {tr('רישיונות', 'licenses')}
                        </span>
                        <span className="text-[10px] text-slate-600">{order.billingType === 'MONTHLY_INVOICE' ? tr('חשבונית חודשית', 'Monthly invoice') : tr('כרטיס אשראי', 'Credit card')}</span>
                      </div>
                      {(order.failureReason || order.rejectionReason) && (
                        <div className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {order.failureReason || order.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-600 mb-0.5">{tr('נוצר', 'Created')}</div>
                    <div className="text-xs text-slate-400">{fmt(order.createdAt, isHebrew ? 'he-IL' : 'en-US')}</div>
                    {order.approvedAt && (
                      <div className="text-[10px] text-slate-600 mt-1">{tr('אושר', 'Approved')}: <span className="text-slate-400">{fmt(order.approvedAt, isHebrew ? 'he-IL' : 'en-US')}</span></div>
                    )}
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-2 text-[10px] text-slate-600 pr-1">
                    <span className="text-slate-500">{tr('הערות', 'Notes')}: </span>{order.notes}
                  </div>
                )}
                <div className="mt-2 text-[10px] text-cdata-300">{tr('פתח הזמנה', 'Open order')}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
