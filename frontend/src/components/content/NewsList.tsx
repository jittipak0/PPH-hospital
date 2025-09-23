import React from 'react'
import type { NewsItem } from '../../lib/api'
import { useI18n } from '../../lib/i18n'
import { NewsCard } from './NewsCard'

interface NewsListProps {
  news: NewsItem[]
  onSelect?: (news: NewsItem) => void
}

export const NewsList: React.FC<NewsListProps> = ({ news, onSelect }) => {
  const { t } = useI18n()

  if (news.length === 0) {
    return <p role="status">{t('home.news.emptyState')}</p>
  }

  return (
    <div className="news-list">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} onSelect={onSelect} />
      ))}
      <style>{`
        .news-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
      `}</style>
    </div>
  )
}
