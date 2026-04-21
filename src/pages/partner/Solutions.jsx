import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe, Lock, Shield, Zap, Users, ArrowLeft,
  CheckCircle, ChevronLeft, Star, Building2
} from 'lucide-react'

const solutions = [
  {
    id: 'sase',
    icon: Globe,
    name: 'Sovereign SASE',
    nameHe: 'SASE ריבוני',
    tagline: 'Control. Security. Sovereignty.',
    description: 'פתרון SASE מלא עם שליטה מלאה על ה-data path, מדיניות ורשת — ארכיטקטורה פרטית לחלוטין.',
    descriptionEn: 'Full SASE solution with complete control over data path, policy, and network — fully private architecture.',
    vendor: 'Fortinet · SpotNet',
    color: '#5B9BB8',
    colorDim: 'rgba(44,106,138,0.12)',
    borderColor: 'rgba(44,106,138,0.2)',
    badge: 'Enterprise · Government · Finance',
    features: [
      'ZTNA — Zero Trust Network Access',
      'SWG — Secure Web Gateway',
      'CASB — Cloud Access Security',
      'FWaaS — Firewall as a Service',
      'SD-WAN Integration',
      'Data Sovereignty',
    ],
    idealFor: ['ממשל וביטחון', 'פיננסים ורגולציה', 'תשתיות קריטיות', 'ארגונים גדולים'],
    price: 'מחיר לפי משתמש / Site',
    tag: 'Most Popular',
  },
  {
    id: 'workspace',
    icon: Lock,
    name: 'Workspace Security',
    nameHe: 'אבטחת סביבת עבודה',
    tagline: 'Stop Threats. Protect People.',
    description: 'הגנה מתקדמת על אימייל, דפדפן ו-SaaS מבוססת AI — עוצרת phishing, BEC, malware ו-account takeover.',
    descriptionEn: 'Advanced AI-based protection for email, browser, and SaaS — stops phishing, BEC, malware, and account takeover.',
    vendor: 'Perception Point',
    color: '#10b981',
    colorDim: 'rgba(16,185,129,0.12)',
    borderColor: 'rgba(16,185,129,0.2)',
    badge: 'SMB · Enterprise · All Sectors',
    features: [
      'Email Security (M365 / Google)',
      'Browser Security',
      'Cloud Storage Protection',
      'Collaboration Tools',
      'AI Threat Detection',
      'Incident Response',
    ],
    idealFor: ['כל הארגונים', 'Microsoft 365', 'Google Workspace', 'הגנה מהירה לפריסה'],
    price: 'מחיר לפי משתמש / חודש',
    tag: 'Fast Deploy',
  },
]

export default function PartnerSolutions() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Solutions</h1>
          <p className="text-slate-500 text-sm mt-0.5">פתרונות הסייבר שלנו | Our Cyber Portfolio</p>
        </div>
        <button
          onClick={() => navigate('/partner/compare')}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          השוואת פתרונות
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {solutions.map(sol => (
          <div
            key={sol.id}
            className="glass rounded-2xl p-6 cursor-pointer hover:scale-[1.01] transition-all duration-300"
            style={{ border: `1px solid ${sol.borderColor}`, boxShadow: `0 0 40px ${sol.colorDim}` }}
            onClick={() => navigate(`/partner/solutions/${sol.id}`)}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: sol.colorDim, border: `1px solid ${sol.borderColor}` }}
                >
                  <sol.icon className="w-6 h-6" style={{ color: sol.color }} />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{sol.name}</div>
                  <div className="text-xs text-slate-500">{sol.nameHe}</div>
                </div>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: `${sol.colorDim}`, color: sol.color, border: `1px solid ${sol.borderColor}` }}
              >
                {sol.tag}
              </span>
            </div>

            {/* Tagline */}
            <div className="text-base font-semibold mb-2" style={{ color: sol.color }}>
              {sol.tagline}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-400 mb-5 leading-relaxed">{sol.description}</p>

            {/* Features */}
            <div className="mb-5">
              <div className="text-xs text-slate-500 mb-2.5 font-medium">יכולות עיקריות</div>
              <div className="grid grid-cols-2 gap-1.5">
                {sol.features.map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: sol.color }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Ideal For */}
            <div className="mb-5">
              <div className="text-xs text-slate-500 mb-2 font-medium">מתאים ל</div>
              <div className="flex flex-wrap gap-1.5">
                {sol.idealFor.map(t => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] text-slate-600">Vendor</div>
                <div className="text-xs font-medium text-slate-400">{sol.vendor}</div>
              </div>
              <button
                className="flex items-center gap-2 text-sm font-semibold transition-all hover:gap-3"
                style={{ color: sol.color }}
              >
                פרטים מלאים
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="glass glow-border rounded-2xl p-6 flex items-center justify-between">
        <div>
          <div className="font-semibold text-white mb-1">לא בטוח איזה מוצר מתאים ללקוח שלך?</div>
          <div className="text-sm text-slate-500">השתמש בכלי ההשוואה שלנו לקבלת המלצה מותאמת אישית</div>
        </div>
        <button
          onClick={() => navigate('/partner/compare')}
          className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap"
        >
          השוואת פתרונות
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
