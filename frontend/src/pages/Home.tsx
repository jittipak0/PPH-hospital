import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { NewsList } from '../components/content/NewsList'
import { ArticleCard } from '../components/content/ArticleCard'
import { DownloadWebViewButton } from '../components/common/DownloadWebViewButton'
import type { NewsItem } from '../lib/api'
import { useArticlesQuery, useClinicsQuery, useNewsQuery } from '../hooks/useHomeContent'
import type { BeforeInstallPromptEvent } from '../types/pwa'
import doctorImg from '../assets/image/doctors.png'
import styles from './Home.module.scss'

export const Home: React.FC = () => {
  const {
    data: newsData,
    isLoading: isNewsLoading,
    isFetching: isNewsFetching,
    isPending: isNewsPending
  } = useNewsQuery()
  const { data: articleData } = useArticlesQuery()
  const { data: clinicData } = useClinicsQuery()

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installationResult, setInstallationResult] = useState<'installed' | 'dismissed' | null>(null)
  const [showGuide, setShowGuide] = useState<'ios' | 'android' | null>(null)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')
  const [isStandalone, setIsStandalone] = useState(false)

  const news = useMemo(() => (newsData ?? []).slice(0, 4), [newsData])
  const articles = useMemo(() => articleData ?? [], [articleData])
  const clinics = useMemo(() => clinicData ?? [], [clinicData])

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
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <Container className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>โรงพยาบาลชุมชนก้าวสู่อนาคต</span>
            <h1 className={styles.heroTitle}>โรงพยาบาลโพนพิสัย ยืนหยัดเพื่อการดูแลสุขภาพของทุกคน</h1>
            <p className={styles.heroDescription}>
              เราให้บริการการรักษาครบวงจร ทีมแพทย์ผู้เชี่ยวชาญ และเทคโนโลยีทันสมัย เพื่อให้คนไทยทุกวัยได้รับการดูแลที่ดีที่สุด
            </p>
            <div className={styles.heroActions}>
              <Link to="/appointment" className="btn btn-primary" aria-label="จองคิวแพทย์ออนไลน์">
                จองคิวแพทย์ออนไลน์
              </Link>
              <Link to="/news" className="btn btn-secondary" aria-label="อ่านข่าวสารโรงพยาบาล">
                ข่าวสารล่าสุด
              </Link>
              <DownloadWebViewButton className={styles.heroDownloadButton} />
            </div>
            <div className={styles.heroStats} role="presentation">
              <div className={styles.heroStatCard}>
                <strong className={styles.heroStatValue}>24/7</strong>
                <span className={styles.heroStatLabel}>ศูนย์ฉุกเฉินพร้อมดูแล</span>
              </div>
              <div className={styles.heroStatCard}>
                <strong className={styles.heroStatValue}>120+</strong>
                <span className={styles.heroStatLabel}>ทีมแพทย์และพยาบาลผู้เชี่ยวชาญ</span>
              </div>
              <div className={styles.heroStatCard}>
                <strong className={styles.heroStatValue}>4.9</strong>
                <span className={styles.heroStatLabel}>คะแนนความพึงพอใจจากผู้รับบริการ</span>
              </div>
            </div>
          </div>
          <div className={styles.heroFigure} aria-hidden="true">
            <div className={styles.heroFigureGlow} />
            <img
              className={styles.heroImage}
              src={doctorImg}
              alt="ทีมแพทย์"
            />
          </div>
        </Container>
      </section>

      <PageSection
        id="download"
        title="ติดตั้งเวอร์ชันมือถือ"
        description="ใช้งานเว็บไซต์ในรูปแบบ WebView เสมือนแอปสำหรับ Android และ iOS"
        background="muted"
      >
        <div className={styles.downloadSection}>
          <article className={`card ${styles.downloadCard}`}>
            <h3>Android</h3>
            <p>ติดตั้งเว็บแอปผ่าน Chrome เพื่อใช้งานแบบหน้าต่างเต็มจอ พร้อมเข้าสู่ระบบได้รวดเร็ว</p>
            <button type="button" className="btn btn-primary" onClick={handleAndroidInstall}>
              ติดตั้ง WebView บน Android
            </button>
            {installationResult === 'installed' ? (
              <p className={styles.downloadStatus} role="status">
                ติดตั้งเรียบร้อยแล้ว สามารถเปิดได้จากหน้าจอหลัก
              </p>
            ) : null}
            {installationResult === 'dismissed' ? (
              <p className={styles.downloadStatus} role="status">
                หากยังไม่เห็นปุ่ม ให้ทำตามขั้นตอนคู่มือด้านขวา
              </p>
            ) : null}
            {showAndroidHint ? (
              <p className={styles.downloadHint}>
                เปิดเว็บไซต์ผ่าน Google Chrome แล้วรีเฟรชหน้าเพื่อให้ปุ่มติดตั้งปรากฏ
              </p>
            ) : null}
          </article>
          <article className={`card ${styles.downloadCard}`}>
            <h3>iOS</h3>
            <p>เพิ่มเว็บแอปลงหน้าจอหลักผ่าน Safari เพื่อใช้งานเหมือนแอปพลิเคชัน</p>
            <button type="button" className="btn btn-secondary" onClick={handleIosInstall}>
              ดูขั้นตอนสำหรับ iOS
            </button>
            {platform === 'ios' && !isStandalone ? (
              <p className={styles.downloadHint}>
                ใช้ Safari เพื่อเพิ่มแอปลงหน้าจอหลักและใช้งานแบบเต็มหน้าจอ
              </p>
            ) : null}
            {isStandalone && platform === 'ios' ? (
              <p className={styles.downloadStatus} role="status">
                คุณกำลังใช้งานในโหมดติดตั้งแล้ว ขอบคุณค่ะ
              </p>
            ) : null}
          </article>
        </div>
      </PageSection>

      <PageSection
        id="quick-actions"
        title="บริการยอดนิยม"
        description="เข้าถึงบริการสำคัญของโรงพยาบาลได้ง่ายในคลิกเดียว"
        background="muted"
      >
        <Grid columns={3}>
          <article className={`card ${styles.quickCard}`}>
            <span className={styles.quickCardIcon} aria-hidden="true">🩺</span>
            <h3 className={styles.quickCardTitle}>นัดหมายแพทย์ออนไลน์</h3>
            <p className={styles.quickCardText}>นัดหมายแพทย์ล่วงหน้า ลดเวลารอคิว พร้อมระบบแจ้งเตือนอัตโนมัติ</p>
            <Link to="/appointment" className="btn btn-primary" aria-label="เปิดหน้าฟอร์มนัดหมายแพทย์">
              เริ่มนัดหมาย
            </Link>
          </article>
          <article className={`card ${styles.quickCard}`}>
            <span className={styles.quickCardIcon} aria-hidden="true">👩‍⚕️</span>
            <h3 className={styles.quickCardTitle}>ค้นหาแพทย์และตารางออกตรวจ</h3>
            <p className={styles.quickCardText}>ค้นหาชื่อแพทย์หรือเลือกตามแผนก พร้อมข้อมูลตารางออกตรวจในและนอกเวลาราชการ</p>
            <Link to="/doctors" className="btn btn-primary" aria-label="เปิดหน้าค้นหาแพทย์">
              ค้นหาแพทย์
            </Link>
          </article>
          <article className={`card ${styles.quickCard}`}>
            <span className={styles.quickCardIcon} aria-hidden="true">🛡️</span>
            <h3 className={styles.quickCardTitle}>ข้อมูลบริการผู้ป่วย</h3>
            <p className={styles.quickCardText}>ดูขั้นตอนการเข้ารับบริการ โปรแกรมตรวจสุขภาพ และสิทธิการรักษาที่รองรับ</p>
            <Link to="/services" className="btn btn-primary" aria-label="เปิดหน้าบริการผู้ป่วย">
              อ่านรายละเอียด
            </Link>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="news" title="ข่าวประชาสัมพันธ์" description="ประกาศสำคัญและกิจกรรมล่าสุดของโรงพยาบาล">
        {isNewsLoading || isNewsPending || (isNewsFetching && news.length === 0) ? (
          <p role="status">กำลังโหลดข่าว...</p>
        ) : (
          <NewsList news={news} onSelect={setSelectedNews} />
        )}
        {selectedNews ? (
          <div className={styles.newsDetail} role="dialog" aria-label="รายละเอียดข่าว" aria-modal="false">
            <h3>{selectedNews.title}</h3>
            <p>{selectedNews.content}</p>
            <button type="button" onClick={() => setSelectedNews(null)} className="btn btn-secondary">
              ปิดหน้าต่าง
            </button>
          </div>
        ) : null}
      </PageSection>

      <PageSection
        id="clinics"
        title="คลินิกเฉพาะทาง"
        description="คลินิกที่ให้บริการด้วยทีมแพทย์ผู้เชี่ยวชาญ"
        background="muted"
      >
        <Grid columns={clinics.length > 0 ? clinics.length : 3}>
          {clinics.map((clinic) => (
            <article className={`card ${styles.clinicCard}`} key={clinic.id}>
              <h3 className={styles.clinicCardTitle}>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p>
                <strong>เวลาทำการ:</strong> {clinic.operatingHours}
              </p>
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

      <section className={styles.mapSection} aria-labelledby="map-heading">
        <Container>
          <div className={styles.mapGrid}>
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
            <div>
              <iframe
                className={styles.mapFrame}
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
      {showGuide ? (
        <div className={styles.installGuide} role="dialog" aria-modal="true" aria-labelledby="install-guide-title">
          <div className={styles.installGuideContent}>
            <h3 id="install-guide-title">{showGuide === 'ios' ? 'ขั้นตอนติดตั้งบน iOS' : 'ขั้นตอนติดตั้งบน Android'}</h3>
            <ol className={styles.installGuideList}>
              {(showGuide === 'ios' ? iosInstructions : androidInstructions).map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            <button type="button" className="btn btn-secondary" onClick={closeGuide}>
              ปิดคู่มือ
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
