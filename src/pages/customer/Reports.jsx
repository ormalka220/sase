import React from 'react'
import { FileText, Download, Calendar, Shield, BarChart3, TrendingUp, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useProduct } from '../../context/ProductContext'
import { useLanguage } from '../../context/LanguageContext'

const monthlyData = [
  { month: 'יוני', blocked: 245, phishing: 98, malware: 67, bec: 80 },
  { month: 'יולי', blocked: 312, phishing: 120, malware: 89, bec: 103 },
  { month: 'אוג׳', blocked: 289, phishing: 115, malware: 71, bec: 103 },
  { month: 'ספט׳', blocked: 380, phishing: 148, malware: 95, bec: 137 },
  { month: 'אוק׳', blocked: 421, phishing: 162, malware: 108, bec: 151 },
  { month: 'נוב׳', blocked: 356, phishing: 140, malware: 91, bec: 125 },
]

const reports = [
  { title: 'דוח אבטחה חודשי — נובמבר 2025', type: 'Monthly', date: '01/12/2025', size: '2.4 MB' },
  { title: 'דוח אבטחה חודשי — אוקטובר 2025', type: 'Monthly', date: '01/11/2025', size: '2.1 MB' },
  { title: 'דוח Threat Intelligence — Q3 2025', type: 'Quarterly', date: '01/10/2025', size: '5.8 MB' },
  { title: 'דוח עמידה בתקנים — ISO 27001', type: 'Compliance', date: '15/09/2025', size: '3.2 MB' },
  { title: 'דוח Executive — Q3 2025', type: 'Executive', date: '01/10/2025', size: '1.1 MB' },
]
const saseReports = [
  { title: 'FortiSASE Usage Report — Nov 2025', type: 'Monthly', date: '01/12/2025', size: '2.0 MB' },
  { title: 'ZTNA Access Summary — Nov 2025', type: 'Monthly', date: '01/12/2025', size: '1.8 MB' },
  { title: 'Bandwidth Analytics — Q3 2025', type: 'Quarterly', date: '01/10/2025', size: '4.4 MB' },
  { title: 'SASE Compliance Report — ISO 27001', type: 'Compliance', date: '15/09/2025', size: '2.9 MB' },
]

const typeColors = {
  Monthly: 'badge-blue',
  Quarterly: 'badge-amber',
  Compliance: 'badge-green',
  Executive: 'badge-blue',
}

export default function CustomerReports() {
  const { tr } = useLanguage()
  const { product, config } = useProduct()
  const reportTitle = product === 'perception' ? 'דוחות Perception Point' : product === 'all' ? 'דוחות מאוחדים' : 'דוחות Forti SASE'
  const blockedLabel = product === 'sase' ? 'חיבורים חסומים ב-30 יום' : product === 'all' ? 'אירועי אבטחה נחסמו ב-30 יום' : 'איומי מייל נחסמו ב-30 יום'
  const primaryScoreLabel = product === 'perception' ? tr('ציון אבטחת דוא"ל', 'Email Security Score') : tr('ציון אבטחה', 'Security Score')
  const reportRows = product === 'all' ? [...reports.slice(0, 3), ...saseReports.slice(0, 2)] : product === 'sase' ? saseReports : reports
  const summaryCards = product === 'sase'
    ? [
      { label: blockedLabel, value: '184', icon: Shield, color: 'text-indigo-300', bg: 'bg-indigo-600/15' },
      { label: tr('ZTNA Sessions', 'ZTNA Sessions'), value: '3,842', icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-600/15' },
      { label: tr('Bandwidth Usage', 'Bandwidth Usage'), value: '1.4 TB', icon: TrendingUp, color: 'text-cyan-400', bg: 'bg-cyan-600/15' },
      { label: primaryScoreLabel, value: '96%', icon: CheckCircle, color: 'text-purple-300', bg: 'bg-purple-500/15' },
    ]
    : [
      { label: blockedLabel, value: '356', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-600/15' },
      { label: tr('Phishing שנחסמו', 'Phishing Blocked'), value: '140', icon: BarChart3, color: 'text-red-400', bg: 'bg-red-600/15' },
      { label: tr('Malware שנחסמו', 'Malware Blocked'), value: '91', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-600/15' },
      { label: primaryScoreLabel, value: product === 'all' ? '97%' : '98%', icon: CheckCircle, color: 'text-cdata-300', bg: 'bg-cdata-500/15' },
    ]
  const chartBars = product === 'sase'
    ? [{ key: 'blocked', color: config.primaryColor, label: tr('נחסם', 'Blocked') }]
    : [{ key: 'phishing', color: '#5B9BB8', label: 'Phishing' }, { key: 'malware', color: '#ef4444', label: 'Malware' }, { key: 'bec', color: '#f59e0b', label: 'BEC' }]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">דוחות</h1>
        <p className="text-slate-500 text-sm mt-0.5">{reportTitle} · {tr('דוחות ואנליטיקה', 'Reports & Analytics')}</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="glass glow-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-white text-sm">איומים שנחסמו — 6 חודשים</div>
            <div className="text-xs text-slate-500">{tr('מגמות חסימת איומים', 'Threat Blocking Trends')}</div>
          </div>
          <div className="flex gap-3 text-[10px]">
            {chartBars.map(l => (
              <div key={l.label} className="flex items-center gap-1 text-slate-500">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }}></div>
                {l.label}
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyData} barSize={14} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#0a1428', border: '1px solid rgba(44,106,138,0.2)', borderRadius: 8, fontSize: 11 }}
            />
            {chartBars.map((bar) => (
              <Bar key={bar.key} dataKey={bar.key} fill={bar.color} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Reports List */}
      <div className="glass glow-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8 flex items-center justify-between">
          <div className="font-semibold text-white text-sm">{tr('דוחות זמינים להורדה', 'Reports Available for Download')}</div>
          <span className="badge-blue text-xs">{reports.length} {tr('דוחות', 'reports')}</span>
        </div>
        {reportRows.map((r, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-all group cursor-pointer">
            <div className="w-9 h-9 rounded-xl bg-cdata-500/15 border border-cdata-500/15 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-cdata-300" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-white text-sm">{r.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] ${typeColors[r.type]}`}>{r.type}</span>
                <span className="text-[10px] text-slate-600 flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5" />
                  {r.date}
                </span>
                <span className="text-[10px] text-slate-600">{r.size}</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-cdata-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              <Download className="w-3.5 h-3.5" />
              {tr('הורד', 'Download')}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
