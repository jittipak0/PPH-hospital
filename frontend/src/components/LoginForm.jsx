import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext.jsx';

const formSchema = z.object({
  username: z.string().min(3, 'กรุณากรอกชื่อผู้ใช้'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
  acceptPrivacy: z.boolean().refine((val) => val === true, 'ต้องยอมรับนโยบายความเป็นส่วนตัวก่อนเข้าสู่ระบบ'),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', acceptPrivacy: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const parsed = formSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message || 'ข้อมูลไม่ถูกต้อง');
      return;
    }

    try {
      setLoading(true);
      await login(parsed.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'ไม่สามารถเข้าสู่ระบบได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '420px', margin: '5rem auto' }}>
      <h1>PPH Hospital Secure Portal</h1>
      <p>เข้าสู่ระบบด้วยบัญชีบุคลากรภายในและยืนยันการยอมรับนโยบายความเป็นส่วนตัว</p>
      {error && <div className="alert">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">ชื่อผู้ใช้</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          placeholder="เช่น admin, dr.smith"
          required
        />

        <label htmlFor="password">รหัสผ่าน</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password123!"
          required
        />

        <label htmlFor="acceptPrivacy" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <input
            id="acceptPrivacy"
            name="acceptPrivacy"
            type="checkbox"
            checked={form.acceptPrivacy}
            onChange={handleChange}
          />
          <span>ฉันได้อ่านและยอมรับ <a href="/privacy-policy">นโยบายความเป็นส่วนตัว</a> และ <a href="/terms">ข้อตกลงการใช้งาน</a></span>
        </label>

        <button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1.5rem' }}>
          {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      <section style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#546e7a' }}>
        <h3>บัญชีตัวอย่าง</h3>
        <ul>
          <li>admin / Password123!</li>
          <li>dr.smith / Password123!</li>
          <li>nurse.annie / Password123!</li>
          <li>staff.joe / Password123!</li>
        </ul>
      </section>
    </div>
  );
};

export default LoginForm;
