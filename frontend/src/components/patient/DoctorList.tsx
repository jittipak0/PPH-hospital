import React from 'react'
import type { Doctor } from '../../lib/api'
import { DoctorCard } from './DoctorCard'

interface DoctorListProps {
  doctors: Doctor[]
  totalResults: number
  currentPage: number
  totalPages: number
  onChangePage: (page: number) => void
  loading: boolean
  error: string | null
}

export const DoctorList: React.FC<DoctorListProps> = ({
  doctors,
  totalResults,
  currentPage,
  totalPages,
  onChangePage,
  loading,
  error
}) => {
  if (loading) {
    return <p role="status">กำลังโหลดรายชื่อแพทย์...</p>
  }

  if (error) {
    return <p role="alert" style={{ color: 'crimson' }}>{error}</p>
  }

  if (doctors.length === 0) {
    return <p role="status">ไม่พบแพทย์ตามเงื่อนไขที่ค้นหา</p>
  }

  return (
    <div className="doctor-list">
      <p className="doctor-list__summary">พบแพทย์ทั้งหมด {totalResults} ราย</p>
      <div className="doctor-list__grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="doctor-list__pagination" aria-label="เปลี่ยนหน้ารายชื่อแพทย์">
          <button type="button" onClick={() => onChangePage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            ก่อนหน้า
          </button>
          <span aria-live="polite">
            หน้า {currentPage} / {totalPages}
          </span>
          <button type="button" onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            ถัดไป
          </button>
        </nav>
      )}
      <style>{`
        .doctor-list__summary {
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .doctor-list__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .doctor-card ul {
          padding-left: 1.25rem;
        }
        .doctor-list__pagination {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .doctor-list__pagination button {
          border-radius: 999px;
          border: 1px solid var(--color-primary);
          background: #fff;
          color: var(--color-primary);
          padding: 0.5rem 1.2rem;
          cursor: pointer;
        }
        .doctor-list__pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
