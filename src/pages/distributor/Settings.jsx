import React, { useState } from 'react'
import { User, Bell, Settings as SettingsIcon, Eye, EyeOff, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const inputCls = 'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40 focus:bg-white/[0.06] transition-colors'
const labelCls = 'text-xs text-slate-400 mb-1.5 block'

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/[0.05] last:border-0">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${
          checked ? 'bg-cdata-500' : 'bg-white/[0.08]'
        }`}
        style={{ width: 40, height: 22 }}
        aria-pressed={checked}
      >
        <span
          className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform"
          style={{
            width: 18,
            height: 18,
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  )
}

function SaveSuccess({ show, message }) {
  if (!show) return null
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
      style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
    >
      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
      <span className="text-xs text-emerald-400 font-medium">{message}</span>
    </div>
  )
}

export default function Settings() {
  const { tr } = useLanguage()
  // Profile card
  const [profile, setProfile] = useState({
    name: 'CDATA Distribution',
    email: 'yonatan@cdata.co.il',
    phone: '+972-3-6100100',
  })
  const [profileSaved, setProfileSaved] = useState(false)

  const setProfileField = (key, val) => setProfile(prev => ({ ...prev, [key]: val }))

  const handleProfileSave = () => {
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  // Notifications card
  const [notifs, setNotifs] = useState({
    integratorActivity: true,
    newCustomers: true,
    monthlyReports: false,
  })
  const [notifSaved, setNotifSaved] = useState(false)

  const handleNotifSave = () => {
    setNotifSaved(true)
    setTimeout(() => setNotifSaved(false), 2500)
  }

  // System card
  const [showKey, setShowKey] = useState(false)
  const [systemSaved, setSystemSaved] = useState(false)

  const apiKey = 'sk-dist-cdata-a1b2c3d4e5f6'
  const maskedKey = 'sk-dist-cdata-' + '•'.repeat(8)

  const handleSystemSave = () => {
    setSystemSaved(true)
    setTimeout(() => setSystemSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{tr('הגדרות', 'Settings')}</h1>
        <p className="text-slate-500 text-sm mt-0.5">{tr('הגדרות מפיץ', 'Distributor Settings')}</p>
      </div>

      {/* ── Card 1: Profile ── */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
            <User className="w-4 h-4 text-cdata-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{tr('פרופיל מפיץ', 'Distributor Profile')}</h3>
            <p className="text-xs text-slate-500">Distributor Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className={labelCls}>שם המפיץ</label>
            <input
              className={inputCls}
              value={profile.name}
              onChange={e => setProfileField('name', e.target.value)}
              placeholder="Company Name"
            />
          </div>
          <div>
            <label className={labelCls}>אימייל ראשי</label>
            <input
              type="email"
              className={inputCls}
              value={profile.email}
              onChange={e => setProfileField('email', e.target.value)}
              placeholder="admin@company.co.il"
            />
          </div>
          <div>
            <label className={labelCls}>טלפון</label>
            <input
              className={inputCls}
              value={profile.phone}
              onChange={e => setProfileField('phone', e.target.value)}
              placeholder="+972-3-0000000"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <SaveSuccess show={profileSaved} message={tr('השינויים נשמרו בהצלחה', 'Changes saved successfully')} />
          <button className="btn-primary text-sm ml-auto" onClick={handleProfileSave}>
            {tr('שמור שינויים', 'Save Changes')}
          </button>
        </div>
      </div>

      {/* ── Card 2: Notifications ── */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
            <Bell className="w-4 h-4 text-cdata-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">העדפות התראות</h3>
            <p className="text-xs text-slate-500">{tr('העדפות התראות', 'Notification Preferences')}</p>
          </div>
        </div>

        <div className="mb-5">
          <ToggleRow
            label={tr('פעילות אינטגרטורים', 'Integrator activity')}
            description="קבל התראה כאשר אינטגרטור מבצע פעולה חשובה"
            checked={notifs.integratorActivity}
            onChange={v => setNotifs(prev => ({ ...prev, integratorActivity: v }))}
          />
          <ToggleRow
            label={tr('לקוחות חדשים', 'New customers')}
            description="קבל התראה כאשר לקוח חדש נוסף למערכת"
            checked={notifs.newCustomers}
            onChange={v => setNotifs(prev => ({ ...prev, newCustomers: v }))}
          />
          <ToggleRow
            label={tr('דוחות חודשיים', 'Monthly reports')}
            description="שלח דוח חודשי אוטומטי לאימייל"
            checked={notifs.monthlyReports}
            onChange={v => setNotifs(prev => ({ ...prev, monthlyReports: v }))}
          />
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <SaveSuccess show={notifSaved} message={tr('השינויים נשמרו בהצלחה', 'Changes saved successfully')} />
          <button className="btn-primary text-sm ml-auto" onClick={handleNotifSave}>
            {tr('שמור שינויים', 'Save Changes')}
          </button>
        </div>
      </div>

      {/* ── Card 3: System ── */}
      <div className="glass glow-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(44,106,138,0.12)' }}>
            <SettingsIcon className="w-4 h-4 text-cdata-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{tr('הגדרות מערכת', 'System Settings')}</h3>
            <p className="text-xs text-slate-500">System Settings</p>
          </div>
        </div>

        <div className="space-y-4 mb-5">
          {/* API Key row */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-slate-400">{tr('מפתח API', 'API Key')}</label>
              <button
                type="button"
                onClick={() => setShowKey(v => !v)}
                className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showKey ? tr('הסתר', 'Hide') : tr('הצג', 'Show')}
              </button>
            </div>
            <div
              className="w-full rounded-lg px-4 py-2.5 font-mono text-sm flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-slate-400 truncate">{showKey ? apiKey : maskedKey}</span>
              <span className="badge-steel text-[10px] flex-shrink-0 ml-3">read-only</span>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">{tr('מפתח ה-API משמש לגישה תכנותית למערכת. אין לשתף אותו.', 'The API key is used for programmatic access. Do not share it.')}</p>
          </div>

          {/* Distributor ID row */}
          <div>
            <label className={labelCls}>{tr('מזהה מפיץ', 'Distributor ID')}</label>
            <div
              className="w-full rounded-lg px-4 py-2.5 font-mono text-sm flex items-center justify-between"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-slate-400">d1</span>
              <span className="badge-steel text-[10px] flex-shrink-0 ml-3">system</span>
            </div>
            <p className="text-[10px] text-slate-600 mt-1">מזהה ייחודי של המפיץ במערכת — לא ניתן לשינוי.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <SaveSuccess show={systemSaved} message={tr('השינויים נשמרו בהצלחה', 'Changes saved successfully')} />
          <button className="btn-primary text-sm ml-auto" onClick={handleSystemSave}>
            {tr('שמור שינויים', 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  )
}
