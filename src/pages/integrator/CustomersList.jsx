import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users, CheckCircle, Clock, ChevronRight, ExternalLink, Copy } from 'lucide-react'
import {
  getCustomersByIntegrator,
  getCustomerEnvironment,
  getOrdersByIntegrator,
} from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'

const INTEGRATOR_ID = 'i1'

const onboardingLabel = (status) => {
  const map = { active: 'פעיל', configured: 'מוגדר', invited: 'הוזמן', created: 'חדש' }
  return map[status] || status
}

const onboardingBadge = (status) => {
  const map = {
    active: 'badge-green',
    configured: 'badge-blue',
    invited: 'badge-amber',
    created: 'badge-steel',
  }
  return map[status] || 'badge-steel'
}

const statusBadge = (status) => {
  const map = { active: 'badge-green', onboarding: 'badge-amber', suspended: 'badge-red' }
  return map[status] || 'badge-steel'
}

const statusLabel = (status) => {
  const map = { active: 'פעיל', onboarding: 'קליטה', suspended: 'מושהה' }
  return map[status] || status
}

export default function IntegratorCustomersList() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const allCustomers = getCustomersByIntegrator(INTEGRATOR_ID)
  const integratorOrders = getOrdersByIntegrator(INTEGRATOR_ID)
  const scopedCustomerIds = product === 'all'
    ? null
    : new Set(integratorOrders.filter(o => o.product === product).map(o => o.customerId))
  const productCustomers = product === 'all'
    ? allCustomers
    : allCustomers.filter(c => scopedCustomerIds.has(c.id))

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = productCustomers.filter(c => {
    const matchSearch =
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && c.status === 'active') ||
      (filter === 'onboarding' && c.status === 'onboarding') ||
      (filter === 'suspended' && c.status === 'suspended')
    return matchSearch && matchFilter
  })

  const totalActive = productCustomers.filter(c => c.status === 'active').length
  const totalOnboarding = productCustomers.filter(c => c.status === 'onboarding').length

  const filters = [
    { key: 'all', label: 'הכל' },
    { key: 'active', label: 'פעיל' },
    { key: 'onboarding', label: 'Onboarding' },
    { key: 'suspended', label: 'מושהה' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">לקוחות</h1>
          <p className="text-slate-500 text-sm mt-0.5">רשימת לקוחות · {product === 'all' ? 'All Products' : product === 'sase' ? 'Forti SASE' : 'Perception Point'}</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={() => navigate('/integrator/customers/new')}
        >
          <Plus className="w-4 h-4" />
          לקוח חדש +
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
          {[
          { label: 'סה"כ לקוחות', value: productCustomers.length, icon: Users, color: 'text-cdata-300', bg: 'bg-cdata-500/15' },
          { label: 'לקוחות פעילים', value: totalActive, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
          { label: 'בתהליך קליטה', value: totalOnboarding, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-600/15' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לקוח..."
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'text-cdata-300 border'
                  : 'text-slate-500 hover:text-slate-300 border border-transparent'
              }`}
              style={filter === f.key ? { background: `${config.primaryColor}24`, borderColor: `${config.primaryColor}4d` } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-8 px-5 py-3 border-b border-white/[0.08] text-xs text-slate-500 font-medium">
          <div className="col-span-2">לקוח</div>
          <div>משתמשים</div>
          <div>פאקג'</div>
          <div>סטטוס</div>
          <div>Onboarding</div>
          <div>FortiSASE</div>
          <div>בריאות / פעולות</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-500 text-sm">לא נמצאו לקוחות</div>
        ) : (
          filtered.map(c => {
            const env = getCustomerEnvironment(c.id)
            const score = env?.complianceScore
            const scoreColor = score >= 95 ? '#10b981' : score >= 80 ? '#f59e0b' : '#ef4444'
            return (
              <div
                key={c.id}
                className="grid grid-cols-8 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.025] cursor-pointer transition-all items-center group"
                onClick={() => navigate('/integrator/customers/' + c.id)}
              >
                {/* Customer */}
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cdata-500/15 border border-cdata-500/15 flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0">
                    {c.companyName.slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{c.companyName}</div>
                    <div className="text-[10px] text-slate-500">{c.domain}</div>
                  </div>
                </div>

                {/* Users */}
                <div className="text-sm text-white font-medium">{c.numberOfUsers.toLocaleString()}</div>

                {/* Package */}
                <div className="text-xs text-slate-400 truncate pr-2">{c.packageName}</div>

                {/* Status */}
                <div>
                  <span className={statusBadge(c.status)}>{statusLabel(c.status)}</span>
                </div>

                {/* Onboarding */}
                <div>
                  <span className={onboardingBadge(c.onboardingStatus)}>
                    {onboardingLabel(c.onboardingStatus)}
                  </span>
                </div>

                {/* FortiSASE */}
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <span className="text-xs font-mono text-cdata-300 bg-cdata-500/10 px-2 py-0.5 rounded">
                    {c.fortisaseUser}
                  </span>
                  <a
                    href={c.fortisaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-white/5 text-slate-500 hover:text-cdata-300 transition-colors"
                    title="פתח FortiSASE"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Health + action */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {score != null && score > 0 ? (
                      <>
                        <div className="w-14 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${score}%`, background: scoreColor }}
                          />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: scoreColor }}>
                          {score}%
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
