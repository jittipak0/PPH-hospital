import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PAGES } from '../../pages.config'

const fallbackLabels: Record<string, string> = {
  forms: 'แบบฟอร์มออนไลน์',
  feedback: 'แบบประเมิน',
  internal: 'สำหรับบุคลากร',
  donation: 'การรับบริจาค',
  online: 'บริการออนไลน์'
}

const pageMap = new Map(PAGES.map((page) => [page.path, page.title]))

export const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const path = location.pathname

  if (path === '/') {
    return null
  }

  const segments = path.split('/').filter(Boolean)
  const crumbs = segments.map((segment, index) => {
    const url = `/${segments.slice(0, index + 1).join('/')}`
    const label = pageMap.get(url) ?? fallbackLabels[segment] ?? segment
    return { url, label }
  })

  return (
    <nav aria-label="breadcrumb" className="breadcrumb">
      <ol>
        <li>
          <Link to="/">หน้าแรก</Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.url} aria-current={crumb.url === path ? 'page' : undefined}>
            {crumb.url === path ? (
              <span>{crumb.label}</span>
            ) : (
              <Link to={crumb.url}>{crumb.label}</Link>
            )}
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
        .breadcrumb span {
          font-weight: 600;
        }
      `}</style>
    </nav>
  )
}
