import React from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { TrendingUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const baseChartData = [
  { month: 'Jan', revenue: 12000, mailboxes: 4500, customers: 45 },
  { month: 'Feb', revenue: 19000, mailboxes: 6200, customers: 52 },
  { month: 'Mar', revenue: 15000, mailboxes: 5800, customers: 58 },
  { month: 'Apr', revenue: 25000, mailboxes: 8100, customers: 72 },
  { month: 'May', revenue: 22000, mailboxes: 9200, customers: 89 },
  { month: 'Jun', revenue: 30000, mailboxes: 11500, customers: 105 },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload[0]) {
    return (
      <div className="glass rounded-lg p-2 border border-white/10">
        <p className="text-xs text-slate-300">{payload[0].payload.month}</p>
        <p className="text-xs font-semibold text-emerald-400">
          ${(payload[0].value).toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export default function RevenueChartsSection() {
  const { tr, isHebrew } = useLanguage()

  const months = isHebrew
    ? { Jan: 'ינואר', Feb: 'פברואר', Mar: 'מרץ', Apr: 'אפריל', May: 'מאי', Jun: 'יוני' }
    : { Jan: 'Jan', Feb: 'Feb', Mar: 'Mar', Apr: 'Apr', May: 'May', Jun: 'Jun' }

  const chartData = baseChartData.map((d) => ({
    ...d,
    month: months[d.month] || d.month,
  }))

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 col-span-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Monthly Revenue Chart */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10 lg:col-span-2"
        whileHover={{ borderColor: 'rgba(44,106,138,0.25)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">{tr('הכנסה חודשית משוערת', 'Monthly Revenue')}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {tr('הערכת חיוב PP לפי תיבות דואר מוגנות', 'Est. PP billing by protected mailboxes')}
            </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#gradRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Top Integrators */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10"
        whileHover={{ borderColor: 'rgba(44,106,138,0.25)' }}
      >
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">{tr('אינטגרטורים מובילים', 'Top Integrators')}</h3>
          <p className="text-xs text-slate-400 mb-5">{tr('לפי לקוחות פעילים', 'By active customers')}</p>
        </div>

        <div className="space-y-3">
          {[
            { name: 'Global Systems', customers: 24, revenue: '$6,500' },
            { name: 'Tech Partners', customers: 18, revenue: '$4,200' },
            { name: 'Enterprise Solutions', customers: 16, revenue: '$3,800' },
            { name: 'Digital Leaders', customers: 14, revenue: '$3,100' },
            { name: 'Cloud Innovators', customers: 12, revenue: '$2,400' },
          ].map((integrator, idx) => (
            <motion.div
              key={integrator.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs font-semibold text-white group-hover:text-cdata-400 transition-colors truncate">
                  {integrator.name}
                </div>
                <div className="text-xs text-emerald-400 font-bold flex-shrink-0 ml-2">{integrator.revenue}</div>
              </div>
              <div className="text-[10px] text-slate-500">
                {integrator.customers} {isHebrew ? 'לקוחות' : 'customers'}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Protected Mailboxes Growth */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10"
        whileHover={{ borderColor: 'rgba(44,106,138,0.25)' }}
      >
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">{tr('תיבות דואר מוגנות', 'Protected Mailboxes')}</h3>
          <p className="text-xs text-slate-400 mb-5">{tr('מגמת צמיחה', 'Growth trend')}</p>
        </div>

        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="mailboxes" stroke="#3b82f6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Customer Growth */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10"
        whileHover={{ borderColor: 'rgba(44,106,138,0.25)' }}
      >
        <div>
          <h3 className="text-sm font-semibold text-white mb-1">{tr('צמיחת לקוחות', 'Customer Growth')}</h3>
          <p className="text-xs text-slate-400 mb-5">{tr('לקוחות חדשים בחודש', 'Monthly new customers')}</p>
        </div>

        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="customers" fill="#a855f7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}
