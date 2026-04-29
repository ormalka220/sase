import React from 'react'
import { motion } from 'framer-motion'
import { Users, ShoppingCart, CheckCircle, TrendingUp, Plus, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { getCommonLabels } from '../../i18n/labels'
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
  const { tr } = useLanguage()
  const labels = getCommonLabels(tr)

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title={labels.navigation.dashboard}
        subtitle={labels.integratorDashboard.salesAndOpsHub}
        description={tr('סקירה כללית של הלקוחות, ההזמנות והקליטה שלך', 'Overview of your customers, orders, and onboarding progress')}
        icon={ShoppingCart}
      />

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={pageVariants}
      >
        <KPICard
          icon={Users}
          label={labels.integrator.activeCustomersCount}
          value={12}
          trend={3}
          trendDirection="up"
          explanation={tr('בכל המוצרים', 'Across all products')}
          status="active"
        />
        <KPICard
          icon={ShoppingCart}
          label={labels.integrator.pendingOrdersCount}
          value={2}
          trend={null}
          explanation={tr('ממתינים לאישור CData', 'Waiting for CData approval')}
          status="warning"
        />
        <KPICard
          icon={CheckCircle}
          label={labels.navigation.onboarding}
          value={5}
          trend={null}
          explanation={tr('לקוחות בהקמה', 'Customers in setup')}
          status="info"
        />
        <KPICard
          icon={TrendingUp}
          label={tr('הכנסה חודשית משוערת', 'Est. Monthly Revenue')}
          value={45000}
          trend={12}
          trendDirection="up"
          explanation={tr('מנויים פעילים', 'From active subscriptions')}
          status="active"
          format="currency"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemVariants}>
        <button
          onClick={() => navigate('/integrator/customers/new')}
          className="glass rounded-xl p-6 border border-cdata-500/30 hover:border-cdata-500/50 hover:bg-cdata-500/5 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <Users className="w-6 h-6 text-cdata-400 group-hover:text-cdata-300" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cdata-400 transform group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">{labels.integrator.createCustomer}</h3>
          <p className="text-sm text-slate-400">{tr('הוסף לקוח חדש והקם את מנוי Perception Point שלהם', 'Add a new customer and set up their Perception Point subscription')}</p>
        </button>

        <button
          onClick={() => navigate('/integrator/orders/new')}
          className="glass rounded-xl p-6 border border-cdata-500/30 hover:border-cdata-500/50 hover:bg-cdata-500/5 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-3">
            <ShoppingCart className="w-6 h-6 text-cdata-400 group-hover:text-cdata-300" />
            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cdata-400 transform group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">{labels.navigation.orders}</h3>
          <p className="text-sm text-slate-400">{tr('צור הזמנת Perception Point עבור לקוח קיים', 'Create a Perception Point order for an existing customer')}</p>
        </button>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10"
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold text-white mb-4">{labels.integratorDashboard.recentActivity}</h3>
        <div className="space-y-3">
          {[
            { event: tr('הזמנה אושרה', 'Order Approved'), customer: 'Acme Corp', time: tr('לפני שעתיים', '2 hours ago'), icon: CheckCircle },
            { event: tr('אדמין הוזמן', 'Admin Invited'), customer: 'TechFlow Inc', time: tr('לפני 5 שעות', '5 hours ago'), icon: Users },
            { event: tr('הזמנה הוגשה', 'Order Submitted'), customer: 'SecureNet', time: tr('לפני יום', '1 day ago'), icon: ShoppingCart },
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
