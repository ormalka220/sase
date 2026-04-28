import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, ExternalLink, FileText, Mail, Shield } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function CustomerOnboarding() {
  const { tr } = useLanguage()

  const steps = [
    { id: 1, title: tr('הזמנה הוגשה', 'Order Submitted'), status: 'completed', icon: CheckCircle2 },
    { id: 2, title: tr('אישור CData', 'CData Approval'), status: 'completed', icon: CheckCircle2 },
    { id: 3, title: tr('הזמנת PP נוצרה', 'PP Organization Created'), status: 'in_progress', icon: Shield },
    { id: 4, title: tr('מנהל הוזמן', 'Admin Invited'), status: 'pending', icon: Mail },
    { id: 5, title: tr('חיבור Microsoft 365', 'Connect Microsoft 365'), status: 'pending', icon: ExternalLink },
    { id: 6, title: tr('חיבור Gmail', 'Connect Gmail'), status: 'pending', icon: ExternalLink },
  ]

  const resources = [
    { title: tr('עמוד ההתחלה', 'Getting Started'), desc: tr('מידע בסיסי על Perception Point', 'Basic Perception Point information'), icon: FileText },
    { title: tr('חיבור Microsoft 365', 'Microsoft 365 Connection'), desc: tr('הוראות שלב אחרי שלב', 'Step-by-step instructions'), icon: ExternalLink },
    { title: tr('חיבור Gmail', 'Gmail Connection'), desc: tr('חיבור חשבונות Gmail', 'Gmail account connection'), icon: ExternalLink },
    { title: tr('צור קשר עם המשתתף', 'Contact Integrator'), desc: tr('קבל עזרה מהשותף שלך', 'Get help from your integrator'), icon: Mail },
  ]

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-black text-white mb-2">{tr('הכנת Perception Point', 'Perception Point Setup')}</h1>
        <p className="text-slate-400">{tr('עקוב אחרי התקדמות ההכנה שלך', 'Follow your setup progress')}</p>
      </motion.div>

      {/* Progress */}
      <motion.div variants={itemVariants} className="glass rounded-xl p-6 border border-white/10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{tr('התקדמות כוללת', 'Overall Progress')}</h3>
          <span className="text-2xl font-black text-emerald-400">50%</span>
        </div>
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400"
            initial={{ width: '0%' }}
            animate={{ width: '50%' }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h3 className="text-sm font-semibold text-white mb-4">{tr('שלבי הכנה', 'Setup Steps')}</h3>
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isCompleted = step.status === 'completed'
          const isInProgress = step.status === 'in_progress'
          
          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted ? 'bg-emerald-500' :
                  isInProgress ? 'bg-blue-500' :
                  'bg-white/5'
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isCompleted || isInProgress ? 'text-white' : 'text-slate-600'
                  }`} />
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-8 ${isCompleted ? 'bg-emerald-500' : 'bg-white/10'}`} />
                )}
              </div>
              <div className="pb-4">
                <div className={`text-sm font-semibold ${isCompleted ? 'text-emerald-400' : isInProgress ? 'text-blue-400' : 'text-slate-400'}`}>
                  {step.title}
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Action Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((resource, idx) => {
          const Icon = resource.icon
          return (
            <button key={idx} className="glass rounded-xl p-5 border border-white/10 hover:border-white/20 hover:bg-white/[0.03] text-left transition-all text-white group">
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Icon className="w-4 h-4 text-slate-300" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white group-hover:text-white transition-colors">{resource.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{resource.desc}</p>
                </div>
              </div>
            </button>
          )
        })}
      </motion.div>

      {/* Info Box */}
      <motion.div variants={itemVariants} className="glass rounded-xl p-6 border border-blue-500/30 bg-blue-500/5">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">{tr('דוגמה בלבד', 'Demo Example')}</h4>
        <p className="text-xs text-slate-400">
          {tr('דף זה הוא דוגמה של תהליך ההכנה. בסביבת ייצור, תוכל לעקוב אחר ההתקדמות בזמן אמת.', 'This page is a demo of the onboarding process. In production, you would track progress in real-time.')}
        </p>
      </motion.div>
    </motion.div>
  )
}
