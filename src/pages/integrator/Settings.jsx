import React, { useState } from 'react'
import { User, Bell, Settings2, Eye, EyeOff, Check } from 'lucide-react'
import { getIntegrator } from '../../data/mockData'

const INTEGRATOR_ID = 'i1'
const integrator = getIntegrator(INTEGRATOR_ID)

const inputClass =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40 transition-colors'
const labelClass = 'text-xs text-slate-400 mb-1.5 block'

const SaveButton = ({ onSave, saved }) => (
  <button
    className={`flex items-center gap-2 text-sm ${saved ? 'btn-ghost text-emerald-400' : 'btn-primary'}`}
    onClick={onSave}
  >
    {saved ? (
      <>
        <Check className="w-4 h-4" />
        נשמר
      </>
    ) : (
      'שמור שינויים'
    )}
  </button>
)

const CheckboxRow = ({ label, desc, checked, onChange }) => (
  <label className="flex items-center justify-between p-3 rounded-xl border border-white/[0.04] cursor-pointer hover:bg-white/[0.02] transition-colors group">
    <div>
      <div className="text-sm text-white">{label}</div>
      {desc && <div className="text-xs text-slate-600 mt-0.5">{desc}</div>}
    </div>
    <div className="relative flex-shrink-0">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
        checked
          ? 'bg-cdata-500 border-cdata-500'
          : 'bg-white/[0.04] border-white/20 group-hover:border-white/30'
      }`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
    </div>
  </label>
)

export default function IntegratorSettings() {
  const [profile, setProfile] = useState({
    companyName: integrator?.companyName || 'NetSec Solutions',
    contactName: integrator?.contactName || 'אלון כהן',
    email: integrator?.contactEmail || 'alon@netsec.co.il',
    phone: integrator?.phone || '+972-50-1234567',
  })
  const [profileSaved, setProfileSaved] = useState(false)

  const [notifications, setNotifications] = useState({
    alerts: true,
    reports: true,
    newCustomers: false,
    weeklyDigest: true,
  })
  const [notifSaved, setNotifSaved] = useState(false)

  const [showApiKey, setShowApiKey] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.netsec.co.il/sase-events')
  const [systemSaved, setSystemSaved] = useState(false)

  const setP = (k, v) => {
    setProfile(p => ({ ...p, [k]: v }))
    setProfileSaved(false)
  }

  const setN = (k, v) => {
    setNotifications(n => ({ ...n, [k]: v }))
    setNotifSaved(false)
  }

  const handleProfileSave = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  const handleNotifSave = () => {
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 2500)
  }

  const handleSystemSave = () => {
    setSystemSaved(true)
    setTimeout(() => setSystemSaved(false), 2500)
  }

  const maskedApiKey = '************'
  const realApiKey = 'ערך מוסתר לצורכי אבטחה'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">הגדרות</h1>
        <p className="text-slate-500 text-sm mt-0.5">הגדרות אינטגרטור</p>
      </div>

      {/* Card 1: Profile */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cdata-500/15 flex items-center justify-center">
              <User className="w-4 h-4 text-cdata-300" />
            </div>
            <div className="text-sm font-semibold text-white">פרופיל אינטגרטור</div>
          </div>
          <SaveButton onSave={handleProfileSave} saved={profileSaved} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>שם החברה</label>
            <input
              className={inputClass}
              value={profile.companyName}
              onChange={e => setP('companyName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>שם איש קשר</label>
            <input
              className={inputClass}
              value={profile.contactName}
              onChange={e => setP('contactName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>כתובת מייל</label>
            <input
              className={inputClass}
              type="email"
              value={profile.email}
              onChange={e => setP('email', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>טלפון</label>
            <input
              className={inputClass}
              type="tel"
              value={profile.phone}
              onChange={e => setP('phone', e.target.value)}
            />
          </div>
        </div>

        {integrator?.partnerCode && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center gap-3">
            <span className="text-xs text-slate-500">קוד שותף:</span>
            <span className="text-xs font-mono text-slate-300 bg-white/[0.04] px-2.5 py-1 rounded-md">
              {integrator.partnerCode}
            </span>
          </div>
        )}
      </div>

      {/* Card 2: Notifications */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/15 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-sm font-semibold text-white">העדפות התראות</div>
          </div>
          <SaveButton onSave={handleNotifSave} saved={notifSaved} />
        </div>

        <div className="space-y-2">
          <CheckboxRow
            label="התראות אבטחה"
            desc="קבל התראות על אירועי אבטחה של לקוחות"
            checked={notifications.alerts}
            onChange={v => setN('alerts', v)}
          />
          <CheckboxRow
            label="דוחות חודשיים"
            desc="שלח לי דוח חודשי סיכום בתחילת כל חודש"
            checked={notifications.reports}
            onChange={v => setN('reports', v)}
          />
          <CheckboxRow
            label="לקוחות חדשים"
            desc="הודעה כאשר לקוח חדש מסיים קליטה"
            checked={notifications.newCustomers}
            onChange={v => setN('newCustomers', v)}
          />
          <CheckboxRow
            label="עיכול שבועי"
            desc="סיכום שבועי של כל הפעילות בפורמט מקוצר"
            checked={notifications.weeklyDigest}
            onChange={v => setN('weeklyDigest', v)}
          />
        </div>
      </div>

      {/* Card 3: System */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/15 flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-sm font-semibold text-white">מערכת ו-API</div>
          </div>
          <SaveButton onSave={handleSystemSave} saved={systemSaved} />
        </div>

        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className={labelClass}>מפתח API</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                className={inputClass + ' flex-1 font-mono text-xs'}
                value={showApiKey ? realApiKey : maskedApiKey}
              />
              <button
                className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] transition-colors flex-shrink-0"
                onClick={() => setShowApiKey(v => !v)}
                title={showApiKey ? 'הסתר' : 'הצג'}
              >
                {showApiKey
                  ? <EyeOff className="w-4 h-4 text-slate-400" />
                  : <Eye className="w-4 h-4 text-slate-400" />
                }
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1.5">
              לא לשתף את המפתח. ניתן לחדש מהגדרות המערכת.
            </p>
          </div>

          {/* Webhook URL */}
          <div>
            <label className={labelClass}>Webhook URL</label>
            <input
              className={inputClass}
              type="url"
              placeholder="https://hooks.yourcompany.com/events"
              value={webhookUrl}
              onChange={e => { setWebhookUrl(e.target.value); setSystemSaved(false) }}
            />
            <p className="text-[10px] text-slate-600 mt-1.5">
              אירועים יישלחו ל-URL זה בזמן אמת (POST JSON).
            </p>
          </div>
        </div>

        {/* Advanced zone */}
        <div className="mt-5 pt-5 border-t border-white/[0.06]">
          <div className="text-xs text-slate-500 mb-3">אזור מתקדם</div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-slate-400 hover:text-slate-200 border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
              חדש מפתח API
            </button>
            <button className="text-xs text-red-400/70 hover:text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
              נתק חשבון
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
