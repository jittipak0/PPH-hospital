import React, { useEffect, useState } from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { NewsList } from '../components/content/NewsList'
import { PageMeta } from '../components/seo/PageMeta'
import { api, type NewsItem } from '../lib/api'

export const News: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const items = await api.fetchNews()
      if (!cancelled) {
        setNews(items)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageMeta
        title="ข่าวสารและกิจกรรม | โรงพยาบาลโพนพิสัย"
        description="อัปเดตข่าวประกาศ กิจกรรม และสาระสุขภาพจากโรงพยาบาลโพนพิสัย"
        openGraph={{
          title: 'ข่าวสารโรงพยาบาลโพนพิสัย',
          description: 'ติดตามข่าวกิจกรรม การอบรม และสาระสุขภาพล่าสุดจากโรงพยาบาลโพนพิสัย',
          type: 'article'
        }}
      />
      <Container>
        <header>
          <h1>ข่าวสารและกิจกรรม</h1>
          <p>ติดตามข่าวประกาศ การอบรม กิจกรรมชุมชน และสาระสุขภาพจากทีมแพทย์ของโรงพยาบาล</p>
        </header>
      </Container>
      <PageSection id="news-list" title="ข่าวล่าสุด">
        <NewsList news={news} onSelect={setActiveNews} />
        {activeNews && (
          <article className="card news-modal" role="dialog" aria-modal="true" aria-label="รายละเอียดข่าว">
            <button type="button" onClick={() => setActiveNews(null)} className="news-modal__close" aria-label="ปิดหน้าต่าง">✕</button>
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
