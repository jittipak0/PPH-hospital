import React from 'react'
import { useConsent } from '../../context/ConsentContext'
import { useI18n } from '../../lib/i18n'
import styles from './CookieConsent.module.scss'

export const CookieConsent: React.FC = () => {
  const { consentGiven, acceptConsent, rejectConsent, bannerDismissed } = useConsent()
  const { t } = useI18n()

  if (bannerDismissed) {
    return null
  }

  return (
    <div className={styles.banner} role="dialog" aria-live="polite" aria-label="การแจ้งเตือนคุกกี้">
      <p>
        {t('cookie.message')}{' '}
        <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
          อ่านรายละเอียด
        </a>
      </p>
      <div className={styles.actions}>
        <button type="button" className={`${styles.button} ${styles.primary}`.trim()} onClick={acceptConsent}>
          {t('cookie.accept')}
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`.trim()}
          onClick={rejectConsent}
          aria-pressed={!consentGiven}
        >
          {t('cookie.reject')}
        </button>
      </div>
    </div>
  )
}
