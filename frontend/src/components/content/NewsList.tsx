import React from 'react'
import type { NewsItem } from '../../lib/api'
import { NewsCard } from './NewsCard'
import styles from './NewsList.module.scss'

interface NewsListProps {
  news: NewsItem[]
  onSelect?: (news: NewsItem) => void
}

export const NewsList: React.FC<NewsListProps> = ({ news, onSelect }) => {
  if (news.length === 0) {
    return <p role="status">ยังไม่มีข่าวประชาสัมพันธ์</p>
  }

  return (
    <div className={styles.newsList}>
      {news.map((item) => (
        <NewsCard key={item.id} news={item} onSelect={onSelect} />
      ))}
    </div>
  )
}
