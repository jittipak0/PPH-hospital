import React from 'react'
import { useI18n } from '../../lib/i18n'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  const { t } = useI18n()
  return (
    <label className="search-bar">
      <span className="visually-hidden">{t('search.label')}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? t('doctors.search.placeholder')}
      />
    </label>
  )
}
