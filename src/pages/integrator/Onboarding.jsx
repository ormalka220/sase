import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Shield, Zap, Globe, Trophy, ChevronRight, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { workspaceApi } from '../../api/workspaceApi'
import StepCard from '../../components/integrator/StepCard'
import PageHeader from '../../components/distribution/PageHeader'

const PP_FLOW = [
  {
    key: 'PENDING_CDATA_APPROVAL',
    titleHe: 'אישור CData',
    titleEn: 'CData Approval',
    descHe: 'ממתין לאישור המפיץ',
    descEn: 'Waiting for distributor approval',
    icon: Shield,
  },
  {
    key: 'APPROVED_BY_CDATA',
    titleHe: 'אושר על ידי CData',
    titleEn: 'Approved by CData',
    descHe: 'ההזמנה אושרה ומתחיל תהליך ההקמה',
    descEn: 'Order approved and provisioning is starting',
    icon: CheckCircle,
  },
  {
    key: 'PP_ORG_CREATED',
    titleHe: 'ארגון PP נוצר',
    titleEn: 'PP Organization Created',
    descHe: 'סביבת Perception Point הוקמה',
    descEn: 'Perception Point environment is ready',
    icon: Zap,
  },
  {
    key: 'PP_ADMIN_INVITED',
    titleHe: 'אדמין הוזמן',
    titleEn: 'Admin Invited',
    descHe: 'נשלחה הזמנה למייל של האדמין',
    descEn: 'Admin invitation email was sent',
    icon: Mail,
  },
  {
    key: 'PENDING_SPOTNET_ASSIGNMENT',
    titleHe: 'ממתין להקצאת חבילה',
    titleEn: 'Pending CData Bundle Assignment',
    descHe: 'CData צריכים להקצות את החבילה שנבחרה בהזמנה',
    descEn: 'CData must assign the selected bundle before onboarding',
    icon: AlertCircle,
  },
  {
    key: 'READY_FOR_ONBOARDING',
    titleHe: 'מוכן לקליטה',
    titleEn: 'Ready for Onboarding',
    descHe: 'מוכן לחיבור Microsoft 365 / Gmail',
    descEn: 'Ready to connect Microsoft 365 / Gmail',
    icon: Globe,
  },
  {
    key: 'ACTIVE',
    titleHe: 'פעיל',
    titleEn: 'Active',
    descHe: 'השירות פעיל ומגן על תיבות דואר',
    descEn: 'Service is active and protecting mailboxes',
    icon: Trophy,
  },
]

function stepIndexForStatus(status) {
  const idx = PP_FLOW.findIndex((step) => step.key === status)
  return idx === -1 ? 0 : idx
}

function onboardingCardStatus(orderStatus) {
  if (orderStatus === 'ACTIVE') return 'COMPLETED'
  if (orderStatus === 'FAILED' || orderStatus === 'REJECTED_BY_CDATA' || orderStatus === 'CANCELLED') return 'ACTION_REQUIRED'
  return 'IN_PROGRESS'
}

function progressForStatus(orderStatus) {
  if (orderStatus === 'ACTIVE') return 100
  const idx = stepIndexForStatus(orderStatus)
  return Math.max(8, Math.round(((idx + 1) / PP_FLOW.length) * 100))
}

