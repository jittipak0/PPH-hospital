import React from 'react'
import { useI18n } from '../../lib/i18n'

export const LanguageSwitcher: React.FC = () => {
  const { language, switchLanguage, t } = useI18n()

  return (
    <div role="group" aria-label="เลือกภาษา" className="language-switcher">
      <button
        type="button"
        onClick={() => switchLanguage('th')}
        className={language === 'th' ? 'is-active' : ''}
      >
        {t('language.th')}
      </button>
      <button
        type="button"
        onClick={() => switchLanguage('en')}
        className={language === 'en' ? 'is-active' : ''}
      >
        {t('language.en')}
      </button>
      <style>{`
        .language-switcher {
          display: inline-flex;
          border: 1px solid var(--color-primary);
          border-radius: 999px;
          overflow: hidden;
        }
        .language-switcher button {
          background: transparent;
          color: var(--color-primary);
          border: none;
          padding: 0.35rem 0.75rem;
          font-weight: 600;
          cursor: pointer;
        }
        .language-switcher button.is-active {
          background: var(--color-primary);
          color: #fff;
        }
      `}</style>
    </div>
  )
}
