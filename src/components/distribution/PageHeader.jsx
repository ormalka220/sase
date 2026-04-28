import React from 'react'
import { motion } from 'framer-motion'

export default function PageHeader({
  title,
  subtitle,
  description,
  icon: Icon = null,
  action = null,
  secondaryAction = null,
  status = null,
  className = ''
}) {
  return (
    <motion.div 
      className={`mb-8 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          {Icon && (
            <div className="p-3 rounded-lg bg-cdata-500/10 border border-cdata-500/25 flex-shrink-0">
              <Icon className="w-6 h-6 text-cdata-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black text-white">{title}</h1>
              {status && <div>{status}</div>}
            </div>
            {subtitle && (
              <p className="text-sm text-cdata-400 font-medium mb-1">{subtitle}</p>
            )}
            {description && (
              <p className="text-sm text-slate-400">{description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {secondaryAction && <div>{secondaryAction}</div>}
          {action && <div>{action}</div>}
        </div>
      </div>
    </motion.div>
  )
}
