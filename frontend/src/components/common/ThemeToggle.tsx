import React from 'react'
import styles from './ThemeToggle.module.scss'

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
  return (
    <div className={styles.themeToggle} role="group" aria-label="ปรับการแสดงผล">
      <button type="button" onClick={onDecreaseFont} aria-label="ลดขนาดตัวอักษร" className={styles.button}>
        A-
      </button>
      <button type="button" onClick={onIncreaseFont} aria-label="เพิ่มขนาดตัวอักษร" className={styles.button}>
        A+
      </button>
      <button
        type="button"
        onClick={onToggleContrast}
        aria-pressed={isHighContrast}
        aria-label="สลับโหมดคอนทราสต์สูง"
        className={styles.button}
      >
        {isHighContrast ? 'ปกติ' : 'คอนทราสต์สูง'}
      </button>
    </div>
  )
}
