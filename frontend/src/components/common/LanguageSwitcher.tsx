import React from 'react'
import { useI18n } from '../../lib/i18n'

export const LanguageSwitcher: React.FC = () => {
  const { language, switchLanguage, t } = useI18n()

  return (
    <div role="group" aria-label={t('language.switcher.label')} className="language-switcher">
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
    </div>
  )
}
