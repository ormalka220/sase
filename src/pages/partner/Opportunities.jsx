import React, { useState } from 'react'
import {
  Plus, Search, Filter, Globe, Lock, Clock,
  ChevronLeft, TrendingUp, DollarSign, Target,
  AlertCircle, CheckCircle, ArrowUpRight, Edit3
} from 'lucide-react'

const opps = [
  { id: 1, company: 'Elbit Systems', contact: 'רון שמיר', product: 'Sovereign SASE', stage: 'POC', value: 180000, days: 12, created: '01/10/2025', status: 'hot', notes: 'מבקשים POC על 50 משתמשים' },
  { id: 2, company: 'Bank Hapoalim', contact: 'מיכל ברק', product: 'Workspace Security', stage: 'Proposal', value: 95000, days: 5, created: '15/10/2025', status: 'active', notes: 'הצעת מחיר נשלחה, ממתין לאישור' },
  { id: 3, company: 'Israel Railways', contact: 'אמיר לוי', product: 'Sovereign SASE', stage: 'Demo', value: 240000, days: 20, created: '03/10/2025', status: 'active', notes: 'Demo הצליח, שולחים SOW השבוע' },
  { id: 4, company: 'Maccabi Health', contact: 'שרה כהן', product: 'Workspace Security', stage: 'Discovery', value: 60000, days: 3, created: '18/10/2025', status: 'new', notes: 'פגישה ראשונה, לזהות Pain Points' },
  { id: 5, company: 'Shufersal', contact: 'דוד מור', product: 'Workspace Security', stage: 'Closing', value: 120000, days: 45, created: '01/09/2025', status: 'hot', notes: 'ממתין לחתימה על חוזה' },
  { id: 6, company: 'IAF Tech Unit', contact: 'מתי אבן', product: 'Sovereign SASE', stage: 'Discovery', value: 350000, days: 7, created: '14/10/2025', status: 'new', notes: 'פגישה עם CISO, פוטנציאל גבוה' },
]

const stages = ['All', 'Discovery', 'Demo', 'POC', 'Proposal', 'Closing']
const stageColors = {
  Discovery: 'bg-slate-500/15 text-slate-400 border-slate-500/20',
  Demo: 'bg-cdata-500/15 text-cdata-300 border-cdata-500/20',
  POC: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
  Proposal: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  Closing: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
}

export default function PartnerOpportunities() {
  const [selectedStage, setSelectedStage] = useState('All')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)

  const filtered = opps.filter(o =>
    (selectedStage === 'All' || o.stage === selectedStage) &&
    (o.company.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPipeline = filtered.reduce((s, o) => s + o.value, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Opportunities</h1>
          <p className="text-slate-500 text-sm mt-0.5">ניהול הזדמנויות מכירה | Pipeline Management</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          הזדמנות חדשה
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Pipeline', labelHe: 'סה"כ Pipeline', value: `₪${(totalPipeline / 1000).toFixed(0)}K`, icon: TrendingUp, color: 'text-cdata-300', bg: 'bg-cdata-500/15' },
          { label: 'Active Deals', labelHe: 'עסקאות פעילות', value: filtered.filter(o => o.status === 'active' || o.status === 'hot').length, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
          { label: 'Hot Deals', labelHe: 'עסקאות חמות', value: filtered.filter(o => o.status === 'hot').length, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-600/15' },
          { label: 'Avg. Deal Size', labelHe: 'גודל עסקה ממוצע', value: `₪${(totalPipeline / filtered.length / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-600/15' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-slate-600">{s.labelHe}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש חברה / מוצר..."
            className="bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/30 w-48"
          />
        </div>
        <div className="flex gap-1.5">
          {stages.map(s => (
            <button
              key={s}
              onClick={() => setSelectedStage(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedStage === s ? 'bg-cdata-500/20 text-cdata-300 border border-cdata-500/30' : 'text-slate-500 border border-white/5 hover:border-white/10 hover:text-slate-300'}`}
            >
              {s === 'All' ? 'הכול' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline Board */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-7 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
          <div className="col-span-2">חברה</div>
          <div>מוצר</div>
          <div>שלב</div>
          <div>שווי</div>
          <div>ימים</div>
          <div className="text-left">פעולות</div>
        </div>
        {filtered.map(opp => (
          <div
            key={opp.id}
            className="grid grid-cols-7 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.025] transition-all cursor-pointer items-center group"
          >
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cdata-500/15 border border-cdata-500/15 flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0">
                {opp.company.slice(0, 2)}
              </div>
              <div>
                <div className="font-medium text-white text-sm">{opp.company}</div>
                <div className="text-[10px] text-slate-600">{opp.contact}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              {opp.product === 'Sovereign SASE'
                ? <Globe className="w-3 h-3 text-cdata-400" />
                : <Lock className="w-3 h-3 text-emerald-500" />
              }
              <span className="text-xs">{opp.product.split(' ')[0]}</span>
            </div>
            <div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block ${stageColors[opp.stage]}`}>
                {opp.stage}
              </span>
            </div>
            <div className="font-semibold text-white text-sm">₪{(opp.value / 1000).toFixed(0)}K</div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3" />
              {opp.days}d
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-cdata-500/10 text-slate-400 hover:text-cdata-300 transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Opportunity Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center" onClick={() => setShowForm(false)}>
          <div className="glass-strong rounded-2xl p-7 w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}
            style={{ border: '1px solid rgba(30,179,253,0.2)' }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-bold text-white text-lg">הזדמנות חדשה</div>
                <div className="text-xs text-slate-500">New Opportunity</div>
              </div>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'שם חברה', placeholder: 'Company name...' },
                { label: 'איש קשר', placeholder: 'Contact name...' },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs text-slate-400 mb-1.5 block">{f.label}</label>
                  <input placeholder={f.placeholder} className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40" />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">מוצר</label>
                <select className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cdata-500/40">
                  <option value="sase">Sovereign SASE</option>
                  <option value="ws">Workspace Security</option>
                  <option value="both">שניהם</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">שווי משוער (₪)</label>
                <input type="number" placeholder="100000" className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40" />
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 btn-primary text-sm" onClick={() => setShowForm(false)}>שמור הזדמנות</button>
                <button className="flex-1 btn-ghost text-sm" onClick={() => setShowForm(false)}>ביטול</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
