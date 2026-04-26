import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, Mail, Users, Package, CheckCircle2,
  ChevronRight, ChevronLeft, Send, Layers
} from 'lucide-react'
import { useProduct } from '../../context/ProductContext'
import { workspaceApi } from '../../api/workspaceApi'

const INTEGRATOR_ID = 'i1'
const DISTRIBUTOR_ID = 'd1'

const PRODUCTS = [
  {
    id: 'sase',
    name: 'Forti SASE',
    nameHe: 'פורטי SASE',
    description: 'Secure Access Service Edge — Network Security',
    descHe: 'אבטחת רשת, גישה מאובטחת, Zero Trust',
    color: '#2C6A8A',
    gradient: 'linear-gradient(135deg, #2C6A8A, #1F5070)',
    icon: ShieldCheck,
    licenseTypes: [
      { id: 'users', label: 'Users', labelHe: 'משתמשים', unit: 'user' },
    ],
    sku: 'FPP-SASE1-US-USxx',
    monthlyUnitPrice: 6.5,
    family: 'sase',
  },
  {
    id: 'pp-ades',
    name: 'Advanced Email Security',
    nameHe: 'פרספשן פוינט',
    description: 'Perception Point — advanced email protection against phishing, BEC, malware, and malicious URLs.',
    descHe: 'הגנת מייל מתקדמת נגד פישינג, BEC, קבצים וקישורים זדוניים.',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #047857)',
    icon: Mail,
    licenseTypes: [
      { id: 'mailboxes', label: 'Mailboxes', labelHe: 'תיבות דואר', unit: 'mailbox' },
    ],
    sku: 'FPP-ADES1-ST-AExx',
    monthlyUnitPrice: 3,
    family: 'perception',
  },
  {
    id: 'pp-emsb',
    name: 'Email & MS Package Security Bundle',
    nameHe: 'פרספשן פוינט',
    description: 'Perception Point — email + Microsoft 365 collaboration protection (Teams, SharePoint, OneDrive).',
    descHe: 'הגנה על אימייל וגם על Microsoft 365 ושיתופיות (Teams/SharePoint/OneDrive).',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    icon: Mail,
    licenseTypes: [
      { id: 'mailboxes', label: 'Mailboxes', labelHe: 'תיבות דואר', unit: 'mailbox' },
    ],
    sku: 'FPP-EMSB1-BD-BDxx',
    monthlyUnitPrice: 5,
    family: 'perception',
  },
  {
    id: 'bundle-ades-sase',
    name: 'Bundle: ADES + SASE',
    nameHe: 'באנדל פרספשן + SASE',
    description: 'Advanced Email Security + Forti SASE with 10% bundle discount.',
    descHe: 'Advanced Email Security + Forti SASE עם 10% הנחה על הבאנדל.',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9, #2563EB)',
    icon: Layers,
    licenseTypes: [
      { id: 'users', label: 'Users', labelHe: 'משתמשים', unit: 'user' },
    ],
    sku: 'BND-ADES-SASE-10OFF',
    monthlyUnitPrice: (3 + 6.5) * 0.9,
    family: 'all',
  },
  {
    id: 'bundle-emsb-sase',
    name: 'Bundle: EMSB + SASE',
    nameHe: 'באנדל פרספשן + SASE',
    description: 'Email & MS Package Security Bundle + Forti SASE with 10% bundle discount.',
    descHe: 'EMSB + Forti SASE עם 10% הנחה על הבאנדל.',
    color: '#0284C7',
    gradient: 'linear-gradient(135deg, #0284C7, #1D4ED8)',
    icon: Layers,
    licenseTypes: [
      { id: 'users', label: 'Users', labelHe: 'משתמשים', unit: 'user' },
    ],
    sku: 'BND-EMSB-SASE-10OFF',
    monthlyUnitPrice: (5 + 6.5) * 0.9,
    family: 'all',
  },
]

const DURATIONS = [
  { id: 'monthly', label: 'Monthly', labelHe: 'חודשי' },
  { id: 'yearly',  label: 'Yearly',  labelHe: 'שנתי', badge: '10% הנחה' },
]

const BILLING_TYPES = [
  { id: 'CREDIT_CARD', label: 'כרטיס אשראי' },
  { id: 'MONTHLY_INVOICE', label: 'חשבונית חודשית' },
]
const BANDWIDTH_OPTIONS = ['1', '2', '5', '10', '20']

const STEP_LABELS = ['בחירת מוצר', 'פרטי הזמנה', 'סקירה ושליחה']
const YEARLY_DISCOUNT = 0.1

function formatUsd(amount) {
  return `$${Number(amount).toFixed(2)}`
}

