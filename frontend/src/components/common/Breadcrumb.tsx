import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'

const breadcrumbMap: Record<string, string> = {
  '/': 'nav.home',
  '/about': 'nav.about',
  '/services': 'nav.services',
  '/appointment': 'nav.appointment',
  '/doctors': 'nav.doctors',
  '/news': 'nav.news',
  '/contact': 'nav.contact'
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
        label: breadcrumbMap[url] ?? segment
      }
    })

  return (
    <nav aria-label={t('breadcrumb.aria')} className="breadcrumb">
      <ol>
        <li>
          <Link to="/">{t('nav.home')}</Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.url} aria-current={crumb.url === path ? 'page' : undefined}>
            {crumb.url === path ? t(breadcrumbMap[crumb.url] ?? crumb.label) : <Link to={crumb.url}>{t(breadcrumbMap[crumb.url] ?? crumb.label)}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
