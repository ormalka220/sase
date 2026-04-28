import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Eye, MoreHorizontal, Building2, Shield } from 'lucide-react'
import { integrators, getCustomersByIntegrator, getOrdersByDistributor } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

const STATUS_TABS = ['all', 'active', 'onboarding', 'suspended']

function statusBadge(status) {
  if (status === 'active') return 'badge-green'
  if (status === 'onboarding') return 'badge-amber'
  if (status === 'suspended') return 'badge-red'
  return 'badge-steel'
}

function formatDate(str, locale) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function IntegratorsList() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const { tr, isHebrew } = useLanguage()
  const [realOrders, setRealOrders] = useState([])
  const [realCustomers, setRealCustomers] = useState([])
  const [realError, setRealError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (product === 'sase') return
    async function loadReal() {
      try {
        setRealError('')
        const [orders, customers] = await Promise.all([
          workspaceApi.getOrders({ distributorId: 'd1', role: 'distributor' }),
          workspaceApi.getCustomers(undefined, 'distributor'),
        ])
        const ordersList = Array.isArray(orders) ? orders : (orders?.data || [])
        const customersList = Array.isArray(customers) ? customers : (customers?.data || [])
        setRealOrders(ordersList.filter((o) => o.items?.some((i) => i.product?.code === 'WORKSPACE_SECURITY')))
        setRealCustomers(customersList.filter((c) => c.distributorId === 'dist-1'))
      } catch (e) {
        setRealError(e.message)
      }
    }
    loadReal()
  }, [product])

  const ppIntegrators = useMemo(() => {
    const map = new Map()
    realOrders.forEach((o) => {
      const entry = map.get(o.integratorId) || {
        id: o.integratorId,
        companyName: o.integrator?.organization?.name || o.integratorName || o.integratorId,
        contactName: o.integrator?.user?.name || '—',
        contactEmail: o.integrator?.user?.email || '—',
        status: 'active',
        createdAt: o.createdAt,
        lastActivity: o.updatedAt,
        customers: 0,
      }
      map.set(o.integratorId, entry)
    })
    realCustomers.forEach((c) => {
      const entry = map.get(c.integratorId) || {
        id: c.integratorId,
        companyName: c.integrator?.organization?.name || c.integratorName || c.integratorId,
        contactName: c.integrator?.user?.name || '—',
        contactEmail: c.integrator?.user?.email || '—',
        status: 'active',
        createdAt: c.createdAt,
        lastActivity: c.updatedAt,
        customers: 0,
      }
      entry.customers += 1
      map.set(c.integratorId, entry)
    })
    return Array.from(map.values())
  }, [realOrders, realCustomers])

  if (product !== 'sase') {
    const filteredReal = ppIntegrators.filter((item) => item.companyName.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()))
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{tr('אינטגרטורים', 'Integrators')}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{tr('ניהול אינטגרטורים · Perception Point', 'Integrators Management · Perception Point')}</p>
          {realError && <p className="text-xs text-red-400 mt-1">{realError}</p>}
        </div>
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={tr('חיפוש אינטגרטור...', 'Search integrator...')} className="w-full bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300" />
        </div>
        <div className="glass glow-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-4 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
            <div>{tr('אינטגרטור', 'Integrator')}</div><div>ID</div><div>{tr('לקוחות PP', 'PP Customers')}</div><div>{tr('פעילות אחרונה', 'Last activity')}</div>
          </div>
          {filteredReal.map((item) => (
            <div key={item.id} className="grid grid-cols-4 px-5 py-3 border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer" onClick={() => navigate('/distribution/integrators/' + item.id)}>
              <div className="text-sm text-white">{item.companyName}</div>
              <div className="text-xs text-slate-400">{item.id}</div>
              <div className="text-xs text-slate-300">{item.customers}</div>
              <div className="text-xs text-slate-500">{formatDate(item.lastActivity, isHebrew ? 'he-IL' : 'en-US')}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const distributorOrders = getOrdersByDistributor('d1')
  const scopedIntegratorIds = product === 'all'
    ? null
    : new Set(distributorOrders.filter(o => o.product === product).map(o => o.integratorId))
  const scopedIntegrators = product === 'all'
    ? integrators
    : integrators.filter(i => scopedIntegratorIds.has(i.id))

  const filtered = scopedIntegrators.filter(item => {
    const matchSearch =
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.contactEmail.toLowerCase().includes(search.toLowerCase())
    const matchStatus = activeTab === 'all' || item.status === activeTab
    return matchSearch && matchStatus
  })

  const totalCount = scopedIntegrators.length
  const activeCount = scopedIntegrators.filter(i => i.status === 'active').length
  const onboardingCount = scopedIntegrators.filter(i => i.status === 'onboarding').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{tr('אינטגרטורים', 'Integrators')}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{tr('ניהול אינטגרטורים', 'Integrators Management')} · {product === 'all' ? tr('כל המוצרים', 'All Products') : product === 'sase' ? 'Forti SASE' : 'Perception Point'}</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={() => navigate('/distribution/integrators/new')}
        >
          <Plus className="w-4 h-4" />
          {tr('הוסף אינטגרטור', 'Add Integrator')}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
          {[
          { label: tr('סה"כ אינטגרטורים', 'Total Integrators'), value: totalCount, icon: Building2, color: 'text-cdata-300', bg: `rgba(${config.glowRgb},0.12)` },
          { label: tr('פעילים', 'Active'), value: activeCount, icon: Building2, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.10)' },
          { label: tr('בתהליך קליטה', 'Onboarding'), value: onboardingCount, icon: Building2, color: 'text-amber-400', bg: 'rgba(245,158,11,0.10)' },
          { label: product === 'perception' ? tr('סביבות Perception פעילות', 'Active Perception Environments') : tr('סביבות FortiSASE', 'FortiSASE Environments'), value: String(distributorOrders.filter(o => product === 'all' || o.product === product).length), icon: Shield, color: 'text-cdata-300', bg: `rgba(${config.glowRgb},0.15)` },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tr('חיפוש אינטגרטור...', 'Search integrator...')}
            className="w-full bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          />
        </div>
        {/* Status filter buttons */}
        <div className="flex items-center gap-2">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'text-cdata-300 border'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
              style={activeTab === tab ? { background: `${config.primaryColor}24`, borderColor: `${config.primaryColor}4d` } : {}}
            >
              {tab === 'all' ? tr('הכל', 'All') : tab === 'active' ? tr('פעיל', 'Active') : tab === 'onboarding' ? tr('בתהליך קליטה', 'Onboarding') : tr('מושהה', 'Suspended')}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
          <div className="col-span-2">{tr('אינטגרטור', 'Integrator')}</div>
          <div>{tr('איש קשר', 'Contact')}</div>
          <div>{tr('לקוחות', 'Customers')}</div>
          <div>{tr('סטטוס', 'Status')}</div>
          <div>{tr('פעילות אחרונה', 'Last activity')}</div>
          <div>{tr('נוצר', 'Created')}</div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-slate-700 mb-3" />
            <p className="text-sm font-medium text-slate-400">{tr('לא נמצאו תוצאות', 'No results found')}</p>
            <p className="text-xs text-slate-600 mt-1">{tr('נסה לשנות את החיפוש או הפילטר', 'Try changing search or filter')}</p>
            <button
              className="mt-4 btn-primary text-xs"
              onClick={() => navigate('/distribution/integrators/new')}
            >
              {tr('הוסף אינטגרטור חדש', 'Add a new integrator')}
            </button>
          </div>
        ) : (
          filtered.map((item, i) => {
            const custCount = getCustomersByIntegrator(item.id).length
            return (
              <div
                key={item.id}
                className="grid grid-cols-7 items-center px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors group"
                onClick={() => navigate('/distribution/integrators/' + item.id)}
              >
                {/* Company */}
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(44,106,138,0.15)', border: '1px solid rgba(44,106,138,0.2)' }}
                  >
                    {item.companyName.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{item.companyName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.contactEmail}</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-sm text-slate-400 truncate">{item.contactName}</div>

                {/* Customer count */}
                <div className="text-sm font-medium text-white">{custCount}</div>

                {/* Status */}
                <div>
                  <span className={`${statusBadge(item.status)} text-xs`}>
                    {item.status === 'active' ? tr('פעיל', 'Active') : item.status === 'onboarding' ? tr('בתהליך קליטה', 'Onboarding') : item.status === 'suspended' ? tr('מושהה', 'Suspended') : item.status}
                  </span>
                </div>

                {/* Last Activity */}
                <div className="text-xs text-slate-500">{formatDate(item.lastActivity, isHebrew ? 'he-IL' : 'en-US')}</div>

                {/* Created date + actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatDate(item.createdAt, isHebrew ? 'he-IL' : 'en-US')}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"
                      onClick={e => { e.stopPropagation(); navigate('/distribution/integrators/' + item.id) }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
