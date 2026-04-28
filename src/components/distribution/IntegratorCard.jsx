import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Building2, Mail, Phone, TrendingUp } from 'lucide-react'

export default function IntegratorCard({
  integrator,
  customerCount = 0,
  revenueEstimate = 0,
  pendingOrders = 0,
  onClick = null
}) {
  return (
    <motion.div
      className="glass rounded-xl p-6 border border-white/10 cursor-pointer transition-all"
      whileHover={{ 
        borderColor: 'rgba(44,106,138,0.4)',
        boxShadow: '0 20px 40px rgba(44,106,138,0.15)'
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-12 h-12 rounded-lg bg-cdata-500/15 border border-cdata-500/30 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-cdata-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate">{integrator.companyName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">ID: {integrator.id}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0 group-hover:text-slate-300 transition-colors" />
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        {integrator.contactEmail && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{integrator.contactEmail}</span>
          </div>
        )}
        {integrator.contactPhone && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Phone className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{integrator.contactPhone}</span>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5">
        <div>
          <div className="text-sm font-black text-white mb-0.5">{customerCount}</div>
          <div className="text-[10px] text-slate-500">Active Customers</div>
        </div>
        <div>
          <div className="text-sm font-black text-emerald-400 mb-0.5">${(revenueEstimate / 1000).toFixed(1)}k</div>
          <div className="text-[10px] text-slate-500">Monthly Revenue</div>
        </div>
        <div>
          <div className="text-sm font-black text-amber-400 mb-0.5">{pendingOrders}</div>
          <div className="text-[10px] text-slate-500">Pending Orders</div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
          integrator.status === 'active'
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
        }`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          {integrator.status?.charAt(0).toUpperCase() + integrator.status?.slice(1) || 'Active'}
        </span>
        {pendingOrders > 0 && (
          <span className="text-[10px] text-amber-400 font-semibold">⚠ Action needed</span>
        )}
      </div>
    </motion.div>
  )
}
