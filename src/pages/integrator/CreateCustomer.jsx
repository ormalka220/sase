import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle, Globe, Shield, Lock, ChevronRight,
} from 'lucide-react'

const STEPS = ['פרטי חברה', 'איש קשר', 'פאקג׳', 'אישור']

const packages = [
  {
    id: 'sase',
    icon: Globe,
    title: 'Sovereign SASE',
    desc: 'Zero-trust network access, SWG, CASB',
  },
  {
    id: 'workspace',
    icon: Shield,
    title: 'Workspace Security',
    desc: 'Email, browser, cloud storage protection',
  },
  {
    id: 'both',
    icon: Lock,
    title: 'Full Stack',
    desc: 'Complete SASE + Workspace Security bundle',
  },
]

const packageLabel = (id) => {
  const map = { sase: 'Sovereign SASE', workspace: 'Workspace Security', both: 'Full Stack' }
  return map[id] || id
}

const inputClass =
  'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40 transition-colors'
const labelClass = 'text-xs text-slate-400 mb-1.5 block'

export default function CreateCustomer() {
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [createdCustomerId, setCreatedCustomerId] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    domain: '',
    country: 'Israel',
    numberOfUsers: '',
    fortisaseUser: '',
    adminEmail: '',
    phone: '',
    contactName: '',
    package: 'sase',
    deploymentType: 'cloud',
    bandwidthPerUser: '2',
    requiresStaticIp: false,
    notes: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  // Step indicator
  const StepBar = () => (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const isActive = i === step
        const isCompleted = i < step
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cdata-500 text-white'
                    : isCompleted
                    ? 'bg-cdata-500/30 text-cdata-300'
                    : 'bg-white/5 text-slate-600'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-[10px] whitespace-nowrap ${
                  isActive ? 'text-cdata-300' : isCompleted ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px bg-white/10 mb-4 mx-1" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  // Step 0: Company details
  const Step0 = () => (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className={labelClass}>שם החברה *</label>
        <input
          className={inputClass}
          placeholder="Elbit Systems"
          value={form.companyName}
          onChange={e => set('companyName', e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>דומיין</label>
        <input
          className={inputClass}
          placeholder="elbit.co.il"
          value={form.domain}
          onChange={e => set('domain', e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>מדינה</label>
        <select
          className={inputClass}
          value={form.country}
          onChange={e => set('country', e.target.value)}
        >
          <option>Israel</option>
          <option>United States</option>
          <option>United Kingdom</option>
          <option>Germany</option>
          <option>France</option>
          <option>Other</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className={labelClass}>מספר משתמשים</label>
        <input
          className={inputClass}
          type="number"
          placeholder="250"
          min="1"
          value={form.numberOfUsers}
          onChange={e => set('numberOfUsers', e.target.value)}
        />
      </div>
      {/* Bandwidth per user */}
      <div>
        <label className={labelClass}>רוחב פס פר משתמש</label>
        <select
          className={inputClass}
          value={form.bandwidthPerUser}
          onChange={e => set('bandwidthPerUser', e.target.value)}
        >
          <option value="1">1 Mbps</option>
          <option value="2">2 Mbps</option>
          <option value="5">5 Mbps</option>
          <option value="10">10 Mbps</option>
          <option value="20">20 Mbps</option>
        </select>
      </div>
      <div className="flex flex-col justify-end">
        {form.numberOfUsers && (
          <div className="h-full flex items-end pb-0.5">
            <div className="w-full bg-cdata-500/10 border border-cdata-500/20 rounded-lg px-3 py-2.5 text-xs">
              <span className="text-slate-500">סה"כ נדרש: </span>
              <span className="text-cdata-300 font-semibold">
                {form.bandwidthPerUser} Mbps × {form.numberOfUsers} = <strong>{(parseInt(form.bandwidthPerUser, 10) * parseInt(form.numberOfUsers, 10)).toLocaleString()} Mbps</strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Static IP */}
      <div className="col-span-2">
        <button
          type="button"
          onClick={() => set('requiresStaticIp', !form.requiresStaticIp)}
          className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-right ${
            form.requiresStaticIp
              ? 'border-cdata-500/50 bg-cdata-500/10 ring-1 ring-cdata-500/20'
              : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
          }`}
        >
          <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
            form.requiresStaticIp ? 'bg-cdata-500 border-cdata-500' : 'border-white/20 bg-white/5'
          }`}>
            {form.requiresStaticIp && <CheckCircle className="w-3.5 h-3.5 text-white" />}
          </div>
          <div>
            <div className={`text-sm font-medium ${form.requiresStaticIp ? 'text-white' : 'text-slate-400'}`}>
              נדרשת כתובת IP קבועה (Static IP)
            </div>
            <div className="text-[11px] text-slate-600 mt-0.5">
              הסביבה תקבל כתובת IP ייעודית וקבועה לצורך חיבורי VPN וזיהוי
            </div>
          </div>
        </button>
      </div>

      <div className="col-span-2 mt-2">
        <label className={labelClass}>
          FortiSASE Username
          <span className="text-slate-600 font-normal mr-1">(שם משתמש בסביבת FortiSASE)</span>
        </label>
        <div className="flex gap-2">
          <input
            className={inputClass + " font-mono"}
            placeholder="admin_companyname"
            value={form.fortisaseUser}
            onChange={e => set('fortisaseUser', e.target.value)}
          />
          <button
            type="button"
            onClick={() => set('fortisaseUser', 'admin_' + (form.companyName || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20))}
            className="btn-ghost text-xs px-3 whitespace-nowrap"
          >
            הצע אוטומטי
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1">דוגמא: admin_elbit · admin_hapoalim · admin_2bsecure</p>
      </div>
    </div>
  )

  // Step 1: Contact
  const Step1 = () => (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>מייל אדמין *</label>
        <input
          className={inputClass}
          type="email"
          placeholder="admin@company.co.il"
          value={form.adminEmail}
          onChange={e => set('adminEmail', e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>שם איש קשר</label>
        <input
          className={inputClass}
          placeholder="ישראל ישראלי"
          value={form.contactName}
          onChange={e => set('contactName', e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass}>טלפון</label>
        <input
          className={inputClass}
          type="tel"
          placeholder="+972-50-0000000"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
        />
      </div>
    </div>
  )

  // Step 2: Package
  const Step2 = () => (
    <div className="space-y-5">
      <div>
        <label className={labelClass + ' mb-3'}>בחר פאקג'</label>
        <div className="grid grid-cols-1 gap-3">
          {packages.map(pkg => {
            const selected = form.package === pkg.id
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => set('package', pkg.id)}
                className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  selected
                    ? 'border-cdata-500/50 bg-cdata-500/10 ring-1 ring-cdata-500/30'
                    : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-cdata-500/25' : 'bg-white/5'
                }`}>
                  <pkg.icon className={`w-5 h-5 ${selected ? 'text-cdata-300' : 'text-slate-500'}`} />
                </div>
                <div>
                  <div className={`text-sm font-semibold ${selected ? 'text-white' : 'text-slate-300'}`}>
                    {pkg.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{pkg.desc}</div>
                </div>
                {selected && (
                  <CheckCircle className="w-4 h-4 text-cdata-300 ml-auto flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <label className={labelClass}>סוג פריסה</label>
        <select
          className={inputClass}
          value={form.deploymentType}
          onChange={e => set('deploymentType', e.target.value)}
        >
          <option value="cloud">Cloud-Native</option>
          <option value="hybrid">Hybrid</option>
          <option value="onprem">On-Premise</option>
        </select>
      </div>
    </div>
  )

  // Step 3: Confirmation
  const Step3 = () => {
    const deployLabel = { cloud: 'Cloud-Native', hybrid: 'Hybrid', onprem: 'On-Premise' }
    const totalBw = form.numberOfUsers && form.bandwidthPerUser
      ? `${form.bandwidthPerUser} Mbps × ${form.numberOfUsers} = ${(parseInt(form.bandwidthPerUser, 10) * parseInt(form.numberOfUsers, 10)).toLocaleString()} Mbps`
      : '—'
    const rows = [
      { label: 'Company', value: form.companyName || '—' },
      { label: 'Domain', value: form.domain || '—' },
      { label: 'Users', value: form.numberOfUsers || '—' },
      { label: 'Admin', value: form.adminEmail || '—' },
      { label: 'Package', value: packageLabel(form.package) },
      { label: 'Country', value: form.country },
      { label: 'Deployment', value: deployLabel[form.deploymentType] || form.deploymentType },
      { label: 'Bandwidth', value: totalBw },
      { label: 'Static IP', value: form.requiresStaticIp ? 'כן — נדרשת IP קבועה' : 'לא' },
    ]
    return (
      <div className="space-y-4">
        <div className="bg-white/[0.03] border border-white/8 rounded-xl p-4 space-y-2.5">
          {rows.map(r => (
            <div key={r.label} className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{r.label}</span>
              <span className="text-sm text-white font-medium">{r.value}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">FortiSASE User:</span>
            <code className="text-cdata-300 font-mono">{form.fortisaseUser || '—'}</code>
          </div>
        </div>

        <div>
          <label className={labelClass}>הערות (אופציונלי)</label>
          <textarea
            className={inputClass + ' resize-none h-20'}
            placeholder="הערות נוספות..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
          />
        </div>
      </div>
    )
  }

  const handleSubmit = () => {
    const generatedId = `new-${(form.companyName || 'customer').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16)}`
    setCreatedCustomerId(generatedId)
    setSubmitted(true)
  }

  const resetForm = () => {
    setForm({
      companyName: '', domain: '', country: 'Israel', numberOfUsers: '',
      fortisaseUser: '',
      adminEmail: '', phone: '', contactName: '',
      package: 'sase',
      deploymentType: 'cloud',
      bandwidthPerUser: '2',
      requiresStaticIp: false,
      notes: '',
    })
    setStep(0)
    setSubmitted(false)
    setCreatedCustomerId('')
  }

  // Success state
  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/integrator/customers')}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">לקוח חדש</h1>
            <p className="text-slate-500 text-sm mt-0.5">רישום לקוח חדש</p>
          </div>
        </div>

        <div className="glass glow-border rounded-2xl p-10 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-9 h-9 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">הלקוח נוצר בהצלחה!</h2>
          <p className="text-slate-400 text-sm mb-8">{form.companyName} הוסף למערכת</p>
          <div className="flex items-center justify-center gap-3">
            <button
              className="btn-primary"
              onClick={() => navigate(`/integrator/customers/${createdCustomerId || 'c1'}`)}
            >
              פתח פרופיל לקוח
            </button>
            <button
              className="btn-ghost"
              onClick={resetForm}
            >
              צור לקוח נוסף
            </button>
          </div>
        </div>
      </div>
    )
  }

  const stepContent = [<Step0 />, <Step1 />, <Step2 />, <Step3 />]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/integrator/customers')}
          className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">לקוח חדש</h1>
          <p className="text-slate-500 text-sm mt-0.5">רישום לקוח חדש</p>
        </div>
      </div>

      {/* Step bar */}
      <div className="max-w-2xl mx-auto">
        <StepBar />
      </div>

      {/* Form card */}
      <div className="glass glow-border rounded-2xl p-7 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">{STEPS[step]}</h2>
          <div className="text-xs text-slate-500 mt-0.5">שלב {step + 1} מתוך {STEPS.length}</div>
        </div>

        {stepContent[step]}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-5 border-t border-white/8">
          <div>
            {step > 0 && (
              <button
                className="btn-ghost flex items-center gap-2"
                onClick={() => setStep(s => s - 1)}
              >
                <ArrowLeft className="w-4 h-4" />
                {step === 3 ? 'ערוך' : 'חזור'}
              </button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <button
                className="btn-primary flex items-center gap-2"
                onClick={() => setStep(s => s + 1)}
              >
                הבא
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                className="btn-primary flex items-center gap-2"
                onClick={handleSubmit}
              >
                <CheckCircle className="w-4 h-4" />
                צור לקוח
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
