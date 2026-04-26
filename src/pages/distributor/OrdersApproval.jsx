import React, { useEffect, useState } from 'react'
import {
  ShoppingCart, CheckCircle2, XCircle, Clock, PackageCheck,
  ShieldCheck, Mail, AlertTriangle, Search, Filter, RotateCcw
} from 'lucide-react'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'

const DISTRIBUTOR_ID = 'd1'

const statusConfig = {
  DRAFT: { label: 'Draft', color: '#6b7280', bg: 'rgba(107,114,128,0.12)' },
  PAYMENT_PENDING: { label: 'Payment Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  PENDING_DISTRIBUTOR_APPROVAL: { label: 'Pending Approval', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  APPROVED: { label: 'Approved', color: '#2C6A8A', bg: 'rgba(44,106,138,0.12)' },
  PROVISIONING: { label: 'Provisioning', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  PROVISIONED: { label: 'Provisioned', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  ONBOARDING_PENDING: { label: 'Onboarding Pending', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  ACTIVE: { label: 'Active', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  REJECTED: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  FAILED: { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
}

const productConfig = {
  sase:       { label: 'Forti SASE',       color: '#2C6A8A', icon: ShieldCheck },
  perception: { label: 'Perception Point', color: '#059669', icon: Mail },
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

function fmt(dt) {
  return new Date(dt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function OrdersApproval() {
  const { product, config } = useProduct()
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [productFilter, setProductFilter] = useState(product === 'all' ? 'all' : product)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [error, setError] = useState('')

  async function loadOrders() {
    try {
      setError('')
      const apiOrders = await workspaceApi.getOrders({ distributorId: DISTRIBUTOR_ID, role: 'distributor' })
      const normalized = apiOrders.map(o => ({
        ...o,
        orderNumber: o.id.slice(0, 8).toUpperCase(),
        product: o.productType === 'WORKSPACE_SECURITY' ? 'perception' : 'sase',
        quantity: o.seats,
        duration: o.billingType === 'MONTHLY_INVOICE' ? 'monthly' : 'yearly',
        customerName: o.customerId,
        createdAt: o.createdAt,
      }))
      setOrders(normalized)
    } catch (loadError) {
      setError(loadError.message)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function approveOrder(orderId) {
    await workspaceApi.approveOrder(orderId)
    await loadOrders()
  }

  async function rejectOrder(orderId) {
    if (!rejectReason.trim()) return
    await workspaceApi.rejectOrder(orderId, rejectReason)
    await loadOrders()
    setRejectTarget(null)
    setRejectReason('')
  }

  useEffect(() => {
    setProductFilter(product === 'all' ? 'all' : product)
  }, [product])

  const scopedOrders = product === 'all' ? orders : orders.filter(o => o.product === product)

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || o.status === filter
    const matchProduct = productFilter === 'all' || o.product === productFilter
    const matchScope = product === 'all' || o.product === product
    return matchSearch && matchFilter && matchProduct && matchScope
  })

  const pendingCount = scopedOrders.filter(o => o.status === 'PENDING_DISTRIBUTOR_APPROVAL').length
  const approvalRate = scopedOrders.length ? Math.round((scopedOrders.filter(o => ['APPROVED', 'PROVISIONED', 'ACTIVE', 'ONBOARDING_PENDING'].includes(o.status)).length / scopedOrders.length) * 100) : 0
  const monthlyCount = filtered.filter(o => o.duration === 'monthly').length
  const yearlyCount = filtered.filter(o => o.duration === 'yearly').length

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-5 h-5" style={{ color: config.navActiveColor }} />
            <h1 className="text-xl font-black text-white">אישור <span style={{ color: config.navActiveColor }}>הזמנות</span></h1>
          </div>
          <p className="text-xs text-slate-500">Orders Approval — C-DATA Distribution</p>
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">{pendingCount} הזמנות ממתינות לאישור</span>
          </div>
        )}
      </div>

      {/* Quick KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4" style={{ border: '1px solid rgba(44,106,138,0.15)' }}>
          <div className="text-[10px] text-slate-500 mb-1">סה"כ הזמנות מסוננות</div>
          <div className="text-xl font-black text-white">{filtered.length}</div>
        </div>
        <div className="glass rounded-xl p-4" style={{ border: '1px solid rgba(44,106,138,0.15)' }}>
          <div className="text-[10px] text-slate-500 mb-1">יחס אישור כולל</div>
          <div className="text-xl font-black text-emerald-400">{approvalRate}%</div>
        </div>
        <div className="glass rounded-xl p-4" style={{ border: '1px solid rgba(44,106,138,0.15)' }}>
          <div className="text-[10px] text-slate-500 mb-1">חודשי / שנתי</div>
          <div className="text-xl font-black text-white">
            <span className="text-slate-300">{monthlyCount}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span style={{ color: config.navActiveColor }}>{yearlyCount}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['PENDING_DISTRIBUTOR_APPROVAL', 'APPROVED', 'REJECTED', 'PROVISIONED'].map(status => {
          const cfg = statusConfig[status]
          const count = scopedOrders.filter(o => o.status === status).length
          return (
            <button key={status} onClick={() => setFilter(filter === status ? 'all' : status)}
              className={`glass rounded-xl p-4 text-center transition-all hover:scale-[1.02] ${filter === status ? 'scale-[1.02]' : 'opacity-75 hover:opacity-100'}`}
              style={{
                border: `1px solid ${cfg.color}${filter === status ? '40' : '18'}`,
                boxShadow: filter === status ? `0 0 16px ${cfg.color}20` : 'none',
              }}>
              <div className="text-2xl font-black mb-1" style={{ color: cfg.color }}>{count}</div>
              <div className="text-[10px] text-slate-500">{cfg.label}</div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-3 md:p-4 flex flex-wrap items-center gap-2 md:gap-3" style={{ border: '1px solid rgba(44,106,138,0.12)' }}>
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי מספר / לקוח..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          />
        </div>
        {product === 'all' && (
          <div className="relative w-full md:w-56">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <select
              value={productFilter}
              onChange={e => setProductFilter(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pr-9 pl-3 py-2 text-xs text-white focus:outline-none appearance-none"
            >
              <option value="all">כל המוצרים</option>
              <option value="sase">Forti SASE</option>
              <option value="perception">Perception Point</option>
            </select>
          </div>
        )}
        <button
          onClick={() => { setSearch(''); setFilter('all'); setProductFilter(product === 'all' ? 'all' : product) }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 border border-white/10 hover:text-white hover:border-white/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          נקה פילטרים
        </button>
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass rounded-xl py-16 text-center text-slate-600">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="text-sm">אין הזמנות תואמות</div>
          </div>
        )}

        {filtered.map(order => {
          const prodCfg = productConfig[order.product] || productConfig.sase
          const ProdIcon = prodCfg.icon
          const isPending = order.status === 'PENDING_DISTRIBUTOR_APPROVAL'

          return (
            <div key={order.id}
              className={`glass rounded-xl transition-all duration-200 ${isPending ? 'ring-1 ring-amber-400/20' : ''}`}
              style={{ border: `1px solid ${isPending ? 'rgba(245,158,11,0.25)' : 'rgba(44,106,138,0.12)'}` }}>

              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Order info */}
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${prodCfg.color}12`, border: `1px solid ${prodCfg.color}25` }}>
                      <ProdIcon className="w-4.5 h-4.5" style={{ color: prodCfg.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-white">{order.orderNumber}</span>
                        <StatusBadge status={order.status} />
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{ background: `${prodCfg.color}12`, color: prodCfg.color }}>
                          {prodCfg.label}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mb-1">{order.customerName}</div>
                      <div className="flex items-center gap-3 flex-wrap text-[10px] text-slate-500">
                        <span>{order.quantity.toLocaleString()} {order.licenseType === 'mailboxes' ? 'תיבות' : 'משתמשים'}</span>
                        <span className="text-slate-700">·</span>
                        <span>{order.duration === 'yearly' ? 'שנתי' : 'חודשי'}</span>
                        <span className="text-slate-700">·</span>
                        <span>אינטגרטור: <span className="text-slate-400">{order.integratorId}</span></span>
                        <span className="text-slate-700">·</span>
                        <span>נוצר: {fmt(order.createdAt)}</span>
                      </div>
                      {order.notes && (
                        <div className="text-[10px] text-slate-600 mt-1.5">
                          הערות: <span className="text-slate-500">{order.notes}</span>
                        </div>
                      )}
                      {order.rejectionReason && (
                        <div className="flex items-center gap-1 text-[10px] text-red-400 mt-1.5">
                          <XCircle className="w-3 h-3" />
                          סיבת דחייה: {order.rejectionReason}
                        </div>
                      )}
                      {order.approvalStatus === 'APPROVED' && order.status !== 'REJECTED' && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1.5">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {isPending && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => approveOrder(order.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 2px 8px rgba(5,150,105,0.3)' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        אשר
                      </button>
                      <button
                        onClick={() => setRejectTarget(order.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444' }}>
                        <XCircle className="w-3.5 h-3.5" />
                        דחה
                      </button>
                    </div>
                  )}

                  {order.status === 'APPROVED' && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={async () => {
                          await workspaceApi.provisionOrder(order.id)
                          await loadOrders()
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
                        style={{ background: 'linear-gradient(135deg, #2C6A8A, #1F5070)', boxShadow: '0 2px 8px rgba(44,106,138,0.3)' }}>
                        <PackageCheck className="w-3.5 h-3.5" />
                        הפעל רישויים
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Rejection reason input */}
              {rejectTarget === order.id && (
                <div className="px-5 pb-4 border-t border-white/5 pt-3">
                  <div className="text-xs font-semibold text-slate-300 mb-2">סיבת דחייה *</div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={e => setRejectReason(e.target.value)}
                      placeholder="פרט את סיבת הדחייה..."
                      className="flex-1 bg-white/[0.03] border border-red-500/30 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500/50"
                    />
                    <button onClick={() => rejectOrder(order.id)} disabled={!rejectReason.trim()}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-colors"
                      style={{ background: 'rgba(239,68,68,0.8)' }}>
                      אישור דחייה
                    </button>
                    <button onClick={() => { setRejectTarget(null); setRejectReason('') }}
                      className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white border border-white/10">
                      ביטול
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
