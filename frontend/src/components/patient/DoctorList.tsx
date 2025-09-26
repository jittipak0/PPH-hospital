import React from 'react'
import type { Doctor } from '../../lib/api'
import { DoctorCard } from './DoctorCard'
import styles from './DoctorList.module.scss'

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
    return (
      <p role="alert" className={styles.error}>
        {error}
      </p>
    )
  }

  if (doctors.length === 0) {
    return <p role="status">ไม่พบแพทย์ตามเงื่อนไขที่ค้นหา</p>
  }

  return (
    <div className={styles.container}>
      <p className={styles.summary}>พบแพทย์ทั้งหมด {totalResults} ราย</p>
      <div className={styles.grid}>
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
      {totalPages > 1 ? (
        <nav className={styles.pagination} aria-label="เปลี่ยนหน้ารายชื่อแพทย์">
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => onChangePage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </button>
          <span aria-live="polite">
            หน้า {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            className={styles.paginationButton}
            onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </button>
        </nav>
      ) : null}
    </div>
  )
}
