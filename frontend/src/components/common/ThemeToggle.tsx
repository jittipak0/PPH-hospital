import React from 'react'

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
    <div className="theme-toggle" role="group" aria-label="ปรับการแสดงผล">
      <button type="button" onClick={onDecreaseFont} aria-label="ลดขนาดตัวอักษร">
        A-
      </button>
      <button type="button" onClick={onIncreaseFont} aria-label="เพิ่มขนาดตัวอักษร">
        A+
      </button>
      <button
        type="button"
        onClick={onToggleContrast}
        aria-pressed={isHighContrast}
        aria-label="สลับโหมดคอนทราสต์สูง"
      >
        {isHighContrast ? 'ปกติ' : 'คอนทราสต์สูง'}
      </button>
      <style>{`
        .theme-toggle {
          display: inline-flex;
          gap: 0.25rem;
        }
        .theme-toggle button {
          border: 1px solid var(--color-primary);
          background: #fff;
          color: var(--color-primary);
          padding: 0.3rem 0.6rem;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
        }
        .theme-toggle button[aria-pressed='true'] {
          background: var(--color-primary);
          color: #fff;
        }
      `}</style>
    </div>
  )
}
