import React from 'react'
import { motion } from 'framer-motion'
import { Inbox, Plus } from 'lucide-react'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No items yet',
  description = 'Get started by creating your first item',
  action = null,
  actionLabel = 'Create',
  illustration = null,
  className = ''
}) {
  return (
    <motion.div
      className={`glass rounded-xl border border-white/10 p-12 text-center flex flex-col items-center justify-center min-h-64 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {illustration ? (
        <div className="mb-4 w-20 h-20">
          {illustration}
        </div>
      ) : (
        <div className="mb-4 p-4 rounded-full bg-slate-500/10 border border-slate-500/20">
          <Icon className="w-8 h-8 text-slate-400" />
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 mb-6 max-w-md">{description}</p>
      
      {action && (
        <motion.button
          onClick={action}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cdata-500/15 border border-cdata-500/30 text-cdata-400 hover:text-cdata-300 hover:bg-cdata-500/25 transition-all font-medium text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  )
}
