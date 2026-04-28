import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Eye, MoreHorizontal, Building2, Shield, X, Mail, Phone,
  Users, TrendingUp, Calendar, CheckCircle, AlertCircle, RotateCcw
} from 'lucide-react'
import { integrators, getCustomersByIntegrator, getOrdersByDistributor } from '../../data/mockData'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

// ==================== ANIMATION CONFIGS ====================

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const drawerVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { x: '100%', opacity: 0, transition: { duration: 0.2 } },
}

// ==================== INTEGRATOR DETAIL DRAWER ====================

const IntegratorDetailDrawer = ({ integrator, isOpen, onClose, onCreateCustomer, tr, isHebrew }) => {
  if (!integrator) return null

  const custCount = getCustomersByIntegrator(integrator.id).length
  const ordersCount = getOrdersByDistributor(integrator.id).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-gradient-to-b from-slate-950 to-navy-900 border-l border-white/10 z-50 overflow-y-auto"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="sticky top-0 p-5 border-b border-white/10 bg-gradient-to-b from-slate-950 to-slate-950/80 backdrop-blur-sm flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{integrator.companyName}</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-6">
              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    <a href={`mailto:${integrator.contactEmail}`} className="text-sm text-cdata-400 hover:text-cdata-300 truncate">
                      {integrator.contactEmail}
                    </a>
                  </div>
                  {integrator.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <a href={`tel:${integrator.contactPhone}`} className="text-sm text-slate-300 hover:text-white">
                        {integrator.contactPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10">
                  <div className="text-xs text-slate-500 mb-1">Active Customers</div>
                  <div className="text-2xl font-bold text-white">{custCount}</div>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/10">
                  <div className="text-xs text-slate-500 mb-1">Orders</div>
                  <div className="text-2xl font-bold text-white">{ordersCount}</div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</h3>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${integrator.status === 'active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  <span className="text-sm font-semibold text-white capitalize">{integrator.status}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Created</div>
                    <div className="text-slate-300">
                      {new Date(integrator.createdAt).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-0.5">Last Activity</div>
                    <div className="text-slate-300">
                      {new Date(integrator.lastActivity).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <button
                  onClick={onCreateCustomer}
                  className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-cdata-500 to-cdata-600 hover:from-cdata-600 hover:to-cdata-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Customer
                </button>
                <button className="w-full px-4 py-2.5 rounded-lg border border-white/20 hover:border-white/40 text-slate-300 hover:text-white font-semibold text-sm transition-all">
                  Edit Integrator
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ==================== INTEGRATOR CARD ====================

const IntegratorCard = ({ integrator, onSelect, onClick, tr, isHebrew }) => {
  const custCount = getCustomersByIntegrator(integrator.id).length
  const isActive = integrator.status === 'active'

  return (
    <motion.div
      className={`glass rounded-xl p-5 border cursor-pointer transition-all hover:scale-[1.02] ${
        isActive ? 'border-emerald-500/30 hover:border-emerald-500/50' : 'border-white/10 hover:border-white/20'
      }`}
      variants={itemVariants}
      whileHover={{ y: -4 }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cdata-400 to-cdata-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {integrator.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{integrator.companyName}</h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">{integrator.contactEmail}</p>
          </div>
        </div>
        <div className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
          isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          {isActive ? 'Active' : 'Onboarding'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-xs text-slate-500">Customers</div>
          <div className="text-lg font-bold text-white">{custCount}</div>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-xs text-slate-500">Orders</div>
          <div className="text-lg font-bold text-white">{getOrdersByDistributor(integrator.id).length}</div>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="text-xs text-slate-500">Revenue</div>
          <div className="text-lg font-bold text-emerald-400">$0</div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-[10px] text-slate-600 pt-3 border-t border-white/5">
        <span>Updated {new Date(integrator.lastActivity).toLocaleDateString(isHebrew ? 'he-IL' : 'en-US')}</span>
        <button
          className="text-cdata-400 hover:text-cdata-300 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onSelect(integrator)
          }}
        >
          View Details →
        </button>
      </div>
    </motion.div>
  )
}

// ==================== MAIN COMPONENT ====================

const STATUS_TABS = ['all', 'active', 'onboarding', 'suspended']

export default function IntegratorsList() {
  const navigate = useNavigate()
  const { product, config } = useProduct()
  const { tr, isHebrew } = useLanguage()
  const [realOrders, setRealOrders] = useState([])
  const [realCustomers, setRealCustomers] = useState([])
  const [realError, setRealError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedIntegrator, setSelectedIntegrator] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (product === 'sase') return
    async function loadReal() {
      try {
        setRealError('')
        const [orders, customers] = await Promise.all([
          workspaceApi.getOrders({ distributorId: 'd1', role: 'distributor' }),
          workspaceApi.getCustomers(undefined, 'distributor'),
        ])
        const ordersList = Array.isArray(orders) ? orders : (orders?.data || [])
        const customersList = Array.isArray(customers) ? customers : (customers?.data || [])
        setRealOrders(ordersList.filter((o) => o.items?.some((i) => i.product?.code === 'WORKSPACE_SECURITY')))
        setRealCustomers(customersList.filter((c) => c.distributorId === 'dist-1'))
      } catch (e) {
        setRealError(e.message)
      }
    }
    loadReal()
  }, [product])

  const ppIntegrators = useMemo(() => {
    const map = new Map()
    realOrders.forEach((o) => {
      const entry = map.get(o.integratorId) || {
        id: o.integratorId,
        companyName: o.integrator?.organization?.name || o.integratorName || o.integratorId,
        contactName: o.integrator?.user?.name || '—',
        contactEmail: o.integrator?.user?.email || '—',
        status: 'active',
        createdAt: o.createdAt,
        lastActivity: o.updatedAt,
        customers: 0,
      }
      map.set(o.integratorId, entry)
    })
    realCustomers.forEach((c) => {
      const entry = map.get(c.integratorId) || {
        id: c.integratorId,
        companyName: c.integrator?.organization?.name || c.integratorName || c.integratorId,
        contactName: c.integrator?.user?.name || '—',
        contactEmail: c.integrator?.user?.email || '—',
        status: 'active',
        createdAt: c.createdAt,
        lastActivity: c.updatedAt,
        customers: 0,
      }
      entry.customers += 1
      map.set(c.integratorId, entry)
    })
    return Array.from(map.values())
  }, [realOrders, realCustomers])

  if (product !== 'sase') {
    const filteredReal = ppIntegrators.filter((item) =>
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.contactEmail.toLowerCase().includes(search.toLowerCase())
    )

    return (
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Integrators</h1>
            <p className="text-slate-400 text-sm">Manage channel partners and their customers</p>
            {realError && (
              <div className="mt-2 text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {realError}
              </div>
            )}
          </div>
          <motion.button
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-cdata-500 to-cdata-600 hover:from-cdata-600 hover:to-cdata-700 text-white font-semibold text-sm flex items-center gap-2 whitespace-nowrap transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/distribution/integrators/new')}
          >
            <Plus className="w-4 h-4" />
            Add Integrator
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search integrator..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cdata-500/50"
            />
          </div>
          <button
            onClick={() => setSearch('')}
            className="px-3 py-2.5 rounded-lg border border-white/20 hover:border-white/40 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </motion.div>

        {/* Integrators Grid */}
        {filteredReal.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="col-span-full text-center py-16 rounded-xl border border-white/10 bg-white/[0.02]"
          >
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-400 mb-1">No integrators found</p>
            <p className="text-sm text-slate-500 mb-4">Try adjusting your search or create a new integrator</p>
            <button
              className="px-4 py-2 rounded-lg bg-cdata-500/20 border border-cdata-500/30 text-cdata-400 hover:text-cdata-300 text-sm font-semibold transition-colors"
              onClick={() => navigate('/distribution/integrators/new')}
            >
              Create First Integrator
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredReal.map((integrator) => (
              <IntegratorCard
                key={integrator.id}
                integrator={integrator}
                onClick={() => {
                  setSelectedIntegrator(integrator)
                  setDrawerOpen(true)
                }}
                onSelect={(integ) => {
                  setSelectedIntegrator(integ)
                  setDrawerOpen(true)
                }}
                tr={tr}
                isHebrew={isHebrew}
              />
            ))}
          </motion.div>
        )}

        {/* Detail Drawer */}
        <IntegratorDetailDrawer
          integrator={selectedIntegrator}
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onCreateCustomer={() => navigate('/distribution/integrators/new')}
          tr={tr}
          isHebrew={isHebrew}
        />
      </motion.div>
    )
  }

  // FortiSASE view (original)
  const distributorOrders = getOrdersByDistributor('d1')
  const scopedIntegratorIds = product === 'all'
    ? null
    : new Set(distributorOrders.filter(o => o.product === product).map(o => o.integratorId))
  const scopedIntegrators = product === 'all'
    ? integrators
    : integrators.filter(i => scopedIntegratorIds.has(i.id))

  const filtered = scopedIntegrators.filter(item => {
    const matchSearch =
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.contactEmail.toLowerCase().includes(search.toLowerCase())
    const matchStatus = activeTab === 'all' || item.status === activeTab
    return matchSearch && matchStatus
  })

  const totalCount = scopedIntegrators.length
  const activeCount = scopedIntegrators.filter(i => i.status === 'active').length
  const onboardingCount = scopedIntegrators.filter(i => i.status === 'onboarding').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Integrators</h1>
          <p className="text-slate-500 text-sm mt-0.5">Integrators Management · FortiSASE</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={() => navigate('/distribution/integrators/new')}
        >
          <Plus className="w-4 h-4" />
          Add Integrator
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Integrators', value: totalCount, icon: Building2, color: 'text-cdata-300', bg: 'rgba(44,106,138,0.12)' },
          { label: 'Active', value: activeCount, icon: Building2, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.10)' },
          { label: 'Onboarding', value: onboardingCount, icon: Building2, color: 'text-amber-400', bg: 'rgba(245,158,11,0.10)' },
          { label: 'Active Environments', value: distributorOrders.filter(o => product === 'all' || o.product === product).length, icon: Shield, color: 'text-cdata-300', bg: 'rgba(44,106,138,0.15)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search integrator..."
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
          <div className="col-span-2">Integrator</div>
          <div>Contact</div>
          <div>Customers</div>
          <div>Status</div>
          <div>Last Activity</div>
          <div>Created</div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-slate-700 mb-3" />
            <p className="text-sm font-medium text-slate-400">No results found</p>
          </div>
        ) : (
          filtered.map((item) => {
            const custCount = getCustomersByIntegrator(item.id).length
            return (
              <div
                key={item.id}
                className="grid grid-cols-7 items-center px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors group"
                onClick={() => navigate('/distribution/integrators/' + item.id)}
              >
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(44,106,138,0.15)', border: '1px solid rgba(44,106,138,0.2)' }}
                  >
                    {item.companyName.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{item.companyName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.contactEmail}</div>
                  </div>
                </div>
                <div className="text-sm text-slate-400 truncate">{item.contactName}</div>
                <div className="text-sm font-medium text-white">{custCount}</div>
                <div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    item.status === 'active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    item.status === 'onboarding' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    item.status === 'suspended' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                    'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      item.status === 'active' ? 'bg-emerald-400' :
                      item.status === 'onboarding' ? 'bg-amber-400' :
                      item.status === 'suspended' ? 'bg-red-400' : 'bg-slate-400'
                    }`} />
                    {item.status === 'active' ? 'Active' : item.status === 'onboarding' ? 'Onboarding' : item.status === 'suspended' ? 'Suspended' : item.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500">{new Date(item.lastActivity).toLocaleDateString()}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
