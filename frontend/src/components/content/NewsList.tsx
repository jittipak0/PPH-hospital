import React from 'react'
import type { NewsItem } from '../../lib/api'
import { NewsCard } from './NewsCard'

interface NewsListProps {
  news: NewsItem[]
  onSelect?: (news: NewsItem) => void
}

export const NewsList: React.FC<NewsListProps> = ({ news, onSelect }) => {
  if (news.length === 0) {
    return <p role="status">ยังไม่มีข่าวประชาสัมพันธ์</p>
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
