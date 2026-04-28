import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

const statusColors = {
  active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: 'text-emerald-400' },
  warning: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: 'text-amber-400' },
  critical: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', icon: 'text-red-400' },
  neutral: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', icon: 'text-slate-400' },
  info: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'text-blue-400' },
}

export default function KPICard({
  icon: Icon,
  label,
  value,
  trend = null,
  trendDirection = 'up',
  explanation = '',
  status = 'neutral',
  onClick = null,
  color = null,
  format = 'number', // number, currency, percent, custom
  formatter = null,
  className = ''
}) {
  const config = statusColors[status] || statusColors.neutral

  const formattedValue = (() => {
    if (formatter) return formatter(value)
    if (format === 'currency') return `$${Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
    if (format === 'percent') return `${value}%`
    if (format === 'number') return Number(value).toLocaleString()
    return value
  })()

  return (
    <motion.div
      className={`glass rounded-xl p-5 border backdrop-blur-md transition-all ${config.bg} ${config.border} cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        boxShadow: '0 20px 40px rgba(44,106,138,0.15)',
        borderColor: 'rgba(44,106,138,0.4)'
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={`p-3 rounded-lg ${config.bg} ${config.icon} border ${config.border}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        {trend !== null && (
          <motion.div
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              trendDirection === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {trendDirection === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {Math.abs(trend)}%
          </motion.div>
        )}
      </div>

      <motion.div
        className="mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-3xl font-black text-white mb-1">{formattedValue}</div>
        <div className="text-xs text-slate-400 font-medium">{label}</div>
      </motion.div>

      {explanation && (
        <motion.div
          className="text-xs text-slate-500 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {explanation}
        </motion.div>
      )}
    </motion.div>
  )
}
