import React from 'react'
import type { Doctor } from '../../lib/api'
import { DoctorCard } from './DoctorCard'
import { useI18n } from '../../lib/i18n'

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
  const { t } = useI18n()
  if (loading) {
    return <p role="status">{t('doctors.loading')}</p>
  }

  if (error) {
    return (
      <p role="alert" className="error">
        {error}
      </p>
    )
  }

  if (doctors.length === 0) {
    return <p role="status">{t('doctors.empty')}</p>
  }

  return (
    <div className="doctor-list">
      <p className="doctor-list__summary">{t('doctors.summary').replace('{{count}}', totalResults.toString())}</p>
      <div className="doctor-list__grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="doctor-list__pagination" aria-label={t('doctors.paginationLabel')}>
          <button type="button" onClick={() => onChangePage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
            {t('doctors.previous')}
          </button>
          <span aria-live="polite">
            {t('doctors.pageIndicator')
              .replace('{{current}}', currentPage.toString())
              .replace('{{total}}', totalPages.toString())}
          </span>
          <button type="button" onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
            {t('doctors.next')}
          </button>
        </nav>
      )}
    </div>
  )
}
