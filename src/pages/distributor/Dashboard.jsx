import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, Shield, AlertTriangle, ChevronLeft, CheckCircle, AlertCircle, LayoutDashboard } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import { integrators, customers, customerEnvironments, growthData, getCustomersByIntegrator, getOrdersByDistributor } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'

export default function DistributorDashboard() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const [ppOverview, setPpOverview] = useState(null)
  const [ppError, setPpError] = useState('')
  const [ppLoading, setPpLoading] = useState(false)

  useEffect(() => {
    if (product === 'sase') return
    async function loadPp() {
      try {
        setPpLoading(true)
        setPpError('')
        const data = await workspaceApi.getPpOverview({ distributorId: 'd1', role: 'distributor' })
        setPpOverview(data)
      } catch (e) {
        setPpError(e.message)
      } finally {
        setPpLoading(false)
      }
    }
    loadPp()
  }, [product])

  if (product !== 'sase') {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Distributor Overview · Perception Point</p>
          {ppError && <p className="text-xs text-red-400 mt-1">{ppError}</p>}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            ['לקוחות', ppOverview?.kpis?.totalCustomers || 0],
            ['לקוחות פעילים', ppOverview?.kpis?.activeCustomers || 0],
            ['בתהליך קליטה', ppOverview?.kpis?.pendingOnboarding || 0],
            ['התראות פתוחות', ppOverview?.kpis?.openAlerts || 0],
          ].map(([label, value]) => (
            <div key={label} className="stat-card">
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
        <div className="glass glow-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-white mb-3">צמיחת לקוחות Perception Point</div>
          {ppLoading ? (
            <div className="text-xs text-slate-500">טוען נתונים...</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ppOverview?.growthData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="customers" stroke="#2C6A8A" strokeWidth={2.5} fill="url(#grad1)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    )
  }

  const distributorOrders = getOrdersByDistributor('d1')
  const scopedOrders = product === 'all' ? distributorOrders : distributorOrders.filter(o => o.product === product)
  const scopedCustomerIds = new Set(scopedOrders.map(o => o.customerId))
  const scopedIntegratorIds = new Set(scopedOrders.map(o => o.integratorId))
  const scopedCustomers = product === 'all' ? customers : customers.filter(c => scopedCustomerIds.has(c.id))
  const scopedIntegrators = product === 'all' ? integrators : integrators.filter(i => scopedIntegratorIds.has(i.id))
  const scopedEnvironments = product === 'all' ? customerEnvironments : customerEnvironments.filter(e => scopedCustomerIds.has(e.customerId))

  const activeIntegrators = scopedIntegrators.filter(i => i.status === 'active').length
  const scopedProtectedUsers = scopedEnvironments.reduce((s, e) => s + e.protectedUsers, 0)
  const scopedAlerts = scopedEnvironments.reduce((s, e) => s + e.alertsCount, 0)

  const kpis = [
    {
      icon: Building2,
      label: 'אינטגרטורים',
      value: scopedIntegrators.length,
      sub: `${activeIntegrators} / ${scopedIntegrators.length} פעילים`,
      badge: '+12% מחודש שעבר',
      alert: false,
    },
    {
      icon: Users,
      label: 'לקוחות',
      value: scopedCustomers.length,
      sub: `${scopedCustomers.length} לקוחות מנוהלים`,
      badge: '+12% מחודש שעבר',
      alert: false,
    },
    {
      icon: Shield,
      label: 'משתמשים מוגנים',
      value: scopedProtectedUsers.toLocaleString(),
      sub: '1,764 users protected by FortiSASE',
      badge: '+12% מחודש שעבר',
      alert: false,
    },
    {
      icon: AlertTriangle,
      label: 'התראות פעילות',
      value: scopedAlerts,
      sub: `${scopedAlerts} open alerts`,
      badge: '+12% מחודש שעבר',
      alert: scopedAlerts > 5,
    },
  ]

  const alertEnvs = scopedEnvironments.filter(e => e.alertsCount > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">סקירה כללית — Distribution Overview · {product === 'all' ? 'All Products' : product === 'sase' ? 'Forti SASE' : 'Perception Point'}</p>
      </div>

      {/* Platform Overview Banner */}
      <div className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: `linear-gradient(135deg, rgba(${config.glowRgb},0.12) 0%, rgba(${config.glowRgb},0.04) 100%)`, border: `1px solid rgba(${config.glowRgb},0.2)` }}>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-cdata-500/15 border border-cdata-500/20 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-cdata-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">C-DATA Distribution Platform</div>
            <div className="text-xs text-slate-500">FortiSASE Channel Management · {new Date().toLocaleDateString('he-IL')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
          <span className="text-xs text-emerald-400">כל המערכות פעילות</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: kpi.alert ? 'rgba(239,68,68,0.12)' : 'rgba(44,106,138,0.12)' }}
              >
                <kpi.icon className={`w-5 h-5 ${kpi.alert ? 'text-red-400' : 'text-cdata-300'}`} />
              </div>
              <span className="badge-steel text-xs">{kpi.badge}</span>
            </div>
            <div className="text-3xl font-black text-white mb-1">{kpi.value}</div>
            <div className="text-sm text-slate-500 mb-1">{kpi.label}</div>
            {kpi.sub && <div className="text-[10px] text-slate-600">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-5">
        {/* Customer Growth Chart */}
        <div className="col-span-2 glass glow-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">צמיחת לקוחות</h3>
              <p className="text-xs text-slate-500 mt-0.5">Customer Growth — 6 חודשים אחרונים</p>
            </div>
            <span className="badge-blue text-xs">2024</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2C6A8A" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2C6A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="customers" stroke="#2C6A8A" strokeWidth={2.5} fill="url(#grad1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Integrators Performance */}
        <div className="glass glow-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">ביצועי אינטגרטורים</h3>
          <div className="space-y-3">
            {scopedIntegrators.map(integ => {
              const custCount = getCustomersByIntegrator(integ.id).length
              const isHealthy = integ.status === 'active'
              return (
                <div
                  key={integ.id}
                  className="flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer hover:bg-white/[0.03]"
                  style={{ border: '1px solid rgba(255,255,255,0.05)' }}
                  onClick={() => navigate('/distribution/integrators/' + integ.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0"
                      style={{ background: 'rgba(44,106,138,0.15)' }}
                    >
                      {integ.companyName.slice(0, 2)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-white truncate">{integ.companyName}</div>
                      <div className="text-[10px] text-slate-600">{custCount} לקוחות</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {isHealthy
                      ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* FortiSASE Environment Stats */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">FortiSASE — סטטיסטיקות סביבה</h3>
          <span className="badge-blue text-xs">ftntsa.saas.fortinet.com</span>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'סביבות פעילות', value: '5', sub: 'Active Tenants', color: 'text-emerald-400' },
            { label: 'כולל מנוהל FortiSASE', value: '1,764', sub: 'Protected Users', color: 'text-cdata-300' },
            { label: 'Sites מחוברים', value: '34', sub: 'SD-WAN Sites', color: 'text-blue-400' },
            { label: 'ציות ממוצע', value: '96%', sub: 'Avg Compliance', color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <div className={`text-2xl font-black ${s.color} mb-0.5`}>{s.value}</div>
              <div className="text-xs text-white font-medium">{s.label}</div>
              <div className="text-[10px] text-slate-600">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-2 gap-5">
        {/* Recent Integrators */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">אינטגרטורים אחרונים</h3>
            <button
              onClick={() => navigate('/distribution/integrators')}
              className="text-xs text-cdata-300 hover:text-cdata-200 flex items-center gap-1 transition-colors"
            >
              כל האינטגרטורים <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {integrators.slice(-3).map(integ => (
              <div
                key={integ.id}
                className="flex items-center px-3 py-3 rounded-xl border border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors"
                onClick={() => navigate('/distribution/integrators/' + integ.id)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0 mr-3"
                  style={{ background: 'rgba(44,106,138,0.15)' }}
                >
                  {integ.companyName.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{integ.companyName}</div>
                  <div className="text-[10px] text-slate-600">{integ.contactEmail}</div>
                </div>
                <span
                  className={`text-[10px] ${
                    integ.status === 'active' ? 'badge-green' :
                    integ.status === 'onboarding' ? 'badge-amber' :
                    integ.status === 'suspended' ? 'badge-red' : 'badge-steel'
                  }`}
                >
                  {integ.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Summary */}
        <div className="glass glow-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">סיכום התראות</h3>
          {alertEnvs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">אין התראות פעילות</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alertEnvs.map(env => {
                const cust = customers.find(c => c.id === env.customerId)
                return (
                  <div
                    key={env.id}
                    className="flex items-center justify-between px-3 py-3 rounded-xl border border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${env.alertsCount > 5 ? 'text-red-400' : 'text-amber-400'}`} />
                      <div>
                        <div className="text-sm font-medium text-white">{cust ? cust.companyName : env.customerId}</div>
                        <div className="text-[10px] text-slate-600">{cust ? cust.packageName : ''}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold ${env.alertsCount > 5 ? 'text-red-400' : 'text-amber-400'}`}>
                      {env.alertsCount} התראות
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
