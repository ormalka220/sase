import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Globe, Lock, CheckCircle, ArrowLeft, Download,
  Play, Plus, ChevronLeft, Shield, Zap, Users,
  Building2, FileText, BarChart3
} from 'lucide-react'

const solutions = {
  sase: {
    icon: Globe,
    name: 'Sovereign SASE',
    nameHe: 'SASE ריבוני',
    tagline: 'Control. Security. Sovereignty.',
    color: '#5B9BB8',
    colorDim: 'rgba(44,106,138,0.12)',
    borderColor: 'rgba(44,106,138,0.2)',
    vendor: 'Fortinet · SpotNet',
    description: 'Sovereign SASE הוא פתרון SASE מלא הבנוי על תשתית פרטית וריבונית, המאפשר לארגונים לשמור על שליטה מוחלטת בנתונים, המדיניות והרשת שלהם — ללא תלות בענן ציבורי.',
    components: [
      { name: 'ZTNA', desc: 'Zero Trust Network Access — גישה מאובטחת לאפליקציות ורשתות', icon: Shield },
      { name: 'SWG', desc: 'Secure Web Gateway — סינון ואבטחת תעבורת אינטרנט', icon: Globe },
      { name: 'CASB', desc: 'Cloud Access Security Broker — שליטה ואבטחת שירותי ענן', icon: Shield },
      { name: 'FWaaS', desc: 'Firewall as a Service — חומת אש בענן ריבוני', icon: Zap },
      { name: 'SD-WAN', desc: 'תשתית רשת מוגדרת תוכנה לחיבורי סניפים', icon: Building2 },
      { name: 'Visibility', desc: 'ניטור מלא של תעבורה, משתמשים ואיומים', icon: BarChart3 },
    ],
    useCases: [
      { title: 'עובדים מרחוק', desc: 'גישה מאובטחת ומהירה מכל מקום, ללא VPN מסורתי' },
      { title: 'חיבור סניפים', desc: 'SD-WAN + Security בפריסה אחידה לכל הסניפים' },
      { title: 'דרישות רגולציה', desc: 'עמידה בדרישות GDPR, ITAR, ISO 27001 ועוד' },
      { title: 'Data Sovereignty', desc: 'שמירת הנתונים בתשתית ישראלית ריבונית' },
    ],
    sectors: ['ממשל ובטחון', 'פיננסים', 'תשתיות קריטיות', 'בריאות', 'תעשייה', 'חינוך'],
  },
  workspace: {
    icon: Lock,
    name: 'Workspace Security',
    nameHe: 'אבטחת סביבת עבודה',
    tagline: 'Stop Threats. Protect People.',
    color: '#10b981',
    colorDim: 'rgba(16,185,129,0.1)',
    borderColor: 'rgba(16,185,129,0.2)',
    vendor: 'Perception Point',
    description: 'Workspace Security מבוסס Perception Point מספק הגנה מתקדמת המבוססת AI על כל ערוצי סביבת העבודה המודרנית — אימייל, דפדפן, אחסון ענן וכלי שיתוף פעולה.',
    components: [
      { name: 'Email Security', desc: 'הגנה על M365 ו-Google Workspace מ-phishing, BEC ומלוור', icon: Shield },
      { name: 'Browser Security', desc: 'הגנה בזמן גלישה — חסימת אתרים זדוניים ו-zero-day', icon: Globe },
      { name: 'Cloud Storage', desc: 'סריקה וניטור של SharePoint, OneDrive, Google Drive', icon: Shield },
      { name: 'Collaboration', desc: 'הגנה על Teams, Slack, Zoom מ-malicious content', icon: Users },
      { name: 'AI Detection', desc: 'מנוע AI מתקדם לגילוי איומים לא ידועים', icon: Zap },
      { name: 'IR Team', desc: 'צוות תגובה לאירועים 24/7 הכלול בשירות', icon: BarChart3 },
    ],
    useCases: [
      { title: 'מניעת Phishing', desc: 'חסימת מיילים זדוניים לפני שמגיעים לתיבת הדואר' },
      { title: 'הגנה מ-BEC', desc: 'זיהוי ועצירת הונאות Business Email Compromise' },
      { title: 'Ransomware Prevention', desc: 'חסימת קבצים זדוניים לפני הפעלה' },
      { title: 'Account Takeover', desc: 'גילוי ועצירת ניסיונות השתלטות על חשבונות' },
    ],
    sectors: ['כל הסקטורים', 'SMB', 'Enterprise', 'פיננסים', 'בריאות', 'חינוך'],
  },
}

export default function PartnerSolutionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const sol = solutions[id] || solutions.sase

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/partner/solutions')}
        className="flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rotate-180" />
        חזרה לפתרונות
      </button>

      {/* Hero */}
      <div
        className="glass rounded-2xl p-8"
        style={{ border: `1px solid ${sol.borderColor}`, boxShadow: `0 0 60px ${sol.colorDim}` }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: sol.colorDim, border: `1px solid ${sol.borderColor}` }}
            >
              <sol.icon className="w-8 h-8" style={{ color: sol.color }} />
            </div>
            <div>
              <div className="text-3xl font-black text-white">{sol.name}</div>
              <div className="text-slate-500 text-sm">{sol.nameHe}</div>
              <div className="text-lg font-semibold mt-1" style={{ color: sol.color }}>{sol.tagline}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Datasheet
            </button>
            <button className="btn-ghost flex items-center gap-2 text-sm">
              <Play className="w-4 h-4" />
              Demo Video
            </button>
            <button
              onClick={() => navigate('/partner/opportunities')}
              className="btn-primary flex items-center gap-2 text-sm"
              style={id === 'workspace' ? { background: '#059669' } : {}}
            >
              <Plus className="w-4 h-4" />
              פתח הזדמנות
            </button>
          </div>
        </div>
        <p className="text-slate-400 mt-5 leading-relaxed max-w-3xl">{sol.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Components */}
        <div className="col-span-2 glass glow-border rounded-xl p-5">
          <div className="font-semibold text-white mb-4">רכיבים עיקריים | Core Components</div>
          <div className="grid grid-cols-2 gap-3">
            {sol.components.map(c => (
              <div key={c.name} className="p-4 rounded-xl bg-white/[0.025] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: sol.colorDim }}
                  >
                    <c.icon className="w-3.5 h-3.5" style={{ color: sol.color }} />
                  </div>
                  <span className="font-semibold text-white text-sm">{c.name}</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Use Cases */}
          <div className="glass glow-border rounded-xl p-4">
            <div className="font-semibold text-white text-sm mb-3">Use Cases</div>
            <div className="space-y-3">
              {sol.useCases.map(uc => (
                <div key={uc.title} className="flex gap-2">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: sol.color }} />
                  <div>
                    <div className="text-xs font-semibold text-white">{uc.title}</div>
                    <div className="text-[11px] text-slate-500">{uc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sectors */}
          <div className="glass glow-border rounded-xl p-4">
            <div className="font-semibold text-white text-sm mb-3">סקטורים</div>
            <div className="flex flex-wrap gap-1.5">
              {sol.sectors.map(s => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: sol.colorDim, color: sol.color, border: `1px solid ${sol.borderColor}` }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="rounded-xl p-4 text-center"
            style={{ background: sol.colorDim, border: `1px solid ${sol.borderColor}` }}
          >
            <div className="font-semibold text-white text-sm mb-1">מוכן להתחיל?</div>
            <div className="text-xs text-slate-400 mb-3">בקש Demo ונחזור אליך תוך 24 שעות</div>
            <button
              className="w-full py-2 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: sol.color }}
            >
              בקש Demo / POC
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
