import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function StepCard({
  step,
  title,
  description,
  status = 'pending', // pending, in_progress, completed, failed
  icon: Icon,
  children,
  onClick,
  actionButton,
  expandedByDefault = false
}) {
  const [isExpanded, setIsExpanded] = useState(expandedByDefault)

  const statusConfig = {
    pending: { color: 'text-slate-400', bgColor: 'bg-slate-500/10', borderColor: 'border-slate-500/30', icon: Clock },
    in_progress: { color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', icon: Clock },
    completed: { color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', icon: CheckCircle },
    failed: { color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: AlertCircle },
  }

  const config = statusConfig[status] || statusConfig.pending
  const StatusIcon = config.icon

  return (
    <motion.div
      className={`glass rounded-xl border transition-all ${config.borderColor} ${config.bgColor}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: 'rgba(44,106,138,0.4)' }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-start gap-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        {/* Step circle */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-lg border flex items-center justify-center font-bold text-lg ${config.bgColor} ${config.borderColor} ${config.color}`}>
          {status === 'completed' ? (
            <CheckCircle className="w-6 h-6" />
          ) : Icon ? (
            <Icon className="w-6 h-6" />
          ) : (
            step
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
          {status === 'completed' && (
            <div className="text-xs text-emerald-400 font-semibold mt-1">✓ Completed</div>
          )}
          {status === 'failed' && (
            <div className="text-xs text-red-400 font-semibold mt-1">✗ Failed - Action required</div>
          )}
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-slate-500"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5"
          >
            <div className="px-6 py-4 bg-white/[0.02] space-y-4">
              {children}
              {actionButton && (
                <button
                  onClick={actionButton.onClick}
                  className="px-4 py-2.5 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-semibold text-sm transition-all w-full"
                >
                  {actionButton.label}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
