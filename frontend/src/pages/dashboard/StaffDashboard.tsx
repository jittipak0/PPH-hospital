import React, { useEffect, useState } from 'react'
import { secureApi } from '../../lib/secureApi'
import { useAuth } from '../../context/AuthContext'

type InternalNews = {
  id: string
  title: string
  content: string
  publishedAt: string
}

export const StaffDashboard: React.FC = () => {
  const { accessToken } = useAuth()
  const [news, setNews] = useState<InternalNews[]>([])

  useEffect(() => {
    const load = async () => {
      if (!accessToken) return
      const response = await secureApi.fetchStaffNews(accessToken)
      setNews(response.news)
    }
    load()
  }, [accessToken])

  return (
    <div className="staff-dashboard">
      <h2>ข่าวสารภายในองค์กร</h2>
      <div className="staff-dashboard__grid">
        {news.map((item) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            <time>{new Date(item.publishedAt).toLocaleString('th-TH')}</time>
            <p>{item.content}</p>
          </article>
        ))}
      </div>
      <style>{`
        .staff-dashboard {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow-md);
        }
        .staff-dashboard__grid {
          display: grid;
          gap: 1.5rem;
        }
        article {
          padding: 1.5rem;
          border-radius: 14px;
          background: var(--color-surface-alt);
        }
        time {
          display: block;
          color: var(--color-text-muted);
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  )
}
