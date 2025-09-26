import React from 'react'
import type { Article } from '../../lib/api'
import styles from './ArticleCard.module.scss'

interface ArticleCardProps {
  article: Article
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className={`card ${styles.articleCard}`}>
      <img
        className={styles.image}
        src={`${article.imageUrl}?auto=format&fit=crop&w=600&q=80`}
        alt="ภาพประกอบบทความ"
        loading="lazy"
      />
      <div className={styles.body}>
        <h3>{article.title}</h3>
        <p className={styles.summary}>{article.summary}</p>
        <button type="button" className="btn btn-secondary" aria-label={`อ่านบทความ ${article.title}`}>
          อ่านบทความเต็ม
        </button>
      </div>
    </article>
  )
}
