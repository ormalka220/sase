import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function ExpandableCard({
  header = null,
  children = null,
  expandedContent = null,
  onExpand = null,
  defaultExpanded = false,
  className = ''
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleToggle = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    onExpand?.(newState)
  }

  return (
    <motion.div
      className={`glass rounded-xl border border-white/10 overflow-hidden transition-all ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ borderColor: 'rgba(44,106,138,0.25)' }}
    >
      {/* Header - always visible */}
      <button
        onClick={handleToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.03] transition-colors text-left"
      >
        {header}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && expandedContent && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5"
          >
            <div className="px-6 py-4 bg-white/[0.02]">
              {expandedContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Non-expandable children (always shown) */}
      {children && !expandedContent && (
        <div className="px-6 py-4 text-sm text-slate-300">
          {children}
        </div>
      )}
    </motion.div>
  )
}
