import React from 'react'
import type { Doctor } from '../../lib/api'
import { useI18n } from '../../lib/i18n'

interface DoctorCardProps {
  doctor: Doctor
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const { t } = useI18n()
  return (
    <article className="card doctor-card" aria-label={`${t('doctors.title')} ${doctor.name}`}>
      <header>
        <h3>{doctor.name}</h3>
        <p className="doctor-card__meta">
          <span>
            {t('doctors.departmentLabel')}: {doctor.department}
          </span>
          <span>
            {t('doctors.specialtyLabel')}: {doctor.specialty}
          </span>
        </p>
      </header>
      <p>
        {t('doctors.positionLabel')}: {doctor.position}
      </p>
      <p>
        {t('doctors.phoneLabel')}:{' '}
        <a href={`tel:${doctor.phone}`} aria-label={`${t('doctors.phoneLabel')} ${doctor.name}`}>
          {doctor.phone}
        </a>
      </p>
      <div>
        <h4>{t('doctors.scheduleLabel')}</h4>
        <ul>
          {doctor.schedule.map((slot) => (
            <li key={`${doctor.id}-${slot.day}-${slot.time}`}>
              <span aria-label={t('doctors.scheduleLabel')}>{slot.day}</span>: {slot.time} ({slot.clinic})
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
