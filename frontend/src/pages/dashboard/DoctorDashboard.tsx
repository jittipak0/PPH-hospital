import React, { useEffect, useState } from 'react'
import { secureApi } from '../../lib/secureApi'
import { useAuth } from '../../context/AuthContext'

type Patient = {
  id: string
  name: string
  diagnosis: string
  updatedAt: string
}

export const DoctorDashboard: React.FC = () => {
  const { accessToken } = useAuth()
  const [patients, setPatients] = useState<Patient[]>([])

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return
      const response = await secureApi.fetchDoctorPatients(accessToken)
      setPatients(response.patients)
    }
    load()
  }, [accessToken])

  return (
    <div className="doctor-dashboard">
      <h2>รายชื่อผู้ป่วยของฉัน</h2>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            <h3>{patient.name}</h3>
            <p>การวินิจฉัย: {patient.diagnosis}</p>
            <p>อัปเดตล่าสุด: {new Date(patient.updatedAt).toLocaleString('th-TH')}</p>
          </li>
        ))}
      </ul>
      <style>{`
        .doctor-dashboard {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
        }
        .doctor-dashboard ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 1.25rem;
        }
        .doctor-dashboard li {
          padding: 1.25rem;
          border-radius: 14px;
          background: var(--color-surface-alt);
        }
      `}</style>
    </div>
  )
}
