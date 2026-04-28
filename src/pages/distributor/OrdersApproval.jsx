import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Search, RotateCcw, AlertTriangle } from 'lucide-react'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'
import { getOrdersByDistributor } from '../../data/mockData'
import PageHeader from '../../components/distribution/PageHeader'
import OrderCard from '../../components/distribution/OrderCard'
import EmptyState from '../../components/distribution/EmptyState'
import LoadingSkeleton from '../../components/distribution/LoadingSkeleton'

const PENDING_STATUSES = ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL']
const APPROVED_STATUSES = ['APPROVED', 'APPROVED_BY_CDATA', 'READY_FOR_ONBOARDING', 'ACTIVE']
const REJECTED_STATUSES = ['REJECTED', 'REJECTED_BY_CDATA', 'CANCELLED']
const FAILED_STATUSES = ['FAILED', 'PROVISIONING_FAILED']

const tabs = [
  { id: 'pending', label: 'Pending CData Approval', icon: '⏳' },
  { id: 'approved', label: 'Approved / Active', icon: '✓' },
  { id: 'rejected', label: 'Rejected / Cancelled', icon: '✕' },
  { id: 'failed', label: 'Failed Provisioning', icon: '⚠' },
  { id: 'all', label: 'All Orders', icon: '📋' },
]

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

export default function OrdersApproval() {
  const { product } = useProduct()
  const { tr } = useLanguage()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const [search, setSearch] = useState('')

  // Load orders
  useEffect(() => {
    setLoading(true)
    try {
      const data = getOrdersByDistributor('d1')
      const filtered = product === 'all' ? data : data.filter(o => o.product === product)
      setOrders(filtered)
    } finally {
      setLoading(false)
    }
  }, [product])

  // Filter orders based on tab and search
  const getFilteredOrders = () => {
    let filtered = orders

    // Filter by tab
    switch (activeTab) {
      case 'pending':
        filtered = filtered.filter(o => PENDING_STATUSES.includes(o.status))
        break
      case 'approved':
        filtered = filtered.filter(o => APPROVED_STATUSES.includes(o.status))
        break
      case 'rejected':
        filtered = filtered.filter(o => REJECTED_STATUSES.includes(o.status))
        break
      case 'failed':
        filtered = filtered.filter(o => FAILED_STATUSES.includes(o.status))
        break
      default:
        break
    }

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase()
      filtered = filtered.filter(o =>
        o.id.toLowerCase().includes(query) ||
        o.customer?.companyName?.toLowerCase().includes(query) ||
        o.integrator?.organization?.name?.toLowerCase().includes(query)
      )
    }

    return filtered
  }

  const filteredOrders = getFilteredOrders()
  const pendingCount = orders.filter(o => PENDING_STATUSES.includes(o.status)).length

  const handleApprove = async (orderId) => {
    try {
      await workspaceApi.approveOrder(orderId)
      // Reload orders
      const data = getOrdersByDistributor('d1')
      setOrders(product === 'all' ? data : data.filter(o => o.product === product))
    } catch (error) {
      console.error('Failed to approve order:', error)
    }
  }

  const handleReject = async (orderId, reason) => {
    try {
      await workspaceApi.rejectOrder(orderId, { reason })
      // Reload orders
      const data = getOrdersByDistributor('d1')
      setOrders(product === 'all' ? data : data.filter(o => o.product === product))
    } catch (error) {
      console.error('Failed to reject order:', error)
    }
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title="Orders & Approvals"
        subtitle="Perception Point"
        description="Review and approve integrator orders for new customer provisioning"
        icon={ShoppingCart}
        status={pendingCount > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold text-amber-400">{pendingCount} pending</span>
          </div>
        )}
      />

      {/* KPI Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={pageVariants}
      >
        {tabs.map((tab) => {
          let count = 0
          switch (tab.id) {
            case 'pending':
              count = orders.filter(o => PENDING_STATUSES.includes(o.status)).length
              break
            case 'approved':
              count = orders.filter(o => APPROVED_STATUSES.includes(o.status)).length
              break
            case 'rejected':
              count = orders.filter(o => REJECTED_STATUSES.includes(o.status)).length
              break
            case 'failed':
              count = orders.filter(o => FAILED_STATUSES.includes(o.status)).length
              break
            case 'all':
              count = orders.length
              break
            default:
              break
          }

          const isActive = activeTab === tab.id
          const colors = {
            pending: { bg: 'bg-amber-500/15', border: 'border-amber-500/30', text: 'text-amber-400' },
            approved: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400' },
            rejected: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400' },
            failed: { bg: 'bg-red-500/15', border: 'border-red-500/30', text: 'text-red-400' },
            all: { bg: 'bg-blue-500/15', border: 'border-blue-500/30', text: 'text-blue-400' },
          }
          const color = colors[tab.id] || colors.all

          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`glass rounded-xl p-4 text-left transition-all ${color.bg} ${color.border} border ${isActive ? 'ring-2 ring-offset-2 ring-offset-navy-900' : 'opacity-70 hover:opacity-100'}`}
              style={isActive ? { ringColor: color.text } : {}}
              whileHover={{ scale: 1.02 }}
              variants={itemVariants}
            >
              <div className={`text-2xl font-black mb-1 ${color.text}`}>{count}</div>
              <div className="text-xs text-slate-400 font-medium">{tab.label}</div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="glass rounded-xl p-4 border border-white/10 flex items-center gap-3"
        variants={itemVariants}
      >
        <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, customer name, or integrator..."
          className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Clear
          </button>
        )}
      </motion.div>

      {/* Orders List */}
      {loading ? (
        <LoadingSkeleton type="table" count={3} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title={search ? 'No matching orders' : 'No orders in this category'}
          description={search ? 'Try adjusting your search terms' : 'Switch to another tab to see orders'}
          action={search ? () => setSearch('') : null}
          actionLabel="Clear search"
        />
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          {filteredOrders.map((order) => (
            <motion.div key={order.id} variants={itemVariants}>
              <OrderCard
                order={order}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
