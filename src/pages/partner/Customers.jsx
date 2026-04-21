import React, { useState } from 'react'
import { Search, Plus, Shield, Globe, Lock, CheckCircle, AlertCircle, ExternalLink, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const customers = [
  { name: 'Elbit Systems', industry: 'ביטחון', users: 1200, products: ['sase'], status: 'active', health: 98, mrr: 48000 },
  { name: 'Bank Hapoalim', industry: 'פיננסים', users: 3400, products: ['ws'], status: 'active', health: 100, mrr: 85000 },
  { name: 'Maccabi Health', industry: 'בריאות', users: 890, products: ['ws', 'sase'], status: 'active', health: 94, mrr: 62000 },
  { name: 'Shufersal', industry: 'קמעונות', users: 560, products: ['ws'], status: 'active', health: 96, mrr: 22000 },
  { name: 'Hot Telecom', industry: 'תקשורת', users: 2100, products: ['sase'], status: 'active', health: 91, mrr: 75000 },
  { name: 'Azrieli Group', industry: 'נדל"ן', users: 340, products: ['ws'], status: 'onboarding', health: 80, mrr: 18000 },
  { name: 'Rafael ADS', industry: 'ביטחון', users: 780, products: ['sase'], status: 'active', health: 99, mrr: 38000 },
  { name: 'Tnuva', industry: 'מזון', users: 430, products: ['ws'], status: 'active', health: 95, mrr: 16000 },
]

export default function PartnerCustomers() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.includes(search)
  )

  const totalMRR = filtered.reduce((s, c) => s + c.mrr, 0)
  const totalUsers = filtered.reduce((s, c) => s + c.users, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-500 text-sm mt-0.5">ניהול לקוחות | Customer Management</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          לקוח חדש
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', labelHe: 'סה"כ לקוחות', value: filtered.length, color: 'text-cdata-300', bg: 'bg-cdata-500/15', icon: Users },
          { label: 'Total Users', labelHe: 'סה"כ משתמשים', value: totalUsers.toLocaleString(), color: 'text-emerald-400', bg: 'bg-emerald-600/15', icon: Shield },
          { label: 'Monthly Revenue', labelHe: 'הכנסה חודשית', value: `₪${(totalMRR / 1000).toFixed(0)}K`, color: 'text-amber-400', bg: 'bg-amber-600/15', icon: Shield },
          { label: 'Avg Health', labelHe: 'בריאות ממוצעת', value: `${Math.round(filtered.reduce((s, c) => s + c.health, 0) / filtered.length)}%`, color: 'text-violet-400', bg: 'bg-violet-600/15', icon: CheckCircle },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-slate-600">{s.labelHe}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="חיפוש לקוח..."
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/30"
        />
      </div>

      {/* Table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-6 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
          <div className="col-span-2">לקוח</div>
          <div>מוצרים</div>
          <div>משתמשים</div>
          <div>Health</div>
          <div>MRR</div>
        </div>
        {filtered.map((c, i) => (
          <div
            key={i}
            className="grid grid-cols-6 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.025] transition-all cursor-pointer group items-center"
            onClick={() => navigate('/customer/overview')}
          >
            <div className="col-span-2 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cdata-500/15 border border-cdata-500/15 flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0">
                {c.name.slice(0, 2)}
              </div>
              <div>
                <div className="font-medium text-white text-sm">{c.name}</div>
                <div className="text-[10px] text-slate-500">{c.industry}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {c.products.includes('sase') && (
                <div className="w-6 h-6 rounded-md bg-cdata-500/15 flex items-center justify-center" title="Sovereign SASE">
                  <Globe className="w-3 h-3 text-cdata-300" />
                </div>
              )}
              {c.products.includes('ws') && (
                <div className="w-6 h-6 rounded-md bg-emerald-600/15 flex items-center justify-center" title="Workspace Security">
                  <Lock className="w-3 h-3 text-emerald-400" />
                </div>
              )}
            </div>
            <div className="text-sm text-white font-medium">{c.users.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <div className="w-16 bg-white/5 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${c.health}%`,
                    background: c.health >= 95 ? '#10b981' : c.health >= 85 ? '#f59e0b' : '#ef4444'
                  }}
                ></div>
              </div>
              <span className="text-xs font-semibold" style={{
                color: c.health >= 95 ? '#10b981' : c.health >= 85 ? '#f59e0b' : '#ef4444'
              }}>{c.health}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-sm">₪{(c.mrr / 1000).toFixed(0)}K</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
