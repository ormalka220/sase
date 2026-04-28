import React from 'react'
import { motion } from 'framer-motion'
import { Users, ShoppingCart, CheckCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import KPICard from '../../components/distribution/KPICard'
import PageHeader from '../../components/distribution/PageHeader'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function IntegratorDashboard() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Sales & Operations Hub"
        description="Overview of your customers, orders, and onboarding progress"
        icon={ShoppingCart}
      />

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={pageVariants}
      >
        <KPICard
          icon={Users}
          label="Active Customers"
          value={12}
          trend={3}
          trendDirection="up"
          explanation="Across all products"
          status="active"
        />
        <KPICard
          icon={ShoppingCart}
          label="Pending Orders"
          value={2}
          trend={null}
          explanation="Waiting for CData approval"
          status="warning"
        />
        <KPICard
          icon={CheckCircle}
          label="Onboarding"
          value={5}
          trend={null}
          explanation="Customers in setup"
          status="info"
        />
        <KPICard
          icon={TrendingUp}
          label="Est. Monthly Revenue"
          value={45000}
          trend={12}
          trendDirection="up"
          explanation="From active subscriptions"
          status="active"
          format="currency"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
        <button
          onClick={() => navigate('/integrator/customers/create')}
          className="glass rounded-xl p-6 border border-cdata-500/30 hover:border-cdata-500/50 hover:bg-cdata-500/5 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <Users className="w-6 h-6 text-cdata-400 group-hover:text-cdata-300" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cdata-400 transform group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Create Customer</h3>
          <p className="text-sm text-slate-400">Add a new customer and set up their Perception Point subscription</p>
        </button>

        <button
          onClick={() => navigate('/integrator/orders/create')}
          className="glass rounded-xl p-6 border border-cdata-500/30 hover:border-cdata-500/50 hover:bg-cdata-500/5 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <ShoppingCart className="w-6 h-6 text-cdata-400 group-hover:text-cdata-300" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cdata-400 transform group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Create Order</h3>
          <p className="text-sm text-slate-400">Create a Perception Point order for an existing customer</p>
        </button>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10"
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { event: 'Order Approved', customer: 'Acme Corp', time: '2 hours ago', icon: CheckCircle },
            { event: 'Admin Invited', customer: 'TechFlow Inc', time: '5 hours ago', icon: Users },
            { event: 'Order Submitted', customer: 'SecureNet', time: '1 day ago', icon: ShoppingCart },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors">
                <Icon className="w-4 h-4 text-slate-500" />
                <div className="flex-1">
                  <div className="text-sm text-white">{item.event}</div>
                  <div className="text-xs text-slate-500">{item.customer}</div>
                </div>
                <span className="text-xs text-slate-600">{item.time}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