export default function CreateOrder() {
  const navigate = useNavigate()
  const { product: selectedMode } = useProduct()
  const [customers, setCustomers] = useState([])
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdOrder, setCreatedOrder] = useState(null)
  const [form, setForm] = useState({
    productId: '',
    customerId: '',
    licenseType: '',
    quantity: '',
    duration: 'yearly',
    billingType: 'CREDIT_CARD',
    fortisaseUsername: '',
    bandwidthPerUser: '5',
    notes: '',
  })

  const availableProducts = PRODUCTS.filter(p => {
    if (selectedMode === 'all') return true
    return p.family === selectedMode
  })
  const selectedProduct = availableProducts.find(p => p.id === form.productId)
  const selectedCustomer = customers.find(c => c.id === form.customerId)
  const quantity = Number(form.quantity) || 0
  const monthlyUnitPrice = selectedProduct?.monthlyUnitPrice || 0
  const durationMultiplier = form.duration === 'yearly' ? 1 - YEARLY_DISCOUNT : 1
  const effectiveUnitPrice = monthlyUnitPrice * durationMultiplier
  const totalPrice = effectiveUnitPrice * quantity
  const isSaseOrder = selectedProduct?.family === 'sase'
  const requiresFortiSaseUsername = isSaseOrder
  const totalBandwidth = quantity > 0 ? Number(form.bandwidthPerUser) * quantity : 0

  useEffect(() => {
    workspaceApi
      .getCustomers(INTEGRATOR_ID)
      .then(setCustomers)
      .catch(() => setError('Failed loading customers from backend. Make sure backend is running.'))
  }, [])

  useEffect(() => {
    if (form.productId && !availableProducts.some(p => p.id === form.productId)) {
      setForm(f => ({ ...f, productId: '', licenseType: '' }))
      setStep(0)
    }
  }, [selectedMode, form.productId, availableProducts])

  function next() { setStep(s => Math.min(s + 1, 2)) }
  function back() { setStep(s => Math.max(s - 1, 0)) }

  function canNext() {
    if (step === 0) return !!form.productId
    if (step === 1) {
      const basicValid = !!form.customerId && !!form.licenseType && !!form.quantity && Number(form.quantity) > 0
      if (!basicValid) return false
      if (requiresFortiSaseUsername && !form.fortisaseUsername.trim()) return false
      if (isSaseOrder && !form.bandwidthPerUser) return false
      return true
    }
    return true
  }

  async function handleSubmit() {
    try {
      setLoading(true)
      setError('')
      const created = await workspaceApi.createOrder({
        distributorId: DISTRIBUTOR_ID,
        integratorId: INTEGRATOR_ID,
        customerId: form.customerId,
        productType: selectedProduct?.family === 'perception' ? 'WORKSPACE_SECURITY' : 'FORTISASE',
        seats: Number(form.quantity),
        billingType: form.billingType,
        amount: Number(totalPrice.toFixed(2)),
        currency: 'USD',
      })

      let finalOrder = created
      if (form.billingType === 'CREDIT_CARD') {
        finalOrder = await workspaceApi.payOrder(created.id)
      }
      setCreatedOrder(finalOrder)
      setSubmitted(true)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(16,185,129,0.12)', border: '2px solid rgba(16,185,129,0.3)' }}>
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-black text-white mb-2">
            {form.billingType === 'CREDIT_CARD' ? 'Order paid and provisioned' : 'Order sent for distributor approval'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs">
            {form.billingType === 'CREDIT_CARD'
              ? 'Provisioning has started and customer onboarding is now available.'
              : 'The order is pending distributor approval before provisioning starts.'}
          </p>
        </div>
        <div className="glass rounded-xl p-5 w-full max-w-sm" style={{ border: '1px solid rgba(16,185,129,0.15)' }}>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">מוצר</span>
              <span className="text-white font-semibold">{selectedProduct?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">לקוח</span>
              <span className="text-white font-semibold">{selectedCustomer?.companyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">כמות</span>
              <span className="text-white font-semibold">{form.quantity} {form.licenseType === 'mailboxes' ? 'תיבות' : 'משתמשים'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">תקופה</span>
              <span className="text-white font-semibold">{form.duration === 'yearly' ? 'שנתי' : 'חודשי'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">מחיר ליחידה</span>
              <span className="text-white font-semibold">{formatUsd(effectiveUnitPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">סה"כ</span>
              <span className="text-emerald-400 font-semibold">{formatUsd(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">סטטוס</span>
              <span className="text-white font-semibold">{createdOrder?.status || 'לא זמין'}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/integrator/orders')} className="btn-primary text-xs">
            לרשימת הזמנות
          </button>
          <button onClick={() => { setSubmitted(false); setStep(0); setCreatedOrder(null); setForm({ productId: '', customerId: '', licenseType: '', quantity: '', duration: 'yearly', billingType: 'CREDIT_CARD', fortisaseUsername: '', bandwidthPerUser: '5', notes: '' }) }}
            className="btn-ghost text-xs">
            הזמנה נוספת
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white mb-1">הזמנת <span className="text-cdata-300">רישויים חדשה</span></h1>
        <p className="text-xs text-slate-500">הזמנת רישוי חדשה — תישלח להפצה לאישור</p>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-cdata-500 text-white' :
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

      {/* Step 0 — Select Product */}
      {step === 0 && (
        <div className="space-y-3">
          <div className="text-sm font-bold text-white">בחר מוצר</div>
          <div className="grid grid-cols-1 gap-3">
            {availableProducts.map(product => {
              const Icon = product.icon
              const selected = form.productId === product.id
              return (
                <button
                  key={product.id}
                  onClick={() => setForm(f => ({ ...f, productId: product.id, licenseType: product.licenseTypes[0].id }))}
                  className={`glass rounded-xl p-5 text-right w-full transition-all duration-200 hover:scale-[1.01] ${selected ? 'scale-[1.01]' : ''}`}
                  style={{
                    border: `1px solid ${selected ? product.color + '50' : product.color + '20'}`,
                    boxShadow: selected ? `0 0 20px ${product.color}20` : 'none',
                    background: selected ? `${product.color}08` : 'rgba(11,25,41,0.65)',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: product.gradient, boxShadow: `0 4px 12px ${product.color}40` }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white">{product.name}</span>
                        <span className="text-[10px] text-slate-500">{product.nameHe}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mb-1.5">SKU: {product.sku}</div>
                      <div className="text-xs text-slate-400">{product.description}</div>
                      <div className="text-[10px] text-slate-600 mt-0.5">{product.descHe}</div>
                      <div className="text-[11px] text-emerald-400 mt-2 font-semibold">
                        {formatUsd(product.monthlyUnitPrice)} / {product.licenseTypes[0].unit} / month
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 transition-all flex-shrink-0 ${
                      selected ? 'border-transparent' : 'border-slate-700'
                    }`}
                      style={selected ? { background: product.color } : {}}>
                      {selected && <CheckCircle2 className="w-full h-full text-white" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 1 — Order Details */}
      {step === 1 && selectedProduct && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: selectedProduct.gradient }}>
              <selectedProduct.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">{selectedProduct.name}</span>
          </div>

          {/* Customer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300">לקוח *</label>
              <button
                type="button"
                onClick={() => navigate('/integrator/customers/new')}
                className="text-[10px] px-2.5 py-1 rounded-md border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-colors"
              >
                צור לקוח
              </button>
            </div>
            <select
              value={form.customerId}
              onChange={e => setForm(f => ({ ...f, customerId: e.target.value }))}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cdata-500/40"
            >
              <option value="">בחר לקוח...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.companyName} ({c.domain})</option>
              ))}
            </select>
          </div>

          {/* License type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">סוג רישוי *</label>
            <div className="flex gap-2">
              {selectedProduct.licenseTypes.map(lt => (
                <button key={lt.id} onClick={() => setForm(f => ({ ...f, licenseType: lt.id }))}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                    form.licenseType === lt.id
                      ? 'text-white border-transparent'
                      : 'text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                  style={form.licenseType === lt.id ? { background: selectedProduct.gradient } : {}}>
                  {lt.label} — {lt.labelHe}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity / Users */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">{isSaseOrder ? 'מספר משתמשים *' : 'כמות *'}</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              placeholder={isSaseOrder ? 'לדוגמה: 250' : 'לדוגמה: 100'}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cdata-500/40"
            />
          </div>

          {requiresFortiSaseUsername && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                FortiSASE Username *
              </label>
              <div className="flex gap-2">
                <input
                  value={form.fortisaseUsername}
                  onChange={e => setForm(f => ({ ...f, fortisaseUsername: e.target.value }))}
                  placeholder="admin_companyname"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cdata-500/40 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    const suggested = `admin_${(selectedCustomer?.companyName || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20)}`
                    setForm(f => ({ ...f, fortisaseUsername: suggested }))
                  }}
                  className="btn-ghost text-xs px-3 whitespace-nowrap"
                >
                  הצע אוטומטי
                </button>
              </div>
              <p className="text-[10px] text-slate-600 mt-1">דוגמא: admin_elbit · admin_hapoalim · admin_2bsecure</p>
            </div>
          )}

          {isSaseOrder && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">רוחב פס פר משתמש *</label>
              <select
                value={form.bandwidthPerUser}
                onChange={e => setForm(f => ({ ...f, bandwidthPerUser: e.target.value }))}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cdata-500/40"
              >
                {BANDWIDTH_OPTIONS.map((bw) => (
                  <option key={bw} value={bw}>{bw} Mbps</option>
                ))}
              </select>
              {quantity > 0 && (
                <p className="text-[10px] text-cdata-300 mt-1.5">
                  סה"כ רוחב פס נדרש: {form.bandwidthPerUser} Mbps × {quantity.toLocaleString()} = {totalBandwidth.toLocaleString()} Mbps
                </p>
              )}
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">תקופה *</label>
            <div className="flex gap-2">
              {DURATIONS.map(d => (
                <button key={d.id} onClick={() => setForm(f => ({ ...f, duration: d.id }))}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                    form.duration === d.id
                      ? 'bg-cdata-500 text-white border-transparent'
                      : 'text-slate-400 border-white/10 hover:border-white/20'
                  }`}>
                  {d.labelHe}
                  {d.badge && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400">{d.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">סוג חיוב *</label>
            <div className="grid grid-cols-2 gap-2">
              {BILLING_TYPES.map(bt => (
                <button
                  key={bt.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, billingType: bt.id }))}
                  className={`py-2 rounded-lg border text-xs font-semibold transition-all ${
                    form.billingType === bt.id
                      ? 'bg-cdata-500 text-white border-transparent'
                      : 'text-slate-400 border-white/10 hover:border-white/20'
                  }`}
                >
                  {bt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="glass rounded-xl p-4" style={{ border: `1px solid ${selectedProduct.color}35` }}>
            <div className="text-xs font-semibold text-slate-300 mb-2">תמחור</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">מחיר חודשי בסיס ליחידה</span>
                <span className="text-white font-semibold">{formatUsd(monthlyUnitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">תקופה</span>
                <span className="text-white font-semibold">{form.duration === 'yearly' ? 'שנתי (10% הנחה)' : 'חודשי'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">מחיר ליחידה לאחר תקופה</span>
                <span className="text-white font-semibold">{formatUsd(effectiveUnitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">סה"כ להזמנה ({quantity.toLocaleString()} יח')</span>
                <span className="text-emerald-400 font-bold">{formatUsd(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">הערות (אופציונלי)</label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="פרטים נוספים לגבי ההזמנה..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cdata-500/40 resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 2 — Review */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-sm font-bold text-white mb-3">סקירת הזמנה</div>
          <div className="glass rounded-xl divide-y divide-white/[0.06]" style={{ border: '1px solid rgba(44,106,138,0.15)' }}>
            {[
              { label: 'מוצר',    value: selectedProduct?.name },
              { label: 'לקוח',    value: selectedCustomer?.companyName },
              { label: 'סוג רישוי', value: form.licenseType === 'mailboxes' ? 'Mailboxes — תיבות דואר' : 'Users — משתמשים' },
              { label: 'כמות',    value: `${Number(form.quantity).toLocaleString()} ${form.licenseType === 'mailboxes' ? 'תיבות' : 'משתמשים'}` },
              { label: 'תקופה',   value: form.duration === 'yearly' ? 'שנתי (Yearly)' : 'חודשי (Monthly)' },
              { label: 'מחיר ליחידה', value: formatUsd(effectiveUnitPrice) },
              { label: 'סה"כ', value: formatUsd(totalPrice) },
              { label: 'סוג חיוב', value: form.billingType === 'CREDIT_CARD' ? 'כרטיס אשראי' : 'חשבונית חודשית' },
              ...(requiresFortiSaseUsername ? [{ label: 'FortiSASE Username', value: form.fortisaseUsername || '—' }] : []),
              ...(isSaseOrder ? [{ label: 'רוחב פס למשתמש', value: `${form.bandwidthPerUser} Mbps` }] : []),
              ...(isSaseOrder ? [{ label: 'רוחב פס כולל', value: `${totalBandwidth.toLocaleString()} Mbps` }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-slate-500">{label}</span>
                <span className="text-xs font-semibold text-white">{value}</span>
              </div>
            ))}
            {form.notes && (
              <div className="px-5 py-3">
                <div className="text-xs text-slate-500 mb-1">הערות</div>
                <div className="text-xs text-slate-300">{form.notes}</div>
              </div>
            )}
          </div>

          <div className="glass rounded-xl p-4" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <div className="flex items-start gap-2.5">
              <Send className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-semibold text-amber-400 mb-1">שליחה לאישור הפצה</div>
                <div className="text-[10px] text-slate-500 leading-relaxed">
                  הזמנות בכרטיס אשראי מוקמות אוטומטית לאחר תשלום. הזמנות בחשבונית חודשית ממתינות לאישור מפיץ.
                </div>
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
          חזרה
        </button>

        {step < 2 ? (
          <button onClick={next} disabled={!canNext()}
            className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none">
            המשך
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #059669, #047857)', boxShadow: '0 4px 15px rgba(5,150,105,0.3)' }}>
            <Send className="w-4 h-4" />
            {loading ? 'מעבד...' : 'שלח הזמנה'}
          </button>
        )}
      </div>
    </div>
  )
}
