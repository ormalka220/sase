import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, User, Calendar, CreditCard, BadgeCheck } from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'
import { getCommonLabels } from '../../i18n/labels'

export default function OrderDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tr, isHebrew } = useLanguage()
  const labels = getCommonLabels(tr)
  const [order, setOrder] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true)
        setError('')
        const data = await workspaceApi.getOrder(id)
        setOrder(data)
        if (data?.customer?.companyName) {
          setCustomerName(data.customer.companyName)
        } else if (data?.customerId) {
          try {
            const customer = await workspaceApi.getCustomer(data.customerId)
            setCustomerName(customer?.companyName || data.customerId)
          } catch {
            setCustomerName(data.customerId)
          }
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadOrder()
  }, [id])

  const createdAt = useMemo(() => {
    if (!order?.createdAt) return '—'
    return new Date(order.createdAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')
  }, [order?.createdAt, isHebrew])

  const approvedAt = useMemo(() => {
    if (!order?.approvedAt) return '—'
    return new Date(order.approvedAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')
  }, [order?.approvedAt, isHebrew])

  const totalSeats = useMemo(
    () => (order?.items || []).reduce((sum, item) => sum + (item?.seats || 0), 0),
    [order?.items]
  )

  if (loading) {
    return <div className="text-sm text-slate-400">{tr('טוען הזמנה...', 'Loading order...')}</div>
  }

  if (!order) {
    return <div className="text-sm text-slate-400">{tr('הזמנה לא נמצאה', 'Order not found')}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/integrator/orders')}
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white">{tr('פרטי הזמנה', 'Order Details')}</h1>
          <p className="text-xs text-slate-500 truncate">{customerName || order.customerId || '—'} · {order.id}</p>
        </div>
        <span className="badge-steel">{labels.statuses[order.status] || order.status || '—'}</span>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="glass rounded-2xl p-5 border border-white/10 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-slate-500" />
            <span>{tr('לקוח', 'Customer')}: {customerName || order.customerId || '—'}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-center gap-2 text-slate-300">
            <ShoppingCart className="w-4 h-4 text-slate-500" />
            <span>{tr('סטטוס', 'Status')}: {labels.statuses[order.status] || order.status || '—'}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-center gap-2 text-slate-300">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{tr('נוצר', 'Created')}: {createdAt}</span>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-center gap-2 text-slate-300">
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>{tr('חיוב', 'Billing')}: {order.billingType || '—'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl bg-cdata-500/10 border border-cdata-500/25 p-3">
            <div className="text-[10px] text-slate-500">{tr('סה"כ רישיונות', 'Total seats')}</div>
            <div className="text-lg font-black text-cdata-300">{totalSeats.toLocaleString()}</div>
          </div>
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3">
            <div className="text-[10px] text-slate-500">{tr('תאריך אישור', 'Approval date')}</div>
            <div className="text-sm font-semibold text-white">{approvedAt}</div>
          </div>
          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-3 flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-500">{tr('מספר הזמנה', 'Order number')}</div>
              <div className="text-sm font-semibold text-white">{order.id.slice(0, 8).toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 mb-2">{tr('פריטי הזמנה', 'Order Items')}</div>
          <div className="space-y-2">
            {(order.items || []).map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 p-3 text-xs text-slate-300 bg-white/[0.02] flex items-center justify-between">
                <span className="text-white font-medium">{item.product?.name || item.product?.code || '—'}</span>
                <span>{tr('כמות', 'Seats')}: <strong className="text-cdata-300">{item.seats || 0}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
