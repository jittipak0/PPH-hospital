import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { DownloadWebViewButton } from './DownloadWebViewButton'
import { useAuth } from '../../context/AuthContext'
import { siteSections } from '../../config/siteMap'

interface NavbarProps {
  onIncreaseFont: () => void
  onDecreaseFont: () => void
  isHighContrast: boolean
  onToggleContrast: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onIncreaseFont, onDecreaseFont, isHighContrast, onToggleContrast }) => {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()

  const handleToggleMenu = () => setOpen((prev) => !prev)
  const handleLinkClick = () => setOpen(false)
  const translateLabel = (label: string, key?: string) => (key ? t(key) : label)

  const staticNavItems = [
    { to: '/appointment', label: t('nav.appointment') },
    { to: '/doctors', label: t('nav.doctors') },
    { to: '/news', label: t('nav.news') },
    { to: '/contact', label: t('nav.contact') }
  ]

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={handleLinkClick}>
          โรงพยาบาลโพนพิสัย
        </Link>
        <button className="navbar__toggle" aria-expanded={open} aria-controls="main-navigation" onClick={handleToggleMenu}>
          <span className="visually-hidden">เปิด/ปิดเมนู</span>
          ☰
        </button>
        <nav id="main-navigation" className={`navbar__nav ${open ? 'is-open' : ''}`} aria-label="เมนูหลัก">
          <ul>
            <li>
              <NavLink to="/" onClick={handleLinkClick}>
                {t('nav.home')}
              </NavLink>
            </li>
            {siteSections.map((section) => (
              <li key={section.id} className={`navbar__item ${section.children ? 'navbar__item--has-children' : ''}`}>
                <NavLink to={section.path} onClick={handleLinkClick} aria-haspopup={section.children ? 'true' : undefined}>
                  {translateLabel(section.label, section.labelKey)}
                </NavLink>
                {section.children ? (
                  <ul className="navbar__submenu" aria-label={translateLabel(section.label, section.labelKey)}>
                    {section.children.map((child) => (
                      <li key={child.path}>
                        <NavLink to={child.path} onClick={handleLinkClick}>
                          {translateLabel(child.label, child.labelKey)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            {staticNavItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} onClick={handleLinkClick}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            {isAuthenticated ? (
              <li key="dashboard">
                <NavLink to="/dashboard" onClick={handleLinkClick}>
                  แดชบอร์ด ({user?.role})
                </NavLink>
              </li>
            ) : (
              <li key="login">
                <NavLink to="/login" onClick={handleLinkClick}>
                  เข้าสู่ระบบบุคลากร
                </NavLink>
              </li>
            )}
            <li key="privacy">
              <NavLink to="/privacy-policy" onClick={handleLinkClick}>
                นโยบายความเป็นส่วนตัว
              </NavLink>
            </li>
          </ul>
          <div className="navbar__actions">
            {isAuthenticated ? (
              <button className="navbar__logout" onClick={logout}>
                ออกจากระบบ
              </button>
            ) : null}
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
        .navbar__nav ul {
          display: flex;
          list-style: none;
          gap: 1.25rem;
          margin: 0;
          padding: 0;
        }
        .navbar__nav a {
          text-decoration: none;
          color: var(--color-text);
          font-weight: 600;
          position: relative;
        }
        .navbar__nav a.active {
          color: var(--color-primary);
        }
        .navbar__item {
          position: relative;
        }
        .navbar__submenu {
          position: absolute;
          left: 0;
          top: calc(100% + 0.5rem);
          background: var(--color-surface);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          list-style: none;
          padding: 0.75rem 1rem;
          min-width: 240px;
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          z-index: 60;
        }
        .navbar__submenu a {
          color: var(--color-text);
          font-weight: 500;
        }
        .navbar__item--has-children:hover .navbar__submenu,
        .navbar__item--has-children:focus-within .navbar__submenu {
          display: flex;
        }
        .navbar__actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .navbar__download {
          padding: 0.5rem 1.1rem;
          font-size: 0.95rem;
        }
        .navbar__download .download-webview-button__icon {
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
            gap: 1rem;
            border-bottom: 1px solid rgba(15, 23, 42, 0.08);
            transform: translateY(-120%);
            transition: transform 0.3s ease;
            width: 100%;
          }
          .navbar__nav.is-open {
            transform: translateY(0);
          }
          .navbar__nav ul {
            flex-direction: column;
            width: 100%;
            gap: 1rem;
          }
          .navbar__item--has-children {
            width: 100%;
          }
          .navbar__submenu {
            position: static;
            display: flex;
            box-shadow: none;
            background: rgba(15, 23, 42, 0.04);
            border-radius: 12px;
            padding: 0.75rem 1rem;
            gap: 0.35rem;
          }
          .navbar__actions {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 1rem;
          }
          .navbar__download {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </header>
  )
}
