import React, { useState } from 'react'
import { Globe, Lock, CheckCircle, X, Minus, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const rows = [
  { category: 'סוג פתרון', sase: 'רשת + אבטחה משולבת', ws: 'הגנת Workspace' },
  { category: 'מוצר', sase: 'Fortinet FortiSASE', ws: 'Perception Point' },
  { category: 'טכנולוגיה', sase: 'ZTNA · SWG · CASB · FWaaS', ws: 'AI Email · Browser · SaaS' },
  { category: 'פריסה', sase: 'תשתית ריבונית פרטית', ws: 'SaaS · פריסה תוך דקות' },
  { category: 'זמן פריסה', sase: 'שבועות–חודשים', ws: 'ימים בלבד' },
  { category: 'מורכבות', sase: 'גבוהה', ws: 'נמוכה–בינונית' },
  { category: 'Data Sovereignty', sase: true, ws: false },
  { category: 'Email Security', sase: false, ws: true },
  { category: 'Browser Security', sase: false, ws: true },
  { category: 'VPN Replacement', sase: true, ws: false },
  { category: 'Remote Access', sase: true, ws: false },
  { category: 'SD-WAN', sase: true, ws: false },
  { category: 'Anti-Phishing', sase: 'חלקי', ws: true },
  { category: 'M365 Integration', sase: 'חלקי', ws: true },
  { category: 'Google Workspace', sase: 'חלקי', ws: true },
  { category: 'ה-ROI הופך ב', sase: '6–18 חודש', ws: '1–3 חודש' },
  { category: 'מחיר (הערכה)', sase: '₪30–80 / user / חודש', ws: '₪15–35 / user / חודש' },
]

const sectors = [
  { name: 'ממשלה / ביטחון', sase: 'מיועד', ws: 'משלים' },
  { name: 'פיננסים', sase: 'מיועד', ws: 'מיועד' },
  { name: 'SMB (<200 users)', sase: 'לא אידיאלי', ws: 'מיועד' },
  { name: 'Enterprise', sase: 'מיועד', ws: 'מיועד' },
  { name: 'בריאות', sase: 'מיועד', ws: 'מיועד' },
]

function Cell({ val, color }) {
  if (val === true) return <CheckCircle className="w-4 h-4 mx-auto" style={{ color }} />
  if (val === false) return <X className="w-4 h-4 mx-auto text-slate-600" />
  if (val === 'חלקי') return <Minus className="w-4 h-4 mx-auto text-amber-500" />
  return <span className="text-xs text-slate-300">{val}</span>
}

export default function PartnerCompare() {
  const navigate = useNavigate()
  const [highlight, setHighlight] = useState(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Comparison</h1>
          <p className="text-slate-500 text-sm mt-0.5">השוואת פתרונות | Compare Solutions</p>
        </div>
      </div>

      {/* Picker cards */}
      <div className="grid grid-cols-2 gap-5">
        {[
          { id: 'sase', icon: Globe, name: 'Sovereign SASE', sub: 'Fortinet · SpotNet', color: '#5B9BB8', bg: 'rgba(44,106,138,0.12)', border: 'rgba(44,106,138,0.25)' },
          { id: 'ws', icon: Lock, name: 'Workspace Security', sub: 'Perception Point', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
        ].map(p => (
          <div
            key={p.id}
            className="rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all"
            style={{ background: p.bg, border: `1px solid ${p.border}` }}
            onClick={() => navigate(`/partner/solutions/${p.id}`)}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <p.icon className="w-6 h-6" style={{ color: p.color }} />
            </div>
            <div>
              <div className="font-bold text-white">{p.name}</div>
              <div className="text-xs text-slate-500">{p.sub}</div>
            </div>
            <ChevronLeft className="w-4 h-4 mr-auto text-slate-600" />
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-3 text-sm border-b border-white/8">
          <div className="px-5 py-4 font-semibold text-slate-400">קריטריון</div>
          <div className="px-5 py-4 text-center border-r border-l border-white/8" style={{ background: 'rgba(44,106,138,0.06)' }}>
            <div className="font-bold text-white flex items-center justify-center gap-2">
              <Globe className="w-4 h-4 text-cdata-300" />
              Sovereign SASE
            </div>
          </div>
          <div className="px-5 py-4 text-center" style={{ background: 'rgba(16,185,129,0.06)' }}>
            <div className="font-bold text-white flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Workspace Security
            </div>
          </div>
        </div>

        {rows.map((row, i) => (
          <div
            key={row.category}
            className={`grid grid-cols-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
            onMouseEnter={() => setHighlight(i)}
            onMouseLeave={() => setHighlight(null)}
          >
            <div className="px-5 py-3 text-xs text-slate-400 font-medium flex items-center">{row.category}</div>
            <div className="px-5 py-3 text-center flex items-center justify-center border-r border-l border-white/[0.04]">
              <Cell val={row.sase} color="#5B9BB8" />
            </div>
            <div className="px-5 py-3 text-center flex items-center justify-center">
              <Cell val={row.ws} color="#10b981" />
            </div>
          </div>
        ))}
      </div>

      {/* Sectors */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8 font-semibold text-white text-sm">
          התאמה לפי סקטור | Sector Fit
        </div>
        {sectors.map(s => (
          <div key={s.name} className="grid grid-cols-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
            <div className="px-5 py-3 text-xs text-slate-400 font-medium flex items-center">{s.name}</div>
            <div className="px-5 py-3 text-center border-r border-l border-white/[0.04]">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.sase === 'מיועד' ? 'badge-blue' : s.sase === 'משלים' ? 'badge-amber' : 'badge-red'}`}>
                {s.sase}
              </span>
            </div>
            <div className="px-5 py-3 text-center">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.ws === 'מיועד' ? 'badge-green' : s.ws === 'משלים' ? 'badge-amber' : 'badge-red'}`}>
                {s.ws}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="glass glow-border rounded-2xl p-6">
        <div className="font-bold text-white mb-3">💡 המלצת מכירה | Sales Recommendation</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-cdata-700/20 border border-cdata-500/15">
            <div className="font-semibold text-cdata-300 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" /> מכור Sovereign SASE כאשר:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-cdata-300 flex-shrink-0 mt-0.5" />הלקוח מדבר על VPN, remote access, או SD-WAN</li>
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-cdata-300 flex-shrink-0 mt-0.5" />יש דרישות רגולציה / ריבונות מידע</li>
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-cdata-300 flex-shrink-0 mt-0.5" />מדובר בארגון ממשלתי, פיננסי, או תשתיות קריטיות</li>
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-cdata-300 flex-shrink-0 mt-0.5" />&gt;200 משתמשים ויש תקציב IT גדול</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-emerald-600/8 border border-emerald-500/15">
            <div className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" /> מכור Workspace Security כאשר:
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />הלקוח מדבר על פישינג, מיילים זדוניים, או BEC</li>
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />משתמש ב-M365 / Google Workspace</li>
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />רוצה פריסה מהירה ותוצאות מיידיות</li>
              <li className="flex gap-1.5"><CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />SMB עד Enterprise, כל סקטור</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
