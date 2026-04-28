import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { integrators, getCustomersByIntegrator, getOrdersByIntegrator } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'
import PageHeader from '../../components/distribution/PageHeader'
import IntegratorCard from '../../components/distribution/IntegratorCard'
import EmptyState from '../../components/distribution/EmptyState'
import LoadingSkeleton from '../../components/distribution/LoadingSkeleton'

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

export default function IntegratorsList() {
  const navigate = useNavigate()
  const { product } = useProduct()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [])

  const getFilteredIntegrators = () => {
    let filtered = integrators

    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter)
    }

    if (search.trim()) {
      const query = search.toLowerCase()
      filtered = filtered.filter(i =>
        i.companyName?.toLowerCase().includes(query) ||
        i.contactEmail?.toLowerCase().includes(query) ||
        i.id?.toLowerCase().includes(query)
      )
    }

    return filtered
  }

  const filteredIntegrators = getFilteredIntegrators()

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title="Integrators"
        subtitle="Channel Partners"
        description="Manage all integrators and their customer portfolios"
        icon={Building2}
        action={
          <button
            onClick={() => navigate('/distribution/integrators/create')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Create Integrator
          </button>
        }
      />

      {/* Search and Filters */}
      <motion.div
        className="glass rounded-xl p-4 border border-white/10 space-y-4"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          {['all', 'active', 'inactive', 'suspended'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-cdata-500/25 text-cdata-300 border border-cdata-500/50'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Integrators Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : filteredIntegrators.length === 0 ? (
        <EmptyState
          title={integrators.length === 0 ? 'No integrators yet' : 'No matching integrators'}
          description={integrators.length === 0 ? 'Create your first integrator to get started' : 'Try adjusting your filters'}
          action={integrators.length === 0 ? () => navigate('/distribution/integrators/create') : null}
          actionLabel="Create Integrator"
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          {filteredIntegrators.map((integrator) => {
            const customers = getCustomersByIntegrator(integrator.id)
            const orders = getOrdersByIntegrator(integrator.id)
            const monthlyRevenue = orders
              .filter(o => o.status === 'ACTIVE')
              .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
            const pendingOrders = orders.filter(o => 
              ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL'].includes(o.status)
            ).length

            return (
              <motion.div
                key={integrator.id}
                variants={itemVariants}
                onClick={() => navigate(`/distribution/integrators/${integrator.id}`)}
              >
                <IntegratorCard
                  integrator={integrator}
                  customerCount={customers.length}
                  revenueEstimate={monthlyRevenue}
                  pendingOrders={pendingOrders}
                />
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
