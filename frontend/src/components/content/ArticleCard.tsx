import React from 'react'
import type { Article } from '../../lib/api'
import { useI18n } from '../../lib/i18n'

interface ArticleCardProps {
  article: Article
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const { t } = useI18n()
  return (
    <article className="card article-card">
      <img src={`${article.imageUrl}?auto=format&fit=crop&w=600&q=80`} alt={t('articles.imageAlt')} loading="lazy" />
      <div className="article-card__body">
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
      </div>
    </article>
  )
}
