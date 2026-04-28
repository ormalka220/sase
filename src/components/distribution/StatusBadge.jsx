import React from 'react'
import {
  CheckCircle, AlertCircle, Clock, XCircle, Zap, Eye,
  TrendingUp, TrendingDown, HelpCircle
} from 'lucide-react'

const statusConfig = {
  active: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle },
  pending: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: Clock },
  warning: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', icon: AlertCircle },
  failed: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
  rejected: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
  approved: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle },
  provisioning: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', icon: Zap },
  ready: { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30', icon: Eye },
  info: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30', icon: HelpCircle },
  success: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: CheckCircle },
  error: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
  neutral: { bg: 'bg-slate-500/15', text: 'text-slate-400', border: 'border-slate-500/30', icon: HelpCircle },
}

export default function StatusBadge({ 
  status = 'neutral', 
  label, 
  icon: CustomIcon = null,
  size = 'sm', // sm, md, lg
  showIcon = true,
  className = ''
}) {
  const config = statusConfig[status] || statusConfig.neutral
  const Icon = CustomIcon || config.icon
  
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border font-semibold transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}>
      {showIcon && <Icon className={`w-${size === 'sm' ? 3 : size === 'md' ? 4 : 5} h-${size === 'sm' ? 3 : size === 'md' ? 4 : 5} flex-shrink-0`} />}
      {label && <span>{label}</span>}
    </div>
  )
}
