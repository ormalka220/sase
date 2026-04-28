import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Download, DollarSign, Clock, CheckCircle, AlertCircle,
  ChevronDown, Eye, Mail
} from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import PageHeader from '../../components/distribution/PageHeader'

const mockInvoices = [
  { id: 'INV-2024-001', customer: 'Elbit Systems', period: 'Jan 2024', mailboxes: 245, unitPrice: 0.85, amount: 208.25, status: 'PAID', dueDate: '2024-02-15' },
  { id: 'INV-2024-002', customer: 'IsraCard Ltd', period: 'Jan 2024', mailboxes: 128, unitPrice: 0.85, amount: 108.80, status: 'PAID', dueDate: '2024-02-15' },
  { id: 'INV-2024-003', customer: 'TechVision Inc', period: 'Feb 2024', mailboxes: 156, unitPrice: 0.85, amount: 132.60, status: 'PENDING', dueDate: '2024-03-15' },
  { id: 'INV-2024-004', customer: 'Elbit Systems', period: 'Feb 2024', mailboxes: 251, unitPrice: 0.85, amount: 213.35, status: 'PENDING', dueDate: '2024-03-15' },
  { id: 'INV-2024-005', customer: 'IsraCard Ltd', period: 'Feb 2024', mailboxes: 132, unitPrice: 0.85, amount: 112.20, status: 'PENDING', dueDate: '2024-03-15' },
  { id: 'INV-2024-006', customer: 'Global Security', period: 'Mar 2024', mailboxes: 89, unitPrice: 0.85, amount: 75.65, status: 'OVERDUE', dueDate: '2024-04-15' },
]

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

function StatusBadge({ status }) {
  const styles = {
    PAID: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', color: '#10b981', label: 'Paid' },
    PENDING: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', color: '#f59e0b', label: 'Pending' },
    OVERDUE: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', color: '#ef4444', label: 'Overdue' },
  }
  const s = styles[status] || styles.PENDING
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }}></span>
      {s.label}
    </span>
  )
}

