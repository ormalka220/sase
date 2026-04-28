import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

const onboardingStats = [
  { label: 'Not Started', count: 3, color: '#6b7280', gradient: 'from-slate-500' },
  { label: 'Admin Invited', count: 5, color: '#0ea5e9', gradient: 'from-sky-500' },
  { label: 'MS 365 Waiting', count: 8, color: '#f59e0b', gradient: 'from-amber-500' },
  { label: 'Gmail Waiting', count: 2, color: '#f59e0b', gradient: 'from-amber-500' },
  { label: 'DNS Pending', count: 4, color: '#f59e0b', gradient: 'from-amber-500' },
  { label: 'Active', count: 24, color: '#10b981', gradient: 'from-emerald-500' },
  { label: 'Failed', count: 2, color: '#ef4444', gradient: 'from-red-500' },
]

const totalCustomers = onboardingStats.reduce((sum, stat) => sum + stat.count, 0)

export default function OnboardingHealthSection() {
  return (
    <motion.div
      className="glass rounded-xl p-6 border border-white/10 col-span-full lg:col-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 flex-shrink-0">
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Onboarding Status</h3>
          <p className="text-xs text-slate-400 mt-0.5">{totalCustomers} total customers</p>
        </div>
      </div>

      {/* Status cards */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-1 gap-3"
        initial="hidden"
        animate="visible"
        variants={{ staggerChildren: 0.04, delayChildren: 0.1 }}
      >
        {onboardingStats.map((stat) => {
          const percentage = (stat.count / totalCustomers) * 100
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-slate-300">{stat.label}</span>
                <span className="text-xs font-bold text-white group-hover:text-cdata-400 transition-colors">{stat.count}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} to-transparent`}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{percentage.toFixed(0)}% of total</div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
