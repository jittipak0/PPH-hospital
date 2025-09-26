import React from 'react'
import styles from './SearchBar.module.scss'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <label className={styles.searchBar}>
      <span className="visually-hidden">ค้นหา</span>
      <input
        className={styles.input}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? 'ค้นหาชื่อแพทย์หรือสาขา'}
      />
    </label>
  )
}
