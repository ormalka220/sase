import React from 'react'

export function CDataLogo({ className = 'h-8', showText = true }) {
  const src = '/cdata-logo.png'
  return (
    <img
      src={src}
      alt="C-Data"
      className={`${className} w-auto object-contain scale-125`}
      loading="lazy"
    />
  )
}

export function SpotNetLogo({ className = 'h-7', showText = true }) {
  const src = '/spotnet_email.png'
  return (
    <img
      src={src}
      alt="SpotNet"
      className={`${className} w-auto object-contain scale-125`}
      loading="lazy"
    />
  )
}

export function CoBrandLogo({ className = 'h-6' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <CDataLogo className="h-full" />
      <span className="text-slate-600 text-xs font-light">×</span>
      <SpotNetLogo className="h-full" />
    </div>
  )
}

export function CDataMark({ className = 'w-8 h-8' }) {
  return (
    <img
      src="/cdata-logo.png"
      alt="C-Data mark"
      className={`${className} object-contain scale-125`}
      loading="lazy"
    />
  )
}
