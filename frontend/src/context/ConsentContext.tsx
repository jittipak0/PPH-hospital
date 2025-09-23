import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type ConsentState = {
  consentGiven: boolean
  rejectConsent: () => void
  acceptConsent: () => void
  bannerDismissed: boolean
}

const ConsentContext = createContext<ConsentState | undefined>(undefined)

const STORAGE_KEY = 'pph-cookie-consent'

export const ConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'accepted'
  })

  const [bannerDismissed, setBannerDismissed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'accepted' || stored === 'rejected'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, consentGiven ? 'accepted' : bannerDismissed ? 'rejected' : 'unknown')
  }, [consentGiven, bannerDismissed])

  const acceptConsent = useCallback(() => {
    setConsentGiven(true)
    setBannerDismissed(true)
  }, [])

  const rejectConsent = useCallback(() => {
    setConsentGiven(false)
    setBannerDismissed(true)
  }, [])

  const value = useMemo<ConsentState>(() => ({
    consentGiven,
    acceptConsent,
    rejectConsent,
    bannerDismissed
  }), [consentGiven, acceptConsent, rejectConsent, bannerDismissed])

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>
}

export const useConsent = (): ConsentState => {
  const context = useContext(ConsentContext)
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider')
  }
  return context
}
