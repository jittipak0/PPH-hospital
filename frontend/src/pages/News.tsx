import React, { useEffect, useState } from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { NewsList } from '../components/content/NewsList'
import { api, type NewsItem } from '../lib/api'
import { useI18n } from '../lib/i18n'

export const News: React.FC = () => {
  const { t, language } = useI18n()
  const [news, setNews] = useState<NewsItem[]>([])
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const items = await api.fetchNews(language)
      if (!cancelled) {
        setNews(items)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [language])

  return (
    <div>
      <Container>
        <header>
          <h1>{t('news.title')}</h1>
          <p>{t('news.intro')}</p>
        </header>
      </Container>
      <PageSection id="news-list" title={t('news.section.latest')}>
        <NewsList news={news} onSelect={setActiveNews} />
        {activeNews && (
          <article className="card news-modal" role="dialog" aria-modal="true" aria-label={t('news.modal.aria')}>
            <button type="button" onClick={() => setActiveNews(null)} className="news-modal__close" aria-label={t('news.modal.close')}>
              ✕
            </button>
            <h2>{activeNews.title}</h2>
            <p>{activeNews.content}</p>
          </article>
        )}
      </PageSection>
      <style>{`
        .news-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 520px;
          width: min(520px, 90vw);
          z-index: 80;
        }
        .news-modal__close {
          background: transparent;
          border: none;
          font-size: 1.25rem;
          position: absolute;
          top: 0.75rem;
          right: 1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
