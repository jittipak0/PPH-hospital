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
    <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="การแจ้งเตือนคุกกี้">
      <p>
        {t('cookie.message')}{' '}
        <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
          อ่านรายละเอียด
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
      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          width: min(520px, 90vw);
          background: var(--color-surface);
          box-shadow: var(--shadow-sm);
          border-radius: var(--radius-md);
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 100;
        }
        .cookie-banner p {
          margin: 0;
        }
        .cookie-banner__actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .cookie-banner button {
          border: none;
          padding: 0.5rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
        }
        .cookie-banner button.primary {
          background: var(--color-primary);
          color: #fff;
        }
        .cookie-banner button:not(.primary) {
          background: rgba(13, 110, 253, 0.1);
          color: var(--color-primary);
        }
      `}</style>
    </div>
  )
}
