import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
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

type NavItem = {
  to: string
  key: string
  exact?: boolean
  children?: Array<{
    to: string
    key: string
  }>
}

const navItems: NavItem[] = [
  { to: '/', key: 'nav.home', exact: true },
  {
    to: '/about',
    key: 'nav.about',
    children: [
      { to: '/about/leadership', key: 'nav.about.leadership' },
      { to: '/about/history', key: 'nav.about.history' },
      { to: '/about/vision-mission-values', key: 'nav.about.visionMissionValues' }
    ]
  },
  {
    to: '/ethics',
    key: 'nav.ethics',
    children: [
      { to: '/ethics/club', key: 'nav.ethics.club' },
      { to: '/ethics/anti-stigma', key: 'nav.ethics.antiStigma' },
      { to: '/ethics/laws-acts', key: 'nav.ethics.lawsActs' }
    ]
  },
  {
    to: '/academic/publications',
    key: 'nav.academic',
    children: [
      { to: '/academic/publications', key: 'nav.academic.publications' }
    ]
  },
  {
    to: '/programs/health-rider',
    key: 'nav.programs',
    children: [
      { to: '/programs/health-rider', key: 'nav.programs.healthRider' },
      { to: '/services/online', key: 'nav.services.online' },
      { to: '/transparency/procurement-ita', key: 'nav.transparency.procurementIta' }
    ]
  },
  {
    to: '/forms/medical-record-request',
    key: 'nav.forms',
    children: [
      { to: '/forms/medical-record-request', key: 'nav.forms.medicalRecordRequest' },
      { to: '/forms/donation', key: 'nav.forms.donation' },
      { to: '/forms/satisfaction', key: 'nav.forms.satisfaction' }
    ]
  },
  {
    to: '/intranet/document-center',
    key: 'nav.intranet',
    children: [
      { to: '/intranet/fuel-reimbursement', key: 'nav.intranet.fuelReimbursement' },
      { to: '/intranet/document-center', key: 'nav.intranet.documentCenter' }
    ]
  },
  { to: '/appointment', key: 'nav.appointment' },
  { to: '/doctors', key: 'nav.doctors' },
  { to: '/news', key: 'nav.news' },
  { to: '/contact', key: 'nav.contact' }
]

export const Navbar: React.FC<NavbarProps> = ({ onIncreaseFont, onDecreaseFont, isHighContrast, onToggleContrast }) => {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null)
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const closeDropdownTimeoutRef = useRef<number | null>(null)

  const handleToggleMenu = () => setOpen((prev) => !prev)
  const handleLinkClick = () => {
    setOpen(false)
    setOpenDropdownKey(null)
  }

  useEffect(() => {
    if (!open) {
      setOpenDropdownKey(null)
    }
  }, [open])

  useEffect(() => {
    return () => {
      if (closeDropdownTimeoutRef.current !== null) {
        window.clearTimeout(closeDropdownTimeoutRef.current)
        closeDropdownTimeoutRef.current = null
      }
    }
  }, [])

  const clearCloseDropdownTimeout = () => {
    if (closeDropdownTimeoutRef.current !== null) {
      window.clearTimeout(closeDropdownTimeoutRef.current)
      closeDropdownTimeoutRef.current = null
    }
  }

  const scheduleDropdownClose = () => {
    clearCloseDropdownTimeout()
    closeDropdownTimeoutRef.current = window.setTimeout(() => {
      closeDropdownTimeoutRef.current = null
      setOpenDropdownKey(null)
    }, 220)
  }

  const toggleDropdown = (key: string) => {
    clearCloseDropdownTimeout()
    setOpenDropdownKey((current) => (current === key ? null : key))
  }

  const openDropdown = (key: string) => {
    clearCloseDropdownTimeout()
    setOpenDropdownKey(key)
  }

  const closeDropdown = () => {
    clearCloseDropdownTimeout()
    setOpenDropdownKey(null)
  }

  const handleGroupMouseEnter = (key: string) => {
    openDropdown(key)
  }

  const handleGroupMouseLeave = () => {
    scheduleDropdownClose()
  }

  const handleGroupFocus = (key: string) => {
    openDropdown(key)
  }

  const handleGroupBlur = (event: React.FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget as Node | null

    if (!next || !event.currentTarget.contains(next)) {
      scheduleDropdownClose()
    }
  }

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
            {navItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0
              const isGroupOpen = hasChildren && openDropdownKey === item.key

              return (
                <li
                  key={item.key}
                  className={hasChildren ? styles.navGroup : undefined}
                  onMouseEnter={hasChildren ? () => handleGroupMouseEnter(item.key) : undefined}
                  onMouseLeave={hasChildren ? handleGroupMouseLeave : undefined}
                  onFocus={hasChildren ? () => handleGroupFocus(item.key) : undefined}
                  onBlur={hasChildren ? handleGroupBlur : undefined}
                >
                  {hasChildren ? (
                    <div className={styles.navGroupHeader}>
                      <NavLink
                        to={item.to}
                        end={item.exact}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `${styles.navLink} ${
                            isActive || (!item.exact && location.pathname.startsWith(item.to) && item.to !== '/')
                              ? styles.activeLink
                              : ''
                          }`.trim()
                        }
                      >
                        {t(item.key)}
                      </NavLink>
                      <button
                        type="button"
                        className={`${styles.dropdownToggle} ${isGroupOpen ? styles.dropdownToggleOpen : ''}`.trim()}
                        aria-expanded={isGroupOpen}
                        aria-haspopup="true"
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()
                          toggleDropdown(item.key)
                        }}
                      >
                        <span className="visually-hidden">เปิดเมนู {t(item.key)}</span>
                        <span aria-hidden="true">▾</span>
                      </button>
                    </div>
                  ) : (
                    <NavLink
                      to={item.to}
                      end={item.exact}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `${styles.navLink} ${
                          isActive || (!item.exact && location.pathname.startsWith(item.to) && item.to !== '/')
                            ? styles.activeLink
                            : ''
                        }`.trim()
                      }
                    >
                      {t(item.key)}
                    </NavLink>
                  )}
                  {hasChildren ? (
                    <ul
                      className={`${styles.navSubList} ${isGroupOpen ? styles.navSubListOpen : ''}`.trim()}
                      onMouseEnter={() => handleGroupMouseEnter(item.key)}
                      onMouseLeave={handleGroupMouseLeave}
                    >
                      {item.children?.map((child) => (
                        <li key={child.key}>
                          <NavLink
                            to={child.to}
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                              `${styles.navSubLink} ${isActive ? styles.navSubLinkActive : ''}`.trim()
                            }
                          >
                            {t(child.key)}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              )
            })}
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
