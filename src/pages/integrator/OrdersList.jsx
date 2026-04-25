import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShoppingCart, PlusCircle, Clock, CheckCircle2, XCircle,
  PackageCheck, FileText, Search, ShieldCheck, Mail
} from 'lucide-react'
import { getOrdersByIntegrator } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'

const INTEGRATOR_ID = 'i1'
const orders = getOrdersByIntegrator(INTEGRATOR_ID)

const statusConfig = {
  draft:       { label: 'טיוטה',     color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: FileText },
  pending:     { label: 'ממתין',     color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: Clock },
  approved:    { label: 'אושר',      color: '#2C6A8A', bg: 'rgba(44,106,138,0.12)',  icon: CheckCircle2 },
  rejected:    { label: 'נדחה',      color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: XCircle },
  provisioned: { label: 'הופעל',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  icon: PackageCheck },
}

const productConfig = {
  sase:       { label: 'Forti SASE',       color: '#2C6A8A', icon: ShieldCheck },
  perception: { label: 'Perception Point', color: '#059669', icon: Mail },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.draft
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function ProductBadge({ product }) {
  const cfg = productConfig[product] || productConfig.sase
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
      style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  )
}

function fmt(dt) {
  return new Date(dt).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function OrdersList() {
  const navigate = useNavigate()
  const { product } = useProduct()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const productOrders = product === 'all' ? orders : orders.filter(o => o.product === product)

  const filtered = productOrders.filter(o => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusCounts = Object.keys(statusConfig).reduce((acc, k) => {
    acc[k] = productOrders.filter(o => o.status === k).length
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingCart className="w-5 h-5 text-cdata-300" />
            <h1 className="text-xl font-black text-white">הזמנות <span className="text-cdata-300">רישויים</span></h1>
          </div>
          <p className="text-xs text-slate-500">License Orders — NetSec Solutions</p>
        </div>
        <button
          onClick={() => navigate('/integrator/orders/new')}
          className="btn-primary flex items-center gap-2 text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          הזמנה חדשה +
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
            placeholder="חיפוש לפי מספר הזמנה / לקוח..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cdata-500/40"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass rounded-xl overflow-hidden" style={{ border: '1px solid rgba(44,106,138,0.12)' }}>
        <div className="px-5 py-3.5 border-b border-white/5">
          <span className="text-sm font-bold text-white">
            הזמנות <span className="text-cdata-400 font-normal text-xs mr-2">{filtered.length} נמצאו</span>
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-600">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="text-sm">אין הזמנות תואמות</div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(order => (
              <div key={order.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{order.orderNumber}</span>
                        <StatusBadge status={order.status} />
                        <ProductBadge product={order.product} />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{order.customerName}</span>
                        <span className="text-[10px] text-slate-600">
                          {order.quantity.toLocaleString()} {order.licenseType === 'mailboxes' ? 'תיבות' : 'משתמשים'}
                        </span>
                        <span className="text-[10px] text-slate-600 capitalize">{order.duration === 'yearly' ? 'שנתי' : 'חודשי'}</span>
                      </div>
                      {order.rejectionReason && (
                        <div className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {order.rejectionReason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-slate-600 mb-0.5">נוצר</div>
                    <div className="text-xs text-slate-400">{fmt(order.createdAt)}</div>
                    {order.approvedBy && (
                      <div className="text-[10px] text-slate-600 mt-1">אושר ע"י: <span className="text-slate-400">{order.approvedBy}</span></div>
                    )}
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-2 text-[10px] text-slate-600 pr-1">
                    <span className="text-slate-500">הערות: </span>{order.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
