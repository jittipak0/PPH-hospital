import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { DownloadWebViewButton } from './DownloadWebViewButton'

interface NavbarProps {
  onIncreaseFont: () => void
  onDecreaseFont: () => void
  isHighContrast: boolean
  onToggleContrast: () => void
}

const navItems = [
  { to: '/', key: 'nav.home' },
  { to: '/about', key: 'nav.about' },
  { to: '/services', key: 'nav.services' },
  { to: '/appointment', key: 'nav.appointment' },
  { to: '/doctors', key: 'nav.doctors' },
  { to: '/news', key: 'nav.news' },
  { to: '/contact', key: 'nav.contact' }
]

export const Navbar: React.FC<NavbarProps> = ({ onIncreaseFont, onDecreaseFont, isHighContrast, onToggleContrast }) => {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  const handleToggleMenu = () => setOpen((prev) => !prev)
  const handleLinkClick = () => setOpen(false)

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={handleLinkClick}>
          โรงพยาบาลประชารัฐ
        </Link>
        <button
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={handleToggleMenu}
        >
          <span className="visually-hidden">เปิด/ปิดเมนู</span>
          ☰
        </button>
        <nav id="main-navigation" className={`navbar__nav ${open ? 'is-open' : ''}`} aria-label="เมนูหลัก">
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <NavLink to={item.to} onClick={handleLinkClick}>
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="navbar__actions">
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
        }
        .navbar__nav a.active {
          color: var(--color-primary);
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
          }
          .navbar__nav.is-open {
            transform: translateY(0);
          }
          .navbar__nav ul {
            flex-direction: column;
            width: 100%;
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
