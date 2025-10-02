import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { AdminDashboard } from './AdminDashboard'
import { DoctorDashboard } from './DoctorDashboard'
import { NurseDashboard } from './NurseDashboard'
import { StaffDashboard } from './StaffDashboard'
import { secureApi } from '../../lib/secureApi'

export const DashboardPage: React.FC = () => {
  const { user, accessToken, logout } = useAuth()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)

  if (!user) {
    return (
      <section className="dashboard">
        <div className="dashboard__card">
          <p>โปรดเข้าสู่ระบบเพื่อเข้าถึงข้อมูลภายใน</p>
        </div>
        <style>{`
          .dashboard {
            padding: 3rem 1rem;
          }
          .dashboard__card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: var(--shadow-md);
            max-width: 460px;
            margin: 0 auto;
            text-align: center;
          }
        `}</style>
      </section>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />
      case 'doctor':
        return <DoctorDashboard />
      case 'nurse':
        return <NurseDashboard />
      case 'staff':
      default:
        return <StaffDashboard />
    }
  }

  const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!accessToken) return
    setConfirming(true)
    try {
      await secureApi.deleteAccount(accessToken, { password })
      setMessage('บัญชีถูกลบเรียบร้อย ระบบจะออกจากระบบโดยอัตโนมัติ')
      setPassword('')
      setTimeout(() => {
        logout()
      }, 1200)
    } catch (err) {
      const text = err instanceof Error ? err.message : 'ไม่สามารถลบบัญชีได้'
      setMessage(text)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1>แดชบอร์ดบุคลากร</h1>
          <p>
            สวัสดี {user.username} (บทบาท: {user.role})
          </p>
        </div>
        <button className="dashboard__logout" onClick={logout}>
          ออกจากระบบ
        </button>
      </header>

      <div className="dashboard__content">{renderDashboard()}</div>

      <footer className="dashboard__footer">
        <details>
          <summary>ลบบัญชีตามสิทธิ์ PDPA</summary>
          <form onSubmit={handleDeleteAccount} className="dashboard__delete">
            <label>
              ยืนยันด้วยรหัสผ่านปัจจุบัน
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={4}
              />
            </label>
            <button type="submit" disabled={confirming}>
              {confirming ? 'กำลังลบ...' : 'ลบบัญชีถาวร'}
            </button>
          </form>
          {message ? <p className="dashboard__message">{message}</p> : null}
        </details>
      </footer>

      <style>{`
        .dashboard {
          padding: 3rem 1rem;
          display: grid;
          gap: 2rem;
        }
        .dashboard__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 1.5rem 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
        }
        .dashboard__logout {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          cursor: pointer;
        }
        .dashboard__content {
          display: grid;
          gap: 2rem;
        }
        .dashboard__footer details {
          background: white;
          padding: 1.5rem 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
        }
        .dashboard__delete {
          margin-top: 1rem;
          display: grid;
          gap: 1rem;
          max-width: 360px;
        }
        .dashboard__delete input {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(15, 23, 42, 0.1);
        }
        .dashboard__delete button {
          background: #ef4444;
          color: white;
          padding: 0.75rem 1.25rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }
        .dashboard__message {
          margin-top: 1rem;
          color: var(--color-primary);
        }
        @media (max-width: 768px) {
          .dashboard__header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  )
}
