import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { NewsList } from '../components/content/NewsList'
import { ArticleCard } from '../components/content/ArticleCard'
import { DownloadWebViewButton } from '../components/common/DownloadWebViewButton'
import { api, type Article, type Clinic, type NewsItem } from '../lib/api'

export const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installationResult, setInstallationResult] = useState<'installed' | 'dismissed' | null>(null)
  const [showGuide, setShowGuide] = useState<'ios' | 'android' | null>(null)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')
  const [isStandalone, setIsStandalone] = useState(false)

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

  useEffect(() => {
    if (typeof window === 'undefined') return

    const userAgent = window.navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios')
    } else if (/android/.test(userAgent)) {
      setPlatform('android')
    }

    const standaloneMatcher = window.matchMedia('(display-mode: standalone)')
    const detectStandalone = () => {
      const standalone = standaloneMatcher.matches || window.navigator.standalone === true
      setIsStandalone(standalone)
      if (standalone) {
        setDeferredPrompt(null)
      }
    }

    detectStandalone()

    const handleDisplayModeChange = () => detectStandalone()
    if (standaloneMatcher.addEventListener) {
      standaloneMatcher.addEventListener('change', handleDisplayModeChange)
    } else if (standaloneMatcher.addListener) {
      standaloneMatcher.addListener(handleDisplayModeChange)
    }

    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setInstallationResult(null)
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setInstallationResult('installed')
      setShowGuide(null)
      setIsStandalone(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      if (standaloneMatcher.removeEventListener) {
        standaloneMatcher.removeEventListener('change', handleDisplayModeChange)
      } else if (standaloneMatcher.removeListener) {
        standaloneMatcher.removeListener(handleDisplayModeChange)
      }
    }
  }, [])

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) {
      setShowGuide('android')
      return
    }

    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      if (choice.outcome === 'accepted') {
        setInstallationResult('installed')
      } else {
        setInstallationResult('dismissed')
        setShowGuide('android')
      }
    } catch (error) {
      console.error('Unable to show install prompt', error)
      setInstallationResult('dismissed')
      setShowGuide('android')
    }
  }

  const handleIosInstall = () => {
    setShowGuide('ios')
  }

  const closeGuide = () => {
    setShowGuide(null)
  }

  const showAndroidHint = platform === 'android' && !isStandalone && deferredPrompt === null

  const iosInstructions = [
    'เปิดเว็บไซต์ด้วย Safari เพื่อให้สามารถเพิ่มลงหน้าจอหลักได้',
    'แตะปุ่ม Share (ไอคอนสี่เหลี่ยมพร้อมลูกศรขึ้น)',
    'เลือก “Add to Home Screen / เพิ่มไปยังหน้าจอโฮม”',
    'ตั้งชื่อแอปตามต้องการแล้วกด Add'
  ]

  const androidInstructions = [
    'เปิดเว็บไซต์ด้วย Google Chrome บนอุปกรณ์ Android',
    'แตะเมนูจุดสามจุดมุมขวาบน',
    'เลือก “Add to Home screen / เพิ่มลงหน้าจอหลัก”',
    'ยืนยันโดยแตะ Add แอปจะถูกติดตั้งเป็น WebView'
  ]

  return (
    <div className="home-page">
      <section className="hero">
        <Container>
          <div className="hero__content">
            <h1>โรงพยาบาลโพนพิสัย ยืนหยัดเพื่อการดูแลสุขภาพของทุกคน</h1>
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
              <DownloadWebViewButton className="hero-download-button" />
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

      <PageSection
        id="download"
        title="ติดตั้งเวอร์ชันมือถือ"
        description="ใช้งานเว็บไซต์ในรูปแบบ WebView เสมือนแอปสำหรับ Android และ iOS"
      >
        <div className="download-section">
          <article className="card download-card">
            <h3>Android</h3>
            <p>ติดตั้งเว็บแอปผ่าน Chrome เพื่อใช้งานแบบหน้าต่างเต็มจอ พร้อมเข้าสู่ระบบได้รวดเร็ว</p>
            <button type="button" className="btn btn-primary" onClick={handleAndroidInstall}>
              ติดตั้ง WebView บน Android
            </button>
            {installationResult === 'installed' && (
              <p className="download-card__status" role="status">
                ติดตั้งเรียบร้อยแล้ว สามารถเปิดได้จากหน้าจอหลัก
              </p>
            )}
            {installationResult === 'dismissed' && (
              <p className="download-card__status" role="status">
                หากยังไม่เห็นปุ่ม ให้ทำตามขั้นตอนคู่มือด้านขวา
              </p>
            )}
            {showAndroidHint && (
              <p className="download-card__hint">
                เปิดเว็บไซต์ผ่าน Google Chrome แล้วรีเฟรชหน้าเพื่อให้ปุ่มติดตั้งปรากฏ
              </p>
            )}
          </article>
          <article className="card download-card">
            <h3>iOS</h3>
            <p>เพิ่มเว็บแอปลงหน้าจอหลักผ่าน Safari เพื่อใช้งานเหมือนแอปพลิเคชัน</p>
            <button type="button" className="btn btn-secondary" onClick={handleIosInstall}>
              ดูขั้นตอนสำหรับ iOS
            </button>
            {platform === 'ios' && !isStandalone && (
              <p className="download-card__hint">
                ใช้ Safari เพื่อเพิ่มแอปลงหน้าจอหลักและใช้งานแบบเต็มหน้าจอ
              </p>
            )}
            {isStandalone && platform === 'ios' && (
              <p className="download-card__status" role="status">
                คุณกำลังใช้งานในโหมดติดตั้งแล้ว ขอบคุณค่ะ
              </p>
            )}
          </article>
        </div>
      </PageSection>

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
                title="แผนที่โรงพยาบาลโพนพิสัย"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792975200286!2d100.493088375097!3d13.745570897166702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298d02c5d4b53%3A0xdbc3cfc9ad1bc105!2sMinistry%20of%20Public%20Health!5e0!3m2!1sth!2sth!4v1717470000000!5m2!1sth!2sth"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </section>
      {showGuide && (
        <div className="install-guide" role="dialog" aria-modal="true" aria-labelledby="install-guide-title">
          <div className="install-guide__content">
            <h3 id="install-guide-title">
              {showGuide === 'ios' ? 'ขั้นตอนติดตั้งบน iOS' : 'ขั้นตอนติดตั้งบน Android'}
            </h3>
            <ol>
              {(showGuide === 'ios' ? iosInstructions : androidInstructions).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <button type="button" className="btn btn-secondary" onClick={closeGuide}>
              ปิดคู่มือ
            </button>
          </div>
        </div>
      )}
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
        .hero-download-button {
          padding: 0.75rem 1.5rem;
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
        .download-section {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .download-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .download-card__status {
          margin: 0;
          font-weight: 600;
          color: var(--color-primary);
        }
        .download-card__hint {
          margin: 0;
          color: #495057;
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
        .install-guide {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 1000;
        }
        .install-guide__content {
          background: #fff;
          border-radius: var(--radius-md);
          max-width: min(460px, 100%);
          width: 100%;
          padding: 2rem;
          box-shadow: var(--shadow-md);
        }
        .install-guide__content ol {
          padding-left: 1.25rem;
        }
        .install-guide__content li + li {
          margin-top: 0.5rem;
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
