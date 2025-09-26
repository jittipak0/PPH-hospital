import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PAGES, type PageMeta } from '../pages.config'

const CATEGORY_LABELS: Record<PageMeta['category'], { title: string; description?: string }> = {
  about: { title: 'เกี่ยวกับเรา' },
  academic: { title: 'วิชาการและจริยธรรม' },
  programs: { title: 'โครงการบริการสังคม' },
  legal: { title: 'กฎหมาย/ข้อมูล พ.ร.บ.' },
  procurement: { title: 'จัดซื้อจัดจ้าง/ข่าวสาร ITA' },
  services: { title: 'บริการออนไลน์สำหรับประชาชน' },
  internal: { title: 'ระบบภายในสำหรับบุคลากร', description: 'จำกัดสิทธิ์: ต้องเข้าสู่ระบบจึงจะใช้งานได้' },
  donation: { title: 'การรับบริจาค' },
  feedback: { title: 'แบบประเมินความพึงพอใจ' }
}

const staticLinks = [
  { title: 'หน้าแรก', path: '/' },
  { title: 'บริการออนไลน์', path: '/online-services' },
  { title: 'นโยบายความเป็นส่วนตัว', path: '/privacy-policy' },
  { title: 'ข้อกำหนดการใช้งาน', path: '/terms' },
  { title: 'เข้าสู่ระบบบุคลากร', path: '/login' }
]

export const SitemapPage: React.FC = () => {
  const grouped = useMemo(() => {
    const map = new Map<PageMeta['category'], PageMeta[]>()
    PAGES.forEach((page) => {
      const existing = map.get(page.category) ?? []
      existing.push(page)
      map.set(page.category, existing)
    })

    Array.from(map.values()).forEach((list) => {
      list.sort((a, b) => a.title.localeCompare(b.title, 'th'))
    })

    return map
  }, [])

  return (
    <Container>
      <section className="sitemap">
        <header>
          <h1>แผนผังเว็บไซต์</h1>
          <p>รวมลิงก์ทุกหมวดหมู่ของเว็บไซต์โรงพยาบาล เพื่อให้ง่ายต่อการค้นหาและเข้าถึงข้อมูลสำคัญ</p>
        </header>
        <div className="sitemap__grid">
          <article className="card sitemap__group">
            <h2>หน้าทั่วไป</h2>
            <ul>
              {staticLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </article>
          {Array.from(grouped.entries()).map(([category, pages]) => {
            const meta = CATEGORY_LABELS[category]
            return (
              <article key={category} className="card sitemap__group">
                <h2>{meta?.title ?? category}</h2>
                {meta?.description ? <p className="sitemap__hint">{meta.description}</p> : null}
                <ul>
                  {pages.map((page) => (
                    <li key={page.path}>
                      <Link to={page.path}>
                        {page.title}
                        {page.auth ? <span aria-hidden="true"> 🔒</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
        <p className="sitemap__note">สัญลักษณ์ 🔒 หมายถึงหน้าที่ต้องเข้าสู่ระบบก่อนจึงจะเข้าถึงได้</p>
      </section>
      <style>{`
        .sitemap {
          padding-bottom: 4rem;
        }
        .sitemap__grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .sitemap__group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sitemap__group ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 0.35rem;
        }
        .sitemap__group a {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 600;
        }
        .sitemap__group a:hover {
          text-decoration: underline;
        }
        .sitemap__hint {
          color: var(--color-muted);
          font-size: 0.9rem;
        }
        .sitemap__note {
          margin-top: 2rem;
          color: var(--color-muted);
        }
      `}</style>
    </Container>
  )
}

export default SitemapPage
