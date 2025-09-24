import React, { useEffect, useState } from 'react'
import { secureApi } from '../../lib/secureApi'
import { useAuth } from '../../context/AuthContext'

type Schedule = {
  id: string
  shiftDate: string
  shiftType: string
}

export const NurseDashboard: React.FC = () => {
  const { accessToken } = useAuth()
  const [schedules, setSchedules] = useState<Schedule[]>([])

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return
      const response = await secureApi.fetchNurseSchedules(accessToken)
      setSchedules(response.schedules)
    }
    load()
  }, [accessToken])

  return (
    <div className="nurse-dashboard">
      <h2>ตารางเวรของฉัน</h2>
      <table>
        <thead>
          <tr>
            <th>วันที่</th>
            <th>กะการทำงาน</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>{schedule.shiftDate}</td>
              <td>{schedule.shiftType}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style>{`
        .nurse-dashboard {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 0.9rem 1rem;
          border-bottom: 1px solid rgba(15, 23, 42, 0.1);
          text-align: left;
        }
      `}</style>
    </div>
  )
}
