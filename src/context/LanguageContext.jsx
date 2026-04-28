import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'app_language'

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'he' || saved === 'en') return saved
  } catch {
    // no-op
  }
  return 'he'
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // no-op
    }
    const html = document.documentElement
    const rtl = language === 'he'
    html.lang = language
    html.dir = rtl ? 'rtl' : 'ltr'
  }, [language])

  const value = useMemo(() => ({
    language,
    isHebrew: language === 'he',
    setLanguage,
    toggleLanguage: () => setLanguage((prev) => (prev === 'he' ? 'en' : 'he')),
    tr: (he, en) => (language === 'he' ? he : en),
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

