import React from 'react'
import { useI18n } from '../../lib/i18n'

interface ClinicTabsProps {
  departments: string[]
  selected: string
  onSelect: (value: string) => void
}

export const ClinicTabs: React.FC<ClinicTabsProps> = ({ departments, selected, onSelect }) => {
  const { t } = useI18n()
  return (
    <div className="clinic-tabs" role="tablist" aria-label={t('doctors.clinic.label')}>
      {departments.map((department) => (
        <button
          key={department}
          role="tab"
          type="button"
          aria-selected={selected === department}
          className={selected === department ? 'is-active' : ''}
          onClick={() => onSelect(department)}
        >
          {department === 'all' ? t('doctors.clinic.all') : department}
        </button>
      ))}
    </div>
  )
}
