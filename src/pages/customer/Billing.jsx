import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, DollarSign, Calendar, AlertCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const mockInvoices = [
  { id: 'INV-2024-001', period: 'Jan 2024', mailboxes: 245, amount: 208.25, status: 'PAID', dueDate: '2024-02-15' },
  { id: 'INV-2024-002', period: 'Feb 2024', mailboxes: 251, amount: 213.35, status: 'PAID', dueDate: '2024-03-15' },
  { id: 'INV-2024-003', period: 'Mar 2024', mailboxes: 248, amount: 210.80, status: 'PENDING', dueDate: '2024-04-15' },
]

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function CustomerBilling() {
  const { tr } = useLanguage()
  const [expandedId, setExpandedId] = useState(null)

  const totalAmount = mockInvoices.reduce((sum, i) => sum + i.amount, 0)
  const avgMonthly = (totalAmount / mockInvoices.length).toFixed(2)

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black text-white mb-2">{tr('חיוב', 'Billing')}</h1>
        <p className="text-slate-400">{tr('צפה בחשבוניותיך וניהל את החיוב', 'View your invoices and manage billing')}</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: tr('סכום כללי', 'Total Amount'), value: '$' + totalAmount.toFixed(2), icon: DollarSign, color: 'text-blue-400' },
          { label: tr('סכום חודשי ממוצע', 'Average Monthly'), value: '$' + avgMonthly, icon: Calendar, color: 'text-emerald-400' },
          { label: tr('חשבוניות', 'Invoices'), value: mockInvoices.length, icon: FileText, color: 'text-purple-400' },
        ].map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={idx}
              className="glass rounded-xl p-6 border border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1">{card.value}</div>
              <div className="text-xs text-slate-400">{card.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Invoices List */}
      <motion.div variants={itemVariants} className="glass rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">{tr('חשבוניות', 'Invoices')}</h3>
        </div>

        <div className="divide-y divide-white/5">
          {mockInvoices.map(invoice => (
            <div key={invoice.id}>
              <button
                onClick={() => setExpandedId(expandedId === invoice.id ? null : invoice.id)}
                className="w-full px-6 py-4 hover:bg-white/[0.02] transition-colors flex items-center justify-between text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-white">{invoice.id}</span>
                    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                      invoice.status === 'PAID'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {invoice.status === 'PAID' ? tr('משולם', 'Paid') : tr('ממתין', 'Pending')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{invoice.period} • {invoice.mailboxes} {tr('תיבות מוגנות', 'protected mailboxes')}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white">${invoice.amount.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{tr('בתשלום', 'Due')}: {invoice.dueDate}</div>
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === invoice.id && (
                <motion.div
                  className="px-6 py-4 bg-white/[0.02] border-t border-white/5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 mb-2">{tr('פרטי חשבונית', 'Invoice Details')}</h4>
                      <div className="space-y-2 text-xs">
                        {[
                          { label: tr('תקופה', 'Period'), value: invoice.period },
                          { label: tr('תיבות מוגנות', 'Protected Mailboxes'), value: `${invoice.mailboxes} ${tr('תיבות', 'mailboxes')}` },
                          { label: tr('מחיר ליחידה', 'Unit Price'), value: '$0.85/mailbox/month' },
                          { label: tr('סכום', 'Amount'), value: `$${invoice.amount.toFixed(2)}` },
                        ].map(item => (
                          <div key={item.label} className="flex justify-between p-2.5 rounded-lg bg-white/[0.03]">
                            <span className="text-slate-500">{item.label}</span>
                            <span className="text-white font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-slate-400">
                      <div className="font-semibold text-indigo-400 mb-1">{tr('הערה חשובה', 'Important')}</div>
                      {tr('החיוב מבוסס על מספר התיבות המוגנות בפועל המחוברות ב-Perception Point.', 'Billing is based on actual protected mailboxes connected in Perception Point.')}
                    </div>

                    {/* Actions */}
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors w-full justify-center">
                      <Download className="w-3.5 h-3.5" />
                      {tr('הורד PDF', 'Download PDF')}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div variants={itemVariants} className="glass rounded-xl p-6 border border-white/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">{tr('כיצד מחושב החיוב?', 'How is billing calculated?')}</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• {tr('תיבות בפועל - מחושבות לפי חיבורים ב-Perception Point', '• Actual mailboxes - calculated from Perception Point connections')}</li>
              <li>• {tr('חיוב חודשי - בתוך ה-10 ימים הראשונים של החודש הבא', '• Monthly billing - within 10 days of following month')}</li>
              <li>• {tr('אין צורך אשראי - חשבונית בלבד', '• No credit card - invoice only')}</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
