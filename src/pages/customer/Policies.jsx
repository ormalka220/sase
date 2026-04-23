import React, { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { getPoliciesByCustomer } from '../../data/mockData'

const myPolicies = getPoliciesByCustomer('c1')

const CATEGORIES = [
  { id: 'all', label: 'הכל' },
  { id: 'Internet Access', label: 'Internet Access' },
  { id: 'Zero Trust', label: 'Zero Trust' },
  { id: 'Posture Enforcement', label: 'Posture Enforcement' },
  { id: 'Segmentation', label: 'Segmentation' },
]

export default function CustomerPolicies() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const activeCount = myPolicies.filter(p => p.status === 'active').length
  const disabledCount = myPolicies.filter(p => p.status === 'disabled').length
  const draftCount = myPolicies.filter(p => p.status === 'draft').length

  const filtered = myPolicies.filter(p =>
    selectedCategory === 'all' || p.category === selectedCategory
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">מדיניות</h1>
        <p className="text-slate-500 text-sm mt-0.5">ניהול מדיניות אבטחה</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/15 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{activeCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-green">פעיל</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">מדיניות פעילה</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-slate-600/15 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white">{disabledCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-steel">מבוטל</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">מדיניות מבוטלת</div>
        </div>
        <div className="stat-card">
          <div className="w-9 h-9 rounded-xl bg-amber-600/15 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{draftCount}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="badge-amber">טיוטה</span>
          </div>
          <div className="text-xs font-medium text-slate-300 mt-1">מדיניות בטיוטה</div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-cdata-500/20 text-cdata-300 border border-cdata-500/30'
                : 'text-slate-500 border border-white/5 hover:border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filtered.map(policy => (
          <div key={policy.id} className="glass glow-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cdata-300" />
                <span className="text-xs text-slate-500">{policy.category}</span>
              </div>
              <span
                className={
                  policy.status === 'active'
                    ? 'badge-green'
                    : policy.status === 'disabled'
                      ? 'badge-steel'
                      : 'badge-amber'
                }
              >
                {policy.status === 'active'
                  ? 'פעיל'
                  : policy.status === 'disabled'
                    ? 'מבוטל'
                    : 'טיוטה'}
              </span>
            </div>
            <div className="font-semibold text-white text-sm mb-1">{policy.name}</div>
            <div className="text-xs text-slate-500 mb-3">היקף: {policy.scope}</div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{policy.rules} כללים</span>
              <span>עודכן {policy.lastModified}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
