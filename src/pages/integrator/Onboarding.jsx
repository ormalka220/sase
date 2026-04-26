import React, { useEffect, useMemo, useState } from 'react'
import { ExternalLink, RefreshCcw, CheckCircle2 } from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'
import { useProduct } from '../../context/ProductContext'

const INTEGRATOR_ID = 'i1'

const checklistRows = [
  { key: 'organizationCreated', label: 'הארגון נוצר' },
  { key: 'adminUserInvited', label: 'משתמש אדמין הוזמן' },
  { key: 'licensesAssigned', label: 'הרישיונות הוקצו' },
  { key: 'emailServiceNotConnected', label: 'שירות הדוא"ל עדיין לא מחובר' },
  { key: 'microsoftConsentPending', label: 'הסכמת Microsoft 365 ממתינה' },
  { key: 'dnsMailFlowPending', label: 'DNS / זרימת דואר ממתינים' },
  { key: 'protectionActive', label: 'ההגנה פעילה' },
]

export default function IntegratorOnboarding() {
  const { product } = useProduct()
  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [onboarding, setOnboarding] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)
  const [resending, setResending] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const selectedCustomer = useMemo(
    () => customers.find(c => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  )

  useEffect(() => {
    workspaceApi.getCustomers(INTEGRATOR_ID).then(data => {
      setCustomers(data)
      if (data.length) setSelectedCustomerId(data[0].id)
    }).catch((e) => setError(e.message))
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

  async function resendOnboardingEmail() {
    if (!selectedCustomerId) return
    setResending(true)
    setSuccessMessage('')
    try {
      await workspaceApi.resendOnboardingEmail(selectedCustomerId)
      setSuccessMessage('מייל הנחיות נשלח מחדש בהצלחה.')
    } catch (e) {
      setError(e.message)
    } finally {
      setResending(false)
    }
  }

  if (product === 'sase') {
    return (
      <div className="glass rounded-xl p-5 border border-white/10 text-sm text-slate-300">
        קליטה זמינה כרגע רק עבור Perception Point.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">חברו את Microsoft 365 להפעלת Perception Point</h1>
        <p className="text-xs text-slate-500 mt-1">
          הארגון שלכם כבר נוצר. בשלב זה הקליטה מתבצעת דרך פורטל Perception Point בלבד - השלימו שם את אשף הגדרת שירות הדוא"ל.
        </p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        {successMessage && <p className="text-xs text-emerald-400 mt-2">{successMessage}</p>}
      </div>

      <div className="glass rounded-xl p-4 border border-white/10">
        <label className="text-xs text-slate-400 block mb-2">לקוח</label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
        >
          {customers.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
        </select>
      </div>

      {selectedCustomer && onboarding && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-4 border border-indigo-500/30">
            <div className="text-sm font-semibold text-white mb-2">רשימת סטטוסים</div>
            <div className="space-y-2">
              {checklistRows.map((item) => (
                <div key={item.key} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${onboarding?.checklist?.[item.key] ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-cyan-300">{status?.message || onboarding?.message}</div>
          </div>

          <div className="glass rounded-xl p-4 border border-white/10 space-y-3">
            <div className="text-sm font-semibold text-white">שלבים לביצוע ב־Perception Point</div>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
              <li>לחצו על "+ Email Service Configuration"</li>
              <li>בחרו "Microsoft 365"</li>
              <li>השאירו את שיטת החיבור על "Inline"</li>
              <li>לחצו "Next"</li>
              <li>המשיכו לפי האשף של Perception Point</li>
              <li>אשרו הרשאות אדמין ל־Microsoft 365</li>
              <li>השלימו שלבי DNS / דומיין / Mail Flow אם נדרש</li>
              <li>סיימו את האינטגרציה</li>
              <li>חזרו לכאן ולחצו "בדוק חיבור"</li>
            </ol>
            <div className="flex flex-wrap gap-2 pt-2">
              <a href={onboarding.deepLinkUrl || onboarding.portalUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs inline-flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                פתח הגדרת שירות דוא"ל
              </a>
              <button onClick={checkConnection} className="btn-ghost text-xs inline-flex items-center gap-1" disabled={checking}>
                <RefreshCcw className="w-3.5 h-3.5" />
                {checking ? 'בודק...' : 'בדוק חיבור'}
              </button>
              {status?.manualCompletionAvailable && (
                <button onClick={markComplete} className="btn-ghost text-xs">סמן אינטגרציה כהושלמה</button>
              )}
              <button onClick={resendOnboardingEmail} className="btn-ghost text-xs" disabled={resending}>
                {resending ? 'שולח...' : 'שלח שוב מייל הנחיות'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
