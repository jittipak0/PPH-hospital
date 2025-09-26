import React from 'react'
import { useI18n } from '../../lib/i18n'
import styles from './LanguageSwitcher.module.scss'

export const LanguageSwitcher: React.FC = () => {
  const { language, switchLanguage, t } = useI18n()

  return (
    <div role="group" aria-label="เลือกภาษา" className={styles.languageSwitcher}>
      <button
        type="button"
        onClick={() => switchLanguage('th')}
        className={`${styles.button} ${language === 'th' ? styles.active : ''}`.trim()}
      >
        {t('language.th')}
      </button>
      <button
        type="button"
        onClick={() => switchLanguage('en')}
        className={`${styles.button} ${language === 'en' ? styles.active : ''}`.trim()}
      >
        {t('language.en')}
      </button>
    </div>
  )
}
