import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Edit2, Users, Shield, BarChart2, Mail, Phone, MapPin, Calendar, Hash, Building2 } from 'lucide-react'
import { getIntegrator, getCustomersByIntegrator, getCustomerEnvironment } from '../../data/mockData'
import { workspaceApi } from '../../api/workspaceApi'
import { useLanguage } from '../../context/LanguageContext'

function statusBadge(status) {
  if (status === 'active') return 'badge-green'
  if (status === 'onboarding') return 'badge-amber'
  if (status === 'suspended') return 'badge-red'
  return 'badge-steel'
}

function onboardingBadge(status) {
  if (status === 'active') return 'badge-green'
  if (status === 'configured') return 'badge-blue'
  if (status === 'invited') return 'badge-amber'
  return 'badge-steel'
}

function formatDate(str) {
  if (!str) return '—'
  const d = new Date(str)
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function IntegratorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tr } = useLanguage()
  const [realOrders, setRealOrders] = useState([])
  const [realCustomers, setRealCustomers] = useState([])
  const [realError, setRealError] = useState('')

  useEffect(() => {
    async function loadReal() {
      try {
        setRealError('')
        const [orders, customers] = await Promise.all([
          workspaceApi.getOrders({ distributorId: 'd1', role: 'distributor' }),
          workspaceApi.getCustomers(undefined, 'distributor'),
        ])
        const ordersList = Array.isArray(orders) ? orders : (orders?.data || [])
        const customersList = Array.isArray(customers) ? customers : (customers?.data || [])
        setRealOrders(ordersList.filter((o) => o.integratorId === id && o.items?.some((i) => i.product?.code === 'WORKSPACE_SECURITY')))
        setRealCustomers(customersList.filter((c) => c.integratorId === id))
      } catch (e) {
        setRealError(e.message)
      }
    }
    loadReal()
  }, [id])

  const realView = useMemo(() => {
    if (!realOrders.length && !realCustomers.length) return null
    return {
      id,
      companyName: `Integrator ${id}`,
      contactName: '—',
      contactEmail: '—',
      customers: realCustomers.length,
      seats: realOrders.reduce((sum, o) => sum + (o.items || []).reduce((inner, item) => inner + (item.seats || 0), 0), 0),
      createdAt: realCustomers[0]?.createdAt || realOrders[0]?.createdAt,
    }
  }, [id, realCustomers, realOrders])

  if (realView) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/distribution/integrators')} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/[0.06] transition-colors text-slate-400 hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{realView.companyName}</h1>
            <p className="text-slate-500 text-sm mt-0.5">{tr('פרופיל אינטגרטור Perception Point', 'Perception Point integrator profile')}</p>
            {realError && <p className="text-xs text-red-400 mt-1">{realError}</p>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="stat-card"><div className="text-xl font-bold text-white">{realView.customers}</div><div className="text-xs text-slate-500">{tr('לקוחות', 'Customers')}</div></div>
          <div className="stat-card"><div className="text-xl font-bold text-white">{realView.seats}</div><div className="text-xs text-slate-500">{tr('סה\"כ רישיונות', 'Total Seats')}</div></div>
          <div className="stat-card"><div className="text-xl font-bold text-white">{formatDate(realView.createdAt)}</div><div className="text-xs text-slate-500">{tr('יצירה ראשונה', 'First Created')}</div></div>
        </div>
      </div>
    )
  }

  const integrator = getIntegrator(id)

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

  const customers = getCustomersByIntegrator(integrator.id)
  const environments = customers.map(c => getCustomerEnvironment(c.id)).filter(Boolean)

  const totalUsers = customers.reduce((s, c) => s + c.numberOfUsers, 0)
  const totalProtected = environments.reduce((s, e) => s + e.protectedUsers, 0)
  const avgCompliance = environments.length > 0
    ? Math.round(environments.reduce((s, e) => s + e.complianceScore, 0) / environments.length)
    : 0

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
              <h1 className="text-2xl font-bold text-white">{integrator.companyName}</h1>
              <span className={`${statusBadge(integrator.status)} text-xs`}>{integrator.status}</span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">{integrator.partnerCode} · {tr('פרופיל אינטגרטור', 'Integrator profile')}</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Edit2 className="w-4 h-4" />
          {tr('ערוך', 'Edit')}
        </button>
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
                <div className="text-sm font-medium text-white">{integrator.contactName}</div>
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
                <div className="text-sm text-white">{integrator.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,106,138,0.12)' }}>
                <MapPin className="w-4 h-4 text-cdata-300" />
              </div>
              <div>
                <div className="text-[10px] text-slate-600 mb-0.5">{tr('מדינה', 'Country')}</div>
                <div className="text-sm text-white">{integrator.country}</div>
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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(44,106,138,0.12)' }}>
                <Hash className="w-4 h-4 text-cdata-300" />
              </div>
              <div>
                <div className="text-[10px] text-slate-600 mb-0.5">{tr('קוד שותף', 'Partner code')}</div>
                <div className="text-sm text-white font-mono">{integrator.partnerCode || '—'}</div>
              </div>
            </div>
            {integrator.notes && (
              <div className="pt-2 border-t border-white/[0.05]">
                <div className="text-[10px] text-slate-600 mb-1">{tr('הערות', 'Notes')}</div>
                <div className="text-xs text-slate-400">{integrator.notes}</div>
              </div>
            )}
          </div>
        </div>

        {/* KPI summary */}
        <div className="glass glow-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">{tr('סיכום ביצועים', 'Performance summary')}</h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Building2, label: tr('סה"כ לקוחות', 'Total customers'), value: customers.length, color: 'text-cdata-300', bg: 'rgba(44,106,138,0.12)' },
              { icon: Users,     label: tr('סה"כ משתמשים', 'Total users'), value: totalUsers.toLocaleString(), color: 'text-emerald-400', bg: 'rgba(16,185,129,0.10)' },
              { icon: Shield,    label: tr('משתמשים מוגנים', 'Protected users'), value: totalProtected.toLocaleString(), color: 'text-blue-400', bg: 'rgba(59,130,246,0.10)' },
              { icon: BarChart2, label: tr('ציון ציות ממוצע', 'Average compliance score'), value: environments.length > 0 ? `${avgCompliance}%` : '—', color: 'text-amber-400', bg: 'rgba(245,158,11,0.10)' },
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

      {/* Customers table */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">{tr('לקוחות', 'Customers')}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{tr(`${customers.length} לקוחות רשומים תחת אינטגרטור זה`, `${customers.length} customers registered under this integrator`)}</p>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-5 px-5 py-3 border-b border-white/[0.06] text-xs text-slate-500 font-medium">
          <div className="col-span-2">{tr('לקוח', 'Customer')}</div>
          <div>{tr('חבילה', 'Package')}</div>
          <div>{tr('סטטוס', 'Status')}</div>
          <div>Onboarding</div>
        </div>

        {customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="w-10 h-10 text-slate-700 mb-3" />
            <p className="text-sm text-slate-400">{tr('אין לקוחות עדיין', 'No customers yet')}</p>
            <p className="text-xs text-slate-600 mt-1">{tr('לקוחות שהוגדרו תחת אינטגרטור זה יופיעו כאן', 'Customers assigned to this integrator will appear here')}</p>
          </div>
        ) : (
          customers.map(c => {
            const env = getCustomerEnvironment(c.id)
            return (
              <div
                key={c.id}
                className="grid grid-cols-5 items-center px-5 py-3.5 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
              >
                {/* Customer name */}
                <div className="col-span-2 flex items-center gap-3 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0"
                    style={{ background: 'rgba(44,106,138,0.15)', border: '1px solid rgba(44,106,138,0.2)' }}
                  >
                    {c.companyName.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-white truncate">{c.companyName}</div>
                    <div className="text-[10px] text-slate-500">
                      {env
                        ? tr(`${env.protectedUsers.toLocaleString()} משתמשים מוגנים`, `${env.protectedUsers.toLocaleString()} protected users`)
                        : tr(`${c.numberOfUsers.toLocaleString()} משתמשים`, `${c.numberOfUsers.toLocaleString()} users`)
                      }
                    </div>
                  </div>
                </div>

                {/* Package */}
                <div className="text-xs text-slate-400 truncate">{c.packageName}</div>

                {/* Status */}
                <div>
                  <span className={`${statusBadge(c.status)} text-xs`}>{c.status}</span>
                </div>

                {/* Onboarding */}
                <div>
                  <span className={`${onboardingBadge(c.onboardingStatus)} text-xs`}>{c.onboardingStatus}</span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
