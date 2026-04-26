import React, { useState } from 'react'
import { ShieldOff, Bug, Mail, AlertTriangle, Search, Clock, ChevronDown } from 'lucide-react'
import { workspaceApi } from '../../api/workspaceApi'

const severityConfig = {
  critical: { label: 'קריטי',  color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  high:     { label: 'גבוה',   color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  medium:   { label: 'בינוני', color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
  low:      { label: 'נמוך',   color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
}

const typeConfig = {
  Phishing: { icon: ShieldOff, color: '#ef4444' },
  Malware:  { icon: Bug,       color: '#f97316' },
  Spam:     { icon: Mail,      color: '#eab308' },
}

function fmt(dt) {
  return new Date(dt).toLocaleString('he-IL', {
    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: '2-digit'
  })
}

export default function PerceptionThreats() {
  const [threats, setThreats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')

  React.useEffect(() => {
    async function loadAudit() {
      try {
        const audit = await workspaceApi.getPpAudit('c1', 'customer')
        const mapped = (audit.entries || []).map((entry, idx) => ({
          id: entry.id,
          type: entry.source === 'MANUAL' ? 'Spam' : 'Phishing',
          severity: entry.status === 'active' ? 'low' : 'medium',
          subject: entry.status,
          sender: entry.createdBy || 'system@perception-point',
          recipient: 'customer@domain.local',
          blockedAt: entry.createdAt,
        }))
        setThreats(mapped)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadAudit()
  }, [])

  const filtered = threats.filter(t => {
    const matchSearch = !search || t.subject.toLowerCase().includes(search.toLowerCase()) || t.sender.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || t.type === typeFilter
    const matchSev = severityFilter === 'all' || t.severity === severityFilter
    return matchSearch && matchType && matchSev
  })

  const counts = {
    Phishing: threats.filter(t => t.type === 'Phishing').length,
    Malware:  threats.filter(t => t.type === 'Malware').length,
    Spam:     threats.filter(t => t.type === 'Spam').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h1 className="text-xl font-black text-white">Threat <span className="text-red-400">Analysis</span></h1>
        </div>
        <p className="text-xs text-slate-500">ניתוח איומים — Perception Point Email Security</p>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(counts).map(([type, count]) => {
          const cfg = typeConfig[type]
          const Icon = cfg.icon
          return (
            <button key={type} onClick={() => setTypeFilter(typeFilter === type ? 'all' : type)}
              className={`glass rounded-xl p-4 text-left transition-all duration-200 hover:scale-[1.01] ${typeFilter === type ? 'ring-2' : ''}`}
              style={{
                border: `1px solid ${cfg.color}25`,
                ringColor: cfg.color,
                outline: typeFilter === type ? `2px solid ${cfg.color}60` : 'none'
              }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}25` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: cfg.color }} />
                </div>
                <div>
                  <div className="text-xl font-black" style={{ color: cfg.color }}>{count}</div>
                  <div className="text-xs text-slate-400">{type}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי נושא, שולח..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/40"
          />
        </div>
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500/40"
        >
          <option value="all">כל הרמות</option>
          <option value="critical">קריטי</option>
          <option value="high">גבוה</option>
          <option value="medium">בינוני</option>
          <option value="low">נמוך</option>
        </select>
      </div>

      {/* Threats Table */}
      <div className="glass rounded-xl overflow-hidden" style={{ border: '1px solid rgba(5,150,105,0.12)' }}>
        <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
          <span className="text-sm font-bold text-white">
            Blocked Threats <span className="text-emerald-400 font-normal text-xs mr-2">{filtered.length} נמצאו</span>
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-600">טוען אירועים...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-600">
            <ShieldOff className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <div className="text-sm">אין איומים תואמים</div>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(threat => {
              const cfg = typeConfig[threat.type] || typeConfig.Spam
              const Icon = cfg.icon
              const sev = severityConfig[threat.severity] || severityConfig.low
              return (
                <div key={threat.id} className="px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}>
                      <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold text-white">{threat.subject}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: sev.bg, color: sev.color, border: `1px solid ${sev.color}40` }}>
                          {sev.label}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{ background: `${cfg.color}12`, color: cfg.color }}>
                          {threat.type}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Blocked
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-[10px] text-slate-500">
                          מ: <span className="text-red-400/80">{threat.sender}</span>
                        </span>
                        <span className="text-[10px] text-slate-500">
                          אל: <span className="text-slate-400">{threat.recipient}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-600 flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {fmt(threat.blockedAt)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
