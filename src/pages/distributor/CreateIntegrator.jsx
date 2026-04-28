import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

const inputCls = 'w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cdata-500/40 focus:bg-white/[0.06] transition-colors'
const labelCls = 'text-xs text-slate-400 mb-1.5 block'

export default function CreateIntegrator() {
  const navigate = useNavigate()
  const { tr } = useLanguage()

  const [form, setForm] = useState({
    companyName: '',
    country: 'Israel',
    contactName: '',
    contactEmail: '',
    phone: '',
    status: 'onboarding',
    partnerCode: '',
    notes: '',
  })
  const [sendInvite, setSendInvite] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const validate = () => {
    const e = {}
    if (!form.companyName.trim()) e.companyName = tr('שדה חובה', 'Required field')
    if (!form.contactName.trim()) e.contactName = tr('שדה חובה', 'Required field')
    if (!form.contactEmail.trim()) e.contactEmail = tr('שדה חובה', 'Required field')
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (!validate()) return
    setSuccess(true)
    setTimeout(() => navigate('/distribution/integrators'), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/distribution/integrators')}
          className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors text-slate-400 hover:text-white"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{tr('אינטגרטור חדש', 'New Integrator')}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{tr('הוסף שותף חדש למערכת', 'Add a new partner to the system')}</p>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <div
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
        >
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-sm text-emerald-400 font-medium">{tr('האינטגרטור נוצר בהצלחה — מועבר לרשימה...', 'Integrator created successfully — redirecting to list...')}</span>
        </div>
      )}

      {/* Form card */}
      <form onSubmit={handleSubmit} className="glass glow-border rounded-2xl p-7 max-w-2xl mx-auto">
        <h3 className="text-sm font-semibold text-white mb-6">{tr('פרטי האינטגרטור', 'Integrator Details')}</h3>

        <div className="grid grid-cols-2 gap-5">
          {/* Company Name */}
          <div>
            <label className={labelCls}>
              {tr('שם חברה', 'Company name')} <span className="text-red-400">*</span>
            </label>
            <input
              className={`${inputCls} ${errors.companyName ? 'border-red-500/50' : ''}`}
              placeholder="NetSec Solutions"
              value={form.companyName}
              onChange={e => set('companyName', e.target.value)}
            />
            {errors.companyName && <p className="text-xs text-red-400 mt-1">{errors.companyName}</p>}
          </div>

          {/* Country */}
          <div>
            <label className={labelCls}>{tr('מדינה', 'Country')}</label>
            <select
              className={inputCls}
              value={form.country}
              onChange={e => set('country', e.target.value)}
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <option value="Israel">{tr('ישראל', 'Israel')}</option>
              <option value="US">{tr('ארצות הברית', 'United States')}</option>
              <option value="UK">{tr('בריטניה', 'United Kingdom')}</option>
              <option value="Germany">{tr('גרמניה', 'Germany')}</option>
            </select>
          </div>

          {/* Contact Name */}
          <div>
            <label className={labelCls}>
              {tr('איש קשר', 'Contact name')} <span className="text-red-400">*</span>
            </label>
            <input
              className={`${inputCls} ${errors.contactName ? 'border-red-500/50' : ''}`}
              placeholder="ישראל ישראלי"
              value={form.contactName}
              onChange={e => set('contactName', e.target.value)}
            />
            {errors.contactName && <p className="text-xs text-red-400 mt-1">{errors.contactName}</p>}
          </div>

          {/* Contact Email */}
          <div>
            <label className={labelCls}>
              {tr('אימייל', 'Email')} <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              className={`${inputCls} ${errors.contactEmail ? 'border-red-500/50' : ''}`}
              placeholder="contact@company.co.il"
              value={form.contactEmail}
              onChange={e => set('contactEmail', e.target.value)}
            />
            {errors.contactEmail && <p className="text-xs text-red-400 mt-1">{errors.contactEmail}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>{tr('טלפון', 'Phone')}</label>
            <input
              className={inputCls}
              placeholder="+972-50-0000000"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
            />
          </div>

          {/* Status */}
          <div>
            <label className={labelCls}>{tr('סטטוס', 'Status')}</label>
            <select
              className={inputCls}
              value={form.status}
              onChange={e => set('status', e.target.value)}
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <option value="onboarding">{tr('בתהליך קליטה', 'Onboarding')}</option>
              <option value="active">{tr('פעיל', 'Active')}</option>
            </select>
          </div>

          {/* Partner Code */}
          <div>
            <label className={labelCls}>{tr('קוד שותף (אופציונלי)', 'Partner code (optional)')}</label>
            <input
              className={inputCls}
              placeholder="NS-2024-001"
              value={form.partnerCode}
              onChange={e => set('partnerCode', e.target.value)}
            />
          </div>

          {/* Empty spacer for grid alignment */}
          <div />

          {/* Notes — full width */}
          <div className="col-span-2">
            <label className={labelCls}>{tr('הערות', 'Notes')}</label>
            <textarea
              rows={3}
              className={inputCls}
              placeholder={tr('הערות נוספות על האינטגרטור...', 'Additional notes about the integrator...')}
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Send invite checkbox — full width */}
          <div className="col-span-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={sendInvite}
                  onChange={e => setSendInvite(e.target.checked)}
                />
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                    sendInvite ? 'bg-cdata-500' : 'bg-white/[0.06] border border-white/10'
                  }`}
                >
                  {sendInvite && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                      <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                {tr('שלח הזמנה במייל', 'Send invitation by email')} <span className="text-xs text-slate-600">({tr('demo בלבד', 'demo only')})</span>
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            type="button"
            className="btn-ghost text-sm"
            onClick={() => navigate('/distribution/integrators')}
          >
            {tr('ביטול', 'Cancel')}
          </button>
          <button
            type="submit"
            className="btn-primary text-sm"
            disabled={success}
          >
            {tr('שמור אינטגרטור', 'Save Integrator')}
          </button>
        </div>
      </form>
    </div>
  )
}
