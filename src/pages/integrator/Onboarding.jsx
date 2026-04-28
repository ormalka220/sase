import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Shield, Zap, Globe, Trophy, ChevronRight, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import StepCard from '../../components/integrator/StepCard'
import PageHeader from '../../components/distribution/PageHeader'

// Mock customer onboarding data
const mockOnboardingCustomers = [
  { id: 'c1', company: 'Elbit Systems', product: 'Perception Point', status: 'IN_PROGRESS', progress: 28, blockedStep: 'CData Approval' },
  { id: 'c2', company: 'IsraCard Ltd', product: 'Perception Point', status: 'ACTION_REQUIRED', progress: 42, blockedStep: 'Admin Invitation' },
  { id: 'c3', company: 'TechVision Inc', product: 'Perception Point', status: 'COMPLETED', progress: 100, blockedStep: null },
  { id: 'c4', company: 'Global Security', product: 'Perception Point', status: 'IN_PROGRESS', progress: 14, blockedStep: 'PP Organization' },
]

const steps = [
  { id: 1, title: 'Order Submitted', description: 'Your order is being processed', status: 'completed', icon: Zap },
  { id: 2, title: 'CData Approval', description: 'Waiting for CData distributor approval', status: 'in_progress', icon: Shield },
  { id: 3, title: 'PP Organization Created', description: 'Perception Point environment setup', status: 'pending', icon: Zap },
  { id: 4, title: 'Admin Invited', description: 'Invite customer admin to Perception Point', status: 'pending', icon: Mail },
  { id: 5, title: 'Connect Microsoft 365', description: 'Connect Microsoft 365 mailboxes', status: 'pending', icon: Globe },
  { id: 6, title: 'Connect Gmail', description: 'Connect Gmail accounts (if applicable)', status: 'pending', icon: Globe },
  { id: 7, title: 'Activate Service', description: 'Start protecting mailboxes', status: 'pending', icon: Trophy },
]

export default function Onboarding() {
  const { tr, isHebrew } = useLanguage()
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)
  const [completionPercent, setCompletionPercent] = useState(14)
  const [showConnectionModal, setShowConnectionModal] = useState(null)
  const [expandedSteps, setExpandedSteps] = useState([0])
  const [filterTab, setFilterTab] = useState('ALL')

  const selectedCustomer = mockOnboardingCustomers.find(c => c.id === selectedCustomerId)
  const filteredCustomers = filterTab === 'ALL'
    ? mockOnboardingCustomers
    : mockOnboardingCustomers.filter(c => {
      const custStatus = c.status.replace('_', ' ')
      const tabStatus = filterTab.replace('_', ' ')
      return custStatus === tabStatus
    })

  const handleConnect = (type) => {
    setShowConnectionModal(type)
  }

  const handleCompleteConnection = () => {
    setCompletionPercent(Math.min(100, completionPercent + 15))
    setShowConnectionModal(null)
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
  if (!selectedCustomerId) {
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

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['ALL', 'IN_PROGRESS', 'ACTION_REQUIRED', 'COMPLETED'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filterTab === tab
                  ? 'bg-cdata-500 text-white'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {tab === 'ALL' ? tr('הכל', 'All') :
               tab === 'IN_PROGRESS' ? tr('בתהליך', 'In Progress') :
               tab === 'ACTION_REQUIRED' ? tr('דורש פעולה', 'Action Required') :
               tr('הסתיימו', 'Completed')}
            </button>
          ))}
        </div>

        {/* Customer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCustomers.map(customer => (
            <motion.button
              key={customer.id}
              onClick={() => setSelectedCustomerId(customer.id)}
              className="glass rounded-xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-left transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Status Badge */}
              <div className="mb-4">
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
                  <div className="text-[10px] text-slate-500 mb-0.5">{tr('שלב בחסימה', 'Blocked Step')}</div>
                  <div className="text-xs text-slate-300">{customer.blockedStep}</div>
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
        onClick={() => setSelectedCustomerId(null)}
        className="flex items-center gap-2 text-cdata-400 hover:text-cdata-300 transition-colors text-xs font-semibold"
      >
        <ChevronRight className="w-4 h-4 rotate-180" />
        {tr('חזור לרשימה', 'Back to List')}
      </button>

      {/* Header */}
      <PageHeader
        title={tr('הכנת שירות', 'Onboarding Setup')}
        subtitle={`${tr('לקוח', 'Customer')}: ${selectedCustomer?.company}`}
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
        {steps.map((step, idx) => (
          <StepCard
            key={step.id}
            step={step.id}
            title={step.title}
            description={step.description}
            status={step.status}
            icon={step.icon}
            expandedByDefault={idx === 1}
            actionButton={
              step.id === 5 ? {
                label: 'Connect Microsoft 365',
                onClick: () => handleConnect('365')
              } : step.id === 6 ? {
                label: 'Connect Gmail',
                onClick: () => handleConnect('gmail')
              } : step.id === 7 ? {
                label: 'Activate Service',
                onClick: () => handleCompleteConnection()
              } : null
            }
          >
            {step.status === 'pending' && step.id !== 5 && step.id !== 6 && step.id !== 7 && (
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
              <p>{tr('כדי לחבר את', 'To connect your')} {showConnectionModal === '365' ? 'Microsoft 365' : 'Gmail'} {tr('דרישות:', 'accounts:')}</p>
              <ol className="space-y-2 list-decimal list-inside text-slate-400 text-xs">
                <li>{tr('התחבר ל-', 'Log into your')} {showConnectionModal === '365' ? 'Microsoft 365' : 'Gmail'} {tr('מרכז ניהול', 'admin center')}</li>
                <li>{tr('נווט להגדרות אבטחה', 'Navigate to Security Settings')}</li>
                <li>{tr('צור אסימון אימות', 'Generate an authentication token')}</li>
                <li>{tr('הדבק את האסימון להלן והקלק אישור', 'Paste the token below and click Confirm')}</li>
              </ol>
            </div>

            <input
              type="text"
              placeholder={tr('הדבק את אסימון האימות שלך כאן...', 'Paste your authentication token here...')}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm mb-4 focus:outline-none focus:border-cdata-500/50"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectionModal(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-all"
              >
                {tr('ביטול', 'Cancel')}
              </button>
              <button
                onClick={handleCompleteConnection}
                className="flex-1 px-4 py-2 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-medium transition-all"
              >
                {tr('אישור', 'Confirm')}
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
          <p className="text-sm text-slate-400 mb-4">{tr('Perception Point כעת מגן על תיבות הדואר של ', 'Perception Point is now protecting ')} {selectedCustomer?.company}.</p>
          <button className="px-6 py-2 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-medium transition-all">
            {tr('צפה בלקוח', 'View Customer')}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
