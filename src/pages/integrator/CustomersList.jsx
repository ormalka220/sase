import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Users, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'

const INTEGRATOR_ID = 'i1'

export default function IntegratorCustomersList() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (product === 'sase') {
      setLoading(false)
      setCustomers([])
      return
    }
    async function loadCustomers() {
      try {
        setLoading(true)
        setError('')
        const data = await workspaceApi.getPpCustomersList({ integratorId: INTEGRATOR_ID, role: 'integrator' })
        setCustomers(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadCustomers()
  }, [product])

  if (product === 'sase') {
    return <div className="glass rounded-xl p-5 border border-white/10 text-sm text-slate-300">רשימת לקוחות אמיתית זמינה כרגע רק עבור Perception Point.</div>
  }

  const productCustomers = customers
  const filtered = productCustomers.filter(c => {
    const matchSearch =
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.domain.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ||
      (filter === 'active' && c.status === 'ACTIVE') ||
      (filter === 'onboarding' && c.status === 'ONBOARDING') ||
      (filter === 'suspended' && c.status === 'SUSPENDED')
    return matchSearch && matchFilter
  })

  const totalActive = productCustomers.filter(c => c.status === 'ACTIVE').length
  const totalOnboarding = productCustomers.filter(c => c.status === 'ONBOARDING').length

  const filters = [
    { key: 'all', label: 'הכל' },
    { key: 'active', label: 'פעיל' },
    { key: 'onboarding', label: 'בתהליך קליטה' },
    { key: 'suspended', label: 'מושהה' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">לקוחות</h1>
          <p className="text-slate-500 text-sm mt-0.5">רשימת לקוחות · Perception Point</p>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
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
          <div>Seats</div>
          <div>Org ID</div>
          <div>סטטוס</div>
          <div>קליטה</div>
          <div>PP Admin</div>
          <div>בריאות / פעולות</div>
        </div>

        {loading ? (
          <div className="px-5 py-12 text-center text-slate-500 text-sm">טוען לקוחות...</div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-500 text-sm">לא נמצאו לקוחות</div>
        ) : (
          filtered.map(c => {
            const score = c.complianceScore
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

                <div className="text-sm text-white font-medium">{c.seats.toLocaleString()}</div>

                <div className="text-xs text-slate-400 truncate pr-2">{c.ppOrgId || '—'}</div>

                <div>
                  <span className="badge-steel">{c.status}</span>
                </div>

                <div>
                  <span className="badge-steel">{c.onboardingStatus}</span>
                </div>

                <div className="text-xs text-slate-400 truncate">{c.ppAdminUserId || '—'}</div>

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
