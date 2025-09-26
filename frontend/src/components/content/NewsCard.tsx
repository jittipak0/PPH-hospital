import React from 'react'
import type { NewsItem } from '../../lib/api'
import styles from './NewsCard.module.scss'

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
    <article className={'card ' + styles.newsCard}>
      <img
        className={styles.thumbnail}
        src={news.imageUrl + '?auto=format&fit=crop&w=600&q=80'}
        alt="ภาพประกอบข่าว"
        loading="lazy"
      />
      <div className={styles.body}>
        <p className={styles.date}>เผยแพร่ {formattedDate}</p>
        <h3>{news.title}</h3>
        <p>{news.summary}</p>
        <button type="button" onClick={() => onSelect?.(news)} className={'btn btn-secondary ' + styles.button}>
          อ่านรายละเอียด
        </button>
      </div>
    </article>
  )
}
