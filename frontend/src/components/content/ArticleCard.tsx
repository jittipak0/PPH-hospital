import React from 'react'
import type { Article } from '../../lib/api'

interface ArticleCardProps {
  article: Article
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <article className="card article-card">
      <img src={`${article.imageUrl}?auto=format&fit=crop&w=600&q=80`} alt="ภาพประกอบบทความ" loading="lazy" />
      <div className="article-card__body">
        <h3>{article.title}</h3>
        <p>{article.summary}</p>
      </div>
      <style>{`
        .article-card {
          overflow: hidden;
          padding: 0;
        }
        .article-card img {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .article-card__body {
          padding: 1.25rem;
        }
        .article-card h3 {
          margin-top: 0;
          color: var(--color-primary);
        }
      `}</style>
    </article>
  )
}
