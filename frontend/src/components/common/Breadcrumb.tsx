import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import styles from './Breadcrumb.module.scss'

const breadcrumbKeyMap: Record<string, string> = {
  '/': 'nav.home',
  '/about': 'breadcrumb.about',
  '/about/leadership': 'nav.about.leadership',
  '/about/history': 'nav.about.history',
  '/about/vision-mission-values': 'nav.about.visionMissionValues',
  '/services': 'breadcrumb.services',
  '/services/online': 'nav.services.online',
  '/appointment': 'nav.appointment',
  '/doctors': 'nav.doctors',
  '/news': 'nav.news',
  '/contact': 'nav.contact',
  '/sitemap': 'breadcrumb.sitemap',
  '/ethics': 'breadcrumb.ethics',
  '/ethics/club': 'nav.ethics.club',
  '/ethics/anti-stigma': 'nav.ethics.antiStigma',
  '/ethics/laws-acts': 'nav.ethics.lawsActs',
  '/academic': 'breadcrumb.academic',
  '/academic/publications': 'nav.academic.publications',
  '/programs': 'breadcrumb.programs',
  '/programs/health-rider': 'nav.programs.healthRider',
  '/transparency': 'breadcrumb.transparency',
  '/transparency/procurement-ita': 'nav.transparency.procurementIta',
  '/forms': 'breadcrumb.forms',
  '/forms/medical-record-request': 'nav.forms.medicalRecordRequest',
  '/forms/donation': 'nav.forms.donation',
  '/forms/satisfaction': 'nav.forms.satisfaction',
  '/intranet': 'breadcrumb.intranet',
  '/intranet/fuel-reimbursement': 'nav.intranet.fuelReimbursement',
  '/intranet/document-center': 'nav.intranet.documentCenter'
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const { t } = useI18n()
  const path = location.pathname

  if (path === '/') return null

  const crumbs = path
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => {
      const url = `/${array.slice(0, index + 1).join('/')}`
      return {
        url,
        label: breadcrumbKeyMap[url] ? t(breadcrumbKeyMap[url]) : segment.replace(/-/g, ' ')
      }
    })

  return (
    <nav aria-label="breadcrumb" className={styles.breadcrumb}>
      <ol className={styles.list}>
        <li className={styles.listItem}>
          <Link to="/" className={styles.link}>
            {t('nav.home')}
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li
            key={crumb.url}
            className={`${styles.listItem} ${crumb.url === path ? styles.current : ''}`.trim()}
            aria-current={crumb.url === path ? 'page' : undefined}
          >
            {crumb.url === path ? crumb.label : (
              <Link to={crumb.url} className={styles.link}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
