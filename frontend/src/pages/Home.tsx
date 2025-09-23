import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { NewsList } from '../components/content/NewsList'
import { ArticleCard } from '../components/content/ArticleCard'
import { api, type Article, type Clinic, type NewsItem } from '../lib/api'
import { useI18n } from '../lib/i18n'

export const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const { t } = useI18n()

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
            <h1>{t('home.hero.title')}</h1>
            <p>{t('home.hero.description')}</p>
            <div className="hero__actions">
              <Link to="/appointment" className="btn btn-primary" aria-label={t('home.hero.primaryAriaLabel')}>
                {t('home.hero.primaryCta')}
              </Link>
              <Link to="/news" className="btn btn-secondary" aria-label={t('home.hero.secondaryAriaLabel')}>
                {t('home.hero.secondaryCta')}
              </Link>
            </div>
          </div>
          <div className="hero__figure" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1580281657521-6c3fd1e72054?auto=format&fit=crop&w=800&q=80"
              alt={t('home.hero.imageAlt')}
            />
          </div>
        </Container>
      </section>

      <PageSection
        id="quick-actions"
        title={t('home.quickActions.title')}
        description={t('home.quickActions.description')}
      >
        <Grid columns={3}>
          <article className="card quick-card">
            <h3>{t('home.quickActions.items.appointment.title')}</h3>
            <p>{t('home.quickActions.items.appointment.description')}</p>
            <Link
              to="/appointment"
              className="btn btn-primary"
              aria-label={t('home.quickActions.items.appointment.ariaLabel')}
            >
              {t('home.quickActions.items.appointment.cta')}
            </Link>
          </article>
          <article className="card quick-card">
            <h3>{t('home.quickActions.items.doctors.title')}</h3>
            <p>{t('home.quickActions.items.doctors.description')}</p>
            <Link
              to="/doctors"
              className="btn btn-primary"
              aria-label={t('home.quickActions.items.doctors.ariaLabel')}
            >
              {t('home.quickActions.items.doctors.cta')}
            </Link>
          </article>
          <article className="card quick-card">
            <h3>{t('home.quickActions.items.services.title')}</h3>
            <p>{t('home.quickActions.items.services.description')}</p>
            <Link
              to="/services"
              className="btn btn-primary"
              aria-label={t('home.quickActions.items.services.ariaLabel')}
            >
              {t('home.quickActions.items.services.cta')}
            </Link>
          </article>
        </Grid>
      </PageSection>

      <PageSection
        id="news"
        title={t('home.news.title')}
        description={t('home.news.description')}
      >
        <NewsList news={news} onSelect={setSelectedNews} />
        {selectedNews && (
          <div className="news-detail" role="dialog" aria-label={t('home.news.detailAriaLabel')} aria-modal="false">
            <h3>{selectedNews.title}</h3>
            <p>{selectedNews.content}</p>
            <button type="button" onClick={() => setSelectedNews(null)} className="btn btn-secondary">
              {t('home.news.closeDetail')}
            </button>
          </div>
        )}
      </PageSection>

      <PageSection
        id="clinics"
        title={t('home.clinics.title')}
        description={t('home.clinics.description')}
      >
        <Grid columns={clinics.length > 0 ? clinics.length : 3}>
          {clinics.map((clinic) => (
            <article className="card clinic-card" key={clinic.id}>
              <h3>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p>
                <strong>{t('common.operatingHours')}</strong> {clinic.operatingHours}
              </p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        id="articles"
        title={t('home.articles.title')}
        description={t('home.articles.description')}
      >
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
              <h2 id="map-heading">{t('home.map.heading')}</h2>
              <p>{t('home.map.address')}</p>
              <ul>
                <li>
                  <strong>{t('home.map.privateCarTitle')}</strong> {t('home.map.privateCarDescription')}
                </li>
                <li>
                  <strong>{t('home.map.publicTransitTitle')}</strong> {t('home.map.publicTransitDescription')}
                </li>
              </ul>
              <a href="https://www.example-hospital.go.th/files/hospital-map.pdf" className="btn btn-secondary">
                {t('home.map.downloadMap')}
              </a>
            </div>
            <div className="map-section__frame">
              <iframe
                title={t('home.map.iframeTitle')}
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
