import React from 'react'
import { useConsent } from '../../context/ConsentContext'
import { useI18n } from '../../lib/i18n'

export const CookieConsent: React.FC = () => {
  const { consentGiven, acceptConsent, rejectConsent, bannerDismissed } = useConsent()
  const { t } = useI18n()

  if (bannerDismissed) {
    return null
  }

  return (
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label={t('cookie.bannerLabel')}>
      <p>
        {t('cookie.message')}{' '}
        <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
          {t('cookie.readMore')}
        </a>
      </p>
      <div className="cookie-banner__actions">
        <button type="button" className="primary" onClick={acceptConsent}>
          {t('cookie.accept')}
        </button>
        <button type="button" onClick={rejectConsent} aria-pressed={!consentGiven}>
          {t('cookie.reject')}
        </button>
      </div>
    </div>
  )
}
