import React from 'react'

export default function LoadingSkeleton({ 
  type = 'card', // card, table, kpi, custom
  count = 3,
  className = ''
}) {
  const shimmer = 'animate-pulse'

  if (type === 'kpi') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="glass rounded-xl p-5 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-white/5 ${shimmer}`} />
              <div className={`w-16 h-6 rounded bg-white/5 ${shimmer}`} />
            </div>
            <div className={`h-8 w-20 bg-white/5 rounded mb-2 ${shimmer}`} />
            <div className={`h-4 w-32 bg-white/5 rounded ${shimmer}`} />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'table') {
    return (
      <div className={`glass rounded-xl border border-white/10 divide-y divide-white/5 ${className}`}>
        {/* Header */}
        <div className="p-4 flex items-center gap-4">
          <div className={`h-4 flex-1 bg-white/5 rounded ${shimmer}`} />
          <div className={`h-4 w-20 bg-white/5 rounded ${shimmer}`} />
          <div className={`h-4 w-20 bg-white/5 rounded ${shimmer}`} />
        </div>
        {/* Rows */}
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <div className={`h-4 flex-1 bg-white/5 rounded ${shimmer}`} />
            <div className={`h-4 w-20 bg-white/5 rounded ${shimmer}`} />
            <div className={`h-4 w-20 bg-white/5 rounded ${shimmer}`} />
          </div>
        ))}
      </div>
    )
  }

  if (type === 'custom') {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`h-20 bg-white/5 rounded-lg ${shimmer}`} />
        ))}
      </div>
    )
  }

  // Default card type
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass rounded-xl p-5 border border-white/10 space-y-3">
          <div className={`h-6 w-32 bg-white/5 rounded ${shimmer}`} />
          <div className={`h-4 w-full bg-white/5 rounded ${shimmer}`} />
          <div className={`h-4 w-3/4 bg-white/5 rounded ${shimmer}`} />
        </div>
      ))}
    </div>
  )
}
