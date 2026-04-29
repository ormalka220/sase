import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Plus, Search, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProduct } from '../../context/ProductContext'
import { useLanguage } from '../../context/LanguageContext'
import PageHeader from '../../components/distribution/PageHeader'
import IntegratorCard from '../../components/distribution/IntegratorCard'
import EmptyState from '../../components/distribution/EmptyState'
import LoadingSkeleton from '../../components/distribution/LoadingSkeleton'
import { workspaceApi } from '../../api/workspaceApi'

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
  const { tr } = useLanguage()
  const [integratorsState, setIntegratorsState] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadIntegrators() {
      try {
        setLoading(true)
        setError('')
        const res = await workspaceApi.getIntegrators({ limit: 200 })
        const list = Array.isArray(res) ? res : (res?.data || [])
        const mapped = list.map((i) => ({
          id: i.id,
          companyName: i.organization?.name || i.id,
          contactName: i.organization?.name || '—',
          contactEmail: i.contactEmail || '—',
          phone: i.contactPhone || '—',
          country: i.country || '—',
          status: 'active',
          partnerCode: i.id,
          createdAt: i.createdAt,
          customerCount: i._count?.customers || 0,
          orderCount: i._count?.orders || 0,
        }))
        setIntegratorsState(mapped)
      } catch (e) {
        setError(e.message || tr('טעינת אינטגרטורים נכשלה', 'Failed to load integrators'))
      } finally {
        setLoading(false)
      }
    }
    loadIntegrators()
  }, [])

  const getFilteredIntegrators = () => {
    let filtered = integratorsState

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

  function handleDeleteIntegrator(integrator) {
    const ok = window.confirm(
      tr(
        `למחוק את ${integrator.companyName}? פעולה זו תסיר את האינטגרטור מהרשימה.`,
        `Delete ${integrator.companyName}? This will remove the integrator from the list.`
      )
    )
    if (!ok) return
    setIntegratorsState((prev) => prev.filter((i) => i.id !== integrator.id))
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
        title={tr('אינטגרטורים', 'Integrators')}
        subtitle={tr('שותפי ערוץ', 'Channel Partners')}
        description={tr('נהל את כל האינטגרטורים ואת תיקי הלקוחות שלהם', 'Manage all integrators and their customer portfolios')}
        icon={Building2}
        action={
          <button
            onClick={() => navigate('/distribution/integrators/new')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-semibold text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            {tr('צור אינטגרטור', 'Create Integrator')}
          </button>
        }
      />
      {error && <div className="text-xs text-red-400">{error}</div>}

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
            placeholder={tr('חיפוש לפי שם, אימייל או מזהה...', 'Search by name, email, or ID...')}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-500 font-medium">{tr('סטטוס:', 'Status:')}</span>
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
              {status === 'all'
                ? tr('הכל', 'All')
                : status === 'active'
                  ? tr('פעיל', 'Active')
                  : status === 'inactive'
                    ? tr('לא פעיל', 'Inactive')
                    : tr('מושהה', 'Suspended')}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Integrators Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : filteredIntegrators.length === 0 ? (
        <EmptyState
          title={integratorsState.length === 0 ? tr('אין עדיין אינטגרטורים', 'No integrators yet') : tr('אין אינטגרטורים תואמים', 'No matching integrators')}
          description={integratorsState.length === 0 ? tr('צור את האינטגרטור הראשון כדי להתחיל', 'Create your first integrator to get started') : tr('נסו להתאים את הפילטרים', 'Try adjusting your filters')}
          action={integratorsState.length === 0 ? () => navigate('/distribution/integrators/new') : null}
          actionLabel={tr('צור אינטגרטור', 'Create Integrator')}
        />
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          {filteredIntegrators.map((integrator) => {
            const monthlyRevenue = 0
            const pendingOrders = integrator.orderCount || 0

            return (
              <motion.div
                key={integrator.id}
                variants={itemVariants}
                onClick={() => navigate(`/distribution/integrators/${integrator.id}`)}
              >
                <IntegratorCard
                  integrator={integrator}
                  customerCount={integrator.customerCount || 0}
                  revenueEstimate={monthlyRevenue}
                  pendingOrders={pendingOrders}
                  onDelete={handleDeleteIntegrator}
                />
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}
