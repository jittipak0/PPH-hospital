import React from 'react'
import type { Doctor } from '../../lib/api'
import styles from './DoctorCard.module.scss'

interface DoctorCardProps {
  doctor: Doctor
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <article className={`card ${styles.doctorCard}`} aria-label={`แพทย์ ${doctor.name}`}>
      <header>
        <h3>{doctor.name}</h3>
        <p className={styles.meta}>
          <span>แผนก: {doctor.department}</span>
          <span>ความเชี่ยวชาญ: {doctor.specialty}</span>
        </p>
      </header>
      <p>ตำแหน่ง: {doctor.position}</p>
      <p>
        เบอร์โทรติดต่อ:{' '}
        <a className={styles.contactLink} href={`tel:${doctor.phone}`} aria-label={`โทรหา ${doctor.name}`}>
          {doctor.phone}
        </a>
      </p>
      <div>
        <h4>ตารางออกตรวจ</h4>
        <ul className={styles.scheduleList}>
          {doctor.schedule.map((slot) => (
            <li key={`${doctor.id}-${slot.day}-${slot.time}`}>
              <span aria-label="วันออกตรวจ">{slot.day}</span>: {slot.time} ({slot.clinic})
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
