import React from 'react'
import { motion } from 'framer-motion'
import { Shield, CheckCircle, AlertTriangle, Mail, TrendingUp, Clock, Activity } from 'lucide-react'
import KPICard from '../../components/distribution/KPICard'
import PageHeader from '../../components/distribution/PageHeader'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function CustomerDashboard() {
  const protectionStatus = 'protected' // protected, warning, critical
  const healthPercent = 98
  const mailboxesProtected = 12
  const threatsBlocked = 24
  const onboardingPercent = 85

  const statusConfig = {
    protected: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      label: 'Protected',
      message: 'All systems are secure and functioning normally'
    },
    warning: {
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      label: 'Attention Required',
      message: 'Some mailboxes require attention'
    },
    critical: {
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      label: 'Action Needed',
      message: 'Some connections are offline'
    }
  }

  const config = statusConfig[protectionStatus]

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Email Protection Status"
        description="Your mailboxes are protected by Perception Point"
        icon={Shield}
      />

      {/* Large Protection Status Card */}
      <motion.div
        className={`glass rounded-2xl p-8 border ${config.borderColor} ${config.bgColor}`}
        variants={itemVariants}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">
              {config.label}
            </h2>
            <p className="text-sm text-slate-400">{config.message}</p>
          </div>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgColor} border ${config.borderColor}`}
          >
            {protectionStatus === 'protected' ? (
              <CheckCircle className={`w-8 h-8 ${config.color}`} />
            ) : (
              <AlertTriangle className={`w-8 h-8 ${config.color}`} />
            )}
          </motion.div>
        </div>

        {/* Health Indicator */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">System Health</span>
            <span className={`text-lg font-black ${config.color}`}>{healthPercent}%</span>
          </div>
          <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400`}
              initial={{ width: '0%' }}
              animate={{ width: `${healthPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={pageVariants}
      >
        <KPICard
          icon={Mail}
          label="Mailboxes Protected"
          value={mailboxesProtected}
          trend={null}
          explanation="Connected and active"
          status="active"
        />
        <KPICard
          icon={AlertTriangle}
          label="Threats Blocked (This Week)"
          value={threatsBlocked}
          trend={8}
          trendDirection="up"
          explanation="Malicious emails stopped"
          status="active"
        />
        <KPICard
          icon={TrendingUp}
          label="System Health"
          value={healthPercent}
          trend={null}
          explanation="All components functioning"
          status="active"
          format="percent"
        />
        <KPICard
          icon={Clock}
          label="Onboarding Progress"
          value={onboardingPercent}
          trend={null}
          explanation="Setup nearly complete"
          status="active"
          format="percent"
        />
      </motion.div>

      {/* Status Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={pageVariants}
      >
        {/* Microsoft 365 */}
        <motion.div
          className="glass rounded-xl p-6 border border-white/10"
          variants={itemVariants}
          whileHover={{ borderColor: 'rgba(44,106,138,0.4)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Microsoft 365</h3>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className="text-emerald-400 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Mailboxes</span>
              <span className="text-white font-semibold">10</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Last Sync</span>
              <span className="text-slate-500">2 min ago</span>
            </div>
          </div>
        </motion.div>

        {/* Gmail */}
        <motion.div
          className="glass rounded-xl p-6 border border-white/10"
          variants={itemVariants}
          whileHover={{ borderColor: 'rgba(44,106,138,0.4)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Gmail</h3>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Status</span>
              <span className="text-emerald-400 font-semibold">Connected</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Mailboxes</span>
              <span className="text-white font-semibold">2</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Last Sync</span>
              <span className="text-slate-500">5 min ago</span>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          className="glass rounded-xl p-6 border border-white/10"
          variants={itemVariants}
          whileHover={{ borderColor: 'rgba(44,106,138,0.4)' }}
        >
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">DNS & Mail Flow</h3>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">DNS Status</span>
              <span className="text-emerald-400 font-semibold">Healthy</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Mail Flow</span>
              <span className="text-emerald-400 font-semibold">Optimal</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Response Time</span>
              <span className="text-white">45ms</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10"
        variants={itemVariants}
      >
        <h3 className="text-base font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { event: 'System check completed', time: '10 minutes ago', icon: CheckCircle, color: 'text-emerald-400' },
            { event: '5 malicious emails blocked', time: '2 hours ago', icon: AlertTriangle, color: 'text-amber-400' },
            { event: 'Gmail connection synced', time: '4 hours ago', icon: Mail, color: 'text-blue-400' },
            { event: 'Onboarding step completed', time: '1 day ago', icon: CheckCircle, color: 'text-emerald-400' },
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                <Icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                <div className="flex-1">
                  <div className="text-sm text-white">{item.event}</div>
                  <div className="text-xs text-slate-500">{item.time}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
