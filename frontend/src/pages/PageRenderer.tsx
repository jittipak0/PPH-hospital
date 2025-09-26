import React, { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { useLocation } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PAGES } from '../pages.config'

interface PageDetail {
  title: string
  content_html: string
  updated_at: string | null
}

export const PageRenderer: React.FC = () => {
  const location = useLocation()
  const pageMeta = PAGES.find((page) => page.path === location.pathname)
  const [state, setState] = useState<{ loading: boolean; error: string | null; data: PageDetail | null }>({
    loading: true,
    error: null,
    data: null
  })

  useEffect(() => {
    let isMounted = true

    if (!pageMeta) {
      setState({ loading: false, error: 'ไม่พบหน้าที่ต้องการ', data: null })
      return () => {
        isMounted = false
      }
    }

    setState({ loading: true, error: null, data: null })

    const controller = new AbortController()

    fetch(`/api/pages/${pageMeta.slug}`, {
      credentials: 'include',
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('ไม่สามารถโหลดข้อมูลได้')
        }

        const payload = (await response.json()) as { data: PageDetail }
        if (isMounted) {
          setState({ loading: false, error: null, data: payload.data })
        }
      })
      .catch((error: Error) => {
        if (!isMounted) return
        setState({ loading: false, error: error.message, data: null })
      })

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [pageMeta])

  if (!pageMeta) {
    return (
      <Container>
        <article className="page-renderer">
          <h1>ไม่พบหน้าเนื้อหา</h1>
          <p>กรุณาตรวจสอบลิงก์อีกครั้งหรือกลับไปยังหน้าแรก</p>
        </article>
      </Container>
    )
  }

  if (state.loading) {
    return (
      <Container>
        <div className="page-renderer__state" role="status">
          <span className="spinner" aria-hidden="true" />
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </Container>
    )
  }

  if (state.error || !state.data) {
    return (
      <Container>
        <article className="page-renderer">
          <h1>{pageMeta.title}</h1>
          <p role="alert">{state.error ?? 'เกิดข้อผิดพลาดในการโหลดข้อมูล'}</p>
        </article>
      </Container>
    )
  }

  const sanitizedHtml = DOMPurify.sanitize(state.data.content_html, { USE_PROFILES: { html: true } })

  return (
    <Container>
      <article className="page-renderer">
        <header>
          <h1>{state.data.title}</h1>
          {state.data.updated_at ? (
            <p className="page-renderer__meta">อัปเดตล่าสุด: {new Date(state.data.updated_at).toLocaleDateString('th-TH')}</p>
          ) : null}
        </header>
        <div className="page-renderer__content" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
      </article>
      <style>{`
        .page-renderer {
          padding: 2rem 0 4rem;
        }
        .page-renderer__meta {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-top: 0.5rem;
        }
        .page-renderer__content {
          margin-top: 1.5rem;
          line-height: 1.8;
        }
        .page-renderer__content h2 {
          margin-top: 2rem;
          font-size: 1.5rem;
        }
        .page-renderer__content ul {
          padding-left: 1.25rem;
          margin: 0.75rem 0;
        }
        .page-renderer__state {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 4rem 0;
        }
        .spinner {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 999px;
          border: 3px solid rgba(15, 118, 110, 0.2);
          border-top-color: var(--color-primary);
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Container>
  )
}

export default PageRenderer
