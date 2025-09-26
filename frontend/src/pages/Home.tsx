import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { NewsList } from '../components/content/NewsList'
import { ArticleCard } from '../components/content/ArticleCard'
import { DownloadWebViewButton } from '../components/common/DownloadWebViewButton'
import { api, type Article, type Clinic, type NewsItem } from '../lib/api'
import type { BeforeInstallPromptEvent } from '../types/pwa'
import { siteSections, importantQuickLinks } from '../config/siteMap'
import { PageMeta } from '../components/common/PageMeta'

const stats = [
  { label: 'ผู้ป่วยนอกต่อปี', value: '420,000+' },
  { label: 'ความพึงพอใจเฉลี่ย', value: '94%' },
  { label: 'โครงการดูแลชุมชน', value: '36 โครงการ' }
]

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
  const [showNotice, setShowNotice] = useState(true)

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

  const quickStartLinks = useMemo(
    () => [
      { title: 'นัดหมายแพทย์ออนไลน์', description: 'จองคิวล่วงหน้ากับแพทย์ผู้เชี่ยวชาญ', to: '/appointment' },
      { title: 'ขอประวัติการรักษา', description: 'ยื่นคำขอเอกสารสำคัญเพื่อใช้ต่อยอดการรักษา', to: '/forms/medical-record-request' },
      { title: 'Health Rider', description: 'รับยาและคำแนะนำถึงบ้านสำหรับผู้ป่วยเรื้อรัง', to: '/programs/health-rider' }
    ],
    []
  )

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

  const showAndroidHint = platform === 'android' && !isStandalone && deferredPrompt === null

  return (
    <div className="home-page">
      <PageMeta
        title="โรงพยาบาลโพนพิสัย – การดูแลคุณภาพด้วยหัวใจและเทคโนโลยี"
        description="โรงพยาบาลโพนพิสัยให้บริการรักษาพยาบาลครบวงจร พร้อมบริการออนไลน์ โครงการ Health Rider และการดูแลเชิงรุกเพื่อชุมชน"
        url="https://www.pph-hospital.local/"
      />
      {showNotice ? (
        <div className="home-notice" role="alert">
          <Container className="home-notice__inner">
            <p>
              ประชาชนสามารถรับบริการวัคซีนไข้หวัดใหญ่ฟรีสำหรับกลุ่มเสี่ยง ตั้งแต่วันนี้ถึง 30 กันยายน 2567 ที่คลินิกเวชปฏิบัติทั่วไป ชั้น 2
            </p>
            <button type="button" onClick={() => setShowNotice(false)} aria-label="ปิดประกาศ" className="home-notice__close">
              ×
            </button>
          </Container>
        </div>
      ) : null}

      <section className="hero">
        <Container className="hero__inner">
          <div className="hero__content">
            <h1>ดูแลด้วยหัวใจ เชื่อมโยงด้วยเทคโนโลยี</h1>
            <p>
              โรงพยาบาลโพนพิสัยพร้อมดูแลสุขภาพของทุกคนด้วยทีมแพทย์สหสาขา โครงการเชิงรุก และบริการออนไลน์ที่เข้าถึงง่าย
            </p>
            <div className="hero__actions">
              <Link to="/appointment" className="btn btn-primary">
                นัดหมายแพทย์
              </Link>
              <Link to="/services/online" className="btn btn-secondary">
                บริการออนไลน์
              </Link>
            </div>
          </div>
          <div className="hero__figure" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1580281657521-6c3fd1e72054?auto=format&fit=crop&w=900&q=80"
              alt="ทีมแพทย์กำลังให้คำปรึกษา"
            />
          </div>
        </Container>
      </section>

      <PageSection id="categories" title="หมวดหมู่สำคัญ">
        <Grid columns={3}>
          {siteSections.slice(0, 6).map((section) => (
            <article className="card category-card" key={section.id}>
              <h3>{section.label}</h3>
              <p>{section.description}</p>
              <Link className="btn btn-outline" to={section.path}>
                เข้าสู่หมวดนี้
              </Link>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="quick-links" title="ลัดสู่บริการยอดนิยม" background="muted">
        <Grid columns={3}>
          {importantQuickLinks.map((link) => (
            <article className="card quick-link" key={link.path}>
              <h3>{link.label}</h3>
              <p>{link.description ?? 'เริ่มใช้งานบริการดิจิทัลของโรงพยาบาลได้ภายในไม่กี่ขั้นตอน'}</p>
              <Link className="btn btn-primary" to={link.path}>
                {link.ctaLabel ?? 'เปิดบริการ'}
              </Link>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="news" title="ข่าวและประกาศล่าสุด">
        <Grid columns={2}>
          <div>
            <NewsList news={news} onSelect={setSelectedNews} selected={selectedNews?.id ?? null} />
          </div>
          <div>
            {selectedNews ? (
              <article className="card news-detail">
                <h3>{selectedNews.title}</h3>
                <p>{selectedNews.summary}</p>
                <Link to="/news" className="btn btn-outline">
                  อ่านทั้งหมด
                </Link>
              </article>
            ) : (
              <p>เลือกข่าวจากรายการเพื่ออ่านรายละเอียด</p>
            )}
          </div>
        </Grid>
      </PageSection>

      <PageSection id="stats" title="ตัวเลขที่คุณเชื่อมั่น" background="muted">
        <Grid columns={3}>
          {stats.map((item) => (
            <article className="card stat-card" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="quick-start" title="เริ่มต้นใช้งานเร็ว" description="บริการยอดนิยมที่พร้อมดูแลคุณทันที">
        <Grid columns={3}>
          {quickStartLinks.map((item) => (
            <article className="card quick-start" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link className="btn btn-outline" to={item.to}>
                ไปยังบริการ
              </Link>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="clinics" title="คลินิกเฉพาะทาง" description="บริการสำหรับผู้ป่วยเฉพาะทางที่เปิดให้บริการทุกสัปดาห์">
        <Grid columns={clinics.length > 0 ? Math.min(clinics.length, 3) : 3}>
          {clinics.map((clinic) => (
            <article key={clinic.id} className="card">
              <h3>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p>
                <strong>เวลาทำการ:</strong> {clinic.operatingHours}
              </p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="articles" title="บทความแนะนำ" background="muted">
        <Grid columns={articles.length > 0 ? Math.min(articles.length, 3) : 2}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Grid>
      </PageSection>

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
            <p>เพิ่มเว็บไซต์ลงหน้าจอโฮมเพื่อเข้าถึงบริการได้รวดเร็ว พร้อมแจ้งเตือนจาก Notification</p>
            <button type="button" className="btn btn-secondary" onClick={handleIosInstall}>
              ดูขั้นตอนบน iOS
            </button>
          </article>
          <article className="card download-card">
            <h3>ติดตั้งผ่านไฟล์</h3>
            <p>สำหรับบุคลากรที่ใช้อุปกรณ์ Android ขององค์กร สามารถดาวน์โหลด WebView ที่ตั้งค่าไว้แล้ว</p>
            <DownloadWebViewButton className="btn btn-outline" />
          </article>
        </div>
        {showGuide ? (
          <div className="guide" role="dialog" aria-modal="true">
            <div className="guide__content">
              <h3>ขั้นตอนสำหรับ {showGuide === 'ios' ? 'iOS' : 'Android'}</h3>
              <ol>
                {(showGuide === 'ios' ? iosInstructions : androidInstructions).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <button type="button" className="btn btn-secondary" onClick={() => setShowGuide(null)}>
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : null}
      </PageSection>
      <style>{`
        .home-notice {
          background: #fde68a;
          color: #92400e;
        }
        .home-notice__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.75rem 0;
        }
        .home-notice__close {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
        }
        .hero {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(59, 130, 246, 0.05));
          padding: 4rem 0;
        }
        .hero__inner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2.5rem;
          align-items: center;
        }
        .hero__content h1 {
          font-size: clamp(2.2rem, 4vw, 2.8rem);
          margin-bottom: 1rem;
        }
        .hero__content p {
          font-size: 1.1rem;
          color: var(--color-muted);
        }
        .hero__actions {
          margin-top: 1.75rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero__figure img {
          width: 100%;
          border-radius: 24px;
          object-fit: cover;
          box-shadow: var(--shadow-lg);
        }
        .category-card,
        .quick-link,
        .quick-start,
        .stat-card {
          min-height: 200px;
        }
        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        .stat-card strong {
          font-size: 2rem;
          color: var(--color-primary);
        }
        .stat-card span {
          color: var(--color-muted);
        }
        .news-detail {
          min-height: 260px;
        }
        .download-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .download-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .download-card__status {
          color: #047857;
          font-weight: 600;
        }
        .download-card__hint {
          color: var(--color-muted);
          font-size: 0.9rem;
        }
        .guide {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: grid;
          place-items: center;
          padding: 1.5rem;
        }
        .guide__content {
          background: #fff;
          border-radius: 16px;
          padding: 2rem;
          max-width: 420px;
          width: 100%;
          display: grid;
          gap: 1rem;
        }
        .guide__content ol {
          margin: 0;
          padding-left: 1.25rem;
          display: grid;
          gap: 0.5rem;
        }
        @media (max-width: 768px) {
          .hero {
            padding: 3rem 0;
          }
          .hero__actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  )
}

export default Home
