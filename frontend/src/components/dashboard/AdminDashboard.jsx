import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext.jsx';
import RoleBadge from '../common/RoleBadge.jsx';

const createUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
  role: z.enum(['admin', 'doctor', 'nurse', 'staff']),
});

const AdminDashboard = () => {
  const { authorizedRequest, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({ username: '', password: '', role: 'doctor' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const loadUsers = useCallback(async () => {
    const { data } = await authorizedRequest({ url: '/admin/users', method: 'get' });
    setUsers(data.users);
  }, [authorizedRequest]);

  const loadLogs = useCallback(async () => {
    const { data } = await authorizedRequest({ url: '/admin/logs', method: 'get' });
    setLogs(data.logs);
  }, [authorizedRequest]);

  useEffect(() => {
    loadUsers().catch(() => {});
    loadLogs().catch(() => {});
  }, [loadUsers, loadLogs]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });
    const parsed = createUserSchema.safeParse(form);
    if (!parsed.success) {
      setStatus({ type: 'error', message: 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง' });
      return;
    }
    try {
      await authorizedRequest(
        {
          url: '/admin/users',
          method: 'post',
          data: parsed.data,
        },
        { requireCsrf: true }
      );
      setStatus({ type: 'success', message: 'สร้างบัญชีใหม่สำเร็จ' });
      setForm({ username: '', password: '', role: 'doctor' });
      await loadUsers();
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'ไม่สามารถสร้างบัญชีได้' });
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await authorizedRequest(
        {
          url: `/admin/users/${id}/role`,
          method: 'patch',
          data: { role },
        },
        { requireCsrf: true }
      );
      await loadUsers();
      setStatus({ type: 'success', message: 'อัปเดตบทบาทเรียบร้อย' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'ไม่สามารถอัปเดตบทบาทได้' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('ยืนยันการลบบัญชีนี้หรือไม่?')) {
      return;
    }
    try {
      await authorizedRequest(
        {
          url: `/admin/users/${id}`,
          method: 'delete',
        },
        { requireCsrf: true }
      );
      await loadUsers();
      setStatus({ type: 'success', message: 'ลบบัญชีเรียบร้อยแล้ว' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'ไม่สามารถลบบัญชีได้' });
    }
  };

  return (
    <div>
      <section className="card">
        <h2>จัดการบัญชีบุคลากร</h2>
        <p>บัญชีปัจจุบัน: <RoleBadge role={user.role} /> {user.username}</p>
        {status.type !== 'idle' && (
          <div className={status.type === 'error' ? 'alert' : 'badge'}>{status.message}</div>
        )}
        <form onSubmit={handleCreateUser} style={{ display: 'grid', gap: '1rem', maxWidth: '480px' }}>
          <div>
            <label htmlFor="username">ชื่อผู้ใช้ใหม่</label>
            <input id="username" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="password">รหัสผ่านเริ่มต้น</label>
            <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="role">บทบาท</label>
            <select id="role" name="role" value={form.role} onChange={handleChange}>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit">สร้างบัญชี</button>
        </form>
      </section>

      <section className="card">
        <h3>รายการบัญชีทั้งหมด</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">ชื่อผู้ใช้</th>
              <th align="left">บทบาท</th>
              <th align="left">ยอมรับนโยบาย</th>
              <th align="left">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={item.id} style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <td>{item.username}</td>
                <td>
                  <select value={item.role} onChange={(event) => handleRoleChange(item.id, event.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="nurse">Nurse</option>
                    <option value="staff">Staff</option>
                  </select>
                </td>
                <td>{item.acceptedPrivacy ? '✔' : '✖'}</td>
                <td>
                  <button type="button" onClick={() => handleDelete(item.id)} disabled={item.id === user.id}>
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h3>Audit Log ล่าสุด</h3>
        <ul>
          {logs.slice(0, 20).map((log) => (
            <li key={log.id}>
              <strong>{log.createdAt}</strong> — {log.action} ({log.ipAddress || 'unknown IP'})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
