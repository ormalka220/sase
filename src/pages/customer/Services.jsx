import React from 'react'
import { Shield, Globe, Lock, Zap, CheckCircle, Users, BarChart3, Clock } from 'lucide-react'

const services = [
  {
    name: 'Email Security',
    nameHe: 'אבטחת אימייל',
    provider: 'Perception Point',
    icon: Lock,
    color: '#5B9BB8',
    status: 'active',
    since: 'ינואר 2025',
    users: 250,
    plan: 'Enterprise',
    features: ['Anti-Phishing', 'BEC Protection', 'Malware Detection', 'Sandboxing', 'Incident Response 24/7'],
    stats: { blocked: '1,284', scanned: '48,200', fp: '0' },
  },
  {
    name: 'Browser Security',
    nameHe: 'אבטחת דפדפן',
    provider: 'Perception Point',
    icon: Globe,
    color: '#8b5cf6',
    status: 'active',
    since: 'מרץ 2025',
    users: 247,
    plan: 'Enterprise',
    features: ['Real-time URL Filtering', 'Phishing Prevention', 'Zero-day Protection', 'Web DLP', 'BYOD Support'],
    stats: { blocked: '89', scanned: '12,400', fp: '2' },
  },
  {
    name: 'Sovereign SASE',
    nameHe: 'SASE ריבוני',
    provider: 'Fortinet · SpotNet',
    icon: Zap,
    color: '#10b981',
    status: 'active',
    since: 'מאי 2025',
    users: 150,
    plan: 'Sovereign',
    features: ['ZTNA Access', 'SWG Gateway', 'SD-WAN', 'Israel Hosted', 'Compliance Reports'],
    stats: { blocked: '12', scanned: '89K sessions', fp: '1' },
  },
  {
    name: 'Cloud Storage Protection',
    nameHe: 'הגנת אחסון ענן',
    provider: 'Perception Point',
    icon: Shield,
    color: '#f59e0b',
    status: 'active',
    since: 'ינואר 2025',
    users: 250,
    plan: 'Enterprise',
    features: ['OneDrive Scanning', 'SharePoint Protection', 'Google Drive', 'DLP Policies', 'Collaboration Tools'],
    stats: { blocked: '3', scanned: '1,890 files', fp: '0' },
  },
]

export default function CustomerServices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">שירותים</h1>
        <p className="text-slate-500 text-sm mt-0.5">Active Services — Your Protection Stack</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {services.map(s => (
          <div
            key={s.name}
            className="glass rounded-2xl p-5 transition-all hover:scale-[1.01]"
            style={{ border: `1px solid ${s.color}22`, boxShadow: `0 0 30px ${s.color}08` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div>
                  <div className="font-bold text-white">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.nameHe}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: s.color }}></div>
                <span className="text-xs font-semibold" style={{ color: s.color }}>פעיל</span>
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 rounded-lg bg-white/[0.025] border border-white/5">
                <div className="font-bold text-white text-sm">{s.stats.blocked}</div>
                <div className="text-[9px] text-slate-600">חסומים</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/[0.025] border border-white/5">
                <div className="font-bold text-white text-sm truncate">{s.stats.scanned}</div>
                <div className="text-[9px] text-slate-600">נסרקו</div>
              </div>
              <div className="text-center p-2 rounded-lg bg-white/[0.025] border border-white/5">
                <div className="font-bold text-white text-sm">{s.users}</div>
                <div className="text-[9px] text-slate-600">משתמשים</div>
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <div className="text-xs text-slate-500 mb-2">כלול בתוכנית | Included</div>
              <div className="space-y-1.5">
                {s.features.map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" style={{ color: s.color }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] text-slate-600">
              <span>ספק: {s.provider}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                פעיל מאז: {s.since}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
