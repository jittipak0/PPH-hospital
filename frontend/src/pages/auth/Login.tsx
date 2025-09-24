import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const Login: React.FC = () => {
  const { login, isAuthenticated, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', acceptPolicies: false })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (error) {
      clearError()
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.acceptPolicies) {
      alert('โปรดยอมรับนโยบายความเป็นส่วนตัวก่อนเข้าสู่ระบบ')
      return
    }
    setSubmitting(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      console.error('Login failed', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="secure-login">
      <div className="secure-login__card">
        <h1>เข้าสู่ระบบบุคลากร</h1>
        <p className="secure-login__description">
          ระบบนี้สำหรับบุคลากรภายในโรงพยาบาลเท่านั้น โปรดใช้บัญชีที่ได้รับมอบหมายและรักษาความลับของผู้ป่วยอย่างเคร่งครัด
        </p>
        <form onSubmit={handleSubmit} className="secure-login__form">
          <label>
            ชื่อผู้ใช้
            <input
              name="username"
              type="text"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              required
              minLength={3}
            />
          </label>
          <label>
            รหัสผ่าน
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </label>
          <label className="secure-login__checkbox">
            <input
              type="checkbox"
              name="acceptPolicies"
              checked={form.acceptPolicies}
              onChange={handleChange}
            />
            <span>
              ข้าพเจ้ายอมรับ <a href="/privacy-policy">นโยบายความเป็นส่วนตัว</a> และ <a href="/terms">ข้อตกลงการใช้งาน</a>
            </span>
          </label>
          {error ? <div className="secure-login__error">{error}</div> : null}
          <button type="submit" disabled={submitting}>
            {submitting ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
      <style>{`
        .secure-login {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4rem 1rem;
          background: var(--color-surface-alt);
        }
        .secure-login__card {
          width: min(480px, 100%);
          background: white;
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          padding: 2.5rem;
        }
        .secure-login__description {
          color: var(--color-text-muted);
          margin-bottom: 2rem;
        }
        .secure-login__form {
          display: grid;
          gap: 1.25rem;
        }
        .secure-login__form label {
          display: grid;
          gap: 0.5rem;
          font-weight: 600;
        }
        .secure-login__form input[type='text'],
        .secure-login__form input[type='password'] {
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          font-size: 1rem;
        }
        .secure-login__checkbox {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-weight: 500;
        }
        .secure-login__checkbox a {
          color: var(--color-primary);
        }
        .secure-login__error {
          padding: 0.75rem 1rem;
          background-color: rgba(239, 68, 68, 0.12);
          border-left: 4px solid #ef4444;
          border-radius: 12px;
        }
        button[type='submit'] {
          background: var(--color-primary);
          color: white;
          padding: 0.9rem 1.5rem;
          border-radius: 12px;
          border: none;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        button[type='submit'][disabled] {
          background: rgba(148, 163, 184, 0.6);
          cursor: not-allowed;
        }
      `}</style>
    </section>
  )
}
