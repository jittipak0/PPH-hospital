import React from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
  return (
    <label className="search-bar">
      <span className="visually-hidden">ค้นหา</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? 'ค้นหาชื่อแพทย์หรือสาขา'}
      />
      <style>{`
        .search-bar {
          display: flex;
          width: 100%;
        }
        .search-bar input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.2);
          font-size: 1rem;
        }
      `}</style>
    </label>
  )
}
