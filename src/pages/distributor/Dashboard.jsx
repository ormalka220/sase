import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Users, Shield, AlertTriangle, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import { integrators, customers, customerEnvironments, growthData, getCustomersByIntegrator } from '../../data/mockData'

const totalProtectedUsers = customerEnvironments.reduce((s, e) => s + e.protectedUsers, 0)
const totalAlerts = customerEnvironments.reduce((s, e) => s + e.alertsCount, 0)

export default function DistributorDashboard() {
  const navigate = useNavigate()

  const kpis = [
    {
      icon: Building2,
      label: 'אינטגרטורים',
      value: integrators.length,
      badge: '+12% מחודש שעבר',
      alert: false,
    },
    {
      icon: Users,
      label: 'לקוחות',
      value: customers.length,
      badge: '+12% מחודש שעבר',
      alert: false,
    },
    {
      icon: Shield,
      label: 'משתמשים מוגנים',
      value: totalProtectedUsers.toLocaleString(),
      badge: '+12% מחודש שעבר',
      alert: false,
    },
    {
      icon: AlertTriangle,
      label: 'התראות פעילות',
      value: totalAlerts,
      badge: '+12% מחודש שעבר',
      alert: totalAlerts > 5,
    },
  ]

  const alertEnvs = customerEnvironments.filter(e => e.alertsCount > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">סקירה כללית — Distribution Overview</p>
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
            <div className="text-sm text-slate-500">{kpi.label}</div>
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
            {integrators.map(integ => {
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
