import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users, Mail, Phone, MapPin, Calendar, Building2 } from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function IntegratorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tr } = useLanguage()
  const [integrator, setIntegrator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError('')
        const apiIntg = await workspaceApi.getIntegrator(id)
        setIntegrator(apiIntg)
      } catch (e) {
        setError(e.message || tr('טעינת אינטגרטור נכשלה', 'Failed to load integrator'))
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [id, tr])

  if (loading) {
    return <div className="text-sm text-slate-400 p-6">{tr('טוען אינטגרטור...', 'Loading integrator...')}</div>
  }

  if (!integrator) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/distribution/integrators')}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors text-slate-400 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold text-white">{tr('אינטגרטור לא נמצא', 'Integrator not found')}</h1>
        </div>
        <div className="glass glow-border rounded-2xl p-16 flex flex-col items-center justify-center text-center">
          <Building2 className="w-12 h-12 text-slate-700 mb-4" />
          <p className="text-lg font-semibold text-slate-400 mb-1">{tr('לא נמצא', 'Not found')}</p>
          <p className="text-sm text-slate-600 mb-6">{tr('האינטגרטור המבוקש אינו קיים במערכת', 'The requested integrator does not exist in the system')}</p>
          <button
            className="btn-primary text-sm"
            onClick={() => navigate('/distribution/integrators')}
          >
            {tr('חזרה לרשימה', 'Back to list')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/distribution/integrators')}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors text-slate-400 hover:text-white"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{integrator.organization?.name || tr('אינטגרטור', 'Integrator')}</h1>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{integrator.id} · {tr('פרופיל אינטגרטור', 'Integrator profile')}</p>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
        </div>
      </div>

      {/* Info + KPI */}
      <div className="grid grid-cols-2 gap-5">
        {/* Contact details */}
        <div className="glass glow-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{tr('פרטי קשר', 'Contact details')}</h3>
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,106,138,0.12)' }}>
                <Users className="w-4 h-4 text-cdata-300" />
              </div>
              <div>
                <div className="text-[10px] text-slate-600 mb-0.5">{tr('איש קשר', 'Contact')}</div>
                <div className="text-sm font-medium text-white">{integrator.organization?.name || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,106,138,0.12)' }}>
                <Mail className="w-4 h-4 text-cdata-300" />
              </div>
              <div>
                <div className="text-[10px] text-slate-600 mb-0.5">{tr('אימייל', 'Email')}</div>
                <div className="text-sm text-white">{integrator.contactEmail}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,106,138,0.12)' }}>
                <Phone className="w-4 h-4 text-cdata-300" />
              </div>
              <div>
                <div className="text-[10px] text-slate-600 mb-0.5">{tr('טלפון', 'Phone')}</div>
                <div className="text-sm text-white">{integrator.contactPhone || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,106,138,0.12)' }}>
                <MapPin className="w-4 h-4 text-cdata-300" />
              </div>
              <div>
                <div className="text-[10px] text-slate-600 mb-0.5">{tr('מדינה', 'Country')}</div>
                <div className="text-sm text-white">{integrator.country || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,106,138,0.12)' }}>
                <Calendar className="w-4 h-4 text-cdata-300" />
              </div>
              <div>
                <div className="text-[10px] text-slate-600 mb-0.5">{tr('תאריך הצטרפות', 'Join date')}</div>
                <div className="text-sm text-white">{formatDate(integrator.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI summary */}
        <div className="glass glow-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{tr('סיכום ביצועים', 'Performance summary')}</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Building2, label: tr('סה"כ לקוחות', 'Total customers'), value: integrator._count?.customers || 0, color: 'text-cdata-300', bg: 'rgba(44,106,138,0.12)' },
              { icon: Shield, label: tr('סה"כ הזמנות', 'Total orders'), value: integrator._count?.orders || 0, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.10)' },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3.5 rounded-xl"
                style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="text-xl font-bold text-white mt-0.5">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
