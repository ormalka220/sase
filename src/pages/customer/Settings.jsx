import React, { useState } from 'react'
import { Check } from 'lucide-react'

const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40 focus:bg-white/[0.06] transition-colors"
const labelClass = "text-xs text-slate-400 mb-1.5 block"

export default function CustomerSettings() {
  const [saved, setSaved] = useState({})
  const [notifs, setNotifs] = useState({ critical: true, all: false, daily: true, weekly: false })

  const handleSave = (section) => {
    setSaved(s => ({ ...s, [section]: true }))
    setTimeout(() => setSaved(s => ({ ...s, [section]: false })), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">הגדרות</h1>
        <p className="text-slate-500 text-sm mt-0.5">הגדרות לקוח — Customer Settings</p>
      </div>

      {/* Company Profile */}
      <div className="glass glow-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">פרופיל החברה</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="col-span-2">
            <label className={labelClass}>שם החברה</label>
            <input type="text" defaultValue="Elbit Systems" className={inputClass} readOnly
              style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            <p className="text-[10px] text-slate-700 mt-1">לשינוי שם החברה פנה לאינטגרטור שלך</p>
          </div>
          {[
            { label: 'דומיין', value: 'elbit.co.il', type: 'text' },
            { label: 'מדינה', value: 'Israel', type: 'text' },
            { label: 'מייל אדמין', value: 'it-admin@elbit.co.il', type: 'email' },
            { label: 'טלפון', value: '+972-4-8316111', type: 'tel' },
          ].map(f => (
            <div key={f.label}>
              <label className={labelClass}>{f.label}</label>
              <input type={f.type} defaultValue={f.value} className={inputClass} />
            </div>
          ))}
        </div>
        <button onClick={() => handleSave('profile')} className="btn-primary text-sm flex items-center gap-2">
          {saved.profile ? <><Check className="w-3.5 h-3.5" /> נשמר!</> : 'שמור שינויים'}
        </button>
      </div>

      {/* Notification Preferences */}
      <div className="glass glow-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">העדפות התראות</h3>
        <div className="space-y-3 mb-4">
          {[
            { key: 'critical', label: 'התראות קריטיות בלבד', sub: 'קבל התראה רק על אירועים קריטיים' },
            { key: 'all', label: 'כל ההתראות', sub: 'קבל התראה על כל אירועי אבטחה' },
            { key: 'daily', label: 'דוח יומי', sub: 'סיכום יומי של פעילות האבטחה' },
            { key: 'weekly', label: 'דוח שבועי', sub: 'סיכום שבועי עם מגמות וניתוחים' },
          ].map(n => (
            <label key={n.key} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] cursor-pointer hover:bg-white/[0.02]">
              <div>
                <div className="text-sm text-white">{n.label}</div>
                <div className="text-xs text-slate-600 mt-0.5">{n.sub}</div>
              </div>
              <input
                type="checkbox"
                checked={notifs[n.key]}
                onChange={e => setNotifs(prev => ({ ...prev, [n.key]: e.target.checked }))}
                className="w-4 h-4 accent-cdata-500"
              />
            </label>
          ))}
        </div>
        <button onClick={() => handleSave('notifs')} className="btn-primary text-sm flex items-center gap-2">
          {saved.notifs ? <><Check className="w-3.5 h-3.5" /> נשמר!</> : 'שמור העדפות'}
        </button>
      </div>

      {/* Integrations */}
      <div className="glass glow-border rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">אינטגרציות</h3>
        <div className="space-y-4 mb-4">
          <div>
            <label className={labelClass}>Microsoft 365 Tenant ID</label>
            <input type="text" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SSO Provider</label>
            <select className={inputClass + " appearance-none"}>
              <option value="">בחר ספק SSO</option>
              <option value="azure">Azure AD / Entra ID</option>
              <option value="okta">Okta</option>
              <option value="google">Google Workspace</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Syslog Endpoint</label>
            <input type="text" placeholder="syslog://10.0.0.1:514" className={inputClass} />
          </div>
        </div>
        <button onClick={() => handleSave('integrations')} className="btn-primary text-sm flex items-center gap-2">
          {saved.integrations ? <><Check className="w-3.5 h-3.5" /> נשמר!</> : 'שמור אינטגרציות'}
        </button>
      </div>
    </div>
  )
}
