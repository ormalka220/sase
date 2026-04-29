import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings2, Building2, Bell, Shield, CheckCircle, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/LanguageContext'
import PageHeader from '../../components/distribution/PageHeader'

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const SettingsSection = ({ title, description, children }) => (
  <motion.div
    className="glass rounded-xl p-6 border border-white/10"
    variants={itemVariants}
  >
    <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
    {description && <p className="text-xs text-slate-400 mb-5">{description}</p>}
    {children}
  </motion.div>
)

const FormField = ({ label, type = 'text', placeholder, value, onChange, disabled = false }) => (
  <div className="mb-4 last:mb-0">
    <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">{label}</label>
    {type === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cdata-500/50 disabled:opacity-50"
        rows={3}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cdata-500/50 disabled:opacity-50"
      />
    )}
  </div>
)

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-start justify-between p-4 rounded-lg bg-white/[0.03] border border-white/5 mb-3">
    <div>
      <div className="text-sm font-semibold text-white">{label}</div>
      {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-white/10'
      } flex-shrink-0 ml-4`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
)

export default function Settings() {
  const { user } = useAuth()
  const { tr, isHebrew } = useLanguage()
  const [profile, setProfile] = useState({
    companyName: 'C-DATA Distribution',
    contactName: user?.name || 'Admin User',
    email: user?.email || 'admin@cdata.com',
    phone: '+1 (555) 123-4567',
  })
  const [ppSettings, setPpSettings] = useState({
    enablePP: true,
    billingCycle: 'monthly',
    pricePerMailbox: 2.5,
  })
  const [notifications, setNotifications] = useState({
    newIntegrator: true,
    newCustomer: true,
    orderApproval: true,
    provisioningFailed: true,
    monthlyReport: true,
  })
  const [approvalRules, setApprovalRules] = useState({
    autoApproveBelow: 100,
    requireNote: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Page Header */}
      <PageHeader
        title={tr('הגדרות', 'Settings')}
        subtitle={tr('תצורה', 'Configuration')}
        description={tr('ניהול פרופיל המפיץ והגדרות מערכת', 'Manage distributor profile and system settings')}
        icon={Settings2}
        status={saved && (
          <div className="px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">{tr('נשמר', 'Saved')}</span>
          </div>
        )}
      />

      {/* Distributor Profile */}
      <SettingsSection
        title={tr('פרופיל מפיץ', 'Distributor Profile')}
        description={tr('עדכון פרטי הארגון שלך', 'Update your organization information')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormField
            label={tr('שם חברה', 'Company Name')}
            value={profile.companyName}
            onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
          />
          <FormField
            label={tr('שם איש קשר', 'Contact Name')}
            value={profile.contactName}
            onChange={(e) => setProfile({ ...profile, contactName: e.target.value })}
          />
          <FormField
            label={tr('אימייל', 'Email')}
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
          <FormField
            label={tr('טלפון', 'Phone')}
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2.5 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-semibold text-sm transition-all"
        >
          {tr('שמור פרופיל', 'Save Profile')}
        </button>
      </SettingsSection>

      {/* Product Settings */}
      <SettingsSection
        title={tr('הגדרות מוצר', 'Product Settings')}
        description={tr('הגדרות Perception Point ו-FortiSASE', 'Configure Perception Point and FortiSASE settings')}
      >
        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
            <h4 className="text-sm font-semibold text-white mb-4">Perception Point</h4>
            <Toggle
              label={tr('אפשר מכירות Perception Point', 'Enable Perception Point Sales')}
              description={tr('לאפשר לאינטגרטורים למכור Perception Point ללקוחות', 'Allow integrators to sell Perception Point to customers')}
              checked={ppSettings.enablePP}
              onChange={(val) => setPpSettings({ ...ppSettings, enablePP: val })}
            />
            {ppSettings.enablePP && (
              <>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-4">
                  <div className="text-xs font-semibold text-amber-300">{tr('חיוב חשבונית בלבד', 'Invoice Billing Only')}</div>
                  <div className="text-xs text-amber-200 mt-1">{tr('Perception Point עובד בחיוב חשבונית בלבד ללא חיובי אשראי.', 'Perception Point uses invoice-only billing with no credit card charges.')}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">{tr('מחזור חיוב ברירת מחדל', 'Default Billing Cycle')}</label>
                    <select
                      value={ppSettings.billingCycle}
                      onChange={(e) => setPpSettings({ ...ppSettings, billingCycle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                    >
                      <option value="monthly">{tr('חודשי', 'Monthly')}</option>
                      <option value="annual">{tr('שנתי', 'Annual')}</option>
                    </select>
                  </div>
                  <FormField
                    label={tr('מחיר לכל תיבת דואר', 'Price Per Mailbox')}
                    type="number"
                    placeholder="2.50"
                    value={ppSettings.pricePerMailbox}
                    onChange={(e) => setPpSettings({ ...ppSettings, pricePerMailbox: parseFloat(e.target.value) })}
                  />
                </div>
              </>
            )}
          </div>

          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
            <h4 className="text-sm font-semibold text-white mb-4">FortiSASE</h4>
            <div className="p-3 rounded-lg bg-slate-500/10 border border-slate-500/30">
              <div className="text-xs font-semibold text-slate-300">{tr('אינטגרציית API בהמתנה', 'API Integration Pending')}</div>
              <div className="text-xs text-slate-400 mt-1">{tr('אינטגרציית FortiSASE נמצאת כרגע בפיתוח.', 'FortiSASE integration is currently in development.')}</div>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection
        title={tr('הגדרות התראות', 'Notification Settings')}
        description={tr('שליטה באירועים שמפעילים התראות', 'Control which events trigger notifications')}
      >
        <div className="space-y-2 mb-6">
          <Toggle
            label={tr('פעילות אינטגרטור חדשה', 'New Integrator Activity')}
            checked={notifications.newIntegrator}
            onChange={(val) => setNotifications({ ...notifications, newIntegrator: val })}
          />
          <Toggle
            label={tr('לקוח חדש נוצר', 'New Customer Created')}
            checked={notifications.newCustomer}
            onChange={(val) => setNotifications({ ...notifications, newCustomer: val })}
          />
          <Toggle
            label={tr('הזמנה ממתינה לאישור', 'Order Waiting Approval')}
            checked={notifications.orderApproval}
            onChange={(val) => setNotifications({ ...notifications, orderApproval: val })}
          />
          <Toggle
            label={tr('הקמה נכשלה', 'Provisioning Failed')}
            checked={notifications.provisioningFailed}
            onChange={(val) => setNotifications({ ...notifications, provisioningFailed: val })}
          />
          <Toggle
            label={tr('דוח חודשי הופק', 'Monthly Report Generated')}
            checked={notifications.monthlyReport}
            onChange={(val) => setNotifications({ ...notifications, monthlyReport: val })}
          />
        </div>
      </SettingsSection>

      {/* Approval Rules */}
      <SettingsSection
        title={tr('כללי אישור', 'Approval Rules')}
        description={tr('הגדרת ספי אישור אוטומטיים', 'Configure automatic approval thresholds')}
      >
        <div className="space-y-4 mb-6">
          <FormField
            label={tr('אישור אוטומטי להזמנות מתחת ל־(תיבות דואר)', 'Auto-Approve Orders Below (Mailboxes)')}
            type="number"
            placeholder="100"
            value={approvalRules.autoApproveBelow}
            onChange={(e) => setApprovalRules({ ...approvalRules, autoApproveBelow: parseInt(e.target.value) })}
          />
          <Toggle
            label={tr('דרוש הערת אישור פנימית', 'Require Internal Approval Note')}
            description={tr('כל אישור חייב לכלול הערה מהמאשר', 'All approvals must include a note from the approver')}
            checked={approvalRules.requireNote}
            onChange={(val) => setApprovalRules({ ...approvalRules, requireNote: val })}
          />
        </div>
      </SettingsSection>

      {/* Audit & Security */}
      <SettingsSection
        title={tr('ביקורת ואבטחה', 'Audit & Security')}
        description={tr('מידע אבטחה ותאימות', 'Security and compliance information')}
      >
        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{tr('משתמש נוכחי', 'Current User')}</div>
            <div className="text-sm text-white font-semibold">{user?.name || tr('מנהל מערכת', 'System Admin')}</div>
            <div className="text-xs text-slate-500 mt-1">
              {user?.role
                ? (isHebrew
                  ? (user.role === 'DISTRIBUTOR_ADMIN' ? 'מנהל מפיץ' : user.role)
                  : user.role.replace(/_/g, ' '))
                : tr('מנהל מפיץ', 'Distributor Admin')}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{tr('כניסה אחרונה', 'Last Login')}</div>
            <div className="text-sm text-white">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all">
          <Shield className="w-4 h-4" />
          {tr('הצג יומן ביקורת', 'View Audit Log')}
        </button>
      </SettingsSection>

      {/* Save Button */}
      <motion.div
        className="flex gap-3 pt-4"
        variants={itemVariants}
      >
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-3 rounded-lg bg-cdata-500 hover:bg-cdata-400 text-white font-bold transition-all"
        >
          {tr('שמור את כל ההגדרות', 'Save All Settings')}
        </button>
      </motion.div>
    </motion.div>
  )
}
