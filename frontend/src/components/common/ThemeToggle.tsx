import React from 'react'
import { useI18n } from '../../lib/i18n'

interface ThemeToggleProps {
  onIncreaseFont: () => void
  onDecreaseFont: () => void
  isHighContrast: boolean
  onToggleContrast: () => void
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  onIncreaseFont,
  onDecreaseFont,
  isHighContrast,
  onToggleContrast
}) => {
  const { t } = useI18n()

  return (
    <div className="theme-toggle" role="group" aria-label={t('theme.groupLabel')}>
      <button type="button" onClick={onDecreaseFont} aria-label={t('theme.decrease')}>
        {t('theme.decrease')}
      </button>
      <button type="button" onClick={onIncreaseFont} aria-label={t('theme.increase')}>
        {t('theme.increase')}
      </button>
      <button
        type="button"
        onClick={onToggleContrast}
        aria-pressed={isHighContrast}
        aria-label={isHighContrast ? t('theme.highContrast.off') : t('theme.highContrast.on')}
      >
        {isHighContrast ? t('theme.highContrast.off') : t('theme.highContrast.on')}
      </button>
    </div>
  )
}
