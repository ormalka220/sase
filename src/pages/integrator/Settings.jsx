import React, { useState } from 'react'
import { User, Bell, Settings2, Eye, EyeOff, Check } from 'lucide-react'
import { getIntegrator } from '../../data/mockData'
import { useLanguage } from '../../context/LanguageContext'

const INTEGRATOR_ID = 'i1'
const integrator = getIntegrator(INTEGRATOR_ID)

const inputClass =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40 transition-colors'
const labelClass = 'text-xs text-slate-400 mb-1.5 block'

const SaveButton = ({ onSave, saved, savedLabel, saveLabel }) => (
  <button
    className={`flex items-center gap-2 text-sm ${saved ? 'btn-ghost text-emerald-400' : 'btn-primary'}`}
    onClick={onSave}
  >
    {saved ? (
      <>
        <Check className="w-4 h-4" />
        {savedLabel}
      </>
    ) : (
      saveLabel
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
  const { tr } = useLanguage()
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
  const realApiKey = tr('ערך מוסתר לצורכי אבטחה', 'Hidden value for security reasons')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{tr('הגדרות', 'Settings')}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{tr('הגדרות אינטגרטור', 'Integrator Settings')}</p>
      </div>

      {/* Card 1: Profile */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cdata-500/15 flex items-center justify-center">
              <User className="w-4 h-4 text-cdata-300" />
            </div>
            <div className="text-sm font-semibold text-white">{tr('פרופיל אינטגרטור', 'Integrator Profile')}</div>
          </div>
          <SaveButton onSave={handleProfileSave} saved={profileSaved} savedLabel={tr('נשמר', 'Saved')} saveLabel={tr('שמור שינויים', 'Save Changes')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{tr('שם החברה', 'Company name')}</label>
            <input
              className={inputClass}
              value={profile.companyName}
              onChange={e => setP('companyName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{tr('שם איש קשר', 'Contact name')}</label>
            <input
              className={inputClass}
              value={profile.contactName}
              onChange={e => setP('contactName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{tr('כתובת מייל', 'Email address')}</label>
            <input
              className={inputClass}
              type="email"
              value={profile.email}
              onChange={e => setP('email', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>{tr('טלפון', 'Phone')}</label>
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
            <span className="text-xs text-slate-500">{tr('קוד שותף:', 'Partner code:')}</span>
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
            <div className="text-sm font-semibold text-white">{tr('העדפות התראות', 'Notification Preferences')}</div>
          </div>
          <SaveButton onSave={handleNotifSave} saved={notifSaved} savedLabel={tr('נשמר', 'Saved')} saveLabel={tr('שמור שינויים', 'Save Changes')} />
        </div>

        <div className="space-y-2">
          <CheckboxRow
            label={tr('התראות אבטחה', 'Security alerts')}
            desc={tr('קבל התראות על אירועי אבטחה של לקוחות', 'Receive alerts about customer security events')}
            checked={notifications.alerts}
            onChange={v => setN('alerts', v)}
          />
          <CheckboxRow
            label={tr('דוחות חודשיים', 'Monthly reports')}
            desc={tr('שלח לי דוח חודשי סיכום בתחילת כל חודש', 'Send me a monthly summary report at the beginning of each month')}
            checked={notifications.reports}
            onChange={v => setN('reports', v)}
          />
          <CheckboxRow
            label={tr('לקוחות חדשים', 'New customers')}
            desc={tr('הודעה כאשר לקוח חדש מסיים קליטה', 'Notify when a new customer completes onboarding')}
            checked={notifications.newCustomers}
            onChange={v => setN('newCustomers', v)}
          />
          <CheckboxRow
            label={tr('עיכול שבועי', 'Weekly digest')}
            desc={tr('סיכום שבועי של כל הפעילות בפורמט מקוצר', 'Weekly summary of all activity in compact format')}
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
            <div className="text-sm font-semibold text-white">{tr('מערכת ו-API', 'System & API')}</div>
          </div>
          <SaveButton onSave={handleSystemSave} saved={systemSaved} savedLabel={tr('נשמר', 'Saved')} saveLabel={tr('שמור שינויים', 'Save Changes')} />
        </div>

        <div className="space-y-4">
          {/* API Key */}
          <div>
            <label className={labelClass}>{tr('מפתח API', 'API Key')}</label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                className={inputClass + ' flex-1 font-mono text-xs'}
                value={showApiKey ? realApiKey : maskedApiKey}
              />
              <button
                className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center hover:bg-white/[0.08] transition-colors flex-shrink-0"
                onClick={() => setShowApiKey(v => !v)}
                title={showApiKey ? tr('הסתר', 'Hide') : tr('הצג', 'Show')}
              >
                {showApiKey
                  ? <EyeOff className="w-4 h-4 text-slate-400" />
                  : <Eye className="w-4 h-4 text-slate-400" />
                }
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1.5">
              {tr('לא לשתף את המפתח. ניתן לחדש מהגדרות המערכת.', 'Do not share this key. It can be regenerated from system settings.')}
            </p>
          </div>

          {/* Webhook URL */}
          <div>
            <label className={labelClass}>{tr('כתובת Webhook', 'Webhook URL')}</label>
            <input
              className={inputClass}
              type="url"
              placeholder={tr('https://hooks.yourcompany.com/events', 'https://hooks.yourcompany.com/events')}
              value={webhookUrl}
              onChange={e => { setWebhookUrl(e.target.value); setSystemSaved(false) }}
            />
            <p className="text-[10px] text-slate-600 mt-1.5">
              {tr('אירועים יישלחו ל-URL זה בזמן אמת (POST JSON).', 'Events will be sent to this URL in real time (POST JSON).')}
            </p>
          </div>
        </div>

        {/* Advanced zone */}
        <div className="mt-5 pt-5 border-t border-white/[0.06]">
          <div className="text-xs text-slate-500 mb-3">{tr('אזור מתקדם', 'Advanced zone')}</div>
          <div className="flex items-center gap-3">
            <button className="text-xs text-slate-400 hover:text-slate-200 border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
              {tr('חדש מפתח API', 'Regenerate API key')}
            </button>
            <button className="text-xs text-red-400/70 hover:text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors">
              {tr('נתק חשבון', 'Disconnect account')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
