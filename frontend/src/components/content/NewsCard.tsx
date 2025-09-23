import React from 'react'
import type { NewsItem } from '../../lib/api'

interface NewsCardProps {
  news: NewsItem
  onSelect?: (news: NewsItem) => void
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onSelect }) => {
  const formattedDate = new Date(news.publishedAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="card news-card">
      <img src={`${news.imageUrl}?auto=format&fit=crop&w=600&q=80`} alt="ภาพประกอบข่าว" loading="lazy" />
      <div className="news-card__body">
        <p className="news-card__date">เผยแพร่ {formattedDate}</p>
        <h3>{news.title}</h3>
        <p>{news.summary}</p>
        <button type="button" onClick={() => onSelect?.(news)} className="news-card__button">
          อ่านรายละเอียด
        </button>
      </div>
      <style>{`
        .news-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 0;
          overflow: hidden;
        }
        .news-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .news-card__body {
          padding: 1.25rem;
        }
        .news-card__date {
          font-size: 0.9rem;
          color: var(--color-muted);
        }
        .news-card__button {
          margin-top: 1rem;
          border: none;
          background: var(--color-primary);
          color: #fff;
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 600;
        }
      `}</style>
    </article>
  )
}
