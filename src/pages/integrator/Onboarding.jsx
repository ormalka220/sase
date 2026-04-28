import React, { useEffect, useMemo, useState } from 'react'
import { ExternalLink, RefreshCcw, CheckCircle2 } from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'
import { useProduct } from '../../context/ProductContext'
import { useLanguage } from '../../context/LanguageContext'
import { getCommonLabels } from '../../i18n/labels'

const checklistRows = [
  { key: 'organizationCreated', he: 'הארגון נוצר', en: 'Organization created' },
  { key: 'adminUserInvited', he: 'משתמש אדמין הוזמן', en: 'Admin user invited' },
  { key: 'licensesAssigned', he: 'הרישיונות הוקצו', en: 'Licenses assigned' },
  { key: 'emailServiceNotConnected', he: 'שירות הדוא"ל עדיין לא מחובר', en: 'Email service is not connected yet' },
  { key: 'microsoftConsentPending', he: 'הסכמת Microsoft 365 ממתינה', en: 'Microsoft 365 consent is pending' },
  { key: 'dnsMailFlowPending', he: 'DNS / זרימת דואר ממתינים', en: 'DNS / mail flow are pending' },
  { key: 'protectionActive', he: 'ההגנה פעילה', en: 'Protection is active' },
]

export default function IntegratorOnboarding() {
  const { product } = useProduct()
  const { tr } = useLanguage()
  const labels = getCommonLabels(tr)
  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [onboarding, setOnboarding] = useState(null)
  const [status, setStatus] = useState(null)
  const [ordersByCustomerId, setOrdersByCustomerId] = useState({})
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [resending, setResending] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const selectedCustomer = useMemo(
    () => customers.find(c => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  )
  const selectedOrder = selectedCustomer ? ordersByCustomerId[selectedCustomer.id] || null : null

  useEffect(() => {
    async function loadQueue() {
      try {
        setError('')
        const [customersRes, ordersRes] = await Promise.all([
          workspaceApi.getPpCustomersList({ page: 1, limit: 200 }),
          workspaceApi.getOrders({ productCode: 'WORKSPACE_SECURITY', page: 1, limit: 200 }),
        ])

        const allCustomers = Array.isArray(customersRes) ? customersRes : (customersRes?.data || [])
        const allOrders = Array.isArray(ordersRes) ? ordersRes : (ordersRes?.data || [])

        const READY_STATUSES = new Set([
          'APPROVED_BY_CDATA',
          'PROVISIONING_STARTED',
          'PP_ORG_CREATED',
          'PP_ADMIN_INVITED',
          'READY_FOR_ONBOARDING',
          'ACTIVE',
          'APPROVED',
        ])

        const latestByCustomer = {}
        allOrders.forEach((o) => {
          if (!o?.customerId) return
          if (!READY_STATUSES.has(o.status)) return
          const prev = latestByCustomer[o.customerId]
          if (!prev || new Date(o.createdAt) > new Date(prev.createdAt)) {
            latestByCustomer[o.customerId] = o
          }
        })

        const queue = allCustomers.filter((c) => Boolean(latestByCustomer[c.id]))
        setOrdersByCustomerId(latestByCustomer)
        setCustomers(queue)
        if (queue.length) setSelectedCustomerId(queue[0].id)
      } catch (e) {
        setError(e.message)
      }
    }

    loadQueue()
  }, [])

  useEffect(() => {
    if (!selectedCustomerId) return
    workspaceApi.getOnboarding(selectedCustomerId).then(setOnboarding).catch((e) => setError(e.message))
  }, [selectedCustomerId])

  useEffect(() => {
    if (!selectedCustomerId) return
    const timer = setInterval(() => {
      workspaceApi.getIntegrationStatus(selectedCustomerId)
        .then(setStatus)
        .catch(() => {})
    }, 15000)
    return () => clearInterval(timer)
  }, [selectedCustomerId])

  async function checkConnection() {
    if (!selectedCustomerId) return
    setChecking(true)
    try {
      const result = await workspaceApi.getIntegrationStatus(selectedCustomerId)
      setStatus(result)
      const fresh = await workspaceApi.getOnboarding(selectedCustomerId)
      setOnboarding(fresh)
    } catch (e) {
      setError(e.message)
    } finally {
      setChecking(false)
    }
  }

  async function markComplete() {
    if (!selectedCustomerId) return
    await workspaceApi.markIntegrationComplete(selectedCustomerId)
    await checkConnection()
  }

  async function verifyAndComplete() {
    if (!selectedCustomerId) return
    setCompleting(true)
    setSuccessMessage('')
    setError('')
    try {
      const integration = await workspaceApi.getIntegrationStatus(selectedCustomerId)
      setStatus(integration)

      if (integration?.state === 'active') {
        setSuccessMessage(tr('בוצע אימות תקין ב-PP. תהליך הקליטה הושלם בהצלחה.', 'Verification in PP succeeded. Onboarding completed successfully.'))
        const fresh = await workspaceApi.getOnboarding(selectedCustomerId)
        setOnboarding(fresh)
        return
      }

      if (integration?.manualCompletionAvailable) {
        await workspaceApi.markIntegrationComplete(selectedCustomerId)
        const [freshStatus, freshOnboarding] = await Promise.all([
          workspaceApi.getIntegrationStatus(selectedCustomerId),
          workspaceApi.getOnboarding(selectedCustomerId),
        ])
        setStatus(freshStatus)
        setOnboarding(freshOnboarding)
        setSuccessMessage(tr('בוצע סימון השלמה ידני לאחר בדיקת תקינות.', 'Manual completion was marked after successful validation.'))
      } else {
        setError(tr('המערכת עדיין לא מזהה אינטגרציה מלאה ב-PP. בדקו שהוגדרו תיבות, DNS ו-Mail Flow ואז נסו שוב.', 'The system still does not detect full PP integration. Verify mailboxes, DNS, and mail flow, then try again.'))
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setCompleting(false)
    }
  }

  async function resendOnboardingEmail() {
    if (!selectedCustomerId) return
    setResending(true)
    setSuccessMessage('')
    try {
      await workspaceApi.resendOnboardingEmail(selectedCustomerId)
      setSuccessMessage(tr('מייל הנחיות נשלח מחדש בהצלחה.', 'Onboarding instructions email was resent successfully.'))
    } catch (e) {
      setError(e.message)
    } finally {
      setResending(false)
    }
  }

  if (product === 'sase') {
    return (
      <div className="glass rounded-xl p-5 border border-white/10 text-sm text-slate-300">
        {tr('קליטה זמינה כרגע רק עבור Perception Point.', 'Onboarding is currently available only for Perception Point.')}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">{tr('חברו את Microsoft 365 להפעלת Perception Point', 'Connect Microsoft 365 to activate Perception Point')}</h1>
        <p className="text-xs text-slate-500 mt-1">
          {tr('הארגון שלכם כבר נוצר. בשלב זה הקליטה מתבצעת דרך פורטל Perception Point בלבד - השלימו שם את אשף הגדרת שירות הדוא"ל.', 'Your organization is already created. At this stage onboarding is completed only through the Perception Point portal; finish the email service setup wizard there.')}
        </p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        {successMessage && <p className="text-xs text-emerald-400 mt-2">{successMessage}</p>}
      </div>

      <div className="glass rounded-xl p-4 border border-white/10">
        <label className="text-xs text-slate-400 block mb-2">{tr('לקוח', 'Customer')}</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
        >
          {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
        </select>
        {customers.length === 0 && (
          <div className="mt-3 text-xs text-slate-500">
            {tr('אין כרגע לקוחות בתור קליטה. לקוחות יופיעו כאן אחרי הזמנת PP מאושרת.', 'There are currently no customers in the onboarding queue. Customers appear here after an approved PP order.')}
          </div>
        )}
      </div>

      {selectedCustomer && onboarding && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 border border-indigo-500/30">
            <div className="mb-3 rounded-lg bg-white/[0.03] border border-white/10 p-3">
              <div className="text-[11px] text-slate-500 mb-1">{tr('פרטי התחברות PP ללקוח', 'PP Access Details')}</div>
              <div className="text-xs text-slate-300">{tr('מזהה משתמש אדמין', 'Admin User ID')}: <span className="text-white font-semibold">{selectedCustomer.ppAdminUserId || '—'}</span></div>
              <div className="text-xs text-slate-300">{tr('כתובת פורטל', 'Portal URL')}: <a className="text-cdata-300 hover:underline" href={onboarding.deepLinkUrl || onboarding.portalUrl} target="_blank" rel="noreferrer">{onboarding.deepLinkUrl || onboarding.portalUrl}</a></div>
              {selectedOrder && (
                <div className="text-[11px] text-slate-500 mt-1">
                  {tr('הזמנה', 'Order')}: <span className="text-slate-300">{selectedOrder.id}</span> · {tr('סטטוס', 'Status')}: <span className="text-slate-300">{labels.statuses[selectedOrder.status] || selectedOrder.status}</span>
                </div>
              )}
            </div>
            <div className="text-sm font-semibold text-white mb-2">{tr('רשימת סטטוסים', 'Status Checklist')}</div>
            <div className="space-y-2">
              {checklistRows.map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${onboarding?.checklist?.[item.key] ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{tr(item.he, item.en)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-cyan-300">
              {status?.message || onboarding?.message || tr('אין הודעת סטטוס', 'No status message')}
            </div>
          </div>

          <div className="glass rounded-xl p-4 border border-white/10 space-y-3">
            <div className="text-sm font-semibold text-white">{tr('שלבים לביצוע ב־Perception Point', 'Steps to complete in Perception Point')}</div>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
              <li>{tr('לחצו על "+ Email Service Configuration"', 'Click "+ Email Service Configuration"')}</li>
              <li>{tr('בחרו "Microsoft 365"', 'Select "Microsoft 365"')}</li>
              <li>{tr('השאירו את שיטת החיבור על "Inline"', 'Keep connection method as "Inline"')}</li>
              <li>{tr('לחצו "Next"', 'Click "Next"')}</li>
              <li>{tr('המשיכו לפי האשף של Perception Point', 'Continue with the Perception Point wizard')}</li>
              <li>{tr('אשרו הרשאות אדמין ל־Microsoft 365', 'Approve admin permissions for Microsoft 365')}</li>
              <li>{tr('השלימו שלבי DNS / דומיין / Mail Flow אם נדרש', 'Complete DNS/domain/mail flow steps if needed')}</li>
              <li>{tr('סיימו את האינטגרציה', 'Finish the integration')}</li>
              <li>{tr('חזרו לכאן ולחצו "בדוק חיבור"', 'Return here and click "Check Connection"')}</li>
            </ol>
            <div className="flex flex-wrap gap-2 pt-2">
              <a href={onboarding.deepLinkUrl || onboarding.portalUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs inline-flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                {tr('פתח הגדרת שירות דוא"ל', 'Open Email Service Setup')}
              </a>
              <button onClick={checkConnection} className="btn-ghost text-xs inline-flex items-center gap-1" disabled={checking}>
                <RefreshCcw className="w-3.5 h-3.5" />
                {checking ? tr('בודק...', 'Checking...') : tr('בדוק חיבור', 'Check Connection')}
              </button>
              <button onClick={verifyAndComplete} className="btn-ghost text-xs" disabled={completing}>
                {completing ? tr('מאמת...', 'Verifying...') : tr('בדוק וסיים קליטה', 'Verify & Complete Onboarding')}
              </button>
              {status?.manualCompletionAvailable && (
                <button onClick={markComplete} className="btn-ghost text-xs">{tr('סמן אינטגרציה כהושלמה', 'Mark integration as completed')}</button>
              )}
              <button onClick={resendOnboardingEmail} className="btn-ghost text-xs" disabled={resending}>
                {resending ? tr('שולח...', 'Sending...') : tr('שלח שוב מייל הנחיות', 'Resend onboarding email')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
