import React from 'react'
import type { NewsItem } from '../../lib/api'
import { useI18n } from '../../lib/i18n'

interface NewsCardProps {
  news: NewsItem
  onSelect?: (news: NewsItem) => void
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onSelect }) => {
  const { language, t } = useI18n()
  const formattedDate = new Date(news.publishedAt).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="card news-card">
      <img src={`${news.imageUrl}?auto=format&fit=crop&w=600&q=80`} alt={t('news.imageAlt')} loading="lazy" />
      <div className="news-card__body">
        <p className="news-card__date">{t('news.datePrefix')} {formattedDate}</p>
        <h3>{news.title}</h3>
        <p>{news.summary}</p>
        <button type="button" onClick={() => onSelect?.(news)} className="news-card__button">
          {t('news.readMore')}
        </button>
      </div>
    </article>
  )
}
