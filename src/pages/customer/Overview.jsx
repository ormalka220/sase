import React from 'react'
import {
  Shield, Users, AlertTriangle, CheckCircle, TrendingUp,
  Globe, Lock, Zap, Activity, ArrowUpRight, Clock
} from 'lucide-react'
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

const threatData = [
  { day: 'א', blocked: 12 }, { day: 'ב', blocked: 28 }, { day: 'ג', blocked: 18 },
  { day: 'ד', blocked: 45 }, { day: 'ה', blocked: 31 }, { day: 'ו', blocked: 22 },
  { day: 'ש', blocked: 9 },
]

const recentEvents = [
  { type: 'phishing', msg: 'נחסמ מייל פישינג — מ: billing@fake-bank.cc', time: 'לפני 4 דקות', severity: 'high' },
  { type: 'malware', msg: 'קובץ זדוני נחסם בהורדה — idan.cohen@co.il', time: 'לפני 18 דקות', severity: 'high' },
  { type: 'login', msg: 'כניסה בטוחה מאומתה (MFA) — sarah.levi@co.il', time: 'לפני 32 דקות', severity: 'ok' },
  { type: 'url', msg: 'קישור זדוני נחסם בדפדפן — dana.mor@co.il', time: 'לפני 1 שעה', severity: 'medium' },
  { type: 'scan', msg: 'סריקה שבועית הושלמה — 0 איומים פעילים', time: 'לפני 2 שעות', severity: 'ok' },
]

const severityConfig = {
  high: { color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle },
  medium: { color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
  ok: { color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
}

export default function CustomerOverview() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">סקירה כללית</h1>
        <p className="text-slate-500 text-sm mt-0.5">Overview — TechGlobal Ltd.</p>
      </div>

      {/* Protection Banner */}
      <div className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(16,185,129,0.05) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
          <Shield className="w-7 h-7 text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-white mb-0.5">הארגון שלך מוגן ✓</div>
          <div className="text-sm text-emerald-400">All systems operational · כל המערכות פעילות</div>
          <div className="text-xs text-slate-500 mt-1">עודכן לאחרונה: היום בשעה 11:42</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-emerald-400">98%</div>
          <div className="text-xs text-slate-500">Security Score</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'משתמשים מוגנים', sub: 'Protected Users', value: '247 / 250', change: null, color: 'text-cdata-300', bg: 'bg-cdata-500/15' },
          { icon: Shield, label: 'איומים נחסמו', sub: 'Threats Blocked', value: '1,284', change: 'השבוע', color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
          { icon: AlertTriangle, label: 'אירועים פעילים', sub: 'Active Incidents', value: '0', change: null, color: 'text-amber-400', bg: 'bg-amber-600/15' },
          { icon: Zap, label: 'זמן תגובה', sub: 'Avg. Response', value: '< 1ms', change: null, color: 'text-violet-400', bg: 'bg-violet-600/15' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{s.value}</div>
            <div className="text-xs font-medium text-slate-300">{s.label}</div>
            <div className="text-[10px] text-slate-600">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Threat Chart */}
        <div className="col-span-2 glass glow-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-white text-sm">פעילות חסימות — 7 ימים אחרונים</div>
              <div className="text-xs text-slate-500">Threat Blocking Activity</div>
            </div>
            <span className="badge-green">165 Blocked This Week</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={threatData}>
              <defs>
                <linearGradient id="threatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0a1428', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: 11 }}
                formatter={(v) => [v, 'איומים שנחסמו']}
              />
              <Area type="monotone" dataKey="blocked" stroke="#10b981" strokeWidth={2} fill="url(#threatGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Services Status */}
        <div className="glass glow-border rounded-xl p-5">
          <div className="font-semibold text-white text-sm mb-1">שירותים פעילים</div>
          <div className="text-xs text-slate-500 mb-4">Active Services</div>
          <div className="space-y-3">
            {[
              { name: 'Email Security', sub: 'M365 Integration', ok: true, icon: Lock },
              { name: 'Browser Protection', sub: 'Chrome Extension', ok: true, icon: Globe },
              { name: 'Cloud Storage', sub: 'OneDrive / SharePoint', ok: true, icon: Shield },
              { name: 'Sovereign SASE', sub: 'Network Access', ok: true, icon: Zap },
              { name: 'Threat Intelligence', sub: 'AI Engine', ok: true, icon: Activity },
            ].map(s => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/5 flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white">{s.name}</div>
                  <div className="text-[10px] text-slate-600">{s.sub}</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></div>
                  <span className="text-[10px] text-emerald-500">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="glass glow-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-white text-sm">אירועים אחרונים</div>
            <div className="text-xs text-slate-500">Recent Security Events</div>
          </div>
        </div>
        <div className="space-y-2">
          {recentEvents.map((ev, i) => {
            const cfg = severityConfig[ev.severity]
            return (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${cfg.bg} border ${cfg.border}`}>
                <cfg.icon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
                <div className="flex-1 text-sm text-slate-300">{ev.msg}</div>
                <div className="flex items-center gap-1 text-[10px] text-slate-600 whitespace-nowrap">
                  <Clock className="w-2.5 h-2.5" />
                  {ev.time}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
