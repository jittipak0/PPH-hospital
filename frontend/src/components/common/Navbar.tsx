import React, { useMemo, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { DownloadWebViewButton } from './DownloadWebViewButton'
import { useAuth } from '../../context/AuthContext'
import { PAGES } from '../../pages.config'

interface NavbarProps {
  onIncreaseFont: () => void
  onDecreaseFont: () => void
  isHighContrast: boolean
  onToggleContrast: () => void
}

type PageCategory = (typeof PAGES)[number]['category']

type MenuGroup = {
  key: string
  label: string
  pages: Array<(typeof PAGES)[number]>
}

const filterPages = (categories: PageCategory[]) => PAGES.filter((page) => categories.includes(page.category))

export const Navbar: React.FC<NavbarProps> = ({ onIncreaseFont, onDecreaseFont, isHighContrast, onToggleContrast }) => {
  const [isMenuOpen, setMenuOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  const groups: MenuGroup[] = useMemo(
    () => [
      { key: 'about', label: 'เกี่ยวกับเรา', pages: filterPages(['about']) },
      { key: 'academic', label: 'วิชาการ/จริยธรรม', pages: filterPages(['academic']) },
      { key: 'programs', label: 'โครงการบริการสังคม', pages: filterPages(['programs']) },
      { key: 'legal', label: 'กฎหมาย/พรบ', pages: filterPages(['legal']) },
      { key: 'procurement', label: 'จัดซื้อ/ITA', pages: filterPages(['procurement']) },
      {
        key: 'services',
        label: 'บริการออนไลน์',
        pages: PAGES.filter((page) => ['services', 'donation', 'feedback'].includes(page.category))
      },
      { key: 'internal', label: 'สำหรับบุคลากร', pages: filterPages(['internal']) }
    ],
    []
  )

  const handleToggleMenu = () => {
    setMenuOpen((prev) => !prev)
    if (isMenuOpen) {
      setExpandedGroup(null)
    }
  }

  const closeMenu = () => {
    setMenuOpen(false)
    setExpandedGroup(null)
  }

  const toggleGroup = (key: string) => {
    setExpandedGroup((prev) => (prev === key ? null : key))
  }

  const isGroupActive = (group: MenuGroup) => group.pages.some((page) => location.pathname.startsWith(page.path))

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          โรงพยาบาลโพนพิสัย
        </Link>
        <button
          className="navbar__toggle"
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation"
          onClick={handleToggleMenu}
        >
          <span className="visually-hidden">สลับเมนู</span>
          ☰
        </button>
        <nav id="main-navigation" className={`navbar__nav ${isMenuOpen ? 'is-open' : ''}`} aria-label="เมนูหลัก">
          <ul className="navbar__list">
            <li>
              <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                หน้าแรก
              </NavLink>
            </li>
            {groups.map((group) => (
              <li key={group.key} className={`navbar__item ${isGroupActive(group) ? 'is-active' : ''}`}>
                <button
                  type="button"
                  className="navbar__group-toggle"
                  aria-expanded={expandedGroup === group.key}
                  onClick={() => toggleGroup(group.key)}
                >
                  {group.label}
                  <span aria-hidden="true">▾</span>
                </button>
                <ul className={`navbar__submenu ${expandedGroup === group.key ? 'is-open' : ''}`}>
                  {group.pages.map((page) => (
                    <li key={page.path}>
                      <Link to={page.path} onClick={closeMenu}>
                        {page.title}
                        {page.auth ? <span className="navbar__lock" aria-hidden="true">🔒</span> : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <div className="navbar__actions">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={closeMenu} className="navbar__link-button">
                  แดชบอร์ด ({user?.role ?? 'staff'})
                </Link>
                <button className="navbar__logout" onClick={logout}>
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="navbar__link-button">
                เข้าสู่ระบบบุคลากร
              </Link>
            )}
            <DownloadWebViewButton className="navbar__download" />
            <LanguageSwitcher />
            <ThemeToggle
              onIncreaseFont={onIncreaseFont}
              onDecreaseFont={onDecreaseFont}
              isHighContrast={isHighContrast}
              onToggleContrast={onToggleContrast}
            />
          </div>
        </nav>
      </div>
      <style>{`
        .navbar {
          background-color: var(--color-surface);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .navbar__inner {
          width: min(1120px, 92vw);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
        }
        .navbar__brand {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--color-primary);
          text-decoration: none;
        }
        .navbar__toggle {
          border: none;
          background: transparent;
          font-size: 1.75rem;
          display: none;
          cursor: pointer;
          color: var(--color-primary);
        }
        .navbar__nav {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .navbar__list {
          display: flex;
          list-style: none;
          gap: 1.25rem;
          margin: 0;
          padding: 0;
        }
        .navbar__item {
          position: relative;
        }
        .navbar__item.is-active > .navbar__group-toggle {
          color: var(--color-primary);
        }
        .navbar__list a {
          text-decoration: none;
          color: var(--color-text);
          font-weight: 600;
        }
        .navbar__list a.is-active {
          color: var(--color-primary);
        }
        .navbar__group-toggle {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: transparent;
          border: none;
          font: inherit;
          font-weight: 600;
          cursor: pointer;
          color: var(--color-text);
          padding: 0;
        }
        .navbar__submenu {
          position: absolute;
          top: calc(100% + 0.75rem);
          left: 0;
          min-width: 220px;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          list-style: none;
          padding: 1rem;
          margin: 0;
          display: none;
          flex-direction: column;
          gap: 0.75rem;
        }
        .navbar__submenu.is-open {
          display: flex;
        }
        .navbar__submenu a {
          color: var(--color-text);
          font-weight: 500;
        }
        .navbar__lock {
          margin-left: 0.25rem;
          font-size: 0.85em;
        }
        .navbar__actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .navbar__link-button {
          text-decoration: none;
          font-weight: 600;
          color: var(--color-primary);
        }
        .navbar__download {
          padding: 0.5rem 1.1rem;
          font-size: 0.95rem;
        }
        .navbar__logout {
          background: #ef4444;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          cursor: pointer;
        }
        @media (min-width: 961px) {
          .navbar__item:hover > .navbar__submenu,
          .navbar__item:focus-within > .navbar__submenu {
            display: flex;
          }
        }
        @media (max-width: 960px) {
          .navbar__toggle {
            display: block;
          }
          .navbar__nav {
            position: absolute;
            inset: 70px 0 auto 0;
            background-color: var(--color-surface);
            flex-direction: column;
            align-items: flex-start;
            padding: 1.5rem;
            gap: 1.5rem;
            border-bottom: 1px solid rgba(15, 23, 42, 0.08);
            transform: translateY(-120%);
            transition: transform 0.3s ease;
          }
          .navbar__nav.is-open {
            transform: translateY(0);
          }
          .navbar__list {
            flex-direction: column;
            width: 100%;
            gap: 1rem;
          }
          .navbar__submenu {
            position: static;
            background: rgba(13, 110, 253, 0.06);
            box-shadow: none;
            border-radius: 10px;
            width: 100%;
            margin-top: 0.75rem;
          }
          .navbar__submenu.is-open {
            display: flex;
          }
          .navbar__actions {
            width: 100%;
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          .navbar__download {
            width: 100%;
            justify-content: center;
          }
          .navbar__logout {
            width: 100%;
          }
        }
      `}</style>
    </header>
  )
}
