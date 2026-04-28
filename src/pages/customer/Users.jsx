import React, { useState } from 'react'
import { Search, Shield, AlertTriangle, CheckCircle, Users, Plus, Mail } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const users = [
  { name: 'דנה לוי', email: 'dana.levi@techglobal.co.il', role: 'IT Manager', dept: 'IT', status: 'protected', threats: 0, lastSeen: 'עכשיו' },
  { name: 'ידידיה כהן', email: 'idan.cohen@techglobal.co.il', role: 'Developer', dept: 'R&D', status: 'protected', threats: 2, lastSeen: 'לפני 5 דק׳' },
  { name: 'שרה לוי', email: 'sarah.levi@techglobal.co.il', role: 'CFO', dept: 'Finance', status: 'protected', threats: 0, lastSeen: 'לפני 12 דק׳' },
  { name: 'דנה מור', email: 'dana.mor@techglobal.co.il', role: 'Sales Rep', dept: 'Sales', status: 'alert', threats: 3, lastSeen: 'לפני 1 שעה' },
  { name: 'רון שפיר', email: 'ron.shapir@techglobal.co.il', role: 'Marketing', dept: 'Marketing', status: 'protected', threats: 0, lastSeen: 'לפני 2 שעות' },
  { name: 'מיכל ברק', email: 'michal.barak@techglobal.co.il', role: 'CEO', dept: 'Management', status: 'protected', threats: 1, lastSeen: 'לפני 3 שעות' },
  { name: 'אמיר נחום', email: 'amir.nahum@techglobal.co.il', role: 'DevOps', dept: 'IT', status: 'protected', threats: 0, lastSeen: 'אתמול' },
  { name: 'יעל גל', email: 'yael.gal@techglobal.co.il', role: 'Designer', dept: 'Product', status: 'inactive', threats: 0, lastSeen: 'לפני 3 ימים' },
]

const statusConfig = {
  protected: { label: 'מוגן', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  alert: { label: 'דורש תשומת לב', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  inactive: { label: 'לא פעיל', color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20', dot: 'bg-slate-500' },
}

export default function CustomerUsers() {
  const { tr } = useLanguage()
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.name.includes(search) || u.email.toLowerCase().includes(search.toLowerCase()) || u.dept.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">משתמשים</h1>
          <p className="text-slate-500 text-sm mt-0.5">{tr('משתמשים — חשבונות מוגנים', 'Users - Protected Accounts')}</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          {tr('הוסף משתמש', 'Add User')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: tr('מוגנים', 'Protected'), sub: tr('מוגנים', 'Protected'), value: users.filter(u => u.status === 'protected').length, color: 'text-emerald-400', bg: 'bg-emerald-600/15', icon: Shield },
          { label: tr('דורשים תשומת לב', 'Need Attention'), sub: tr('דורשים תשומת לב', 'Need Attention'), value: users.filter(u => u.status === 'alert').length, color: 'text-amber-400', bg: 'bg-amber-600/15', icon: AlertTriangle },
          { label: tr('לא פעילים', 'Inactive'), sub: tr('לא פעילים', 'Inactive'), value: users.filter(u => u.status === 'inactive').length, color: 'text-slate-400', bg: 'bg-slate-600/15', icon: Users },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs font-medium text-slate-300">{s.label}</div>
            <div className="text-[10px] text-slate-600">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={tr('חיפוש משתמש...', 'Search user...')}
          className="w-full bg-white/[0.04] border border-white/8 rounded-lg pr-9 pl-4 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/30"
        />
      </div>

      {/* Users List */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-5 py-3 border-b border-white/8 text-xs text-slate-500 font-medium">
          <div className="col-span-2">משתמש</div>
          <div>מחלקה</div>
          <div>סטטוס</div>
          <div>איומים</div>
        </div>
        {filtered.map((u, i) => {
          const cfg = statusConfig[u.status]
          return (
            <div key={i} className="grid grid-cols-5 px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all items-center">
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cdata-500/15 border border-cdata-500/15 flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0">
                  {u.name.slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{u.name}</div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1">
                    <Mail className="w-2.5 h-2.5" />
                    {u.email}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400">{u.dept}</div>
              <div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></div>
                  {cfg.label}
                </span>
              </div>
              <div>
                {u.threats > 0
                  ? <span className="badge-amber text-[10px]">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {u.threats} איומים
                    </span>
                  : <span className="text-emerald-500 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      נקי
                    </span>
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
