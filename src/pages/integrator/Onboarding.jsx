import React, { useEffect, useMemo, useState } from 'react'
import { ExternalLink, RefreshCcw, CheckCircle2 } from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'

const INTEGRATOR_ID = 'i1'

const steps = [
  'Organization created',
  'Admin user invited',
  'Licenses assigned',
  'Email service not connected',
  'Microsoft 365 consent pending',
  'DNS / mail flow pending',
  'Protection active',
]

export default function IntegratorOnboarding() {
  const [customers, setCustomers] = useState([])
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [onboarding, setOnboarding] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-black text-white">Connect Microsoft 365 to activate Workspace Security</h1>
        <p className="text-xs text-slate-500 mt-1">
          Your organization has been created. To start protecting email traffic, complete the Email Service Configuration wizard in the FortiMail Workspace Security portal.
        </p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>

      <div className="glass rounded-xl p-4 border border-white/10">
        <label className="text-xs text-slate-400 block mb-2">Customer</label>
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
            <div className="text-sm font-semibold text-white mb-2">Status checklist</div>
            <div className="space-y-2">
              {steps.map((item, idx) => (
                <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${idx < 3 ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-cyan-300">{status?.message || onboarding?.message}</div>
          </div>

          <div className="glass rounded-xl p-4 border border-white/10 space-y-3">
            <div className="text-sm font-semibold text-white">Steps to complete in FortiMail Workspace Security</div>
            <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
              <li>Click "+ Email Service Configuration"</li>
              <li>Select "Microsoft 365"</li>
              <li>Keep connection method as "Inline"</li>
              <li>Click "Next"</li>
              <li>Follow the Perception Point wizard</li>
              <li>Approve Microsoft 365 Admin Consent</li>
              <li>Complete DNS / domain / mail-flow steps if requested</li>
              <li>Finish the integration</li>
              <li>Return here and click "Check connection"</li>
            </ol>
            <div className="flex flex-wrap gap-2 pt-2">
              <a href={onboarding.deepLinkUrl || onboarding.portalUrl} target="_blank" rel="noreferrer" className="btn-primary text-xs inline-flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" />
                Open Email Service Configuration
              </a>
              <button onClick={checkConnection} className="btn-ghost text-xs inline-flex items-center gap-1" disabled={checking}>
                <RefreshCcw className="w-3.5 h-3.5" />
                {checking ? 'Checking...' : 'Check connection'}
              </button>
              {status?.manualCompletionAvailable && (
                <button onClick={markComplete} className="btn-ghost text-xs">Mark integration as completed</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
