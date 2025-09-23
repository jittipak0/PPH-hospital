import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { Container } from '../layout/Container'

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
      <Container className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={handleLinkClick}>
          <span className="navbar__brand-main">{t('hospital.name')}</span>
          <span className="navbar__brand-tagline">{t('brand.tagline')}</span>
        </Link>
        <button
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={handleToggleMenu}
          aria-label={t('navbar.menuToggleLabel')}
        >
          <span className="visually-hidden">{t('navbar.menuToggleLabel')}</span>
          ☰
        </button>
        <nav id="main-navigation" className={`navbar__nav ${open ? 'is-open' : ''}`} aria-label={t('navbar.mainNavLabel')}>
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.to}
                  onClick={handleLinkClick}
                  className={({ isActive }) => (isActive ? 'is-active' : '')}
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="navbar__actions">
            <LanguageSwitcher />
            <ThemeToggle
              onIncreaseFont={onIncreaseFont}
              onDecreaseFont={onDecreaseFont}
              isHighContrast={isHighContrast}
              onToggleContrast={onToggleContrast}
            />
          </div>
        </nav>
      </Container>
    </header>
  )
}
