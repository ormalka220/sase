import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Eye, MoreHorizontal, Building2, Shield } from 'lucide-react'
import { integrators, getCustomersByIntegrator } from '../../data/mockData'

const STATUS_TABS = ['הכל', 'active', 'onboarding', 'suspended']
const STATUS_LABELS = { הכל: 'הכל', active: 'פעיל', onboarding: 'Onboarding', suspended: 'מושהה' }

function statusBadge(status) {
  if (status === 'active') return 'badge-green'
  if (status === 'onboarding') return 'badge-amber'
  if (status === 'suspended') return 'badge-red'
  return 'badge-steel'
}

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function IntegratorsList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('הכל')

  const filtered = integrators.filter(item => {
    const matchSearch =
      item.companyName.toLowerCase().includes(search.toLowerCase()) ||
      item.contactEmail.toLowerCase().includes(search.toLowerCase())
    const matchStatus = activeTab === 'הכל' || item.status === activeTab
    return matchSearch && matchStatus
  })

  const totalCount = integrators.length
  const activeCount = integrators.filter(i => i.status === 'active').length
  const onboardingCount = integrators.filter(i => i.status === 'onboarding').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Integrators</h1>
          <p className="text-slate-500 text-sm mt-0.5">ניהול אינטגרטורים</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 text-sm"
          onClick={() => navigate('/distribution/integrators/new')}
        >
          <Plus className="w-4 h-4" />
          הוסף אינטגרטור
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'סה"כ אינטגרטורים', value: totalCount, icon: Building2, color: 'text-cdata-300', bg: 'rgba(44,106,138,0.12)' },
          { label: 'פעילים', value: activeCount, icon: Building2, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.10)' },
          { label: 'Onboarding', value: onboardingCount, icon: Building2, color: 'text-amber-400', bg: 'rgba(245,158,11,0.10)' },
          { label: 'FortiSASE Environments', value: '5', icon: Shield, color: 'text-cdata-300', bg: 'rgba(44,106,138,0.15)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <div className="text-3xl font-black text-white mb-1">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + Filter row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש אינטגרטור..."
            className="w-full bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/30"
          />
        </div>
        {/* Status filter buttons */}
        <div className="flex items-center gap-2">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-cdata-500/20 text-cdata-300 border border-cdata-500/30'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {STATUS_LABELS[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
          <div className="col-span-2">אינטגרטור</div>
          <div>איש קשר</div>
          <div>לקוחות</div>
          <div>סטטוס</div>
          <div>פעילות אחרונה</div>
          <div>נוצר</div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="w-10 h-10 text-slate-700 mb-3" />
            <p className="text-sm font-medium text-slate-400">לא נמצאו תוצאות</p>
            <p className="text-xs text-slate-600 mt-1">נסה לשנות את החיפוש או הפילטר</p>
            <button
              className="mt-4 btn-primary text-xs"
              onClick={() => navigate('/distribution/integrators/new')}
            >
              הוסף אינטגרטור חדש
            </button>
          </div>
        ) : (
          filtered.map((item, i) => {
            const custCount = getCustomersByIntegrator(item.id).length
            return (
              <div
                key={item.id}
                className="grid grid-cols-7 items-center px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] cursor-pointer transition-colors group"
                onClick={() => navigate('/distribution/integrators/' + item.id)}
              >
                {/* Company */}
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(44,106,138,0.15)', border: '1px solid rgba(44,106,138,0.2)' }}
                  >
                    {item.companyName.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{item.companyName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{item.contactEmail}</div>
                  </div>
                </div>

                {/* Contact */}
                <div className="text-sm text-slate-400 truncate">{item.contactName}</div>

                {/* Customer count */}
                <div className="text-sm font-medium text-white">{custCount}</div>

                {/* Status */}
                <div>
                  <span className={`${statusBadge(item.status)} text-xs`}>{item.status}</span>
                </div>

                {/* Last Activity */}
                <div className="text-xs text-slate-500">{formatDate(item.lastActivity)}</div>

                {/* Created date + actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">{formatDate(item.createdAt)}</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"
                      onClick={e => { e.stopPropagation(); navigate('/distribution/integrators/' + item.id) }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-500 hover:text-white transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
