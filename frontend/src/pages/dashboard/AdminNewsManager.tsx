import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { secureApi } from '../../lib/secureApi'
import type { NewsItem } from '../../lib/api'

type FormState = {
  title: string
  summary: string
  content: string
  imageUrl: string
  publishedAt: string
  isFeatured: boolean
  displayOrder: string
}

const defaultForm: FormState = {
  title: '',
  summary: '',
  content: '',
  imageUrl: '',
  publishedAt: '',
  isFeatured: false,
  displayOrder: '0'
}

const toDateTimeLocalValue = (isoString: string): string => {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) {
    return ''
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

const fromDateTimeLocalValue = (value: string): string | undefined => {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return undefined
  }
  return date.toISOString()
}

export const AdminNewsManager: React.FC = () => {
  const { accessToken } = useAuth()
  const [news, setNews] = useState<NewsItem[]>([])
  const [form, setForm] = useState<FormState>(defaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadNews = useCallback(async () => {
    if (!accessToken) return
    try {
      const response = await secureApi.listAllNews(accessToken)
      const sorted = [...response.news].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      setNews(sorted)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ไม่สามารถโหลดข่าวได้'
      setError(message)
    }
  }, [accessToken])

  useEffect(() => {
    void loadNews()
  }, [loadNews])

  const featuredCount = useMemo(() => news.filter((item) => item.isFeatured).length, [news])

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId(null)
    setError(null)
    setFeedback(null)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFeedback(null)
    setError(null)
  }

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))
    setFeedback(null)
    setError(null)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!accessToken) return

    const displayOrderNumber = Math.max(0, Number.parseInt(form.displayOrder, 10) || 0)
    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      imageUrl: form.imageUrl.trim(),
      isFeatured: form.isFeatured,
      displayOrder: displayOrderNumber,
      publishedAt: fromDateTimeLocalValue(form.publishedAt)
    }

    if (payload.title.length === 0 || payload.summary.length === 0 || payload.content.length === 0) {
      setError('กรุณากรอกข้อมูลหัวข้อ สรุป และเนื้อหาให้ครบถ้วน')
      return
    }

    setLoading(true)
    try {
      if (editingId) {
        await secureApi.updateNews(accessToken, editingId, payload)
        setFeedback('อัปเดตข่าวเรียบร้อย')
      } else {
        await secureApi.createNews(accessToken, payload)
        setFeedback('เพิ่มข่าวใหม่เรียบร้อย')
      }
      await loadNews()
      resetForm()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ไม่สามารถบันทึกข้อมูลได้'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item: NewsItem) => {
    setForm({
      title: item.title,
      summary: item.summary,
      content: item.content,
      imageUrl: item.imageUrl,
      publishedAt: toDateTimeLocalValue(item.publishedAt),
      isFeatured: item.isFeatured,
      displayOrder: String(item.displayOrder ?? 0)
    })
    setEditingId(item.id)
    setFeedback(null)
    setError(null)
  }

  const handleDelete = async (id: string) => {
    if (!accessToken) return
    if (!window.confirm('ต้องการลบข่าวนี้หรือไม่?')) {
      return
    }
    setLoading(true)
    try {
      await secureApi.deleteNews(accessToken, id)
      await loadNews()
      if (editingId === id) {
        resetForm()
      }
      setFeedback('ลบข่าวเรียบร้อย')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ไม่สามารถลบข่าวได้'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-news">
      <div className="admin-news__status">
        <span>จำนวนข่าวทั้งหมด {news.length} รายการ</span>
        <span>ข่าวที่แสดงในสไลด์ {featuredCount} รายการ</span>
      </div>

      <div className="admin-news__layout">
        <form className="admin-news__form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}</h3>
          <label>
            หัวข้อข่าว
            <input name="title" value={form.title} onChange={handleChange} required maxLength={160} />
          </label>
          <label>
            สรุปข่าว (ใช้ในสไลด์)
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              rows={3}
              required
              maxLength={280}
            />
          </label>
          <label>
            เนื้อหาฉบับเต็ม
            <textarea name="content" value={form.content} onChange={handleChange} rows={6} required />
          </label>
          <label>
            ลิงก์รูปภาพ (ใช้งานกับ Unsplash หรือ CDN อื่น)
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required type="url" />
          </label>
          <div className="admin-news__grid">
            <label>
              วันที่เผยแพร่
              <input name="publishedAt" type="datetime-local" value={form.publishedAt} onChange={handleChange} />
            </label>
            <label>
              ลำดับในสไลด์
              <input
                name="displayOrder"
                type="number"
                min={0}
                value={form.displayOrder}
                onChange={handleChange}
              />
            </label>
            <label className="admin-news__featured">
              <input type="checkbox" checked={form.isFeatured} onChange={handleCheckbox} />
              ใช้แสดงในสไลด์ข่าวหน้าแรก
            </label>
          </div>
          <div className="admin-news__actions">
            <button type="submit" disabled={loading} className="primary">
              {loading ? 'กำลังบันทึก...' : editingId ? 'บันทึกการแก้ไข' : 'เพิ่มข่าว'}
            </button>
            {editingId ? (
              <button type="button" onClick={resetForm} className="secondary" disabled={loading}>
                ยกเลิกการแก้ไข
              </button>
            ) : null}
          </div>
          {feedback ? <p className="admin-news__feedback">{feedback}</p> : null}
          {error ? <p className="admin-news__error">{error}</p> : null}
        </form>

        <div className="admin-news__list" aria-live="polite">
          {news.length === 0 ? (
            <p>ยังไม่มีข่าวในระบบ</p>
          ) : (
            <ul>
              {news.map((item) => (
                <li key={item.id}>
                  <header>
                    <div>
                      <span className="admin-news__badge">{item.isFeatured ? 'แสดงบนสไลด์' : 'ข่าวทั่วไป'}</span>
                      <span className="admin-news__order">ลำดับสไลด์ {item.displayOrder}</span>
                    </div>
                    <time>{new Date(item.publishedAt).toLocaleString('th-TH')}</time>
                  </header>
                  <h4>{item.title}</h4>
                  <p>{item.summary}</p>
                  <div className="admin-news__list-actions">
                    <button type="button" onClick={() => handleEdit(item)} disabled={loading}>
                      แก้ไข
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(item.id)} disabled={loading}>
                      ลบ
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <style>{`
        .admin-news {
          display: grid;
          gap: 1.5rem;
        }
        .admin-news__status {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }
        .admin-news__layout {
          display: grid;
          gap: 2rem;
          grid-template-columns: minmax(280px, 1fr) minmax(0, 1.4fr);
        }
        .admin-news__form {
          display: grid;
          gap: 1rem;
          background: var(--color-surface-alt);
          border-radius: 16px;
          padding: 1.75rem;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }
        .admin-news__form h3 {
          margin: 0;
        }
        .admin-news__form label {
          display: grid;
          gap: 0.5rem;
          font-weight: 500;
        }
        .admin-news__form input,
        .admin-news__form textarea {
          border-radius: 10px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          padding: 0.7rem 0.9rem;
          font-size: 0.95rem;
        }
        .admin-news__grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          align-items: end;
        }
        .admin-news__featured {
          display: flex !important;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }
        .admin-news__actions {
          display: flex;
          gap: 0.75rem;
        }
        .admin-news__actions button {
          border-radius: 10px;
          padding: 0.75rem 1.25rem;
          border: none;
          cursor: pointer;
        }
        .admin-news__actions .primary {
          background: var(--color-primary);
          color: #ffffff;
        }
        .admin-news__actions .secondary {
          background: rgba(15, 23, 42, 0.08);
        }
        .admin-news__feedback {
          color: var(--color-primary);
          margin: 0;
        }
        .admin-news__error {
          color: #ef4444;
          margin: 0;
        }
        .admin-news__list ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1rem;
        }
        .admin-news__list li {
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 16px;
          padding: 1.5rem;
          background: white;
          display: grid;
          gap: 0.6rem;
        }
        .admin-news__list header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          font-size: 0.9rem;
          color: var(--color-text-muted);
        }
        .admin-news__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.2rem 0.6rem;
          border-radius: 999px;
          background: rgba(29, 78, 216, 0.12);
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .admin-news__order {
          margin-left: 0.75rem;
          font-size: 0.85rem;
        }
        .admin-news__list-actions {
          display: flex;
          gap: 0.75rem;
        }
        .admin-news__list-actions button {
          border-radius: 10px;
          border: none;
          padding: 0.6rem 1rem;
          cursor: pointer;
          background: rgba(15, 23, 42, 0.08);
        }
        .admin-news__list-actions .danger {
          background: #ef4444;
          color: #ffffff;
        }
        @media (max-width: 1024px) {
          .admin-news__layout {
            grid-template-columns: 1fr;
          }
          .admin-news__form {
            order: 2;
          }
          .admin-news__list {
            order: 1;
          }
        }
      `}</style>
    </div>
  )
}