export default function IntegratorBilling() {
  const { tr, isHebrew } = useLanguage()
  const [expandedId, setExpandedId] = useState(null)

  const totalInvoices = mockInvoices.length
  const paidInvoices = mockInvoices.filter(i => i.status === 'PAID').length
  const pendingInvoices = mockInvoices.filter(i => i.status === 'PENDING' || i.status === 'OVERDUE').length
  const totalAmount = mockInvoices.reduce((sum, i) => sum + i.amount, 0)
  const paidAmount = mockInvoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0)
  const pendingAmount = mockInvoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.amount, 0)
  const avgMonthly = (totalAmount / 3).toFixed(2)

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title={tr('חיוב וחשבוניות', 'Billing')}
        subtitle={tr('ניהול חשבוניות וביעוד', 'Invoice Management')}
        description={tr('צפה בחשבוניות וניהל את החיוב', 'View invoices and manage billing')}
        icon={FileText}
      />

      {/* KPI Summary */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={pageVariants}
      >
        {[
          { label: tr('סה"כ חשבוניות', 'Total Invoices'), value: totalInvoices, icon: FileText, color: 'text-blue-400' },
          { label: tr('חשבוניות משולמות', 'Paid Invoices'), value: paidInvoices, icon: CheckCircle, color: 'text-emerald-400' },
          { label: tr('חשבוניות ממתינות', 'Pending Invoices'), value: pendingInvoices, icon: Clock, color: 'text-amber-400' },
          { label: tr('סכום חודשי משוער', 'Est. Monthly Amount'), value: '$' + avgMonthly, icon: DollarSign, color: 'text-purple-400' },
        ].map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              className="glass rounded-xl p-6 border border-white/10"
              variants={itemVariants}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-white/5 border border-white/10 ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1">{item.value}</div>
              <div className="text-xs text-slate-400">{item.label}</div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={pageVariants}
      >
        {[
          { label: tr('סכום כללי משולם', 'Total Paid'), amount: '$' + paidAmount.toFixed(2), color: 'text-emerald-400' },
          { label: tr('סכום כללי ממתין', 'Total Pending'), amount: '$' + pendingAmount.toFixed(2), color: 'text-amber-400' },
          { label: tr('סכום כללי', 'Grand Total'), amount: '$' + totalAmount.toFixed(2), color: 'text-blue-400' },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="glass rounded-xl p-6 border border-white/10"
            variants={itemVariants}
          >
            <div className="text-xs text-slate-400 mb-2">{item.label}</div>
            <div className={`text-2xl font-black ${item.color}`}>{item.amount}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Invoices List */}
      <motion.div
        className="glass rounded-xl border border-white/10 overflow-hidden"
        variants={itemVariants}
      >
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{tr('רשימת חשבוניות', 'Invoices')}</h3>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors">
            <Download className="w-3.5 h-3.5" />
            {tr('ייצוא', 'Export')}
          </button>
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
                    <StatusBadge status={invoice.status} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{invoice.customer}</span>
                    <span>•</span>
                    <span>{invoice.period}</span>
                    <span>•</span>
                    <span>{tr('תיבות: ', 'Mailboxes: ')}{invoice.mailboxes}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 ml-4">
                  <div className="text-right">
                    <div className="text-sm font-black text-white">${invoice.amount.toFixed(2)}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{tr('בתשלום', 'Due')}: {invoice.dueDate}</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${
                    expandedId === invoice.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </button>

              {/* Expanded Details */}
              {expandedId === invoice.id && (
                <motion.div
                  className="px-6 py-4 bg-white/[0.02] border-t border-white/5"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="space-y-4">
                    {/* Line Items */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-300 mb-3">{tr('פרטי החשבונית', 'Invoice Details')}</h4>
                      <div className="space-y-2 text-xs">
                        {[
                          { label: tr('חברה', 'Company'), value: invoice.customer },
                          { label: tr('מוצר', 'Product'), value: 'Perception Point Email Security' },
                          { label: tr('מחזור', 'Period'), value: invoice.period },
                          { label: tr('תיבות מוגנות', 'Protected Mailboxes'), value: `${invoice.mailboxes} ${tr('תיבות', 'mailboxes')}` },
                          { label: tr('מחיר ליחידה', 'Unit Price'), value: `$${invoice.unitPrice}/mailbox/month` },
                          { label: tr('סכום', 'Amount'), value: `$${invoice.amount.toFixed(2)}` },
                        ].map(item => (
                          <div key={item.label} className="flex justify-between p-2.5 rounded-lg bg-white/[0.03]">
                            <span className="text-slate-500">{item.label}</span>
                            <span className="text-white font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Business Info */}
                    <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] text-slate-400 leading-relaxed">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5 text-indigo-400" />
                        <div>
                          <div className="font-semibold text-slate-300 mb-1">{tr('הערה חשובה', 'Important Note')}</div>
                          {tr('החיוב מחושב לפי מספר התיבות המוגנות בפועל שמחוברות ב-Perception Point.', 'Billing is calculated based on the actual number of protected mailboxes connected in Perception Point.')}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors">
                        <Download className="w-3.5 h-3.5" />
                        {tr('הורד PDF', 'Download PDF')}
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                        {tr('שלח במייל', 'Email')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        className="glass rounded-xl p-6 border border-white/10"
        variants={itemVariants}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">{tr('כיצד מחושב החיוב?', 'How is billing calculated?')}</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>{tr('• תיבות משוערות - משמשות להערכת מחיר בלבד', '• Estimated mailboxes - used for price estimation only')}</li>
              <li>{tr('• תיבות בפועל - מחושבות לפי חיבורים ב-Perception Point', '• Actual mailboxes - calculated from Perception Point connections')}</li>
              <li>{tr('• התאמת חשבוניות - סוף החודש, מחושבת בפועל', '• Invoice reconciliation - end of month, calculated actuals')}</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
