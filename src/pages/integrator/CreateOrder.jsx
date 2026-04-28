import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Mail, CheckCircle2, ChevronRight, ChevronLeft, Send,
  FileText, Info, Users, DollarSign, AlertCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { workspaceApi } from '../../api/workspaceApi'
import { PP_PACKAGES, PP_BILLING_CYCLES, calcPPEstimate } from '../../data/ppPackages'

const STEP_LABELS = ['Choose Package', 'Order Details', 'Review & Submit']

function fmt(amount) {
  return `$${Number(amount).toFixed(2)}`
}

function InvoiceOnlyBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
      style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
      <FileText className="w-3 h-3" />
      Invoice Only — No Credit Card
    </div>
  )
}

export default function CreateOrder() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const preselectedCustomerId = searchParams.get('customerId') || ''

  const [customers, setCustomers] = useState([])
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdOrder, setCreatedOrder] = useState(null)

  const [form, setForm] = useState({
    packageId: '',
    customerId: preselectedCustomerId,
    billingCycle: 'MONTHLY',
    estimatedMailboxes: '',
    notes: '',
  })

  const selectedPkg = PP_PACKAGES.find(p => p.id === form.packageId)
  const selectedCustomer = customers.find(c => c.id === form.customerId)
  const estimatedMailboxes = Number(form.estimatedMailboxes) || 0
  const estimate = calcPPEstimate(selectedPkg, form.billingCycle, estimatedMailboxes)

  useEffect(() => {
    const data = workspaceApi.getCustomers()
    if (data && typeof data.then === 'function') {
      data
        .then(res => {
          const list = res?.data || res || []
          setCustomers(list)
        })
        .catch(() => setError('Could not load customers. Make sure the backend is running.'))
    }
  }, [])

  // Pre-select customer if passed via URL
  useEffect(() => {
    if (preselectedCustomerId && !form.customerId) {
      setForm(f => ({ ...f, customerId: preselectedCustomerId }))
    }
  }, [preselectedCustomerId])

  function next() { setStep(s => Math.min(s + 1, 2)) }
  function back() { setStep(s => Math.max(s - 1, 0)) }

  function canNext() {
    if (step === 0) return !!form.packageId
    if (step === 1) return !!form.customerId && estimatedMailboxes >= 1
    return true
  }

  async function handleSubmit() {
    if (!selectedPkg || !form.customerId || estimatedMailboxes < 1) return
    try {
      setLoading(true)
      setError('')

      const pricePerMailbox = form.billingCycle === 'ANNUAL'
        ? selectedPkg.annualPricePerMailbox
        : selectedPkg.monthlyPricePerMailbox

      const created = await workspaceApi.createPPOrder({
        customerId: form.customerId,
        packageCode: selectedPkg.code,
        billingCycle: form.billingCycle,
        estimatedUsers: estimatedMailboxes,
        pricePerMailbox,
        notes: form.notes || undefined,
      })

      setCreatedOrder(created)
      setSubmitted(true)
    } catch (submitError) {
      setError(submitError.message || 'Failed to submit order')
    } finally {
      setLoading(false)
    }
  }

  if (submitted && createdOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(99,102,241,0.12)', border: '2px solid rgba(99,102,241,0.3)' }}>
          <Send className="w-9 h-9" style={{ color: '#a5b4fc' }} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-white mb-2">Order Submitted for CData Approval</h2>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            Your Perception Point order has been submitted. CData will review and approve it —
            you will be notified once provisioning begins.
          </p>
        </div>

        <div className="glass rounded-xl p-5 w-full max-w-sm" style={{ border: '1px solid rgba(99,102,241,0.18)' }}>
          <div className="space-y-2.5 text-xs">
            {[
              { label: 'Package', value: selectedPkg?.name },
              { label: 'Customer', value: selectedCustomer?.companyName },
              { label: 'Billing Cycle', value: form.billingCycle === 'ANNUAL' ? 'Annual (15% off)' : 'Monthly' },
              { label: 'Estimated Mailboxes', value: `${estimatedMailboxes.toLocaleString()} mailboxes` },
              { label: 'Estimated Monthly', value: fmt(estimate.monthly) },
              { label: 'Billing Method', value: 'Invoice Only' },
              { label: 'Status', value: createdOrder.status || 'PENDING_CDATA_APPROVAL' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between">
                <span className="text-slate-500">{label}</span>
                <span className="text-white font-semibold">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-[10px] text-slate-600 leading-relaxed">
            Final invoice is calculated based on actual protected mailboxes connected in Perception Point.
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate(`/integrator/customers/${form.customerId}`)}
            className="btn-primary text-xs">
            View Customer Profile
          </button>
          <button onClick={() => navigate('/integrator/orders')} className="btn-ghost text-xs">
            View All Orders
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white">
              New <span className="text-emerald-400">Perception Point</span> Order
            </h1>
          </div>
          <p className="text-xs text-slate-500">Submit a PP license order to CData for approval and provisioning.</p>
          {error && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>
        <InvoiceOnlyBadge />
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-indigo-500 text-white' :
                'bg-white/5 text-slate-600'
              }`}>
                {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-white' : 'text-slate-600'}`}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? 'bg-emerald-500/40' : 'bg-white/5'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* ── Step 0: Choose Package ── */}
      {step === 0 && (
        <div className="space-y-3">
          <div className="text-sm font-bold text-white">Choose Perception Point Package</div>

          {PP_PACKAGES.map(pkg => {
            const selected = form.packageId === pkg.id
            return (
              <button key={pkg.id}
                onClick={() => setForm(f => ({ ...f, packageId: pkg.id }))}
                className="glass rounded-xl p-5 text-left w-full transition-all duration-200 hover:scale-[1.01]"
                style={{
                  border: `1px solid ${selected ? pkg.color + '50' : pkg.color + '20'}`,
                  boxShadow: selected ? `0 0 20px ${pkg.color}20` : 'none',
                  background: selected ? `${pkg.color}08` : 'rgba(11,25,41,0.65)',
                }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: pkg.gradient, boxShadow: `0 4px 12px ${pkg.color}40` }}>
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-white">{pkg.name}</span>
                      <span className="text-[10px] text-slate-500">SKU: {pkg.sku}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">{pkg.description}</p>
                    <ul className="space-y-1">
                      {pkg.features.map(f => (
                        <li key={f} className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0" style={{ color: pkg.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[11px] font-semibold" style={{ color: pkg.color }}>
                        from {fmt(pkg.monthlyPricePerMailbox)} / mailbox / month
                      </span>
                      <span className="text-[10px] text-slate-600">
                        or {fmt(pkg.annualPricePerMailbox)} / mailbox / month (annual)
                      </span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 mt-0.5 ${selected ? 'border-transparent' : 'border-slate-700'}`}
                    style={selected ? { background: pkg.color } : {}}>
                    {selected && <CheckCircle2 className="w-full h-full text-white" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Step 1: Order Details ── */}
      {step === 1 && selectedPkg && (
        <div className="space-y-5">
          {/* Package summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: `${selectedPkg.color}08`, border: `1px solid ${selectedPkg.color}20` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: selectedPkg.gradient }}>
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{selectedPkg.name}</div>
              <div className="text-[10px] text-slate-500">{selectedPkg.sku}</div>
            </div>
            <InvoiceOnlyBadge />
          </div>

          {/* Customer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Customer *</label>
              <button type="button" onClick={() => navigate('/integrator/customers/new')}
                className="text-[10px] px-2.5 py-1 rounded-md border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-colors">
                + New Customer
              </button>
            </div>
            <select value={form.customerId}
              onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/40">
              <option value="">Select customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.companyName} ({c.domain})</option>
              ))}
            </select>
          </div>

          {/* Billing Cycle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Billing Cycle *</label>
            <div className="grid grid-cols-2 gap-2">
              {PP_BILLING_CYCLES.map(cycle => (
                <button key={cycle.id}
                  onClick={() => setForm(f => ({ ...f, billingCycle: cycle.id }))}
                  className={`py-3 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center gap-1 ${
                    form.billingCycle === cycle.id
                      ? 'bg-indigo-600 text-white border-transparent'
                      : 'text-slate-400 border-white/10 hover:border-white/20'
                  }`}>
                  <span>{cycle.labelHe}</span>
                  <span className="text-[10px] font-normal opacity-70">{cycle.label}</span>
                  {cycle.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 text-emerald-400 font-semibold">
                      {cycle.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Mailboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Estimated Protected Mailboxes *
            </label>
            <p className="text-[10px] text-slate-600 mb-2">
              For price estimation only — final invoice is based on actual connected mailboxes in Perception Point.
            </p>
            <input type="number" min="1"
              value={form.estimatedMailboxes}
              onChange={e => setForm(f => ({ ...f, estimatedMailboxes: e.target.value }))}
              placeholder="e.g. 250"
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40"
            />
          </div>

          {/* Price Estimate */}
          {estimatedMailboxes > 0 && (
            <div className="rounded-xl p-4" style={{ background: `${selectedPkg.color}08`, border: `1px solid ${selectedPkg.color}25` }}>
              <div className="flex items-center gap-1.5 mb-3">
                <DollarSign className="w-3.5 h-3.5" style={{ color: selectedPkg.color }} />
                <div className="text-xs font-semibold text-white">Price Estimate</div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Package</span>
                  <span className="text-white">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Billing Cycle</span>
                  <span className="text-white">{form.billingCycle === 'ANNUAL' ? 'Annual (15% off)' : 'Monthly'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price per Mailbox</span>
                  <span className="text-white font-semibold">{fmt(estimate.pricePerMailbox)} / month</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Mailboxes</span>
                  <span className="text-white">{estimatedMailboxes.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/5 pt-2 flex justify-between">
                  <span className="text-slate-400 font-semibold">Estimated Monthly Total</span>
                  <span className="font-bold text-base" style={{ color: selectedPkg.color }}>{fmt(estimate.monthly)}</span>
                </div>
                {form.billingCycle === 'ANNUAL' && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Annual Total</span>
                    <span className="text-emerald-400 font-semibold">{fmt(estimate.annual)}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-start gap-1.5 text-[10px] text-slate-600">
                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                Final invoice is calculated by actual protected mailboxes connected in Perception Point.
                No credit card payment required.
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Notes (optional)</label>
            <textarea value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="Additional details for this order..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 resize-none"
            />
          </div>
        </div>
      )}

      {/* ── Step 2: Review & Submit ── */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-sm font-bold text-white mb-3">Review Order</div>
          <div className="glass rounded-xl divide-y divide-white/[0.06]"
            style={{ border: '1px solid rgba(99,102,241,0.18)' }}>
            {[
              { label: 'Package',               value: selectedPkg?.name },
              { label: 'SKU',                   value: selectedPkg?.sku },
              { label: 'Customer',              value: selectedCustomer?.companyName },
              { label: 'Domain',                value: selectedCustomer?.domain },
              { label: 'Billing Cycle',         value: form.billingCycle === 'ANNUAL' ? 'Annual (15% off)' : 'Monthly' },
              { label: 'Estimated Mailboxes',   value: `${estimatedMailboxes.toLocaleString()} mailboxes` },
              { label: 'Est. Monthly Total',    value: fmt(estimate.monthly) },
              { label: 'Billing Method',        value: 'Invoice Only — No Credit Card' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
            {form.notes && (
              <div className="px-5 py-3">
                <div className="text-xs text-slate-500 mb-1">Notes</div>
                <div className="text-xs text-slate-300">{form.notes}</div>
              </div>
            )}
          </div>

          {/* Invoice notice */}
          <div className="rounded-xl p-4"
            style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#a5b4fc' }} />
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: '#a5b4fc' }}>Invoice-Only Billing</div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Perception Point orders are billed by invoice. No credit card payment is required.
                  Final invoice is calculated by actual protected mailboxes connected in Perception Point,
                  not by the estimate above.
                </p>
              </div>
            </div>
          </div>

          {/* Approval notice */}
          <div className="rounded-xl p-4"
            style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="flex items-start gap-2.5">
              <Send className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-amber-400 mb-1">Submit to CData for Approval</div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  This order will be sent to CData for review and approval before provisioning begins.
                  You will be notified once the order is approved and the Perception Point organization is created.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button onClick={back} disabled={step === 0}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
          Back
        </button>

        {step < 2 ? (
          <button onClick={next} disabled={!canNext()}
            className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
            Continue
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 15px rgba(79,70,229,0.35)' }}>
            <Send className="w-4 h-4" />
            {loading ? 'Submitting...' : 'Submit to CData for Approval'}
          </button>
        )}
      </div>
    </div>
  )
}
