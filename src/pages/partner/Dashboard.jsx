import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Users, DollarSign, Target, ArrowUpRight,
  Globe, Lock, ChevronLeft, Plus, Clock, Zap, Shield
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import { SpotNetLogo } from '../../components/Logos'

const revenueData = [
  { month: 'Jan', revenue: 42 }, { month: 'Feb', revenue: 58 },
  { month: 'Mar', revenue: 51 }, { month: 'Apr', revenue: 74 },
  { month: 'May', revenue: 68 }, { month: 'Jun', revenue: 89 },
  { month: 'Jul', revenue: 95 },
]

const opportunities = [
  { company: 'Elbit Systems',  product: 'Sovereign SASE',    stage: 'POC',      value: '₪180K', days: 12, status: 'hot' },
  { company: 'Bank Hapoalim', product: 'Workspace Security', stage: 'Proposal', value: '₪95K',  days: 5,  status: 'active' },
  { company: 'Israel Railways',product: 'Sovereign SASE',    stage: 'Demo',     value: '₪240K', days: 20, status: 'active' },
  { company: 'Maccabi Health', product: 'Workspace Security', stage: 'Discovery',value: '₪60K',  days: 3,  status: 'new' },
]

const stageColor   = { active: 'badge-blue', hot: 'badge-orange', new: 'badge-green' }
const stageLabel   = { active: 'Active', hot: '🔥 Hot', new: 'New' }

