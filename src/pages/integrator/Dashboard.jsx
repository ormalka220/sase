import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, CheckCircle, Clock, AlertTriangle, Plus, FileText, ListChecks,
  ChevronRight,
} from 'lucide-react'
import {
  AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area,
} from 'recharts'
import {
  getCustomersByIntegrator,
  getCustomerEnvironment,
  growthData,
  getOrdersByIntegrator,
} from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'

const INTEGRATOR_ID = 'i1'
const myCustomers = getCustomersByIntegrator(INTEGRATOR_ID)

const onboardingBadge = (status) => {
  const map = {
    active: 'badge-green',
    configured: 'badge-blue',
    invited: 'badge-amber',
    created: 'badge-steel',
  }
  return map[status] || 'badge-steel'
}

const onboardingLabel = (status) => {
  const map = { active: 'פעיל', configured: 'מוגדר', invited: 'הוזמן', created: 'חדש' }
  return map[status] || status
}

export default function IntegratorDashboard() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const integratorOrders = getOrdersByIntegrator(INTEGRATOR_ID)
  const scopedCustomerIds = product === 'all'
    ? null
    : new Set(integratorOrders.filter(o => o.product === product).map(o => o.customerId))
  const scopedCustomers = product === 'all'
    ? myCustomers
    : myCustomers.filter(c => scopedCustomerIds.has(c.id))

  const activeCustomers = scopedCustomers.filter(c => c.status === 'active')
  const pendingOnboarding = scopedCustomers.filter(c => c.onboardingStatus !== 'active')
  const openAlerts = scopedCustomers.reduce((sum, c) => {
    const env = getCustomerEnvironment(c.id)
    return sum + (env?.alertsCount || 0)
  }, 0)

  const kpis = [
    {
      label: 'סה"כ לקוחות',
      value: scopedCustomers.length,
      icon: Users,
      color: 'text-cdata-300',
      bg: 'bg-cdata-500/15',
    },
    {
      label: 'לקוחות פעילים',
      value: activeCustomers.length,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-600/15',
    },
    {
      label: 'בתהליך קליטה',
      value: pendingOnboarding.length,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-600/15',
    },
    {
      label: 'התראות פתוחות',
      value: openAlerts,
      icon: AlertTriangle,
      color: openAlerts > 0 ? 'text-red-400' : 'text-emerald-400',
      bg: openAlerts > 0 ? 'bg-red-600/15' : 'bg-emerald-600/15',
    },
  ]

  const recentCustomers = [...scopedCustomers].slice(-3).reverse()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">לוח בקרה</h1>
        <p className="text-slate-500 text-sm mt-0.5">NetSec Solutions — Integrator Dashboard · {product === 'all' ? 'All Products' : product === 'sase' ? 'Forti SASE' : 'Perception Point'}</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <div key={k.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <div className="text-xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Charts + Customer Health */}
      <div className="grid grid-cols-3 gap-4">
        {/* Area Chart */}
        <div className="glass glow-border rounded-2xl p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-white">צמיחת לקוחות</div>
              <div className="text-xs text-slate-500">6 חודשים אחרונים</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={growthData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="cgGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2C6A8A" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2C6A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1f2d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#94a3b8' }}
                itemStyle={{ color: '#87BFDA' }}
              />
              <Area
                type="monotone"
                dataKey="customers"
                stroke="#2C6A8A"
                strokeWidth={2}
                fill="url(#cgGrad)"
                name="לקוחות"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Health List */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-4">בריאות לקוחות</div>
          <div className="space-y-3">
            {scopedCustomers.map(c => {
              const env = getCustomerEnvironment(c.id)
              const score = env?.complianceScore ?? 0
              const barColor = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'
              return (
                <div key={c.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 truncate max-w-[120px]">{c.companyName}</span>
                    <span className={`${onboardingBadge(c.onboardingStatus)} text-[10px] px-1.5 py-0.5`}>
                      {onboardingLabel(c.onboardingStatus)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${score}%`, background: barColor }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold w-8 text-right" style={{ color: barColor }}>
                      {score > 0 ? `${score}%` : '—'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions + Recent Customers */}
      <div className="grid grid-cols-3 gap-4">
        {/* Quick Actions */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-4">פעולות מהירות</div>
          <div className="space-y-2.5">
            <button
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              onClick={() => navigate('/integrator/customers/new')}
            >
              <Plus className="w-4 h-4" />
              לקוח חדש +
            </button>
            <button
              className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
              onClick={() => navigate('/integrator/onboarding')}
            >
              <ListChecks className="w-4 h-4" />
              תור קליטה
            </button>
            <button
              className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
              onClick={() => navigate('/integrator/reports')}
            >
              <FileText className="w-4 h-4" />
              דוח חודשי
            </button>
          </div>
        </div>

        {/* Recent Customers */}
        <div className="glass glow-border rounded-2xl p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">לקוחות אחרונים</div>
            <button
              className="text-xs transition-colors flex items-center gap-1"
              style={{ color: config.navActiveColor }}
              onClick={() => navigate('/integrator/customers')}
            >
              הכל <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {recentCustomers.map(c => {
              const env = getCustomerEnvironment(c.id)
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  onClick={() => navigate(`/integrator/customers/${c.id}`)}
                >
                  <div className="w-8 h-8 rounded-xl bg-cdata-500/15 border border-cdata-500/15 flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0">
                    {c.companyName.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{c.companyName}</div>
                    <div className="text-[10px] text-slate-500">{c.domain}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${onboardingBadge(c.onboardingStatus)} text-[10px]`}>
                      {onboardingLabel(c.onboardingStatus)}
                    </span>
                    {env && (
                      <span className="text-xs text-slate-500">{env.complianceScore > 0 ? `${env.complianceScore}%` : '—'}</span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
