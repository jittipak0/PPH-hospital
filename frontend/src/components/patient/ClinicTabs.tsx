import React from 'react'
import styles from './ClinicTabs.module.scss'

interface ClinicTabsProps {
  departments: string[]
  selected: string
  onSelect: (value: string) => void
}

export const ClinicTabs: React.FC<ClinicTabsProps> = ({ departments, selected, onSelect }) => {
  return (
    <div className={styles.tabs} role="tablist" aria-label="เลือกแผนก">
      {departments.map((department) => (
        <button
          key={department}
          role="tab"
          type="button"
          aria-selected={selected === department}
          className={`${styles.tabButton} ${selected === department ? styles.active : ''}`.trim()}
          onClick={() => onSelect(department)}
        >
          {department === 'all' ? 'ทั้งหมด' : department}
        </button>
      ))}
    </div>
  )
}
