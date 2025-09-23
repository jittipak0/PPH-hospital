import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { NewsList } from '../components/content/NewsList'
import { ArticleCard } from '../components/content/ArticleCard'
import { api, type Article, type Clinic, type NewsItem } from '../lib/api'

export const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [newsItems, articleItems, clinicItems] = await Promise.all([
        api.fetchNews(),
        api.fetchArticles(),
        api.fetchClinics()
      ])
      if (!cancelled) {
        setNews(newsItems.slice(0, 4))
        setArticles(articleItems)
        setClinics(clinicItems)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home-page">
      <section className="hero">
        <Container>
          <div className="hero__content">
            <h1>โรงพยาบาลประชารัฐ ยืนหยัดเพื่อการดูแลสุขภาพของทุกคน</h1>
            <p>
              เราให้บริการการรักษาครบวงจร ทีมแพทย์ผู้เชี่ยวชาญ และเทคโนโลยีทันสมัย เพื่อให้คนไทยทุกวัยได้รับการดูแลที่ดีที่สุด
            </p>
            <div className="hero__actions">
              <Link to="/appointment" className="btn btn-primary" aria-label="จองคิวแพทย์ออนไลน์">
                จองคิวแพทย์ออนไลน์
              </Link>
              <Link to="/news" className="btn btn-secondary" aria-label="อ่านข่าวสารโรงพยาบาล">
                ข่าวสารล่าสุด
              </Link>
            </div>
          </div>
          <div className="hero__figure" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1580281657521-6c3fd1e72054?auto=format&fit=crop&w=800&q=80"
              alt="ทีมแพทย์"
            />
          </div>
        </Container>
      </section>

      <PageSection id="quick-actions" title="บริการยอดนิยม" description="เข้าถึงบริการสำคัญของโรงพยาบาลได้ง่ายในคลิกเดียว">
        <Grid columns={3}>
          <article className="card quick-card">
            <h3>นัดหมายแพทย์ออนไลน์</h3>
            <p>นัดหมายแพทย์ล่วงหน้า ลดเวลารอคิว พร้อมระบบแจ้งเตือนอัตโนมัติ</p>
            <Link to="/appointment" className="btn btn-primary" aria-label="เปิดหน้าฟอร์มนัดหมายแพทย์">
              เริ่มนัดหมาย
            </Link>
          </article>
          <article className="card quick-card">
            <h3>ค้นหาแพทย์และตารางออกตรวจ</h3>
            <p>ค้นหาชื่อแพทย์หรือเลือกตามแผนก พร้อมข้อมูลตารางออกตรวจในและนอกเวลาราชการ</p>
            <Link to="/doctors" className="btn btn-primary" aria-label="เปิดหน้าค้นหาแพทย์">
              ค้นหาแพทย์
            </Link>
          </article>
          <article className="card quick-card">
            <h3>ข้อมูลบริการผู้ป่วย</h3>
            <p>ดูขั้นตอนการเข้ารับบริการ โปรแกรมตรวจสุขภาพ และสิทธิการรักษาที่รองรับ</p>
            <Link to="/services" className="btn btn-primary" aria-label="เปิดหน้าบริการผู้ป่วย">
              อ่านรายละเอียด
            </Link>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="news" title="ข่าวประชาสัมพันธ์" description="ประกาศสำคัญและกิจกรรมล่าสุดของโรงพยาบาล">
        <NewsList news={news} onSelect={setSelectedNews} />
        {selectedNews && (
          <div className="news-detail" role="dialog" aria-label="รายละเอียดข่าว" aria-modal="false">
            <h3>{selectedNews.title}</h3>
            <p>{selectedNews.content}</p>
            <button type="button" onClick={() => setSelectedNews(null)} className="btn btn-secondary">
              ปิดหน้าต่าง
            </button>
          </div>
        )}
      </PageSection>

      <PageSection id="clinics" title="คลินิกเฉพาะทาง" description="คลินิกที่ให้บริการด้วยทีมแพทย์ผู้เชี่ยวชาญ">
        <Grid columns={clinics.length > 0 ? clinics.length : 3}>
          {clinics.map((clinic) => (
            <article className="card clinic-card" key={clinic.id}>
              <h3>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p><strong>เวลาทำการ:</strong> {clinic.operatingHours}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="articles" title="บทความสุขภาพ" description="สาระความรู้เพื่อการดูแลสุขภาพสำหรับประชาชน">
        <Grid columns={articles.length > 0 ? Math.min(articles.length, 3) : 3}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Grid>
      </PageSection>

      <section className="map-section" aria-labelledby="map-heading">
        <Container>
          <div className="map-section__grid">
            <div>
              <h2 id="map-heading">การเดินทางมายังโรงพยาบาล</h2>
              <p>ที่ตั้ง: 123 ถนนสุขภาพดี แขวงประชาธิปไตย เขตเมืองหลวง กรุงเทพมหานคร 10200</p>
              <ul>
                <li>
                  <strong>รถยนต์ส่วนตัว:</strong> สามารถจอดได้ที่อาคารจอดรถฝั่งทิศเหนือ มีทางเชื่อมเข้าตึกผู้ป่วยนอกโดยตรง
                </li>
                <li>
                  <strong>ขนส่งสาธารณะ:</strong> ลงรถไฟฟ้าสายสีเขียวสถานีสุขภาพ ออกทางออก 2 ต่อรถเมล์สาย 15 หรือรถสองแถวสีเขียว
                </li>
              </ul>
              <a href="https://www.example-hospital.go.th/files/hospital-map.pdf" className="btn btn-secondary">
                ดาวน์โหลดแผนที่ภายในโรงพยาบาล (PDF)
              </a>
            </div>
            <div className="map-section__frame">
              <iframe
                title="แผนที่โรงพยาบาลประชารัฐ"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792975200286!2d100.493088375097!3d13.745570897166702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298d02c5d4b53%3A0xdbc3cfc9ad1bc105!2sMinistry%20of%20Public%20Health!5e0!3m2!1sth!2sth!4v1717470000000!5m2!1sth!2sth"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </section>
      <style>{`
        .hero {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(32, 201, 151, 0.15));
          padding: 3rem 0;
        }
        .hero__content {
          max-width: 560px;
        }
        .hero__content h1 {
          font-size: clamp(2rem, 4vw, 2.6rem);
          margin-bottom: 1rem;
        }
        .hero__content p {
          font-size: 1.1rem;
        }
        .hero__actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero__figure img {
          border-radius: 24px;
          width: min(380px, 100%);
          box-shadow: var(--shadow-sm);
        }
        .hero .container-shell {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-weight: 700;
          text-decoration: none;
        }
        .btn-primary {
          background: var(--color-primary);
          color: #fff;
        }
        .btn-secondary {
          background: rgba(13, 110, 253, 0.12);
          color: var(--color-primary);
        }
        .quick-card h3 {
          margin-top: 0;
        }
        .news-detail {
          margin-top: 1.5rem;
          padding: 1.5rem;
          border-radius: var(--radius-md);
          background: rgba(32, 201, 151, 0.12);
        }
        .clinic-card h3 {
          color: var(--color-primary);
        }
        .map-section {
          background: rgba(32, 201, 151, 0.12);
          padding: 3rem 0;
        }
        .map-section__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          align-items: center;
        }
        .map-section__frame iframe {
          width: 100%;
          min-height: 320px;
          border: 0;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }
        @media (max-width: 960px) {
          .hero .container-shell {
            flex-direction: column;
          }
          .hero__figure img {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
