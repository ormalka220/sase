import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Building2, Users, Shield, AlertTriangle, TrendingUp, CheckCircle, AlertCircle,
  LayoutDashboard, ArrowUpRight, ArrowDownRight, Bell, Zap, Mail, Clock
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line
} from 'recharts'
import { integrators, customers, customerEnvironments, growthData, getCustomersByIntegrator, getOrdersByDistributor } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

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

const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3 },
  },
}

// ==================== KPI CARD COMPONENT ====================

const KPICard = ({ icon: Icon, label, value, trend, trendDirection, explanation, status, color }) => {
  const statusColors = {
    active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    critical: 'text-red-400 bg-red-500/10 border-red-500/30',
    neutral: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  }

  return (
    <motion.div
      className={`glass rounded-xl p-5 border backdrop-blur-md ${statusColors[status]}`}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      layout
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${statusColors[status].split(' ')[1]} ${statusColors[status].split(' ')[0]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-xs font-semibold ${trendDirection === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {trendDirection === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}%
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-3xl font-black text-white mb-1">{value.toLocaleString()}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>

      {explanation && (
        <div className="text-xs text-slate-500 leading-relaxed">{explanation}</div>
      )}
    </motion.div>
  )
}

// ==================== APPROVAL QUEUE CARD ====================

const ApprovalQueuePreview = ({ orders, onViewAll }) => {
  const pendingOrders = orders.filter(o => ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL'].includes(o.status)).slice(0, 5)

  return (
    <motion.div
      className="glass rounded-xl p-5 border border-white/10 col-span-2"
      variants={itemVariants}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Approval Queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">{pendingOrders.length} orders waiting for CData review</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-cdata-400 hover:text-cdata-300 font-semibold flex items-center gap-1 transition-colors"
        >
          View all <ArrowUpRight className="w-3 h-3 rotate-45" />
        </button>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="text-center py-6">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
          <p className="text-xs text-slate-500">No pending approvals</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pendingOrders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-semibold text-white">{order.customer?.companyName || 'Unknown'}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Integrator: {order.integrator?.organization?.name || 'Unknown'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded text-[10px] font-semibold" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                    {order.billingCycle || 'Monthly'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">{order.estimatedUsers?.toLocaleString()} mailboxes</span>
                <span className="text-emerald-400 font-semibold">${(order.totalAmount || 0).toFixed(2)}/mo</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ==================== ONBOARDING HEALTH CARD ====================

const OnboardingHealthCard = () => {
  const onboardingStats = [
    { label: 'Not Started', count: 3, color: '#6b7280' },
    { label: 'Admin Invited', count: 5, color: '#0ea5e9' },
    { label: 'MS 365 Setup', count: 8, color: '#f59e0b' },
    { label: 'DNS Pending', count: 4, color: '#f59e0b' },
    { label: 'Active', count: 24, color: '#10b981' },
    { label: 'Failed', count: 2, color: '#ef4444' },
  ]

  return (
    <motion.div
      className="glass rounded-xl p-5 border border-white/10"
      variants={itemVariants}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Onboarding Status</h3>
          <p className="text-xs text-slate-400 mt-0.5">46 total customers</p>
        </div>
      </div>

      <div className="space-y-2">
        {onboardingStats.map((stat) => {
          const percentage = (stat.count / 46) * 100
          return (
            <div key={stat.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">{stat.label}</span>
                <span className="text-xs font-semibold text-white">{stat.count}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: stat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ==================== ACTIVITY FEED ====================

const ActivityFeed = () => {
  const activities = [
    { type: 'order_approved', customer: 'TechCorp Ltd', integrator: 'Global Systems', time: '2 hours ago', color: 'text-emerald-400', icon: CheckCircle },
    { type: 'admin_invited', customer: 'DataFlow Inc', integrator: 'Tech Partners', time: '5 hours ago', color: 'text-blue-400', icon: Mail },
    { type: 'ms365_connected', customer: 'SecureNet', integrator: 'Enterprise Solutions', time: '8 hours ago', color: 'text-cdata-400', icon: Zap },
    { type: 'org_created', customer: 'CloudFirst', integrator: 'Digital Leaders', time: '1 day ago', color: 'text-slate-400', icon: Building2 },
  ]

  return (
    <motion.div
      className="glass rounded-xl p-5 border border-white/10"
      variants={itemVariants}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-lg bg-slate-500/10 border border-slate-500/30">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest onboarding events</p>
        </div>
      </div>

      <div className="space-y-3">
        {activities.map((activity, idx) => {
          const ActivityIcon = activity.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors"
            >
              <div className={`p-2 rounded-lg bg-white/[0.03] ${activity.color}`}>
                <ActivityIcon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white">{activity.customer}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">by {activity.integrator}</div>
              </div>
              <span className="text-[10px] text-slate-600 flex-shrink-0">{activity.time}</span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
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
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-black text-white mb-2">Distribution Dashboard</h1>
          <p className="text-slate-400 text-sm">Perception Point · Distributor Overview</p>
          {ppError && (
            <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {ppError}
            </div>
          )}
        </motion.div>

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

        {/* KPI Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <KPICard
              icon={Building2}
              label="Integrators"
              value={integrators.length}
              trend="+12"
              trendDirection="up"
              explanation="Active channel partners"
              status="active"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              icon={Users}
              label="Total Customers"
              value={customers.length}
              trend="+8"
              trendDirection="up"
              explanation="Across all integrators"
              status="active"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              icon={AlertTriangle}
              label="Pending Approvals"
              value={orders.filter(o => ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL'].includes(o.status)).length}
              trend={null}
              explanation="Waiting for review"
              status="warning"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              icon={Mail}
              label="PP Customers"
              value={ppOverview?.kpis?.totalCustomers || 0}
              trend="+15"
              trendDirection="up"
              explanation="Active Perception Point deployments"
              status="active"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              icon={TrendingUp}
              label="Monthly Est. Revenue"
              value={orders.filter(o => o.status === 'ACTIVE').reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0}
              trend="+18"
              trendDirection="up"
              explanation="From active Perception Point subscriptions"
              status="active"
              color="emerald"
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <KPICard
              icon={Shield}
              label="Mailboxes Protected"
              value={Math.floor(Math.random() * 500000) + 100000}
              trend="+22"
              trendDirection="up"
              explanation="Across all connected environments"
              status="active"
            />
          </motion.div>
        </motion.div>

        {/* Approval Queue + Onboarding Health */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          <ApprovalQueuePreview orders={orders} onViewAll={() => navigate('/distribution/orders')} />
          <OnboardingHealthCard />
          <ActivityFeed />
        </motion.div>

        {/* Charts Section */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          variants={pageVariants}
          initial="hidden"
          animate="visible"
        >
          {/* PP Revenue Chart */}
          <motion.div
            className="glass rounded-xl p-5 border border-white/10"
            variants={itemVariants}
          >
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-white">Monthly PP Revenue</h3>
              <p className="text-xs text-slate-400 mt-0.5">Est. billing by mailbox count</p>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: '#0B1929', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={2} fill="url(#gradRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Integrator Performance */}
          <motion.div
            className="glass rounded-xl p-5 border border-white/10"
            variants={itemVariants}
          >
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-white">Top Integrators</h3>
              <p className="text-xs text-slate-400 mt-0.5">By active customers</p>
            </div>

            <div className="space-y-3">
              {integrators.slice(0, 5).map((integ, idx) => {
                const custCount = getCustomersByIntegrator(integ.id).length
                return (
                  <motion.div
                    key={integ.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => navigate('/distribution/integrators/' + integ.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-cdata-500/15 border border-cdata-500/30 flex items-center justify-center flex-shrink-0 text-cdata-400 font-bold text-xs">
                        {integ.companyName.slice(0, 1)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{integ.companyName}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{custCount} customers</div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-emerald-400 flex-shrink-0">{custCount}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
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