export default function PartnerDashboard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">שלום, NetSec Solutions 👋</h1>
          <p className="text-slate-500 text-sm mt-0.5">סיכום הפעילות שלך | Performance Overview</p>
        </div>
        <button onClick={() => navigate('/partner/opportunities')}
          className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          הזדמנות חדשה
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: TrendingUp,  label: 'Pipeline Value', labelHe: 'שווי Pipeline',   value: '₪1.2M', change: '+18%', color: 'text-cdata-300', bg: 'rgba(44,106,138,0.12)', border: 'rgba(44,106,138,0.2)' },
          { icon: Target,      label: 'Active Deals',   labelHe: 'עסקאות פעילות',   value: '14',    change: '+3',   color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.15)' },
          { icon: Users,       label: 'Customers',      labelHe: 'לקוחות',           value: '38',    change: '+5',   color: 'text-spot-400',    bg: 'rgba(245,124,32,0.1)',  border: 'rgba(245,124,32,0.15)' },
          { icon: DollarSign,  label: 'Revenue MTD',    labelHe: 'הכנסה החודש',      value: '₪89K',  change: '+22%', color: 'text-steel-300',   bg: 'rgba(128,128,128,0.1)', border: 'rgba(128,128,128,0.15)' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-5 transition-all duration-300 hover:scale-[1.02]"
            style={{ background: stat.bg, border: `1px solid ${stat.border}` }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.2)' }}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />{stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-slate-400">{stat.label}</div>
            <div className="text-[10px] text-slate-600">{stat.labelHe}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pipeline Trend */}
        <div className="col-span-2 glass glow-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-semibold text-white text-sm">Pipeline Trend</div>
              <div className="text-xs text-slate-500">מגמת מכירות 7 חודשים אחרונים</div>
            </div>
            <span className="badge-blue text-xs">2025</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="cdataGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2C6A8A" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2C6A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#0B1929', border: '1px solid rgba(44,106,138,0.25)', borderRadius: 8, fontSize: 12 }}
                formatter={v => [`₪${v}K`]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#5B9BB8" strokeWidth={2.5} fill="url(#cdataGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Product Split */}
        <div className="glass glow-border rounded-xl p-5">
          <div className="font-semibold text-white text-sm mb-1">Product Mix</div>
          <div className="text-xs text-slate-500 mb-5">פיצול לפי מוצר</div>
          <div className="space-y-4">
            {[
              { name: 'Sovereign SASE',    pct: 62, color: '#5B9BB8' },
              { name: 'Workspace Security', pct: 38, color: '#10b981' },
            ].map(p => (
              <div key={p.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">{p.name}</span>
                  <span className="font-semibold text-white">{p.pct}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all"
                    style={{ width: `${p.pct}%`, background: p.color, boxShadow: `0 0 8px ${p.color}60` }} />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-white/5">
              <div className="text-xs text-slate-500 mb-2.5">Stage Breakdown</div>
              {[
                { stage: 'Discovery', count: 5, color: '#64748b' },
                { stage: 'Demo / POC', count: 4, color: '#5B9BB8' },
                { stage: 'Proposal',  count: 3, color: '#F57C20' },
                { stage: 'Closing',   count: 2, color: '#10b981' },
              ].map(s => (
                <div key={s.stage} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs text-slate-400">{s.stage}</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities + Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 glass glow-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-white text-sm">Active Opportunities</div>
              <div className="text-xs text-slate-500">הזדמנויות פעילות</div>
            </div>
            <button onClick={() => navigate('/partner/opportunities')}
              className="text-xs text-cdata-300 hover:text-cdata-200 flex items-center gap-1 transition-colors">
              כל ההזדמנויות <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {opportunities.map((opp, i) => (
              <div key={i}
                className="flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer group hover:bg-white/[0.03]"
                style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-cdata-300 font-bold text-xs flex-shrink-0"
                  style={{ background: 'rgba(44,106,138,0.12)', border: '1px solid rgba(44,106,138,0.2)' }}>
                  {opp.company.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm truncate">{opp.company}</div>
                  <div className="text-xs text-slate-500">{opp.product}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-slate-400 mb-1">{opp.stage}</div>
                  <span className={stageColor[opp.status] + ' text-[10px]'}>{stageLabel[opp.status]}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-white text-sm">{opp.value}</div>
                  <div className="text-[10px] text-slate-600 flex items-center gap-1 justify-end">
                    <Clock className="w-2.5 h-2.5" />{opp.days}d ago
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass glow-border rounded-xl p-5">
          <div className="font-semibold text-white text-sm mb-1">Quick Actions</div>
          <div className="text-xs text-slate-500 mb-4">פעולות מהירות</div>
          <div className="space-y-2">
            {[
              { icon: Globe,  label: 'Request SASE Demo', color: 'text-cdata-300',  bg: 'rgba(44,106,138,0.12)' },
              { icon: Lock,   label: 'Request WS POC',    color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)' },
              { icon: Zap,    label: 'New Opportunity',   color: 'text-spot-400',    bg: 'rgba(245,124,32,0.1)' },
              { icon: Shield, label: 'Compare Products',  color: 'text-steel-300',   bg: 'rgba(128,128,128,0.1)' },
            ].map(action => (
              <button key={action.label}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-right group hover:bg-white/[0.03]"
                style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: action.bg }}>
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">{action.label}</span>
                <ChevronLeft className="w-3 h-3 text-slate-700 mr-auto" />
              </button>
            ))}
          </div>

          {/* Gold Partner */}
          <div className="mt-4 p-3 rounded-xl" style={{ border: '1px solid rgba(245,124,32,0.2)', background: 'rgba(245,124,32,0.05)' }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-spot-400 font-semibold">Gold Partner</span>
              <span className="text-xs text-slate-500">Level 3/5</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
              <div className="h-1.5 rounded-full" style={{ width: '62%', background: '#F57C20', boxShadow: '0 0 8px rgba(245,124,32,0.5)' }} />
            </div>
            <div className="text-[10px] text-slate-600">₪320K עד Platinum | ₪320K to Platinum</div>
          </div>

          {/* SpotNet badge */}
          <div className="mt-3 flex items-center justify-center">
            <SpotNetLogo className="h-4 opacity-30" />
          </div>
        </div>
      </div>
    </div>
  )
}
