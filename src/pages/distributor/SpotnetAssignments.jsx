import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Clock3, Loader2, Mail, Building2, ShieldCheck } from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'
import { PP_PACKAGES } from '../../data/ppPackages'

function resolveBundleFromOrder(order) {
  const tokenMatch = order?.notes?.match(/\[PP_PACKAGE:([A-Z0-9_-]+)\]/i)
  const packageCode = tokenMatch?.[1]?.toUpperCase()
  if (packageCode) {
    const byCode = PP_PACKAGES.find((pkg) => pkg.code === packageCode)
    if (byCode) return byCode
  }

  const unitPrice = Number(order?.items?.[0]?.unitPrice)
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return null

  const billingCycle = (order?.billingCycle || 'MONTHLY').toUpperCase()
  const priceKey = billingCycle === 'ANNUAL' ? 'annualPricePerMailbox' : 'monthlyPricePerMailbox'
  const tolerance = 0.001

  return (
    PP_PACKAGES.find((pkg) => Math.abs(Number(pkg[priceKey]) - unitPrice) < tolerance) || null
  )
}

export default function SpotnetAssignments() {
  const { tr, isHebrew } = useLanguage()
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [actionLoading, setActionLoading] = useState({})

  async function loadData() {
    try {
      setLoading(true)
      setError('')
      const [ordersRes, customersRes] = await Promise.all([
        workspaceApi.getOrders({ status: 'PENDING_SPOTNET_ASSIGNMENT', limit: 300 }),
        workspaceApi.getPpCustomersList({ limit: 500 }),
      ])
      const ordersList = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || [])
      const customersList = Array.isArray(customersRes) ? customersRes : (customersRes?.data || [])
      const pendingPpOrders = ordersList.filter((order) =>
        (order.items || []).some((item) => item?.product?.code === 'WORKSPACE_SECURITY')
      )
      setOrders(pendingPpOrders)
      setCustomers(customersList)
    } catch (e) {
      setError(e.message || tr('נכשלה טעינת רשימת הקצאות', 'Failed to load assignments list'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const customerById = useMemo(() => {
    return Object.fromEntries(customers.map((customer) => [customer.id, customer]))
  }, [customers])

  function formatDate(value) {
    if (!value) return '—'
    return new Date(value).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')
  }

  async function markAssigned(orderId) {
    try {
      setInfo('')
      setError('')
      setActionLoading((prev) => ({ ...prev, [orderId]: true }))
      await workspaceApi.markSpotnetAssigned(orderId)
      await loadData()
      setInfo(tr('סומן כהוקצה בהצלחה. השלב הבא נפתח לקליטה.', 'Marked as assigned. Next onboarding stage is now unlocked.'))
    } catch (e) {
      setError(e.message || tr('עדכון הקצאה נכשל', 'Failed to update bundle assignment'))
    } finally {
      setActionLoading((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-white">{tr('תור הקצאות SpotNet', 'SpotNet Bundle Assignment Queue')}</h1>
          <p className="text-xs text-slate-500 mt-1">
            {tr(
              'כל הארגונים שממתינים להקצאת Bundle ידנית לפני פתיחת קליטה.',
              'All organizations waiting for manual bundle assignment before onboarding unlock.'
            )}
          </p>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          {info && <p className="text-xs text-emerald-400 mt-1">{info}</p>}
        </div>
        <div className="px-3 py-2 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-200 text-xs font-semibold">
          {orders.length} {tr('ממתינים להקצאה', 'pending assignments')}
        </div>
      </div>

      {loading ? (
        <div className="glass rounded-xl p-10 text-center text-slate-400 text-sm">{tr('טוען תור הקצאות...', 'Loading assignment queue...')}</div>
      ) : orders.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center text-slate-500 text-sm">
          {tr('אין כרגע ארגונים שממתינים להקצאת Bundle.', 'No organizations are currently waiting for bundle assignment.')}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const customer = customerById[order.customerId]
            const loadingThis = Boolean(actionLoading[order.id])
            const selectedBundle = resolveBundleFromOrder(order)
            const packageName = selectedBundle ? (isHebrew ? selectedBundle.nameHe : selectedBundle.name) : (order.items?.[0]?.product?.name || 'Perception Point')
            const packageSku = selectedBundle?.sku
            return (
              <div
                key={order.id}
                className="glass rounded-xl border border-white/10 p-4 md:p-5"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white font-mono">{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 border border-violet-500/25 text-violet-200">
                        <Clock3 className="w-3 h-3" />
                        {tr('ממתין להקצאה', 'Pending Assignment')}
                      </span>
                    </div>
                    <div className="text-sm text-white font-semibold flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      {customer?.companyName || order.customer?.companyName || order.customerId}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      {customer?.adminEmail || tr('לא זמין', 'N/A')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                      {tr('חבילה', 'Bundle')}: <span className="text-slate-300 font-medium">{packageName}</span>
                    </div>
                    {packageSku && (
                      <div className="text-[11px] text-slate-500">
                        SKU: <span className="text-slate-400 font-mono">{packageSku}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-slate-500">
                      PP Org: <span className="text-slate-400">{customer?.ppOrgName || '—'}</span>
                      {customer?.ppOrgId ? <span className="text-slate-600"> · {customer.ppOrgId}</span> : null}
                    </div>
                    <div className="text-[11px] text-slate-600">
                      {tr('נוצר', 'Created')}: {formatDate(order.createdAt)} · {tr('אושר', 'Approved')}: {formatDate(order.approvedAt)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAssigned(order.id)}
                      disabled={loadingThis}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)', boxShadow: '0 2px 8px rgba(124,58,237,0.35)' }}
                    >
                      {loadingThis
                        ? <span className="inline-flex items-center gap-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin" />{tr('טוען...', 'Loading...')}</span>
                        : <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" />{tr('Bundle הוקצה', 'Bundle Assigned')}</span>}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
