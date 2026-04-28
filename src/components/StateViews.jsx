import React from 'react'
import { Loader2, AlertTriangle, Inbox, RefreshCw } from 'lucide-react'

export function LoadingState({ message = 'Loading...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-3 ${className}`}>
      <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  )
}

export function ErrorState({ message = 'Something went wrong', onRetry, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-500/10">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-white">{message}</p>
        <p className="text-xs text-slate-500 mt-1">Please try again or contact support</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title = 'No results', description, icon: Icon = Inbox, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}>
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <Icon className="w-7 h-7 text-slate-600" />
      </div>
      <div className="text-center max-w-xs">
        <p className="text-sm font-semibold text-white">{title}</p>
        {description && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)', boxShadow: '0 4px 15px rgba(37,99,235,0.25)' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
