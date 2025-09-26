import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { DownloadWebViewButton } from './DownloadWebViewButton'
import { useAuth } from '../../context/AuthContext'
import styles from './Navbar.module.scss'

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
  const { isAuthenticated, user, logout } = useAuth()

  const handleToggleMenu = () => setOpen((prev) => !prev)
  const handleLinkClick = () => setOpen(false)

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} onClick={handleLinkClick}>
          <span className={styles.brandMark} aria-hidden="true">
            PPH
          </span>
          <span className={styles.brandText}>โรงพยาบาลโพนพิสัย</span>
        </Link>
        <button
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={handleToggleMenu}
        >
          <span className="visually-hidden">เปิด/ปิดเมนู</span>
          ☰
        </button>
        <nav
          id="main-navigation"
          className={`${styles.nav} ${open ? styles.navOpen : ''}`.trim()}
          aria-label="เมนูหลัก"
        >
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={item.to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`.trim()
                  }
                >
                  {t(item.key)}
                </NavLink>
              </li>
            ))}
            {isAuthenticated ? (
              <li key="dashboard">
                <NavLink
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`.trim()
                  }
                >
                  แดชบอร์ด ({user?.role})
                </NavLink>
              </li>
            ) : (
              <li key="login">
                <NavLink
                  to="/login"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.activeLink : ''}`.trim()
                  }
                >
                  เข้าสู่ระบบบุคลากร
                </NavLink>
              </li>
            )}
            <li key="privacy">
              <NavLink
                to="/privacy-policy"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.activeLink : ''}`.trim()
                }
              >
                นโยบายความเป็นส่วนตัว
              </NavLink>
            </li>
          </ul>
          <div className={styles.actions}>
            {isAuthenticated ? (
              <button className={styles.logoutButton} onClick={logout}>
                ออกจากระบบ
              </button>
            ) : null}
            <DownloadWebViewButton className={`${styles.downloadButton} btn btn-secondary`} />
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
    </header>
  )
}
