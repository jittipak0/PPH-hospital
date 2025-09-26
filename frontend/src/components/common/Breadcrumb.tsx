import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import styles from './Breadcrumb.module.scss'

const breadcrumbMap: Record<string, string> = {
  '/': 'หน้าแรก',
  '/about': 'เกี่ยวกับเรา',
  '/services': 'บริการผู้ป่วย',
  '/appointment': 'นัดหมายแพทย์',
  '/doctors': 'ค้นหาแพทย์',
  '/news': 'ข่าวสาร/กิจกรรม',
  '/contact': 'ติดต่อเรา'
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
