import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { useLanguage } from '../../context/LanguageContext'

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
}

export default function ApprovalQueuePreview({ orders = [], onViewAll = null }) {
  const { tr, isHebrew } = useLanguage()
  const pendingOrders = orders
    .filter(o => ['PENDING_APPROVAL', 'PENDING_CDATA_APPROVAL'].includes(o.status))
    .slice(0, 5)

  const waitingReviewText = pendingOrders.length === 1
    ? (isHebrew ? 'הזמנה אחת ממתינה לביקורת' : '1 order waiting for review')
    : (isHebrew ? `${pendingOrders.length} הזמנות ממתינות לביקורת` : `${pendingOrders.length} orders waiting for review`)

  return (
    <motion.div
      className="glass rounded-xl p-6 border border-white/10 col-span-full lg:col-span-1"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{tr('תור אישורים', 'Approval Queue')}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{waitingReviewText}</p>
          </div>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/5 text-xs text-cdata-400 hover:text-cdata-300 font-semibold transition-colors"
          >
            {tr('צפה בכל', 'View all')} <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {pendingOrders.length === 0 ? (
        <motion.div
          className="text-center py-8"
          variants={itemVariants}
        >
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-50" />
          <p className="text-xs text-slate-500">{tr('אין אישורים ממתינים', 'No pending approvals')}</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        >
          {pendingOrders.map((order) => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              className="p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-white">{order.customer?.companyName || tr('לא ידוע', 'Unknown')}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {isHebrew
                      ? `על ידי ${order.integrator?.organization?.name || tr('לא ידוע', 'Unknown')}`
                      : `by ${order.integrator?.organization?.name || tr('לא ידוע', 'Unknown')}`
                    }
                  </div>
                </div>
                <StatusBadge
                  status="pending"
                  label={order.billingCycle || tr('חודשי', 'Monthly')}
                  size="sm"
                />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">
                  {(order.estimatedUsers || 0).toLocaleString()} {isHebrew ? 'תיבות דואר' : 'mailboxes'}
                </span>
                <span className="text-emerald-400 font-semibold">${(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
