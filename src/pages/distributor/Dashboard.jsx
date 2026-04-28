import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2, Users, Shield, AlertTriangle, TrendingUp, CheckCircle, AlertCircle,
  LayoutDashboard, ArrowUpRight, ArrowDownRight, Bell, Zap, Mail, Clock, Banknote
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts'
import { integrators, customers, customerEnvironments, growthData, getCustomersByIntegrator, getOrdersByDistributor } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'
import KPICard from '../../components/distribution/KPICard'
import PageHeader from '../../components/distribution/PageHeader'
import ApprovalQueuePreview from '../../components/distribution/ApprovalQueuePreview'
import OnboardingHealthSection from '../../components/distribution/OnboardingHealthSection'
import ActivityFeed from '../../components/distribution/ActivityFeed'
import RevenueChartsSection from '../../components/distribution/RevenueChartsSection'
import LoadingSkeleton from '../../components/distribution/LoadingSkeleton'

// ==================== ANIMATION CONFIGS ====================

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ==================== MAIN DASHBOARD COMPONENT ====================

export default function DistributorDashboard() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const { tr, isHebrew } = useLanguage()
  const [ppOverview, setPpOverview] = useState(null)
  const [ppError, setPpError] = useState('')
  const [ppLoading, setPpLoading] = useState(false)
  const [orders, setOrders] = useState([])

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

  // Load orders for approval queue
  useEffect(() => {
    try {
      const distributorOrders = getOrdersByDistributor('d1')
      setOrders(product === 'all' ? distributorOrders : distributorOrders.filter(o => o.product === product))
    } catch (e) {
      console.error('Failed to load orders:', e)
    }
  }, [product])

  if (product !== 'sase') {
    return (
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Page Header */}
        <PageHeader
          title="Distribution Dashboard"
          subtitle="Perception Point"
          description="Live overview of all integrators, customers, orders, and onboarding"
          icon={LayoutDashboard}
        />

        {/* Error Banner */}
        {ppError && (
          <motion.div
            variants={itemVariants}
            className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {ppError}
          </motion.div>
        )}

        {/* Status Banner */}
        <motion.div
          className="rounded-xl p-4 flex items-center gap-4 border"
          style={{
            background: `linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.04) 100%)`,
            borderColor: 'rgba(16,185,129,0.3)',
          }}
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">System Status</div>
              <div className="text-xs text-slate-500">All services operational</div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-semibold">Live</span>
          </div>
        </motion.div>

        {/* KPI Cards - 2 rows */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <KPICard
            icon={Building2}
            label="Total Integrators"
            value={integrators.length}
            trend={12}
            trendDirection="up"
            explanation="Active channel partners"
            status="active"
          />

          <KPICard
            icon={Users}
            label="Active Customers"
            value={customers.length}
            trend={8}
            trendDirection="up"
            explanation="Across all integrators"
            status="active"
          />

          <KPICard
            icon={AlertTriangle}
            label="Pending Approvals"
            value={orders.filter(o => ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL'].includes(o.status)).length}
            trend={null}
            explanation="Waiting for review"
            status="warning"
          />

          <KPICard
            icon={Mail}
            label="Active PP Customers"
            value={ppOverview?.kpis?.totalCustomers || 0}
            trend={15}
            trendDirection="up"
            explanation="Perception Point deployments"
            status="active"
          />

          <KPICard
            icon={Banknote}
            label="Monthly Est. Revenue"
            value={orders.filter(o => o.status === 'ACTIVE').reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0}
            trend={18}
            trendDirection="up"
            explanation="From PP subscriptions"
            status="active"
            format="currency"
          />

          <KPICard
            icon={Shield}
            label="Mailboxes Protected"
            value={Math.floor(Math.random() * 500000) + 100000}
            trend={22}
            trendDirection="up"
            explanation="Across connected environments"
            status="active"
            format="number"
          />

          <KPICard
            icon={Zap}
            label="Avg Onboarding Days"
            value={8}
            trend={-5}
            trendDirection="down"
            explanation="Faster than last month"
            status="active"
          />

          <KPICard
            icon={AlertCircle}
            label="Failed Onboarding"
            value={orders.filter(o => o.status === 'FAILED').length}
            trend={null}
            explanation="Requires attention"
            status={orders.filter(o => o.status === 'FAILED').length > 0 ? 'critical' : 'active'}
          />
        </motion.div>

        {/* Approval Queue + Onboarding + Activity Feed */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <ApprovalQueuePreview orders={orders} onViewAll={() => navigate('/distribution/orders')} />
          <OnboardingHealthSection />
          <ActivityFeed />
        </motion.div>

        {/* Charts Section */}
        <RevenueChartsSection />
      </motion.div>
    )
  }

  // FortiSASE view
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Distributor Overview · {product === 'all' ? 'All Products' : 'FortiSASE'}</p>
      </div>

      {/* FortiSASE KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
              <Building2 className="w-5 h-5 text-cdata-300" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{scopedIntegrators.length}</div>
          <div className="text-sm text-slate-500">Integrators</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
              <Users className="w-5 h-5 text-cdata-300" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{scopedCustomers.length}</div>
          <div className="text-sm text-slate-500">Customers</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
              <Shield className="w-5 h-5 text-cdata-300" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{scopedProtectedUsers.toLocaleString()}</div>
          <div className="text-sm text-slate-500">Protected Users</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: scopedAlerts > 5 ? 'rgba(239,68,68,0.12)' : 'rgba(44,106,138,0.12)' }}>
              <AlertTriangle className={`w-5 h-5 ${scopedAlerts > 5 ? 'text-red-400' : 'text-cdata-300'}`} />
            </div>
          </div>
          <div className="text-3xl font-black text-white mb-1">{scopedAlerts}</div>
          <div className="text-sm text-slate-500">Active Alerts</div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="text-sm font-semibold text-white mb-3">Customer Growth</div>
        <ResponsiveContainer width="100%" height={180}>
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
            <Tooltip contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8, fontSize: 12 }} />
            <Area type="monotone" dataKey="customers" stroke="#2C6A8A" strokeWidth={2.5} fill="url(#grad1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
