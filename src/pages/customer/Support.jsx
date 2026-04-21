import React, { useState } from 'react'
import {
  HelpCircle, MessageSquare, Phone, Mail, FileText,
  ChevronLeft, Clock, CheckCircle, AlertCircle, Plus
} from 'lucide-react'
import { CDataLogo, SpotNetLogo } from '../../components/Logos'

const tickets = [
  { id: 'TK-2341', subject: 'שאלה על הגדרת MFA לכל המשתמשים', status: 'open',     priority: 'medium', created: 'היום 09:12',    agent: 'תמיכה C-Data' },
  { id: 'TK-2318', subject: 'Email Security — דיווח על False Positive',status: 'in-progress', priority: 'high', created: 'אתמול 14:30', agent: 'Perception Point IR' },
  { id: 'TK-2290', subject: 'בקשה לדוח עמידה ב-ISO 27001', status: 'resolved',   priority: 'low',    created: '15/10/2025',    agent: 'תמיכה C-Data' },
  { id: 'TK-2271', subject: 'שאלה על חיבור סניף חדש ל-SASE',  status: 'resolved',   priority: 'medium', created: '10/10/2025',    agent: 'SpotNet Tech' },
]

const statusCfg = {
  open:        { label: 'פתוח',      badge: 'badge-orange', icon: AlertCircle },
  'in-progress':{ label: 'בטיפול',   badge: 'badge-blue',   icon: Clock },
  resolved:    { label: 'נסגר',      badge: 'badge-green',  icon: CheckCircle },
}

const priorityCfg = {
  high:   { label: 'גבוהה', color: 'text-red-400' },
  medium: { label: 'בינונית', color: 'text-amber-400' },
  low:    { label: 'נמוכה', color: 'text-slate-400' },
}

const faqs = [
  { q: 'איך מוסיפים משתמש חדש להגנה?', a: 'ניתן להוסיף משתמשים דרך עמוד Users → הוסף משתמש, או ישירות מה-M365 admin center.' },
  { q: 'מה קורה כשנחסם מייל לגיטימי?', a: 'ניתן לדווח על False Positive ישירות מהממשק. הצוות שלנו יטפל תוך עד 4 שעות.' },
  { q: 'איך מוציאים דוח אבטחה חודשי?', a: 'עמוד Reports → בחר חודש → הורד PDF. הדוחות נשמרים 12 חודשים אחורה.' },
  { q: 'האם SASE פועל גם מחוץ לישראל?', a: 'כן — Sovereign SASE פועל מכל מקום עם שמירה על ה-data path בישראל.' },
]

export default function CustomerSupport() {
  const [showForm, setShowForm] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">תמיכה</h1>
          <p className="text-slate-500 text-sm mt-0.5">Support Center</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          פתח קריאה חדשה
        </button>
      </div>

      {/* Contact options */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: MessageSquare, label: 'Live Chat', sub: 'זמין ראשון-חמישי 08:00–18:00', color: 'text-cdata-300', bg: 'rgba(44,106,138,0.1)', border: 'rgba(44,106,138,0.2)', action: 'פתח Chat' },
          { icon: Mail,          label: 'Email Support', sub: 'support@cdata.co.il',      color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', action: 'שלח מייל' },
          { icon: Phone,         label: 'Phone Support', sub: '03-123-4567 | זמין 24/7', color: 'text-spot-400', bg: 'rgba(245,124,32,0.1)', border: 'rgba(245,124,32,0.2)', action: 'התקשר' },
        ].map(c => (
          <div key={c.label} className="glass rounded-xl p-5 cursor-pointer hover:scale-[1.02] transition-all"
            style={{ border: `1px solid ${c.border}`, background: c.bg }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(0,0,0,0.25)' }}>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
            <div className="font-semibold text-white text-sm mb-1">{c.label}</div>
            <div className="text-xs text-slate-500 mb-4">{c.sub}</div>
            <button className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: c.color }}>
              {c.action} <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Open tickets */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
          <div>
            <div className="font-semibold text-white text-sm">קריאות שירות</div>
            <div className="text-xs text-slate-500">Support Tickets</div>
          </div>
          <span className="badge-blue text-xs">{tickets.filter(t => t.status !== 'resolved').length} פתוחות</span>
        </div>
        {tickets.map((t, i) => {
          const cfg = statusCfg[t.status]
          const pri = priorityCfg[t.priority]
          return (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all cursor-pointer group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(44,106,138,0.1)', border: '1px solid rgba(44,106,138,0.15)' }}>
                <cfg.icon className="w-4 h-4 text-cdata-300" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm truncate">{t.subject}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-slate-600">{t.id}</span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <span className="text-[10px] text-slate-600">{t.agent}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-[10px] font-semibold ${pri.color}`}>{pri.label}</span>
                <span className={`text-[10px] ${cfg.badge}`}>{cfg.label}</span>
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />{t.created}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <div className="font-semibold text-white text-sm">שאלות נפוצות</div>
          <div className="text-xs text-slate-500">FAQ</div>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-white/[0.04] last:border-0">
            <button
              className="w-full px-5 py-4 flex items-center justify-between text-right hover:bg-white/[0.02] transition-all"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span className="text-sm font-medium text-white">{faq.q}</span>
              <ChevronLeft className={`w-4 h-4 text-slate-500 flex-shrink-0 mr-2 transition-transform ${openFaq === i ? '-rotate-90' : ''}`} />
            </button>
            {openFaq === i && (
              <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed"
                style={{ borderTop: '1px solid rgba(44,106,138,0.08)', paddingTop: '12px' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Support team logos */}
      <div className="glass glow-border rounded-xl p-4 flex items-center justify-center gap-8">
        <div className="text-center">
          <div className="text-[10px] text-slate-600 mb-2">Distribution Support</div>
          <CDataLogo className="h-6 opacity-60" />
        </div>
        <div className="w-px h-8 bg-white/5"></div>
        <div className="text-center">
          <div className="text-[10px] text-slate-600 mb-2">Technical Support</div>
          <SpotNetLogo className="h-5 opacity-60" />
        </div>
      </div>

      {/* New ticket modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowForm(false)}>
          <div className="glass-strong rounded-2xl p-7 w-full max-w-lg mx-4"
            style={{ border: '1px solid rgba(44,106,138,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-bold text-white text-lg">קריאת שירות חדשה</div>
                <div className="text-xs text-slate-500">Open Support Ticket</div>
              </div>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors text-lg leading-none">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">נושא</label>
                <input placeholder="תיאור קצר של הבעיה..." className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none" style={{ borderColor: 'rgba(44,106,138,0.2)' }} />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">קטגוריה</label>
                <select className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none" style={{ borderColor: 'rgba(44,106,138,0.2)' }}>
                  <option>Email Security</option>
                  <option>Browser Security</option>
                  <option>Sovereign SASE</option>
                  <option>ניהול משתמשים</option>
                  <option>כללי / אחר</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">פירוט</label>
                <textarea rows={3} placeholder="תיאור מפורט של הבעיה..." className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none resize-none" style={{ borderColor: 'rgba(44,106,138,0.2)' }} />
              </div>
              <div className="flex gap-3 pt-1">
                <button className="flex-1 btn-primary text-sm" onClick={() => setShowForm(false)}>שלח קריאה</button>
                <button className="flex-1 btn-ghost text-sm" onClick={() => setShowForm(false)}>ביטול</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
