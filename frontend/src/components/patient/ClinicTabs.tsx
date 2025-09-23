import React from 'react'

interface ClinicTabsProps {
  departments: string[]
  selected: string
  onSelect: (value: string) => void
}

export const ClinicTabs: React.FC<ClinicTabsProps> = ({ departments, selected, onSelect }) => {
  return (
    <div className="clinic-tabs" role="tablist" aria-label="เลือกแผนก">
      {departments.map((department) => (
        <button
          key={department}
          role="tab"
          type="button"
          aria-selected={selected === department}
          className={selected === department ? 'is-active' : ''}
          onClick={() => onSelect(department)}
        >
          {department === 'all' ? 'ทั้งหมด' : department}
        </button>
      ))}
      <style>{`
        .clinic-tabs {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin: 1rem 0 1.5rem;
        }
        .clinic-tabs button {
          border-radius: 999px;
          border: 1px solid var(--color-primary);
          background: transparent;
          color: var(--color-primary);
          padding: 0.4rem 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        .clinic-tabs button.is-active {
          background: var(--color-primary);
          color: #fff;
        }
      `}</style>
    </div>
  )
}
