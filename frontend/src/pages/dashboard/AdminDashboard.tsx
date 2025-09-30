import React, { useEffect, useState } from 'react'
import { secureApi, type AuthenticatedUser, type Role } from '../../lib/secureApi'
import { useAuth } from '../../context/AuthContext'
import { AdminNewsManager } from './AdminNewsManager'

type AuditLog = {
  id: string
  action: string
  ip: string | null
  createdAt: string
  username: string | null
}

export const AdminDashboard: React.FC = () => {
  const { accessToken } = useAuth()
  const [users, setUsers] = useState<AuthenticatedUser[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [form, setForm] = useState({ username: '', password: '', role: 'staff' as Role })
  const [loading, setLoading] = useState(false)

  const loadUsers = async () => {
    if (!accessToken) return
    const response = await secureApi.listUsers(accessToken)
    setUsers(response.users)
  }

  const loadLogs = async () => {
    if (!accessToken) return
    const response = await secureApi.listAuditLogs(accessToken)
    setLogs(response.logs)
  }

  useEffect(() => {
    loadUsers()
    loadLogs()
  }, [accessToken])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFeedback(null)
  }

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!accessToken) return
    setLoading(true)
    try {
      await secureApi.createUser(accessToken, form)
      setFeedback('สร้างบัญชีผู้ใช้เรียบร้อย')
      setForm({ username: '', password: '', role: 'staff' })
      await loadUsers()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ไม่สามารถสร้างผู้ใช้ได้'
      setFeedback(message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!accessToken) return
    if (!confirm('ยืนยันการลบบัญชีนี้หรือไม่')) return
    await secureApi.deleteUser(accessToken, userId)
    await loadUsers()
    await loadLogs()
  }

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__panel">
        <h2>จัดการบัญชีบุคลากร</h2>
        <form onSubmit={handleCreateUser} className="admin-dashboard__form">
          <div>
            <label>ชื่อผู้ใช้</label>
            <input name="username" value={form.username} onChange={handleChange} required minLength={3} />
          </div>
          <div>
            <label>รหัสผ่านชั่วคราว</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={8} />
          </div>
          <div>
            <label>บทบาท</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="doctor">แพทย์</option>
              <option value="nurse">พยาบาล</option>
              <option value="staff">เจ้าหน้าที่</option>
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'กำลังสร้าง...' : 'สร้างบัญชี'}
          </button>
          {feedback ? <p className="admin-dashboard__feedback">{feedback}</p> : null}
        </form>
      </section>

      <section className="admin-dashboard__panel">
        <h2>บัญชีทั้งหมด</h2>
        <div className="admin-dashboard__table">
          <table>
            <thead>
              <tr>
                <th>ชื่อผู้ใช้</th>
                <th>บทบาท</th>
                <th>สถานะนโยบาย</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.acceptedPolicies ? 'ยอมรับแล้ว' : 'ยังไม่ยอมรับ'}</td>
                  <td>
                    <button className="danger" onClick={() => handleDelete(user.id)}>
                      ลบบัญชี
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-dashboard__panel">
        <h2>จัดการข่าวและสไลด์หน้าแรก</h2>
        <AdminNewsManager />
      </section>

      <section className="admin-dashboard__panel">
        <h2>บันทึกกิจกรรมระบบ</h2>
        <ul className="admin-dashboard__logs">
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.action}</strong> โดย {log.username ?? 'ไม่ระบุ'} (IP: {log.ip ?? 'n/a'}) เวลา {new Date(log.createdAt).toLocaleString('th-TH')}
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .admin-dashboard {
          display: grid;
          gap: 2rem;
        }
        .admin-dashboard__panel {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: var(--shadow-md);
        }
        .admin-dashboard__form {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .admin-dashboard__form div {
          display: grid;
          gap: 0.5rem;
        }
        .admin-dashboard__form input,
        .admin-dashboard__form select {
          padding: 0.7rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(15, 23, 42, 0.1);
        }
        .admin-dashboard__form button {
          grid-column: 1 / -1;
          justify-self: flex-start;
          background: var(--color-primary);
          color: white;
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
        }
        .admin-dashboard__feedback {
          grid-column: 1 / -1;
          color: var(--color-primary);
        }
        .admin-dashboard__table table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-dashboard__table th,
        .admin-dashboard__table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
          text-align: left;
        }
        .admin-dashboard__table button.danger {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 0.8rem;
          border-radius: 8px;
          cursor: pointer;
        }
        .admin-dashboard__logs {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0.75rem;
        }
        .admin-dashboard__logs li {
          padding: 0.75rem 1rem;
          border-radius: 10px;
          background: var(--color-surface-alt);
        }
      `}</style>
    </div>
  )
}
