import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage()

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-1">
      <button
        onClick={() => setLanguage('he')}
        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${language === 'he' ? 'bg-cdata-500/30 text-white' : 'text-slate-400 hover:text-white'}`}
        title="Hebrew"
      >
        עברית
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${language === 'en' ? 'bg-cdata-500/30 text-white' : 'text-slate-400 hover:text-white'}`}
        title="English"
      >
        English
      </button>
    </div>
  )
}