export default function Onboarding() {
  const navigate = useNavigate()
  const { tr } = useLanguage()
  const [orders, setOrders] = useState([])
  const [ppCustomers, setPpCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [completionPercent, setCompletionPercent] = useState(0)
  const [showConnectionModal, setShowConnectionModal] = useState(null)
  const [filterTab, setFilterTab] = useState('READY_FOR_ONBOARDING')
  const [completing, setCompleting] = useState(false)
  const ppPortalBase = import.meta.env.VITE_PP_PORTAL_URL || 'https://app.perception-point.io'

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [ordersRes, customersRes] = await Promise.all([
        workspaceApi.getOrders({ productCode: 'WORKSPACE_SECURITY', limit: 200 }),
        workspaceApi.getPpCustomersList({ limit: 500 }),
      ])
      const list = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || [])
      const ppList = Array.isArray(customersRes) ? customersRes : (customersRes?.data || [])
      setOrders(list)
      setPpCustomers(ppList)
    } catch (e) {
      setError(e.message || tr('נכשלה טעינת הזמנות קליטה', 'Failed to load onboarding orders'))
    } finally {
      setLoading(false)
    }
  }, [tr])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const ppCustomerById = useMemo(() => {
    const entries = ppCustomers.map((customer) => [customer.id, customer])
    return Object.fromEntries(entries)
  }, [ppCustomers])

  const onboardingOrders = useMemo(() => {
    return orders
      .filter((order) => (order.items || []).some((item) => item?.product?.code === 'WORKSPACE_SECURITY'))
      .map((order) => {
        const orderStatus = order.status
        const idx = stepIndexForStatus(orderStatus)
        const current = PP_FLOW[Math.min(idx, PP_FLOW.length - 1)]
        const ppCustomer = ppCustomerById[order.customerId]
        const adminEmail = ppCustomer?.adminEmail || ''
        const adminName = ppCustomer?.adminName || ''
        const ppOrgName = ppCustomer?.ppOrgName || order.customer?.companyName || ''
        const ppOrgId = ppCustomer?.ppOrgId || null
        return {
          id: order.id,
          customerId: order.customerId,
          company: order.customer?.companyName || order.customerId || tr('לקוח לא ידוע', 'Unknown Customer'),
          product: 'Perception Point',
          status: onboardingCardStatus(orderStatus),
          progress: progressForStatus(orderStatus),
          blockedStep: current ? tr(current.titleHe, current.titleEn) : tr('לא זמין', 'N/A'),
          orderStatus,
          adminEmail,
          adminName,
          ppOrgName,
          ppOrgId,
        }
      })
  }, [orders, ppCustomerById, tr])

  const filteredOrders = filterTab === 'ALL'
    ? onboardingOrders
    : onboardingOrders.filter((order) => {
      if (filterTab === 'READY_FOR_ONBOARDING') return order.orderStatus === 'READY_FOR_ONBOARDING'
      if (filterTab === 'PENDING_SPOTNET_ASSIGNMENT') return order.orderStatus === 'PENDING_SPOTNET_ASSIGNMENT'
      if (filterTab === 'COMPLETED') return order.orderStatus === 'ACTIVE'
      if (filterTab === 'ACTION_REQUIRED') return ['FAILED', 'REJECTED_BY_CDATA', 'CANCELLED'].includes(order.orderStatus)
      return order.status === filterTab
    })

  const selectedOrder = onboardingOrders.find((order) => order.id === selectedOrderId)
  const isBundleAssigned = ['READY_FOR_ONBOARDING', 'ACTIVE'].includes(selectedOrder?.orderStatus)

  useEffect(() => {
    if (!selectedOrder) return
    setCompletionPercent(selectedOrder.progress)
  }, [selectedOrder])

  const stepCards = useMemo(() => {
    const currentIdx = stepIndexForStatus(selectedOrder?.orderStatus)
    return PP_FLOW.map((step, idx) => ({
      id: idx + 1,
      key: step.key,
      title: tr(step.titleHe, step.titleEn),
      description: tr(step.descHe, step.descEn),
      icon: step.icon,
      status:
        selectedOrder?.orderStatus === 'ACTIVE'
          ? 'completed'
          : selectedOrder?.orderStatus === 'READY_FOR_ONBOARDING'
            ? (idx <= currentIdx ? 'completed' : 'pending')
            : idx < currentIdx ? 'completed'
              : idx === currentIdx ? 'in_progress'
                : 'pending',
    }))
  }, [selectedOrder, tr])

  const handleConnect = (type) => {
    setShowConnectionModal(type)
  }

  const handleCompleteConnection = async () => {
    if (!selectedOrder?.customerId || completing) return
    try {
      setCompleting(true)
      setError('')
      await workspaceApi.markIntegrationComplete(selectedOrder.customerId)
      await loadOrders()
      setShowConnectionModal(null)
    } catch (e) {
      setError(e.message || tr('עדכון סטטוס נכשל', 'Failed to update status'))
    } finally {
      setCompleting(false)
    }
  }

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Customer Selection View
  if (!selectedOrderId) {
    return (
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <PageHeader
          title={tr('הכנת שירות', 'Onboarding')}
          subtitle={tr('בחר לקוח להתחלה', 'Select customer to begin')}
          description={tr('בחר לקוח וממשך את תהליך ההכנה', 'Select a customer and continue setup')}
          icon={CheckCircle}
        />

        {error && (
          <div className="text-xs text-red-400">{error}</div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['READY_FOR_ONBOARDING', 'PENDING_SPOTNET_ASSIGNMENT', 'ALL', 'IN_PROGRESS', 'ACTION_REQUIRED', 'COMPLETED'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterTab === tab
                  ? 'bg-cdata-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {tab === 'READY_FOR_ONBOARDING' ? tr('מוכן לקליטה', 'Ready for Onboarding') :
               tab === 'PENDING_SPOTNET_ASSIGNMENT' ? tr('ממתין להקצאת חבילה', 'Pending Bundle Assignment') :
               tab === 'ALL' ? tr('הכל', 'All') :
               tab === 'IN_PROGRESS' ? tr('בתהליך', 'In Progress') :
               tab === 'ACTION_REQUIRED' ? tr('דורש פעולה', 'Action Required') :
               tr('הסתיימו', 'Completed')}
            </button>
          ))}
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="text-sm text-slate-400">{tr('טוען הזמנות קליטה...', 'Loading onboarding orders...')}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-sm text-slate-500">{tr('אין הזמנות תואמות לקליטה', 'No matching onboarding orders')}</div>
          ) : filteredOrders.map(customer => (
            <motion.button
              key={customer.id}
              onClick={() => setSelectedOrderId(customer.id)}
              className="glass rounded-xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-left transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Status Badge */}
              <div className="mb-4">
                {customer.orderStatus === 'READY_FOR_ONBOARDING' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3" />
                    {tr('מוכן לקליטה', 'Ready for Onboarding')}
                  </span>
                )}
                {customer.status === 'COMPLETED' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="w-3 h-3" />
                    {tr('הסתיימה', 'Completed')}
                  </span>
                )}
                {customer.status === 'IN_PROGRESS' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Zap className="w-3 h-3" />
                    {tr('בתהליך', 'In Progress')}
                  </span>
                )}
                {customer.status === 'ACTION_REQUIRED' && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertCircle className="w-3 h-3" />
                    {tr('דורש פעולה', 'Action Required')}
                  </span>
                )}
              </div>

              {/* Company Name */}
              <h3 className="text-lg font-bold text-white mb-1">{customer.company}</h3>
              <p className="text-xs text-slate-400 mb-4">{customer.product}</p>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">{tr('התקדמות', 'Progress')}</span>
                  <span className="text-sm font-bold text-cdata-400">{customer.progress}%</span>
                </div>
                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cdata-500 to-cdata-400"
                    initial={{ width: '0%' }}
                    animate={{ width: `${customer.progress}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>

              {/* Blocked Step */}
              {customer.blockedStep && (
                <div className="mb-4 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <div className="text-[10px] text-slate-500 mb-0.5">{tr('שלב נוכחי', 'Current step')}</div>
                  <div className="text-xs text-slate-300">{customer.blockedStep}</div>
                </div>
              )}

              {(customer.adminEmail || customer.ppOrgName) && (
                <div className="mb-4 grid grid-cols-1 gap-1.5 text-[11px]">
                  {customer.adminEmail && (
                    <div className="text-slate-400">
                      <span className="text-slate-500">{tr('אדמין', 'Admin')}: </span>
                      {customer.adminName ? `${customer.adminName} · ` : ''}{customer.adminEmail}
                    </div>
                  )}
                  {customer.ppOrgName && (
                    <div className="text-slate-400">
                      <span className="text-slate-500">PP {tr('ארגון', 'Org')}: </span>
                      {customer.ppOrgName}
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <div className="flex items-center gap-2 text-cdata-400 text-xs font-semibold group">
                {tr('המשך הכנה', 'Continue Onboarding')}
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    )
  }

  // Onboarding Steps View
  return (
    <motion.div
      className="space-y-6 max-w-5xl"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Back Button */}
      <button
        onClick={() => setSelectedOrderId(null)}
        className="flex items-center gap-2 text-cdata-400 hover:text-cdata-300 transition-colors text-xs font-semibold"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        {tr('חזור לרשימה', 'Back to List')}
      </button>

      {/* Header */}
      <PageHeader
        title={tr('הכנת שירות', 'Onboarding Setup')}
        subtitle={`${tr('לקוח', 'Customer')}: ${selectedOrder?.company || '—'}`}
        description={tr('השלם את השלבים הבאים להפעלת Perception Point', 'Complete these steps to activate Perception Point protection')}
        icon={CheckCircle}
      />

      {/* Progress Overview */}
      <motion.div className="space-y-3" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">{tr('התקדמות', 'Setup Progress')}</h3>
          <span className="text-2xl font-black text-cdata-400">{completionPercent}%</span>
        </div>
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cdata-500 to-cdata-400"
            initial={{ width: '0%' }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{tr('התחיל', 'Started')}</span>
          <span>{tr('פעיל ממלא', 'Fully Active')}</span>
        </div>
      </motion.div>

      {/* Onboarding Steps */}
      <motion.div className="space-y-3" variants={itemVariants}>
        {!isBundleAssigned && selectedOrder?.orderStatus === 'PENDING_SPOTNET_ASSIGNMENT' && (
          <div
            className="rounded-xl p-3 text-xs"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.28)', color: '#c4b5fd' }}
          >
            {tr(
              'לא ניתן להתחיל חיבור Microsoft 365 / Gmail לפני שצוות CData מקצה חבילה לארגון.',
              'You cannot start Microsoft 365 / Gmail connection until CData assigns a bundle to the organization.'
            )}
          </div>
        )}
        {stepCards.map((step, idx) => (
          <StepCard
            key={step.id}
            step={step.id}
            title={step.title}
            description={step.description}
            status={step.status}
            icon={step.icon}
            expandedByDefault={idx === 1}
            actionButton={
              step.key === 'READY_FOR_ONBOARDING' && isBundleAssigned ? {
                label: tr('חבר 365 / Gmail', 'Connect 365 / Gmail'),
                onClick: () => handleConnect('365')
              } : null
            }
          >
            {step.status === 'pending' && step.key !== 'READY_FOR_ONBOARDING' && step.key !== 'ACTIVE' && (
              <p className="text-sm text-slate-400">{tr('שלב זה יהיה זמין לאחר השלבים הקודמים.', 'This step will be available once previous steps are complete.')}</p>
            )}
            {step.status === 'in_progress' && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-blue-300">{tr('זמן משוער: 2-4 שעות לאחר אישור', 'Estimated time: 2-4 hours after approval')}</p>
              </div>
            )}
            {step.status === 'completed' && (
              <p className="text-sm text-emerald-300">✓ {tr('הסתיימה ב-15 בינואר 2024', 'Completed on Jan 15, 2024')}</p>
            )}
            {step.key === 'PP_ORG_CREATED' && selectedOrder?.ppOrgName && (
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/25">
                <p className="text-xs text-indigo-300">
                  <span className="text-indigo-200 font-semibold">PP {tr('ארגון', 'Org')}:</span> {selectedOrder.ppOrgName}
                </p>
              </div>
            )}
            {step.key === 'PP_ADMIN_INVITED' && selectedOrder?.adminEmail && (
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/25">
                <p className="text-xs text-cyan-200 font-semibold mb-1">{tr('אדמין שהוזמן', 'Invited admin')}</p>
                <p className="text-xs text-cyan-300">
                  {selectedOrder.adminName ? `${selectedOrder.adminName} · ` : ''}{selectedOrder.adminEmail}
                </p>
              </div>
            )}
            {step.key === 'PENDING_SPOTNET_ASSIGNMENT' && (
              <div className="p-3 rounded-lg bg-violet-500/10 border border-violet-500/25">
                <p className="text-xs text-violet-200 font-semibold mb-1">{tr('נדרשת פעולה תפעולית', 'Operational action required')}</p>
                <p className="text-xs text-violet-300">
                  {tr(
                    'השלב הבא יפתח רק לאחר סימון הקצאת חבילה בצד CData.',
                    'Next steps unlock only after bundle assignment is confirmed by CData operations.'
                  )}
                </p>
              </div>
            )}
          </StepCard>
        ))}
      </motion.div>

      {/* Connection Modal */}
      {showConnectionModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowConnectionModal(null)}
        >
          <motion.div
            className="glass rounded-2xl p-8 max-w-md border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-cdata-500/15 border border-cdata-500/30 flex items-center justify-center">
                <Globe className="w-5 h-5 text-cdata-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {tr('חיבור ל-', 'Connect ')} {showConnectionModal === '365' ? 'Microsoft 365' : 'Gmail'}
              </h3>
            </div>

            <div className="space-y-3 mb-6 text-sm text-slate-300">
              <p className="text-slate-300">
                {tr('תהליך החיבור מתבצע מתוך פורטל Perception Point עם משתמש האדמין שנשלחה אליו הזמנה במייל.', 'Connection is completed in the Perception Point portal using the invited admin user.')}
              </p>
              <ol className="space-y-2 list-decimal list-inside text-slate-300 text-xs leading-relaxed">
                <li>{tr('פותחים את ההזמנה במייל, עושים הרשמה (Sign Up) ומתחברים לחשבון האדמין.', 'Open the email invitation, complete Sign Up, and log in as the admin user.')}</li>
                <li>{tr('בפורטל עוברים ל־Settings.', 'In the portal, go to Settings.')}</li>
                <li>{tr('נכנסים ל־Bundles and Channels.', 'Open Bundles and Channels.')}</li>
                <li>{tr('לוחצים על + ואז על Email Service Configuration.', 'Click + and choose Email Service Configuration.')}</li>
                <li>
                  {tr(
                    `ב־Enabled Channels בוחרים ${showConnectionModal === '365' ? 'Microsoft 365' : 'Google Workspace (Gmail)'} וממשיכים לפי האשף.`,
                    `Under Enabled Channels choose ${showConnectionModal === '365' ? 'Microsoft 365' : 'Google Workspace (Gmail)'} and continue the wizard.`
                  )}
                </li>
              </ol>
              {selectedOrder?.adminEmail && (
                <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03] text-xs">
                  <div className="text-slate-500 mb-1">{tr('משתמש אדמין לחיבור', 'Admin user for connection')}</div>
                  <div className="text-slate-200">{selectedOrder.adminName ? `${selectedOrder.adminName} · ` : ''}{selectedOrder.adminEmail}</div>
                </div>
              )}
              {selectedOrder?.ppOrgName && (
                <div className="p-3 rounded-lg border border-white/10 bg-white/[0.03] text-xs">
                  <div className="text-slate-500 mb-1">PP {tr('ארגון', 'Organization')}</div>
                  <div className="text-slate-200">{selectedOrder.ppOrgName}</div>
                </div>
              )}
              {selectedOrder?.ppOrgId && (
                <a
                  href={`${ppPortalBase}/org/${selectedOrder.ppOrgId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 rounded-lg bg-cdata-500/20 border border-cdata-400/30 text-cdata-300 hover:bg-cdata-500/30 transition-all text-xs font-semibold"
                >
                  {tr('פתח פורטל PP לארגון', 'Open PP Org Portal')}
                </a>
              )}
              {!selectedOrder?.ppOrgId && (
                <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-400/30 rounded-lg p-2.5">
                  {tr('פורטל הארגון יהיה זמין לאחר יצירת PP Org.', 'Org portal link will be available once PP Org is created.')}
                </div>
              )}
              <div className="text-[11px] text-slate-500">
                {tr('טיפ: עדיף להשתמש במייל קבוצתי (Escalation Contacts) שזמין 24/7.', 'Tip: use a group email for Escalation Contacts that is available 24/7.')}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectionModal(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-all"
              >
                {tr('סגור', 'Close')}
              </button>
              <button
                onClick={handleCompleteConnection}
                disabled={completing}
                className="flex-1 px-4 py-2 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-medium transition-all"
              >
                {completing ? tr('מעדכן...', 'Updating...') : tr('סימנתי כהושלם', 'Mark as Completed')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Completion State */}
      {completionPercent === 100 && (
        <motion.div
          className="glass rounded-2xl p-8 border border-emerald-500/30 bg-emerald-500/5 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4"
          >
            <Trophy className="w-8 h-8 text-emerald-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white mb-2">{tr('הכנה הושלמה! 🎉', 'Setup Complete! 🎉')}</h3>
          <p className="text-sm text-slate-400 mb-4">{tr('Perception Point כעת מגן על תיבות הדואר של ', 'Perception Point is now protecting ')} {selectedOrder?.company}.</p>
          <button
            onClick={() => {
              if (selectedOrder?.customerId) {
                navigate(`/integrator/customers/${selectedOrder.customerId}`)
              }
            }}
            className="px-6 py-2 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-medium transition-all"
          >
            {tr('צפה בלקוח', 'View Customer')}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
