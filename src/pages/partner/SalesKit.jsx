import React from 'react'
import { Download, FileText, Video, Presentation, Globe, Lock, ExternalLink, BookOpen, Play } from 'lucide-react'

const categories = [
  {
    title: 'Sovereign SASE',
    titleHe: 'חומרי מכירה SASE',
    color: '#5B9BB8',
    bg: 'rgba(44,106,138,0.08)',
    border: 'rgba(44,106,138,0.18)',
    icon: Globe,
    items: [
      { type: 'PDF', icon: FileText, title: 'SASE Solution Brief', desc: 'סקירת הפתרון — 2 עמודים', size: '1.2 MB', tag: 'hot' },
      { type: 'PDF', icon: FileText, title: 'Technical Architecture Guide', desc: 'ארכיטקטורה טכנית מלאה', size: '4.5 MB', tag: null },
      { type: 'PPT', icon: FileText, title: 'Sales Presentation Deck', desc: 'מצגת מכירה — 28 שקופיות', size: '8.1 MB', tag: 'new' },
      { type: 'PDF', icon: FileText, title: 'ROI Calculator Guide', desc: 'כלי לחישוב ROI ללקוח', size: '0.8 MB', tag: null },
      { type: 'VIDEO', icon: Video, title: 'Product Demo (5 min)', desc: 'וידאו הדגמה קצר', size: 'Stream', tag: null },
      { type: 'PDF', icon: FileText, title: 'Case Study — Finance Sector', desc: 'לקוח פיננסי — success story', size: '2.1 MB', tag: 'new' },
    ],
  },
  {
    title: 'Workspace Security',
    titleHe: 'חומרי מכירה Workspace',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.18)',
    icon: Lock,
    items: [
      { type: 'PDF', icon: FileText, title: 'Workspace Security Brief', desc: 'סקירת Perception Point', size: '1.5 MB', tag: 'hot' },
      { type: 'PPT', icon: FileText, title: 'Sales Deck — All Sectors', desc: 'מצגת מכירה כוללת', size: '6.4 MB', tag: null },
      { type: 'PDF', icon: FileText, title: 'Email Security Deep Dive', desc: 'פירוט מלא על Email Security', size: '3.2 MB', tag: null },
      { type: 'VIDEO', icon: Video, title: 'Live Attack Demo', desc: 'הדגמת חסימת מתקפה בזמן אמת', size: 'Stream', tag: 'new' },
      { type: 'PDF', icon: FileText, title: 'Competitive Comparison', desc: 'השוואה מול Proofpoint / Mimecast', size: '2.8 MB', tag: null },
      { type: 'PDF', icon: FileText, title: 'SMB Quick Start Guide', desc: 'מדריך פריסה מהיר ל-SMB', size: '1.1 MB', tag: null },
    ],
  },
]

const tagStyle = { hot: 'badge-red', new: 'badge-green' }
const tagLabel = { hot: '🔥', new: 'New' }

export default function PartnerSalesKit() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Sales Kit</h1>
        <p className="text-slate-500 text-sm mt-0.5">חומרי מכירה ותמיכה | Sales & Support Materials</p>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: BookOpen, label: 'Partner Playbook', desc: 'מדריך מכירה מלא', color: 'text-cdata-300', bg: 'bg-cdata-500/15' },
          { icon: FileText, label: 'Pricing Guide', desc: 'מחירון עדכני שנוכח', color: 'text-amber-400', bg: 'bg-amber-600/15' },
          { icon: Play, label: 'Training Videos', desc: '12 סרטוני הכשרה', color: 'text-violet-400', bg: 'bg-violet-600/15' },
        ].map(item => (
          <button key={item.label} className="stat-card flex items-center gap-4 hover:border-white/15 text-right">
            <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white text-sm">{item.label}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
          </button>
        ))}
      </div>

      {/* Categories */}
      {categories.map(cat => (
        <div key={cat.title} className="glass rounded-2xl overflow-hidden" style={{ border: `1px solid ${cat.border}` }}>
          <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: cat.border, background: cat.bg }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <cat.icon className="w-4 h-4" style={{ color: cat.color }} />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{cat.title}</div>
              <div className="text-[10px] text-slate-500">{cat.titleHe}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-0">
            {cat.items.map((item, i) => (
              <div
                key={i}
                className="p-4 border-b border-l border-white/[0.04] hover:bg-white/[0.02] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: cat.bg }}
                    >
                      <item.icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: cat.bg, color: cat.color }}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                  {item.tag && (
                    <span className={`text-[10px] ${tagStyle[item.tag]}`}>{tagLabel[item.tag]}</span>
                  )}
                </div>
                <div className="font-semibold text-white text-sm mb-1">{item.title}</div>
                <div className="text-xs text-slate-500 mb-3">{item.desc}</div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-600">{item.size}</span>
                  <button
                    className="flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: cat.color }}
                  >
                    <Download className="w-3 h-3" />
                    הורד
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
