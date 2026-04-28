import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Download, Banknote, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { integrators, customers, getOrdersByDistributor } from '../../data/mockData'
import PageHeader from '../../components/distribution/PageHeader'
import DarkTable from '../../components/distribution/DarkTable'

const chartData = [
  { month: 'Jan', revenue: 12000, customers: 45, mailboxes: 4500 },
  { month: 'Feb', revenue: 19000, customers: 52, mailboxes: 6200 },
  { month: 'Mar', revenue: 15000, customers: 58, mailboxes: 5800 },
  { month: 'Apr', revenue: 25000, customers: 72, mailboxes: 8100 },
  { month: 'May', revenue: 22000, customers: 89, mailboxes: 9200 },
  { month: 'Jun', revenue: 30000, customers: 105, mailboxes: 11500 },
]

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function Reports() {
  const orders = getOrdersByDistributor('d1')
  const activeOrders = orders.filter(o => o.status === 'ACTIVE')
  const totalRevenue = activeOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const totalMailboxes = orders.reduce((sum, o) => sum + (o.estimatedUsers || 0), 0)
  const avgRevenuePerCustomer = customers.length > 0 ? totalRevenue / customers.length : 0

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title="Reports"
        subtitle="Analytics & Insights"
        description="Business intelligence and operational reports"
        icon={BarChart3}
      />

      {/* KPI Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={pageVariants}
      >
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-blue-400' },
          { label: 'Protected Mailboxes', value: (totalMailboxes / 1000).toFixed(1) + 'k', icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Monthly Est. Revenue', value: '$' + (totalRevenue / 1000).toFixed(1) + 'k', icon: Banknote, color: 'text-amber-400' },
          { label: 'Avg Revenue/Customer', value: '$' + Math.round(avgRevenuePerCustomer), icon: TrendingUp, color: 'text-purple-400' },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              className="glass rounded-xl p-6 border border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1">{item.value}</div>
              <div className="text-xs text-slate-400">{item.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={pageVariants}
      >
        {/* Revenue Trend */}
        <motion.div
          className="glass rounded-xl p-6 border border-white/10"
          variants={itemVariants}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#0B1929', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Distribution by Integrator */}
        <motion.div
          className="glass rounded-xl p-6 border border-white/10"
          variants={itemVariants}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Customer Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={integrators.slice(0, 5).map((integ, idx) => ({
                  name: integ.companyName,
                  value: Math.floor(Math.random() * 30) + 5
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {['#2C6A8A', '#059669', '#0ea5e9', '#f59e0b', '#ec4899'].map((color, idx) => (
                  <Cell key={idx} fill={color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Report Tables */}
      <motion.div
        className="space-y-6"
        variants={pageVariants}
      >
        {/* Integrator Performance Report */}
        <motion.div
          className="glass rounded-xl p-6 border border-white/10"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Integrator Performance</h3>
              <p className="text-xs text-slate-400 mt-1">Revenue and customer metrics by partner</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
          <DarkTable
            columns={[
              { key: 'name', label: 'Integrator', width: '35%' },
              { key: 'customers', label: 'Customers', width: '20%' },
              { key: 'revenue', label: 'Monthly Revenue', width: '20%' },
              { key: 'status', label: 'Status', width: '25%', render: (val) => (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active
                </span>
              )}
            ]}
            data={integrators.slice(0, 5).map(i => ({
              name: i.companyName,
              customers: Math.floor(Math.random() * 20) + 5,
              revenue: '$' + (Math.floor(Math.random() * 50) + 10) + 'k',
            }))}
          />
        </motion.div>

        {/* Onboarding Status Report */}
        <motion.div
          className="glass rounded-xl p-6 border border-white/10"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">Onboarding Status Summary</h3>
              <p className="text-xs text-slate-400 mt-1">Customer provisioning pipeline</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Not Started', count: 3, color: 'text-slate-400' },
              { label: 'In Progress', count: 15, color: 'text-blue-400' },
              { label: 'Active', count: 24, color: 'text-emerald-400' },
              { label: 'Failed', count: 2, color: 'text-red-400' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
                <div className={`text-lg font-black mb-1 ${item.color}`}>{item.count}</div>
                <div className="text-xs text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
