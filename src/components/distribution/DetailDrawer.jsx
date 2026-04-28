import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'

export default function DetailDrawer({
  isOpen = false,
  onClose = () => {},
  title = '',
  subtitle = '',
  icon: Icon = null,
  children = null,
  actions = null,
  tabs = null,
  activeTab = null,
  onTabChange = null,
  size = 'md', // sm, md, lg, xl
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-full max-w-sm',
    md: 'w-full max-w-2xl',
    lg: 'w-full max-w-4xl',
    xl: 'w-full max-w-5xl'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer - slides from right (LTR) / left (RTL) */}
          <motion.div
            className={`fixed top-0 right-0 h-screen ${sizeClasses[size]} bg-navy-900 shadow-2xl flex flex-col z-50 border-l border-white/10 rtl:right-auto rtl:left-0 rtl:border-l-0 rtl:border-r ${className}`}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ direction: document.dir === 'rtl' ? 'rtl' : 'ltr' }}
          >
            {/* Header */}
            <div className="border-b border-white/5 p-6 flex items-start justify-between flex-shrink-0">
              <div className="flex items-start gap-4 flex-1">
                {Icon && (
                  <div className="p-2.5 rounded-lg bg-cdata-500/10 border border-cdata-500/25 flex-shrink-0">
                    <Icon className="w-5 h-5 text-cdata-400" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">{title}</h2>
                  {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs (if provided) */}
            {tabs && tabs.length > 0 && (
              <div className="border-b border-white/5 px-6 py-0 flex-shrink-0 overflow-x-auto">
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange?.(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-cdata-500 text-cdata-400'
                          : 'border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>

            {/* Actions Footer (if provided) */}
            {actions && (
              <div className="border-t border-white/5 p-6 flex-shrink-0 flex items-center gap-3 bg-gradient-to-t from-navy-800 to-transparent">
                {Array.isArray(actions) ? actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={action.onClick}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                      action.variant === 'primary'
                        ? 'bg-cdata-500 hover:bg-cdata-400 text-white'
                        : action.variant === 'danger'
                        ? 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                    }`}
                  >
                    {action.label}
                  </button>
                )) : actions}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
