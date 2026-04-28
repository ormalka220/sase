import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, CheckCircle, Clock, AlertTriangle, Plus, FileText, ListChecks, ChevronRight,
} from 'lucide-react'
import { AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area } from 'recharts'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

const INTEGRATOR_ID = 'i1'

export default function IntegratorDashboard() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const { tr } = useLanguage()
  const showOnboarding = product === 'perception' || product === 'all'
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product === 'sase') {
      setLoading(false)
      return
    }
    async function load() {
      try {
        setLoading(true)
        setError('')
        const data = await workspaceApi.getPpOverview({ integratorId: INTEGRATOR_ID, role: 'integrator' })
        setOverview(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [product])

  if (product === 'sase') {
    return <div className="glass rounded-xl p-5 border border-white/10 text-slate-300 text-sm">{tr('ב־FortiSASE המסך הזה נשאר כרגע על נתוני דמו עד ש-API ייעודי יהיה זמין.', 'In FortiSASE, this view currently stays on demo data until a dedicated API is available.')}</div>
  }

  const kpis = overview?.kpis || { totalCustomers: 0, activeCustomers: 0, pendingOnboarding: 0, openAlerts: 0 }

  const cards = [
    {
      label: tr('סה"כ לקוחות', 'Total Customers'),
      value: kpis.totalCustomers,
      icon: Users,
      color: 'text-cdata-300',
      bg: 'bg-cdata-500/15',
    },
    {
      label: tr('לקוחות פעילים', 'Active Customers'),
      value: kpis.activeCustomers,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-600/15',
    },
    {
      label: tr('בתהליך קליטה', 'In Onboarding'),
      value: kpis.pendingOnboarding,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-600/15',
    },
    {
      label: tr('התראות פתוחות', 'Open Alerts'),
      value: kpis.openAlerts,
      icon: AlertTriangle,
      color: kpis.openAlerts > 0 ? 'text-red-400' : 'text-emerald-400',
      bg: kpis.openAlerts > 0 ? 'bg-red-600/15' : 'bg-emerald-600/15',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{tr('לוח בקרה', 'Dashboard')}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{tr('NetSec Solutions — לוח בקרה אינטגרטור · Perception Point', 'NetSec Solutions - Integrator Dashboard · Perception Point')}</p>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map(k => (
          <div key={k.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <div className="text-xl font-bold text-white">{k.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="glass glow-border rounded-2xl p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-white">{tr('צמיחת לקוחות', 'Customer Growth')}</div>
              <div className="text-xs text-slate-500">{tr('6 חודשים אחרונים', 'Last 6 months')}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={overview?.growthData || []} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
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
                name={tr('לקוחות', 'Customers')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-4">{tr('בריאות לקוחות', 'Customer Health')}</div>
          <div className="space-y-3">
            {(overview?.customerHealth || []).map(c => {
              const score = c.complianceScore ?? 0
              const barColor = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444'
              return (
                <div key={c.customerId} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 truncate max-w-[120px]">{c.companyName}</span>
                    <span className="badge-steel text-[10px] px-1.5 py-0.5">
                      {c.onboardingStatus}
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

      <div className="grid grid-cols-3 gap-4">
        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-4">{tr('פעולות מהירות', 'Quick Actions')}</div>
          <div className="space-y-2.5">
            <button
              className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
              onClick={() => navigate('/integrator/customers/new')}
            >
              <Plus className="w-4 h-4" />
              {tr('לקוח חדש +', 'New Customer +')}
            </button>
            <button
              className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
              onClick={() => navigate('/integrator/onboarding')}
              style={{ display: showOnboarding ? 'flex' : 'none' }}
            >
              <ListChecks className="w-4 h-4" />
              {tr('תור קליטה', 'Onboarding Queue')}
            </button>
            <button
              className="btn-ghost w-full flex items-center justify-center gap-2 text-sm"
              onClick={() => navigate('/integrator/reports')}
            >
              <FileText className="w-4 h-4" />
              {tr('דוח חודשי', 'Monthly Report')}
            </button>
          </div>
        </div>

        <div className="glass glow-border rounded-2xl p-5 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-white">{tr('לקוחות אחרונים', 'Recent Customers')}</div>
            <button
              className="text-xs transition-colors flex items-center gap-1"
              style={{ color: config.navActiveColor }}
              onClick={() => navigate('/integrator/customers')}
            >
              {tr('הכל', 'View all')} <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {loading ? (
              <div className="text-xs text-slate-500">{tr('טוען נתונים...', 'Loading data...')}</div>
            ) : (overview?.recentCustomers || []).map(c => {
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
                    <span className="badge-steel text-[10px]">
                      {c.onboardingStatus}
                    </span>
                    <span className="text-xs text-slate-500">{c.complianceScore > 0 ? `${c.complianceScore}%` : '—'}</span>
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
