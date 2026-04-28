import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Key, Shield, Zap, Globe, Trophy, ChevronRight } from 'lucide-react'
import StepCard from '../../components/integrator/StepCard'
import PageHeader from '../../components/distribution/PageHeader'

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
  const [completionPercent, setCompletionPercent] = useState(14)
  const [showConnectionModal, setShowConnectionModal] = useState(null)
  const [expandedSteps, setExpandedSteps] = useState([0])

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

  return (
    <motion.div
      className="space-y-6 max-w-5xl"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <PageHeader
        title="Onboarding Setup"
        subtitle="Customer: Acme Corp"
        description="Complete these steps to activate Perception Point protection"
        icon={CheckCircle}
      />

      {/* Progress Overview */}
      <motion.div className="space-y-3" variants={itemVariants}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Setup Progress</h3>
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
          <span>Started</span>
          <span>Fully Active</span>
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
            expandedByDefault={idx === 1} // Expand current step
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
              <p className="text-sm text-slate-400">This step will be available once previous steps are complete.</p>
            )}
            {step.status === 'in_progress' && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-blue-300">Estimated time: 2-4 hours after approval</p>
              </div>
            )}
            {step.status === 'completed' && (
              <p className="text-sm text-emerald-300">✓ Completed on Jan 15, 2024</p>
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
                {showConnectionModal === '365' ? <Globe className="w-5 h-5 text-cdata-400" /> : <Globe className="w-5 h-5 text-cdata-400" />}
              </div>
              <h3 className="text-lg font-bold text-white">
                Connect {showConnectionModal === '365' ? 'Microsoft 365' : 'Gmail'}
              </h3>
            </div>

            <div className="space-y-3 mb-6 text-sm text-slate-300">
              <p>To connect your {showConnectionModal === '365' ? 'Microsoft 365' : 'Gmail'} accounts:</p>
              <ol className="space-y-2 list-decimal list-inside text-slate-400 text-xs">
                <li>Log into your {showConnectionModal === '365' ? 'Microsoft 365' : 'Gmail'} admin center</li>
                <li>Navigate to Security Settings</li>
                <li>Generate an authentication token</li>
                <li>Paste the token below and click Confirm</li>
              </ol>
            </div>

            <input
              type="text"
              placeholder="Paste your authentication token here..."
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-600 text-sm mb-4 focus:outline-none focus:border-cdata-500/50"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowConnectionModal(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteConnection}
                className="flex-1 px-4 py-2 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-medium transition-all"
              >
                Confirm
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
          <h3 className="text-xl font-bold text-white mb-2">Setup Complete! 🎉</h3>
          <p className="text-sm text-slate-400 mb-4">Perception Point is now protecting Acme Corp's mailboxes.</p>
          <button className="px-6 py-2 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-medium transition-all">
            View Customer
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
