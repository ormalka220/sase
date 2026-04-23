import React, { useState } from 'react'
import { FileText, Download, TrendingUp, BarChart as BarChartIcon, Calendar } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import { growthData, integrators, getCustomersByIntegrator } from '../../data/mockData'

const integratorBarData = integrators.map(integ => ({
  name: integ.companyName.split(' ')[0],
  customers: getCustomersByIntegrator(integ.id).length,
}))

const reportsList = [
  {
    name: 'דוח פעילות אינטגרטורים — ינואר 2024',
    description: 'סיכום חודשי של כל הפעילות תחת המפיץ',
    date: '01/01/2024',
    size: '1.2 MB',
  },
  {
    name: 'דוח לקוחות ורישיונות — Q4 2023',
    description: 'ניתוח שימוש ברישיונות וצמיחת לקוחות',
    date: '01/10/2023',
    size: '890 KB',
  },
  {
    name: 'דוח אבטחה ותאימות — דצמבר 2023',
    description: 'ניתוח ציוני תאימות והתראות לפי לקוח',
    date: '01/12/2023',
    size: '540 KB',
  },
]

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">דוחות</h1>
          <p className="text-slate-500 text-sm mt-0.5">ניהול דוחות מפיץ</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-steel text-xs flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            ינואר 2024
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        {/* Customer Growth AreaChart */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">צמיחת לקוחות</h3>
              <p className="text-xs text-slate-500 mt-0.5">Customer Growth — 6 חודשים אחרונים</p>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
              <TrendingUp className="w-4 h-4 text-cdata-300" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="reportsGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2C6A8A" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2C6A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="customers" stroke="#2C6A8A" strokeWidth={2.5} fill="url(#reportsGrad1)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Customers per integrator BarChart */}
        <div className="glass glow-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">לקוחות לפי אינטגרטור</h3>
              <p className="text-xs text-slate-500 mt-0.5">Customers per Integrator</p>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
              <BarChartIcon className="w-4 h-4 text-cdata-300" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={integratorBarData} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: 'rgba(44,106,138,0.08)' }}
              />
              <Bar dataKey="customers" fill="#2C6A8A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Downloadable reports */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-white">דוחות להורדה</h3>
            <p className="text-xs text-slate-500 mt-0.5">Downloadable Reports</p>
          </div>
          <span className="text-xs text-slate-600">{reportsList.length} דוחות זמינים</span>
        </div>

        <div className="space-y-3">
          {reportsList.map((report, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl transition-colors hover:bg-white/[0.02]"
              style={{ border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(44,106,138,0.12)' }}
              >
                <FileText className="w-5 h-5 text-cdata-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{report.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{report.description}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {report.date}
                  </span>
                  <span className="text-[10px] text-slate-600">{report.size}</span>
                </div>
              </div>
              <button className="btn-ghost text-xs flex items-center gap-1.5 flex-shrink-0">
                <Download className="w-3.5 h-3.5" />
                הורד PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
