import React from 'react'
import type { NewsItem } from '../../lib/api'
import { NewsCard } from './NewsCard'
import { useI18n } from '../../lib/i18n'

interface NewsListProps {
  news: NewsItem[]
  onSelect?: (news: NewsItem) => void
}

export const NewsList: React.FC<NewsListProps> = ({ news, onSelect }) => {
  const { t } = useI18n()
  if (news.length === 0) {
    return <p role="status">{t('news.empty')}</p>
  }

  return (
    <div className="news-list">
      {news.map((item) => (
        <NewsCard key={item.id} news={item} onSelect={onSelect} />
      ))}
    </div>
  )
}
