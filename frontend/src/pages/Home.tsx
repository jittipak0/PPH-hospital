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
  const { t, language } = useI18n()
  const [news, setNews] = useState<NewsItem[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [newsItems, articleItems, clinicItems] = await Promise.all([
        api.fetchNews(language),
        api.fetchArticles(language),
        api.fetchClinics(language)
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
  }, [language])

  return (
    <div className="home-page">
      <section className="hero">
        <Container className="hero__inner">
          <div className="hero__content">
            <span className="badge">{t('home.hero.badge')}</span>
            <h1>{t('home.hero.title')}</h1>
            <p>{t('home.hero.subtitle')}</p>
            <div className="hero__actions">
              <Link to="/appointment" className="btn btn-primary" aria-label={t('actions.bookAppointment')}>
                {t('home.hero.primaryAction')}
              </Link>
              <Link to="/news" className="btn btn-secondary" aria-label={t('nav.news')}>
                {t('home.hero.secondaryAction')}
              </Link>
            </div>
          </div>
          <div className="hero__figure" aria-hidden="true">
            <img
              src="https://images.unsplash.com/photo-1580281657521-6c3fd1e72054?auto=format&fit=crop&w=800&q=80"
              alt={t('home.hero.imageAlt')}
              loading="lazy"
            />
          </div>
        </Container>
      </section>

      <PageSection id="quick-actions" title={t('home.quick.title')} description={t('home.quick.description')}>
        <Grid columns={3}>
          <article className="card quick-card">
            <h3>{t('home.quick.appointment.title')}</h3>
            <p>{t('home.quick.appointment.body')}</p>
            <Link to="/appointment" className="btn btn-primary" aria-label={t('home.quick.appointment.cta')}>
              {t('home.quick.appointment.cta')}
            </Link>
          </article>
          <article className="card quick-card">
            <h3>{t('home.quick.doctors.title')}</h3>
            <p>{t('home.quick.doctors.body')}</p>
            <Link to="/doctors" className="btn btn-primary" aria-label={t('home.quick.doctors.cta')}>
              {t('home.quick.doctors.cta')}
            </Link>
          </article>
          <article className="card quick-card">
            <h3>{t('home.quick.services.title')}</h3>
            <p>{t('home.quick.services.body')}</p>
            <Link to="/services" className="btn btn-primary" aria-label={t('home.quick.services.cta')}>
              {t('home.quick.services.cta')}
            </Link>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="news" title={t('home.news.title')} description={t('home.news.description')}>
        <NewsList news={news} onSelect={setSelectedNews} />
        {selectedNews && (
          <div className="news-detail" role="dialog" aria-label={t('news.modal.aria')} aria-modal="false">
            <h3>{selectedNews.title}</h3>
            <p>{selectedNews.content}</p>
            <button type="button" onClick={() => setSelectedNews(null)} className="btn btn-secondary">
              {t('home.news.dialogClose')}
            </button>
          </div>
        )}
      </PageSection>

      <PageSection id="clinics" title={t('home.clinics.title')} description={t('home.clinics.description')}>
        <Grid columns={clinics.length > 0 ? Math.min(clinics.length, 3) : 3}>
          {clinics.map((clinic) => (
            <article className="card clinic-card" key={clinic.id}>
              <h3>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p>
                <strong>{t('doctors.scheduleLabel')}:</strong> {clinic.operatingHours}
              </p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="articles" title={t('home.articles.title')} description={t('home.articles.description')}>
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
              <h2 id="map-heading">{t('home.map.title')}</h2>
              <p>{t('home.map.address')}</p>
              <ul className="map-section__list">
                <li>{t('home.map.car')}</li>
                <li>{t('home.map.public')}</li>
              </ul>
              <a href="https://www.example-hospital.go.th/files/hospital-map.pdf" className="btn btn-secondary">
                {t('home.map.download')}
              </a>
            </div>
            <div className="map-section__frame">
              <iframe
                title={t('home.map.title')}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792975200286!2d100.493088375097!3d13.745570897166702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298d02c5d4b53%3A0xdbc3cfc9ad1bc105!2sMinistry%20of%20Public%20Health!5e0!3m2!1sth!2sth!4v1717470000000!5m2!1sth!2sth"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
