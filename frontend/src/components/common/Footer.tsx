import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../layout/Container'
import { useI18n } from '../../lib/i18n'

export const Footer: React.FC = () => {
  const { t } = useI18n()

  return (
    <footer className="site-footer">
      <Container className="site-footer__inner">
        <div>
          <strong>{t('hospital.name')}</strong>
          <p>{t('hospital.tagline')}</p>
        </div>
        <nav aria-label={t('footer.navLabel')}>
          <ul>
            <li>
              <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
                {t('footer.privacy')}
              </a>
            </li>
            <li>
              <a href="https://www.example-hospital.go.th/terms" target="_blank" rel="noopener noreferrer">
                {t('footer.terms')}
              </a>
            </li>
            <li>
              <Link to="/sitemap">{t('footer.sitemap')}</Link>
            </li>
          </ul>
        </nav>
        <div className="site-footer__social">
          <p>{t('footer.follow')}</p>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            📘
          </a>
          <a href="https://line.me" target="_blank" rel="noopener noreferrer" aria-label="Line">
            💬
          </a>
        </div>
      </Container>
      <div className="site-footer__credit">© {new Date().getFullYear()} {t('footer.credit')}</div>
    </footer>
  )
}
