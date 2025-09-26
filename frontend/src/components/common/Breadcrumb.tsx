import React, { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { siteSections } from '../../config/siteMap'

const staticBreadcrumbs: Record<string, string> = {
  '/': 'หน้าแรก',
  '/appointment': 'นัดหมายแพทย์',
  '/doctors': 'ค้นหาแพทย์',
  '/news': 'ข่าวสาร/กิจกรรม',
  '/contact': 'ติดต่อเรา',
  '/privacy-policy': 'นโยบายความเป็นส่วนตัว',
  '/terms': 'เงื่อนไขการใช้งาน'
}

export const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const { t } = useI18n()
  const path = location.pathname

  const labelMap = useMemo(() => {
    const map = new Map<string, string>()
    Object.entries(staticBreadcrumbs).forEach(([key, value]) => map.set(key, value))
    siteSections.forEach((section) => {
      map.set(section.path, section.label)
      section.children?.forEach((child) => {
        map.set(child.path, child.label)
      })
    })
    return map
  }, [])

  if (path === '/') return null

  const crumbs = path
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => {
      const url = `/${array.slice(0, index + 1).join('/')}`
      return {
        url,
        label: labelMap.get(url) ?? segment
      }
    })

  return (
    <nav aria-label="breadcrumb" className="breadcrumb">
      <ol>
        <li>
          <Link to="/">{t('nav.home')}</Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.url} aria-current={crumb.url === path ? 'page' : undefined}>
            {crumb.url === path ? crumb.label : <Link to={crumb.url}>{crumb.label}</Link>}
          </li>
        ))}
      </ol>
      <style>{`
        .breadcrumb {
          background: rgba(13, 110, 253, 0.08);
          padding: 0.75rem 1rem;
          border-radius: 999px;
          width: fit-content;
          margin: 1rem 0 2rem;
        }
        .breadcrumb ol {
          list-style: none;
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin: 0;
          padding: 0;
          font-size: 0.95rem;
        }
        .breadcrumb li::after {
          content: '›';
          margin: 0 0.25rem;
        }
        .breadcrumb li:last-child::after {
          content: '';
        }
        .breadcrumb a {
          text-decoration: none;
          color: var(--color-primary);
          font-weight: 600;
        }
      `}</style>
    </nav>
  )
}
