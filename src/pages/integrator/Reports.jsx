import React from 'react'
import { FileText, Download, BarChart2, Users, Shield } from 'lucide-react'
import {
  AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area,
} from 'recharts'
import { growthData, getCustomersByIntegrator, getOrdersByIntegrator } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'

const INTEGRATOR_ID = 'i1'

const reports = [
  {
    id: 'monthly',
    icon: FileText,
    title: 'סיכום חודשי',
    desc: 'דוח כולל על פעילות הלקוחות, התראות ואירועי אבטחה',
    date: 'ינואר 2024',
    type: 'PDF',
    color: 'text-cdata-300',
    bg: 'bg-cdata-500/15',
  },
  {
    id: 'health',
    icon: Shield,
    title: 'דוח בריאות לקוחות',
    desc: 'ציוני compliance, סטטוס גייטוויי ועמידה בפוליסי לכל לקוח',
    date: 'ינואר 2024',
    type: 'PDF',
    color: 'text-emerald-400',
    bg: 'bg-emerald-600/15',
  },
  {
    id: 'licenses',
    icon: Users,
    title: 'ניצול רישיונות',
    desc: 'מעקב שימוש ברישיונות SASE, עלייה וירידה לפי לקוח',
    date: 'ינואר 2024',
    type: 'Excel',
    color: 'text-amber-400',
    bg: 'bg-amber-600/15',
  },
]

export default function IntegratorReports() {
  const { product, config } = useProduct()
  const myCustomers = getCustomersByIntegrator(INTEGRATOR_ID)
  const integratorOrders = getOrdersByIntegrator(INTEGRATOR_ID)
  const scopedCustomerIds = product === 'all'
    ? null
    : new Set(integratorOrders.filter(o => o.product === product).map(o => o.customerId))
  const scopedCustomers = product === 'all'
    ? myCustomers
    : myCustomers.filter(c => scopedCustomerIds.has(c.id))
  const activeCount = scopedCustomers.filter(c => c.status === 'active').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">דוחות</h1>
          <p className="text-slate-500 text-sm mt-0.5">דוחות אינטגרטור · {product === 'all' ? 'All Products' : product === 'sase' ? 'Forti SASE' : 'Perception Point'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">עודכן לאחרונה:</span>
          <span className="text-xs text-slate-300">15 ינואר 2024</span>
        </div>
      </div>

      {/* KPI mini row */}
      <div className="grid grid-cols-3 gap-4">
          {[
          { label: 'סה"כ לקוחות', value: scopedCustomers.length, icon: Users, color: 'text-cdata-300', bg: 'bg-cdata-500/15' },
          { label: 'לקוחות פעילים', value: activeCount, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
          { label: 'דוחות זמינים', value: reports.length, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-600/15' },
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

      {/* Growth chart */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-white">צמיחת לקוחות</div>
            <div className="text-xs text-slate-500">6 חודשים אחרונים</div>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" style={{ color: config.navActiveColor }} />
            <span className="text-xs font-semibold" style={{ color: config.navActiveColor }}>{growthData[growthData.length - 1].customers} לקוחות</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={growthData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="rptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.primaryColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={config.primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: '#0d1f2d',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: config.navActiveColor }}
            />
            <Area
              type="monotone"
              dataKey="customers"
              stroke={config.primaryColor}
              strokeWidth={2}
              fill="url(#rptGrad)"
              name="לקוחות"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Reports list */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <div className="text-sm font-semibold text-white">דוחות זמינים</div>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {reports.map(r => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${r.bg} flex items-center justify-center flex-shrink-0`}>
                <r.icon className={`w-5 h-5 ${r.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{r.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">{r.desc}</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">{r.date}</div>
                  <div className="text-[10px] text-slate-600">{r.type}</div>
                </div>
                <button className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-3">
                  <Download className="w-3.5 h-3.5" />
                  הורדה
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
