import React, { useEffect, useState } from 'react'
import { FileText, Download, BarChart2, Users, Shield } from 'lucide-react'
import { AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area } from 'recharts'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'

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
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (product === 'sase') {
      setLoading(false)
      return
    }
    async function loadSummary() {
      try {
        setLoading(true)
        setError('')
        const data = await workspaceApi.getPpReportsSummary({ integratorId: INTEGRATOR_ID, role: 'integrator' })
        setSummary(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadSummary()
  }, [product])

  if (product === 'sase') {
    return <div className="glass rounded-xl p-5 border border-white/10 text-sm text-slate-300">דוחות אמת זמינים כרגע רק ל-Perception Point.</div>
  }

  const totals = summary?.totals || { customers: 0, activeCustomers: 0 }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">דוחות</h1>
          <p className="text-slate-500 text-sm mt-0.5">דוחות אינטגרטור · Perception Point</p>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">עודכן לאחרונה:</span>
          <span className="text-xs text-slate-300">15 ינואר 2024</span>
        </div>
      </div>

      {/* KPI mini row */}
      <div className="grid grid-cols-3 gap-4">
          {[
          { label: 'סה"כ לקוחות', value: totals.customers, icon: Users, color: 'text-cdata-300', bg: 'bg-cdata-500/15' },
          { label: 'לקוחות פעילים', value: totals.activeCustomers, icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
          { label: 'דוחות זמינים', value: (summary?.downloadableReports || []).length, icon: FileText, color: 'text-amber-400', bg: 'bg-amber-600/15' },
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
            <span className="text-xs font-semibold" style={{ color: config.navActiveColor }}>{totals.customers} לקוחות</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={summary?.recentOrders || []} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="rptGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.primaryColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={config.primaryColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="id" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
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
              dataKey="seats"
              stroke={config.primaryColor}
              strokeWidth={2}
              fill="url(#rptGrad)"
              name="Seats"
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
          {loading ? (
            <div className="px-5 py-6 text-xs text-slate-500">טוען דוחות...</div>
          ) : (summary?.downloadableReports || []).map(r => (
            <div
              key={r.id}
              className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-cdata-500/15 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-cdata-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white">{r.title}</div>
                <div className="text-xs text-slate-500 mt-0.5 truncate">נוצר מנתוני אמת של Perception Point</div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">Realtime</div>
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
