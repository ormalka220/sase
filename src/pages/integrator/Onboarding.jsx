import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink, RefreshCcw, CheckCircle2, Copy, Check, AlertCircle,
  ChevronDown, Loader2, Mail, Lock
} from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'
import { useProduct } from '../../context/ProductContext'
import { useLanguage } from '../../context/LanguageContext'
import { getCommonLabels } from '../../i18n/labels'

// ==================== ANIMATION CONFIGS ====================

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
}

const cardHoverVariants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4)',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
}

const expandContentVariants = {
  collapsed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  expanded: { opacity: 1, height: 'auto', transition: { duration: 0.4 } },
}

const buttonPulse = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
}

// ==================== SKELETON LOADERS ====================

const CardSkeleton = () => (
  <motion.div
    className="glass rounded-xl p-5 border border-white/10 space-y-3"
    animate={{ opacity: [0.6, 0.8, 0.6] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg bg-white/5" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-white/5 rounded w-1/3" />
        <div className="h-2 bg-white/5 rounded w-1/2" />
      </div>
    </div>
  </motion.div>
)

// ==================== REUSABLE COMPONENTS ====================

const OnboardingCard = ({ expanded, onToggle, status, children, className = '' }) => {
  const getStatusStyle = (status) => {
    const baseClasses = 'glass rounded-xl p-5 border backdrop-blur-md cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-900'
    switch (status) {
      case 'completed':
        return `${baseClasses} border-emerald-500/40 bg-emerald-500/8 hover:bg-emerald-500/12 focus:ring-emerald-500/50`
      case 'in-progress':
        return `${baseClasses} border-yellow-500/40 bg-yellow-500/8 hover:bg-yellow-500/12 focus:ring-yellow-500/50`
      case 'action-required':
        return `${baseClasses} border-blue-500/40 bg-blue-500/8 hover:bg-blue-500/12 focus:ring-blue-500/50`
      case 'failed':
        return `${baseClasses} border-red-500/40 bg-red-500/8 hover:bg-red-500/12 focus:ring-red-500/50`
      default:
        return `${baseClasses} border-white/10 hover:border-white/20 focus:ring-cdata-500/50`
    }
  }

  return (
    <motion.button
      className={getStatusStyle(status)}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      layout
      role="button"
      aria-expanded={expanded}
    >
      {children}
    </motion.button>
  )
}

const StatusBadge = ({ status }) => {
  const statusConfigs = {
    completed: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    'in-progress': { label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    'action-required': { label: 'Action Required', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    failed: { label: 'Failed', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  }

  const config = statusConfigs[status] || statusConfigs['action-required']

  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  )
}

const CopyButton = ({ text, label = 'Copy' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.button
      onClick={handleCopy}
      className="text-xs px-2 py-1 rounded border border-white/20 hover:border-white/40 text-slate-300 hover:text-white transition-all flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-cdata-500/50"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={text}
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : label}
    </motion.button>
  )
}

// ==================== HEADER SECTION ====================

const OnboardingHeader = ({ customerName, status, progress, tr }) => {
  return (
    <motion.header
      className="mb-8"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">{customerName}</h1>
          <p className="text-sm text-slate-400">Perception Point Onboarding</p>
        </div>
        <StatusBadge status={status === 'active' ? 'completed' : 'in-progress'} />
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <label htmlFor="progress-bar">Onboarding Progress</label>
          <span aria-label={`${progress} percent complete`}>{progress}%</span>
        </div>
        <div
          id="progress-bar"
          className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cdata-500 to-cdata-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.header>
  )
}

// ==================== CARD COMPONENTS ====================

const OrganizationCard = ({ expanded, onToggle, customer, onboarding, tr }) => {
  const getStatusKey = () => onboarding?.checklist?.organizationCreated ? 'completed' : 'action-required'

  return (
    <OnboardingCard expanded={expanded} onToggle={onToggle} status={getStatusKey()}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Organization Created</h3>
            <p className="text-xs text-slate-400 mt-0.5">Your Perception Point org is ready</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 mt-4 pt-4 border-t border-white/10 overflow-hidden"
          >
            <div className="bg-white/[0.02] rounded-lg p-3 space-y-2">
              <div>
                <div className="text-xs text-slate-500 mb-1">Organization ID</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-slate-200 font-mono break-all">{customer?.id}</code>
                  <CopyButton text={customer?.id} />
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Portal URL</div>
                <div className="flex items-center justify-between gap-2">
                  <a href={onboarding?.portalUrl} target="_blank" rel="noreferrer" className="text-xs text-cdata-400 hover:text-cdata-300 truncate">
                    {onboarding?.portalUrl}
                  </a>
                  <CopyButton text={onboarding?.portalUrl} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingCard>
  )
}

const AdminSetupCard = ({ expanded, onToggle, customer, onboarding, resending, onResendEmail, tr }) => {
  const isCompleted = onboarding?.checklist?.adminUserInvited

  return (
    <OnboardingCard expanded={expanded} onToggle={onToggle} status={isCompleted ? 'completed' : 'action-required'}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-blue-500/20 border border-blue-500/30'}`}>
            <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-emerald-400' : 'text-blue-400'}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Admin User Access</h3>
            <p className="text-xs text-slate-400 mt-0.5">Your admin user account</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 mt-4 pt-4 border-t border-white/10 overflow-hidden"
          >
            <div className="bg-white/[0.02] rounded-lg p-3 space-y-2">
              <div>
                <div className="text-xs text-slate-500 mb-1">Admin User ID</div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs text-slate-200 font-mono">{customer?.ppAdminUserId || '—'}</code>
                  <CopyButton text={customer?.ppAdminUserId || ''} />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onResendEmail()
                }}
                disabled={resending}
                className="text-xs px-3 py-2 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {resending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                {resending ? 'Sending...' : 'Resend Invite'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingCard>
  )
}

const ServiceConnectionCard = ({ expanded, onToggle, service, checklist, onboarding, checking, onCheckConnection, onMarkConnected, tr }) => {
  const isMs365 = service === 'microsoft'
  const icon = isMs365 ? '365' : '📧'
  const title = isMs365 ? 'Connect Microsoft 365' : 'Connect Gmail'
  const isConnected = isMs365 ? checklist?.microsoftConsentCompleted : checklist?.gmailConnected

  const substeps = isMs365 ? [
    { step: 1, label: 'Open Perception Point Portal', action: 'Open Portal', icon: '🔓' },
    { step: 2, label: 'Click "+ Email Service Configuration"', icon: '⚙️' },
    { step: 3, label: 'Select Microsoft 365', icon: '🔗' },
    { step: 4, label: 'Choose Inline Mode', icon: '📡' },
    { step: 5, label: 'Approve Admin Permissions', icon: '✅' },
  ] : [
    { step: 1, label: 'Open Perception Point Portal', action: 'Open Portal', icon: '🔓' },
    { step: 2, label: 'Click "+ Email Service Configuration"', icon: '⚙️' },
    { step: 3, label: 'Select Gmail', icon: '🔗' },
    { step: 4, label: 'Approve Account Access', icon: '✅' },
  ]

  return (
    <OnboardingCard expanded={expanded} onToggle={onToggle} status={isConnected ? 'completed' : 'action-required'}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isConnected ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-blue-500/20 border border-blue-500/30'}`}>
            <span className="text-lg">{icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{isConnected ? 'Connected' : 'Action required'}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 mt-4 pt-4 border-t border-white/10 overflow-hidden"
          >
            <div className="space-y-3">
              {substeps.map((sub, idx) => (
                <motion.div
                  key={sub.step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${isConnected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-300 border border-slate-600'}`}>
                      {sub.icon}
                    </div>
                    {sub.step < substeps.length && <div className="w-0.5 h-6 bg-slate-600 my-1" />}
                  </div>
                  <div className="pt-1">
                    <p className="text-xs text-slate-300">{sub.label}</p>
                    {sub.action && (
                      <a href={onboarding?.deepLinkUrl || onboarding?.portalUrl} target="_blank" rel="noreferrer" className="text-xs text-cdata-400 hover:text-cdata-300 mt-1 inline-flex items-center gap-1">
                        {sub.action}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onCheckConnection()
                }}
                disabled={checking}
                className="text-xs px-3 py-2 rounded border border-cdata-500/30 bg-cdata-500/10 text-cdata-300 hover:bg-cdata-500/20 transition-all disabled:opacity-50 flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {checking ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
                {checking ? 'Checking...' : 'Check Connection'}
              </motion.button>

              {!isConnected && (
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMarkConnected()
                  }}
                  className="text-xs px-3 py-2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check className="w-3 h-3" />
                  Mark Connected
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingCard>
  )
}

const DnsConfigCard = ({ expanded, onToggle, checklist, tr }) => {
  const isCompleted = checklist?.dnsMailFlowCompleted

  const dnsRecords = [
    { type: 'SPF', value: 'v=spf1 include:pp.protection-point.io ~all' },
    { type: 'DKIM', value: 'contact admin@perception-point.io for DKIM records' },
    { type: 'MX', value: 'mx.pp.protection-point.io (priority 5)' },
  ]

  return (
    <OnboardingCard expanded={expanded} onToggle={onToggle} status={isCompleted ? 'completed' : 'in-progress'}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-yellow-500/20 border border-yellow-500/30'}`}>
            <Lock className={`w-5 h-5 ${isCompleted ? 'text-emerald-400' : 'text-yellow-400'}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">DNS & Mail Flow Configuration</h3>
            <p className="text-xs text-slate-400 mt-0.5">{isCompleted ? 'Configured' : 'Pending configuration'}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 mt-4 pt-4 border-t border-white/10 overflow-hidden"
          >
            <p className="text-xs text-slate-400 mb-3">Configure these DNS records in your domain provider:</p>

            <div className="space-y-2">
              {dnsRecords.map((record, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-white/[0.02] rounded-lg p-3"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-300">{record.type}</span>
                    <CopyButton text={record.value} label="Copy" />
                  </div>
                  <code className="text-xs text-slate-400 block font-mono break-all">{record.value}</code>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingCard>
  )
}

const MailboxSyncCard = ({ expanded, onToggle, checklist, tr }) => {
  const mailboxCount = 85 // Mock data - replace with real API
  const isActive = checklist?.protectionActive

  return (
    <OnboardingCard expanded={expanded} onToggle={onToggle} status={isActive ? 'completed' : 'in-progress'}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isActive ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-yellow-500/20 border border-yellow-500/30'}`}>
            <Mail className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-yellow-400'}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Mailbox Sync Status</h3>
            <p className="text-xs text-slate-400 mt-0.5">{isActive ? 'Active' : 'Syncing...'}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 mt-4 pt-4 border-t border-white/10 overflow-hidden"
          >
            <div className="bg-white/[0.02] rounded-lg p-4 text-center">
              <motion.div
                className="text-3xl font-bold text-emerald-400 mb-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {mailboxCount}
              </motion.div>
              <p className="text-xs text-slate-400">Protected mailboxes</p>
            </div>

            <div className="text-xs text-slate-400">
              <p className="mb-2">Status: <span className="text-emerald-400 font-semibold">Active</span></p>
              <p className="text-slate-500 text-[11px]">All mailboxes are being protected and monitored by Perception Point.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </OnboardingCard>
  )
}

const ProtectionStatusCard = ({ checklist }) => {
  const isActive = checklist?.protectionActive

  if (!isActive) return null

  return (
    <OnboardingCard status="completed">
      <div className="text-center">
        <motion.div
          className="inline-block mb-3"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
        </motion.div>
        <h3 className="text-lg font-semibold text-white mb-1">Protection Active</h3>
        <p className="text-sm text-slate-400">Perception Point is now protecting your email environment</p>
      </div>
    </OnboardingCard>
  )
}

// ==================== RIGHT SIDEBAR ====================

const OnboardingChecklist = ({ checklist, customers, selectedCustomer }) => {
  const items = [
    { key: 'organizationCreated', label: 'Organization created' },
    { key: 'adminUserInvited', label: 'Admin invited' },
    { key: 'microsoftConsentCompleted', label: 'Microsoft 365 connected' },
    { key: 'dnsMailFlowCompleted', label: 'DNS configured' },
    { key: 'protectionActive', label: 'Mailboxes syncing' },
  ]

  const completedCount = items.filter(item => checklist?.[item.key]).length
  const progress = Math.round((completedCount / items.length) * 100)

  return (
    <motion.div
      className="glass rounded-xl p-5 border border-white/10 h-fit sticky top-20"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-sm font-semibold text-white mb-4">Onboarding Checklist</h3>

      <div className="space-y-3 mb-5">
        {items.map((item) => (
          <motion.div key={item.key} className="flex items-center gap-2">
            <motion.div
              initial={false}
              animate={{
                scale: checklist?.[item.key] ? 1 : 0.8,
              }}
            >
              {checklist?.[item.key] ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-600 bg-slate-700/30" />
              )}
            </motion.div>
            <span className={`text-xs ${checklist?.[item.key] ? 'text-slate-300' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400">Progress</span>
            <span className="text-xs font-semibold text-slate-300">{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cdata-500 to-cdata-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Estimated Users</p>
          <p className="text-lg font-bold text-white">~80</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-4">
          <p className="text-xs text-blue-300">
            💡 Final billing is based on actual connected mailboxes, not estimates.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== BOTTOM ACTION BAR ====================

const ActionBar = ({ checking, completing, onCheckConnection, onVerifyComplete, onBackClick, tr }) => {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-navy-900 via-navy-900/95 to-transparent p-4 sm:p-5 border-t border-white/10 backdrop-blur-sm"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <motion.button
          onClick={onBackClick}
          className="text-xs px-4 py-2 rounded border border-white/20 hover:border-white/40 text-slate-300 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-cdata-500/50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back to Customers
        </motion.button>

        <div className="flex gap-2 flex-wrap">
          <motion.button
            onClick={onCheckConnection}
            disabled={checking}
            className="text-xs px-4 py-2 rounded border border-cdata-500/30 bg-cdata-500/10 text-cdata-300 hover:bg-cdata-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1 flex-1 sm:flex-initial focus:outline-none focus:ring-2 focus:ring-cdata-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {checking ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCcw className="w-3 h-3" />}
            {checking ? 'Checking...' : 'Check Connection'}
          </motion.button>

          <motion.button
            onClick={onVerifyComplete}
            disabled={completing}
            className="text-xs px-4 py-2 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-1 flex-1 sm:flex-initial font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {completing ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            {completing ? 'Verifying...' : 'Complete Onboarding'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// ==================== MAIN COMPONENT ====================

export default function IntegratorOnboarding() {
  const { product } = useProduct()
  const { tr } = useLanguage()
  const labels = getCommonLabels(tr)

  // State
  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [onboarding, setOnboarding] = useState(null)
  const [checklist, setChecklist] = useState(null)
  const [status, setStatus] = useState(null)
  const [ordersByCustomerId, setOrdersByCustomerId] = useState({})
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Loading states
  const [checking, setChecking] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [resending, setResending] = useState(false)

  // Expanded cards
  const [expandedCard, setExpandedCard] = useState('organization')

  const selectedCustomer = useMemo(
    () => customers.find(c => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  )

  const progress = useMemo(() => {
    if (!checklist) return 0
    const items = [
      'organizationCreated',
      'adminUserInvited',
      'microsoftConsentCompleted',
      'dnsMailFlowCompleted',
      'protectionActive',
    ]
    const completed = items.filter(key => checklist[key]).length
    return Math.round((completed / items.length) * 100)
  }, [checklist])

  // Load customers and orders
  useEffect(() => {
    async function loadQueue() {
      try {
        setError('')
        const [customersRes, ordersRes] = await Promise.all([
          workspaceApi.getPpCustomersList({ page: 1, limit: 200 }),
          workspaceApi.getOrders({ productCode: 'WORKSPACE_SECURITY', page: 1, limit: 200 }),
        ])

        const allCustomers = Array.isArray(customersRes) ? customersRes : (customersRes?.data || [])
        const allOrders = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || [])

        const READY_STATUSES = new Set([
          'APPROVED_BY_CDATA',
          'PROVISIONING_STARTED',
          'PP_ORG_CREATED',
          'PP_ADMIN_INVITED',
          'READY_FOR_ONBOARDING',
          'ACTIVE',
          'APPROVED',
        ])

        const latestByCustomer = {}
        allOrders.forEach((o) => {
          if (!o?.customerId) return
          if (!READY_STATUSES.has(o.status)) return
          const prev = latestByCustomer[o.customerId]
          if (!prev || new Date(o.createdAt) > new Date(prev.createdAt)) {
            latestByCustomer[o.customerId] = o
          }
        })

        const queue = allCustomers.filter((c) => Boolean(latestByCustomer[c.id]))
        setOrdersByCustomerId(latestByCustomer)
        setCustomers(queue)
        if (queue.length) setSelectedCustomerId(queue[0].id)
      } catch (e) {
        setError(e.message)
      }
    }

    loadQueue()
  }, [])

  // Load onboarding data
  useEffect(() => {
    if (!selectedCustomerId) return
    async function loadData() {
      try {
        setError('')
        const onboardingData = await workspaceApi.getOnboarding(selectedCustomerId)
        setOnboarding(onboardingData)
        setChecklist(onboardingData?.checklist || {})
      } catch (e) {
        setError(e.message)
      }
    }

    loadData()
  }, [selectedCustomerId])

  // Poll integration status
  useEffect(() => {
    if (!selectedCustomerId) return
    const timer = setInterval(() => {
      workspaceApi.getIntegrationStatus(selectedCustomerId)
        .then(setStatus)
        .catch(() => {})
    }, 15000)
    return () => clearInterval(timer)
  }, [selectedCustomerId])

  // Actions
  async function checkConnection() {
    if (!selectedCustomerId) return
    setChecking(true)
    try {
      const result = await workspaceApi.getIntegrationStatus(selectedCustomerId)
      setStatus(result)
      const fresh = await workspaceApi.getOnboarding(selectedCustomerId)
      setOnboarding(fresh)
      setChecklist(fresh?.checklist || {})
    } catch (e) {
      setError(e.message)
    } finally {
      setChecking(false)
    }
  }

  async function verifyAndComplete() {
    if (!selectedCustomerId) return
    setCompleting(true)
    setSuccessMessage('')
    setError('')
    try {
      const integration = await workspaceApi.getIntegrationStatus(selectedCustomerId)
      setStatus(integration)

      if (integration?.state === 'active') {
        setSuccessMessage('Verification succeeded. Onboarding completed successfully.')
        const fresh = await workspaceApi.getOnboarding(selectedCustomerId)
        setOnboarding(fresh)
        setChecklist(fresh?.checklist || {})
        return
      }

      if (integration?.manualCompletionAvailable) {
        await workspaceApi.markIntegrationComplete(selectedCustomerId)
        const [freshStatus, freshOnboarding] = await Promise.all([
          workspaceApi.getIntegrationStatus(selectedCustomerId),
          workspaceApi.getOnboarding(selectedCustomerId),
        ])
        setStatus(freshStatus)
        setOnboarding(freshOnboarding)
        setChecklist(freshOnboarding?.checklist || {})
        setSuccessMessage('Onboarding completed successfully.')
      } else {
        setError('The system does not yet detect full integration. Verify mailboxes, DNS, and mail flow, then try again.')
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setCompleting(false)
    }
  }

  async function resendOnboardingEmail() {
    if (!selectedCustomerId) return
    setResending(true)
    setSuccessMessage('')
    try {
      await workspaceApi.resendOnboardingEmail(selectedCustomerId)
      setSuccessMessage('Onboarding instructions email was resent successfully.')
    } catch (e) {
      setError(e.message)
    } finally {
      setResending(false)
    }
  }

  if (product === 'sase') {
    return (
      <div className="glass rounded-xl p-5 border border-white/10 text-sm text-slate-300">
        Onboarding is currently available only for Perception Point.
      </div>
    )
  }

  // Loading or no customer selected
  if (!selectedCustomer) {
    return (
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-black text-white">Perception Point Onboarding</h1>
        <motion.div
          className="glass rounded-xl p-5 border border-white/10"
          whileHover={{ borderColor: 'rgba(255,255,255,0.15)' }}
        >
          <label className="text-xs text-slate-400 block mb-2">Select a Customer</label>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cdata-500/50"
          >
            <option value="">Choose a customer...</option>
            {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
          </select>
          {customers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-slate-500"
            >
              No customers in onboarding queue. Customers appear here after approved PP orders.
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    )
  }

  if (!onboarding) {
    return (
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-2xl font-black text-white mb-4">Loading onboarding details...</h1>
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </motion.div>
    )
  }

  return (
    <div className="pb-32">
      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </motion.div>
      )}

      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </motion.div>
      )}

      {/* Header */}
      <OnboardingHeader
        customerName={selectedCustomer?.companyName}
        status={status?.state}
        progress={progress}
        tr={tr}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-20">
        {/* Cards Column */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            className="space-y-4"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Organization Card */}
            <motion.div variants={itemVariants}>
              <OrganizationCard
                expanded={expandedCard === 'organization'}
                onToggle={() => setExpandedCard(expandedCard === 'organization' ? null : 'organization')}
                customer={selectedCustomer}
                onboarding={onboarding}
                tr={tr}
              />
            </motion.div>

            {/* Admin Setup Card */}
            <motion.div variants={itemVariants}>
              <AdminSetupCard
                expanded={expandedCard === 'admin'}
                onToggle={() => setExpandedCard(expandedCard === 'admin' ? null : 'admin')}
                customer={selectedCustomer}
                onboarding={onboarding}
                resending={resending}
                onResendEmail={resendOnboardingEmail}
                tr={tr}
              />
            </motion.div>

            {/* Microsoft 365 Card */}
            <motion.div variants={itemVariants}>
              <ServiceConnectionCard
                expanded={expandedCard === 'microsoft'}
                onToggle={() => setExpandedCard(expandedCard === 'microsoft' ? null : 'microsoft')}
                service="microsoft"
                checklist={checklist}
                onboarding={onboarding}
                checking={checking}
                onCheckConnection={checkConnection}
                onMarkConnected={() => setExpandedCard(null)}
                tr={tr}
              />
            </motion.div>

            {/* Gmail Card */}
            <motion.div variants={itemVariants}>
              <ServiceConnectionCard
                expanded={expandedCard === 'gmail'}
                onToggle={() => setExpandedCard(expandedCard === 'gmail' ? null : 'gmail')}
                service="gmail"
                checklist={checklist}
                onboarding={onboarding}
                checking={checking}
                onCheckConnection={checkConnection}
                onMarkConnected={() => setExpandedCard(null)}
                tr={tr}
              />
            </motion.div>

            {/* DNS Config Card */}
            <motion.div variants={itemVariants}>
              <DnsConfigCard
                expanded={expandedCard === 'dns'}
                onToggle={() => setExpandedCard(expandedCard === 'dns' ? null : 'dns')}
                checklist={checklist}
                tr={tr}
              />
            </motion.div>

            {/* Mailbox Sync Card */}
            <motion.div variants={itemVariants}>
              <MailboxSyncCard
                expanded={expandedCard === 'sync'}
                onToggle={() => setExpandedCard(expandedCard === 'sync' ? null : 'sync')}
                checklist={checklist}
                tr={tr}
              />
            </motion.div>

            {/* Protection Status Card */}
            {checklist?.protectionActive && (
              <motion.div variants={itemVariants}>
                <ProtectionStatusCard checklist={checklist} />
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block">
          <OnboardingChecklist
            checklist={checklist}
            customers={customers}
            selectedCustomer={selectedCustomer}
          />
        </div>
      </div>

      {/* Mobile Checklist */}
      <motion.div className="lg:hidden mb-8">
        <OnboardingChecklist
          checklist={checklist}
          customers={customers}
          selectedCustomer={selectedCustomer}
        />
      </motion.div>

      {/* Action Bar */}
      <ActionBar
        checking={checking}
        completing={completing}
        onCheckConnection={checkConnection}
        onVerifyComplete={verifyAndComplete}
        onBackClick={() => setSelectedCustomerId('')}
        tr={tr}
      />
    </div>
  )
}
