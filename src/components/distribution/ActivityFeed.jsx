import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, Mail, Zap, Building2, FileText } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { getCommonLabels } from '../../i18n/labels'

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
}

const activityIcons = {
  order_submitted: { icon: FileText, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  order_approved: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  cdata_approved: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  pp_org_created: { icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  admin_invited: { icon: Mail, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  ms365_connected: { icon: Zap, color: 'text-cdata-400', bg: 'bg-cdata-500/10' },
  gmail_connected: { icon: Zap, color: 'text-cdata-400', bg: 'bg-cdata-500/10' },
  invoice_generated: { icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10' },
}

const activities = [
  { 
    type: 'order_approved', 
    customer: 'TechCorp Ltd', 
    integrator: 'Global Systems', 
    description: 'Order approved by CData',
    time: '2 hours ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  { 
    type: 'admin_invited', 
    customer: 'DataFlow Inc', 
    integrator: 'Tech Partners',
    description: 'Admin invited to Perception Point', 
    time: '5 hours ago',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  { 
    type: 'ms365_connected', 
    customer: 'SecureNet', 
    integrator: 'Enterprise Solutions',
    description: 'Microsoft 365 connected',
    time: '8 hours ago',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
  },
  { 
    type: 'pp_org_created', 
    customer: 'CloudFirst', 
    integrator: 'Digital Leaders',
    description: 'PP organization created',
    time: '1 day ago',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
  },
  { 
    type: 'order_submitted', 
    customer: 'NextGen Corp', 
    integrator: 'Growth Partners',
    description: 'New order submitted',
    time: '2 days ago',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000)
  },
]

export default function ActivityFeed() {
  return (
    <motion.div
      className="glass rounded-xl p-6 border border-white/10 col-span-full lg:col-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-slate-500/10 border border-slate-500/30 flex-shrink-0">
          <Clock className="w-5 h-5 text-slate-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
          <p className="text-xs text-slate-400 mt-0.5">Latest onboarding events</p>
        </div>
      </div>

      {/* Activity timeline */}
      <motion.div
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{ staggerChildren: 0.05, delayChildren: 0.1 }}
      >
        {activities.map((activity, idx) => {
          const config = activityIcons[activity.type] || activityIcons.order_submitted
          const ActivityIcon = config.icon

          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group"
            >
              {/* Timeline dot and connector */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`p-2 rounded-lg ${config.bg} ${config.color} border border-white/10`}>
                  <ActivityIcon className="w-4 h-4" />
                </div>
                {idx < activities.length - 1 && (
                  <div className="w-0.5 h-6 bg-gradient-to-b from-slate-500/50 to-transparent my-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="text-xs font-semibold text-white group-hover:text-cdata-400 transition-colors">
                  {activity.customer}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">{activity.description}</div>
                <div className="text-[9px] text-slate-600 mt-1">{activity.integrator}</div>
              </div>

              {/* Time */}
              <div className="text-[10px] text-slate-600 flex-shrink-0 text-right whitespace-nowrap">
                {activity.time}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
