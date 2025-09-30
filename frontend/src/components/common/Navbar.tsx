import React, { useEffect, useState } from 'react'
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

  const handleToggleMenu = () => setOpen((prev) => !prev)

  const handleCloseMenu = () => {
    setOpen(false)
    setOpenDropdownKey(null)
  }

  const handleLinkClick = () => {
    handleCloseMenu()
  }

  useEffect(() => {
    if (!open) {
      setOpenDropdownKey(null)
    }
  }, [open])

  useEffect(() => {
    if (open) {
      document.body.style.setProperty('overflow', 'hidden')
    } else {
      document.body.style.removeProperty('overflow')
    }

    return () => {
      document.body.style.removeProperty('overflow')
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setOpenDropdownKey(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const toggleDropdown = (key: string) => {
    setOpenDropdownKey((current) => (current === key ? null : key))
  }

  const openDropdown = (key: string) => {
    setOpenDropdownKey(key)
  }

  const closeDropdown = () => {
    setOpenDropdownKey(null)
  }

  const handleGroupBlur = (key: string) => (event: React.FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setOpenDropdownKey((current) => (current === key ? null : current))
    }
  }

  const renderActions = (variant: 'desktop' | 'mobile') => (
    <div
      className={`${styles.actions} ${
        variant === 'desktop' ? styles.actionsDesktop : styles.actionsMobile
      }`.trim()}
    >
      {isAuthenticated ? (
        <button className={styles.logoutButton} onClick={logout}>
          ออกจากระบบ
        </button>
      ) : null}
      <DownloadWebViewButton
        className={`${styles.downloadButton} btn btn-secondary`}
      />
      <LanguageSwitcher />
      <ThemeToggle
        onIncreaseFont={onIncreaseFont}
        onDecreaseFont={onDecreaseFont}
        isHighContrast={isHighContrast}
        onToggleContrast={onToggleContrast}
      />
    </div>
  )

  return (
    <header className={styles.navbar}>
      <div className={styles.bar}>
        <Link to="/" className={styles.brand} onClick={handleLinkClick}>
          <span className={styles.brandEmblem} aria-hidden="true">
            PPH
          </span>
          <span className={styles.brandCopy}>
            โรงพยาบาลโพนพิสัย
          </span>
        </Link>
        {renderActions('desktop')}
        <button
          className={`${styles.menuToggle} ${open ? styles.menuToggleOpen : ''}`.trim()}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={handleToggleMenu}
          type="button"
        >
          <span className="visually-hidden">เปิด/ปิดเมนูหลัก</span>
          <span aria-hidden="true" className={styles.menuToggleIcon}>
            <span className={styles.menuToggleBar} />
            <span className={styles.menuToggleBar} />
            <span className={styles.menuToggleBar} />
          </span>
        </button>
      </div>
      <nav
        id="main-navigation"
        className={`${styles.menu} ${open ? styles.menuOpen : ''}`.trim()}
        aria-label="เมนูหลัก"
      >
        <div className={styles.menuContent}>
          <ul className={styles.menuList}>
            {navItems.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0
              const isGroupOpen = hasChildren && openDropdownKey === item.key

              return (
                <li
                  key={item.key}
                  className={hasChildren ? styles.menuGroup : styles.menuItem}
                  onMouseEnter={hasChildren ? () => openDropdown(item.key) : undefined}
                  onMouseLeave={hasChildren ? closeDropdown : undefined}
                  onFocus={hasChildren ? () => openDropdown(item.key) : undefined}
                  onBlur={hasChildren ? handleGroupBlur(item.key) : undefined}
                >
                  {hasChildren ? (
                    <div className={styles.groupHeader}>
                      <NavLink
                        to={item.to}
                        end={item.exact}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `${styles.menuLink} ${
                            isActive || (!item.exact && location.pathname.startsWith(item.to) && item.to !== '/')
                              ? styles.menuLinkActive
                              : ''
                          }`.trim()
                        }
                      >
                        {t(item.key)}
                      </NavLink>
                      <button
                        type="button"
                        className={`${styles.groupToggle} ${isGroupOpen ? styles.groupToggleOpen : ''}`.trim()}
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
                        `${styles.menuLink} ${
                          isActive || (!item.exact && location.pathname.startsWith(item.to) && item.to !== '/')
                            ? styles.menuLinkActive
                            : ''
                        }`.trim()
                      }
                    >
                      {t(item.key)}
                    </NavLink>
                  )}
                  {hasChildren ? (
                    <ul className={`${styles.subList} ${isGroupOpen ? styles.subListOpen : ''}`.trim()}>
                      {item.children?.map((child) => (
                        <li key={child.key}>
                          <NavLink
                            to={child.to}
                            onClick={handleLinkClick}
                            className={({ isActive }) =>
                              `${styles.subLink} ${isActive ? styles.subLinkActive : ''}`.trim()
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
              <li key="dashboard" className={styles.menuItem}>
                <NavLink
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`.trim()
                  }
                >
                  แดชบอร์ด ({user?.role})
                </NavLink>
              </li>
            ) : (
              <li key="login" className={styles.menuItem}>
                <NavLink
                  to="/login"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`.trim()
                  }
                >
                  เข้าสู่ระบบบุคลากร
                </NavLink>
              </li>
            )}
            <li key="privacy" className={styles.menuItem}>
              <NavLink
                to="/privacy-policy"
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`.trim()
                }
              >
                นโยบายความเป็นส่วนตัว
              </NavLink>
            </li>
          </ul>
          {renderActions('mobile')}
        </div>
      </nav>
      <div
        className={`${styles.backdrop} ${open ? styles.backdropVisible : ''}`.trim()}
        onClick={handleCloseMenu}
        aria-hidden="true"
      />
    </header>
  )
}
