import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../../lib/i18n'
import { LanguageSwitcher } from './LanguageSwitcher'
import { ThemeToggle } from './ThemeToggle'
import { DownloadWebViewButton } from './DownloadWebViewButton'
import { useAuth } from '../../context/AuthContext'
import styles from './Sidebar.module.scss'

interface SidebarProps {
  onIncreaseFont: () => void
  onDecreaseFont: () => void
  isHighContrast: boolean
  onToggleContrast: () => void
}

type NavChild = {
  to: string
  key: string
}

type NavItem = {
  to: string
  key: string
  exact?: boolean
  icon: React.ReactNode
  children?: NavChild[]
}

const icon = (paths: React.ReactNode): React.ReactNode => (
  <svg
    className={styles.icon}
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.6}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {paths}
  </svg>
)

const navItems: NavItem[] = [
  {
    to: '/',
    key: 'nav.home',
    exact: true,
    icon: icon(
      <>
        <path d="M3.5 11 12 4l8.5 7" />
        <path d="M6 10.5v9.5h5v-6h2v6h5v-9.5" />
      </>
    )
  },
  {
    to: '/about',
    key: 'nav.about',
    icon: icon(
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 10v5" />
        <path d="M12 7.5h.01" />
      </>
    ),
    children: [
      { to: '/about/leadership', key: 'nav.about.leadership' },
      { to: '/about/history', key: 'nav.about.history' },
      { to: '/about/vision-mission-values', key: 'nav.about.visionMissionValues' }
    ]
  },
  {
    to: '/ethics',
    key: 'nav.ethics',
    icon: icon(
      <>
        <path d="M12 4.5 5 7v5.6c0 4.6 3.1 6.8 7 7.9 3.9-1.1 7-3.3 7-7.9V7Z" />
        <path d="M9.5 12.5 11 14l3.5-4" />
      </>
    ),
    children: [
      { to: '/ethics/club', key: 'nav.ethics.club' },
      { to: '/ethics/anti-stigma', key: 'nav.ethics.antiStigma' },
      { to: '/ethics/laws-acts', key: 'nav.ethics.lawsActs' }
    ]
  },
  {
    to: '/academic/publications',
    key: 'nav.academic',
    icon: icon(
      <>
        <path d="M5.5 6.5h10.5L18.5 8v9.5H5.5Z" />
        <path d="M8 6.5v-1.5h8.5V8" />
        <path d="M8 10h7" />
      </>
    ),
    children: [{ to: '/academic/publications', key: 'nav.academic.publications' }]
  },
  {
    to: '/programs/health-rider',
    key: 'nav.programs',
    icon: icon(
      <>
        <circle cx="12" cy="8.5" r="2.5" />
        <path d="M6.5 18c.5-3.5 2.8-5.5 5.5-5.5S17 14.5 17.5 18" />
        <path d="M5 12h14" />
      </>
    ),
    children: [
      { to: '/programs/health-rider', key: 'nav.programs.healthRider' },
      { to: '/services/online', key: 'nav.services.online' },
      { to: '/transparency/procurement-ita', key: 'nav.transparency.procurementIta' }
    ]
  },
  {
    to: '/forms/medical-record-request',
    key: 'nav.forms',
    icon: icon(
      <>
        <path d="M8.5 5h7L17.5 7v12h-11V5Z" />
        <path d="M9.5 10h5" />
        <path d="M9.5 13h5" />
      </>
    ),
    children: [
      { to: '/forms/medical-record-request', key: 'nav.forms.medicalRecordRequest' },
      { to: '/forms/donation', key: 'nav.forms.donation' },
      { to: '/forms/satisfaction', key: 'nav.forms.satisfaction' }
    ]
  },
  {
    to: '/intranet/document-center',
    key: 'nav.intranet',
    icon: icon(
      <>
        <path d="M4.5 8H19.5V18.5H4.5Z" />
        <path d="M4.5 8V5.5h7L13.5 8" />
      </>
    ),
    children: [
      { to: '/intranet/fuel-reimbursement', key: 'nav.intranet.fuelReimbursement' },
      { to: '/intranet/document-center', key: 'nav.intranet.documentCenter' }
    ]
  },
  {
    to: '/appointment',
    key: 'nav.appointment',
    icon: icon(
      <>
        <rect x="4.5" y="6.5" width="15" height="13" rx="2" />
        <path d="M8.5 4.5v4" />
        <path d="M15.5 4.5v4" />
        <path d="M4.5 11.5h15" />
      </>
    )
  },
  {
    to: '/doctors',
    key: 'nav.doctors',
    icon: icon(
      <>
        <circle cx="10" cy="9" r="2.5" />
        <path d="M4.5 18c.4-2.8 2.4-4.2 5.5-4.2" />
        <circle cx="16" cy="10" r="2" />
        <path d="M15 18h4.5c-.2-2.2-1.4-3.6-3.5-4" />
      </>
    )
  },
  {
    to: '/news',
    key: 'nav.news',
    icon: icon(
      <>
        <path d="M5.5 7h11.5l1.5 1.5v9H5.5Z" />
        <path d="M5.5 11h6" />
        <path d="M5.5 14h9" />
      </>
    )
  },
  {
    to: '/contact',
    key: 'nav.contact',
    icon: icon(
      <>
        <path d="M7.5 6.5h2l1.5 3-2 1.5c.9 1.8 2.2 3.1 4 4l1.5-2 3 1.5v2a1.5 1.5 0 0 1-1.6 1.5c-6.6-.8-9.4-3.6-10.4-10.1A1.5 1.5 0 0 1 7.5 6.5Z" />
      </>
    )
  }
]

const getIsActive = (item: NavItem, pathname: string) => {
  if (item.exact) {
    return pathname === item.to
  }

  if (item.key === 'nav.home') {
    return pathname === '/'
  }

  if (item.children?.length) {
    return (
      item.children.some((child) => pathname.startsWith(child.to)) ||
      (item.to !== '/' && pathname.startsWith(item.to))
    )
  }

  if (item.to === '/') {
    return pathname === '/'
  }

  return pathname.startsWith(item.to)
}

export const Sidebar: React.FC<SidebarProps> = ({
  onIncreaseFont,
  onDecreaseFont,
  isHighContrast,
  onToggleContrast
}) => {
  const { t } = useI18n()
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  useEffect(() => {
    const activeParent = navItems.find((item) =>
      item.children?.some((child) => location.pathname.startsWith(child.to))
    )

    if (!isCollapsed && activeParent) {
      setExpandedKey(activeParent.key)
    }
  }, [location.pathname, isCollapsed])

  useEffect(() => {
    if (isCollapsed) {
      setExpandedKey(null)
    }
  }, [isCollapsed])

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev)
    setHoveredKey(null)
  }

  const handleToggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev)
  }

  const handleLinkClick = () => {
    setIsDrawerOpen(false)
    setHoveredKey(null)
  }

  const handleExpandGroup = (key: string) => {
    setExpandedKey((current) => (current === key ? null : key))
  }

  const handleLogout = () => {
    logout()
    setIsDrawerOpen(false)
  }

  const sidebarClasses = [styles.sidebar]
  if (isCollapsed) {
    sidebarClasses.push(styles.collapsed)
  }
  if (isDrawerOpen) {
    sidebarClasses.push(styles.drawerOpen)
  }

  return (
    <>
      <div className={styles.mobileHeader}>
        <button
          type="button"
          className={styles.mobileToggle}
          aria-label={isDrawerOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={isDrawerOpen}
          onClick={handleToggleDrawer}
        >
          ☰
        </button>
        <Link to="/" className={styles.mobileBrand} onClick={handleLinkClick}>
          <span className={styles.brandMark} aria-hidden="true">
            PPH
          </span>
          <span className={styles.brandText}>โรงพยาบาลโพนพิสัย</span>
        </Link>
      </div>
      <aside className={sidebarClasses.join(' ')} aria-label="เมนูหลัก">
        <div className={styles.sidebarInner}>
          <div className={styles.brandRow}>
            <Link to="/" className={styles.brand} onClick={handleLinkClick}>
              <span className={styles.brandMark} aria-hidden="true">
                PPH
              </span>
              {!isCollapsed ? <span className={styles.brandText}>โรงพยาบาลโพนพิสัย</span> : null}
            </Link>
            <button
              type="button"
              className={styles.collapseButton}
              aria-label={isCollapsed ? 'ขยายเมนู' : 'ย่อเมนู'}
              onClick={handleToggleCollapse}
            >
              <span aria-hidden="true">{isCollapsed ? '›' : '‹'}</span>
            </button>
            <button
              type="button"
              className={styles.closeDrawer}
              aria-label="ปิดเมนู"
              onClick={() => setIsDrawerOpen(false)}
            >
              ×
            </button>
          </div>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navItems.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                const isActive = getIsActive(item, location.pathname)
                const isSubmenuOpen = hasChildren
                  ? isCollapsed
                    ? hoveredKey === item.key
                    : expandedKey === item.key
                  : false

                return (
                  <li
                    key={item.key}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`.trim()}
                    onMouseEnter={isCollapsed && hasChildren ? () => setHoveredKey(item.key) : undefined}
                    onMouseLeave={isCollapsed && hasChildren ? () => setHoveredKey(null) : undefined}
                    onFocus={isCollapsed && hasChildren ? () => setHoveredKey(item.key) : undefined}
                    onBlur={isCollapsed && hasChildren ? () => setHoveredKey(null) : undefined}
                  >
                    <div className={styles.navItemInner}>
                      <NavLink
                        to={item.to}
                        end={item.exact}
                        onClick={handleLinkClick}
                        className={({ isActive: navActive }) =>
                          `${styles.navLink} ${navActive ? styles.navLinkActive : ''}`.trim()
                        }
                        title={t(item.key)}
                      >
                        <span className={styles.iconWrap}>{item.icon}</span>
                        {!isCollapsed ? <span className={styles.linkLabel}>{t(item.key)}</span> : null}
                      </NavLink>
                      {hasChildren ? (
                        <button
                          type="button"
                          className={`${styles.chevron} ${isSubmenuOpen ? styles.chevronOpen : ''}`.trim()}
                          aria-label={`${isSubmenuOpen ? 'ปิด' : 'เปิด'}เมนู ${t(item.key)}`}
                          onClick={() => handleExpandGroup(item.key)}
                          disabled={isCollapsed}
                        >
                          <span aria-hidden="true">▾</span>
                        </button>
                      ) : null}
                    </div>
                    {hasChildren ? (
                      <div
                        className={`${styles.submenu} ${isSubmenuOpen ? styles.submenuOpen : ''} ${isCollapsed ? styles.submenuFloating : ''}`.trim()}
                      >
                        <ul className={styles.submenuList}>
                          {item.children?.map((child) => (
                            <li key={child.key}>
                              <NavLink
                                to={child.to}
                                onClick={handleLinkClick}
                                className={({ isActive: childActive }) =>
                                  `${styles.submenuLink} ${childActive ? styles.submenuLinkActive : ''}`.trim()
                                }
                              >
                                {t(child.key)}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                )
              })}
              {isAuthenticated ? (
                <li className={styles.navItem}>
                  <NavLink
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `${styles.navLink} ${styles.navLinkDashboard} ${isActive ? styles.navLinkActive : ''}`.trim()
                    }
                    title="แดชบอร์ด"
                  >
                    <span className={styles.iconWrap}>
                      {icon(
                        <>
                          <rect x="5.5" y="5.5" width="5" height="5" rx="1.2" />
                          <rect x="13.5" y="5.5" width="5" height="3.5" rx="1.2" />
                          <rect x="5.5" y="13.5" width="5" height="5" rx="1.2" />
                          <rect x="13.5" y="11.5" width="5" height="7" rx="1.2" />
                        </>
                      )}
                    </span>
                    {!isCollapsed ? <span className={styles.linkLabel}>แดชบอร์ด ({user?.role})</span> : null}
                  </NavLink>
                </li>
              ) : (
                <li className={styles.navItem}>
                  <NavLink
                    to="/login"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
                    }
                    title="เข้าสู่ระบบบุคลากร"
                  >
                    <span className={styles.iconWrap}>
                      {icon(
                        <>
                          <path d="M12 4.5a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z" />
                          <path d="M6.5 18c.5-3.5 2.9-5 5.5-5s5 1.5 5.5 5" />
                          <path d="M19 12.5h-5" />
                          <path d="m16 10.5 3 2-3 2" />
                        </>
                      )}
                    </span>
                    {!isCollapsed ? <span className={styles.linkLabel}>เข้าสู่ระบบบุคลากร</span> : null}
                  </NavLink>
                </li>
              )}
              <li className={styles.navItem}>
                <NavLink
                  to="/privacy-policy"
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`.trim()
                  }
                  title="นโยบายความเป็นส่วนตัว"
                >
                  <span className={styles.iconWrap}>
                    {icon(
                      <>
                        <path d="M5 7.5 12 4l7 3.5v5.5c0 4.2-3 6.8-7 8-4-1.2-7-3.8-7-8Z" />
                        <path d="M9.5 12.5 11.5 14l3-3.5" />
                      </>
                    )}
                  </span>
                  {!isCollapsed ? <span className={styles.linkLabel}>นโยบายความเป็นส่วนตัว</span> : null}
                </NavLink>
              </li>
            </ul>
          </nav>
          <div className={styles.actions}>
            {isAuthenticated ? (
              <button type="button" className={styles.logoutButton} onClick={handleLogout}>
                {!isCollapsed ? 'ออกจากระบบ' : '⎋'}
              </button>
            ) : null}
            {!isCollapsed ? (
              <>
                <DownloadWebViewButton className={`${styles.downloadButton} btn btn-secondary`} />
                <LanguageSwitcher />
                <ThemeToggle
                  onIncreaseFont={onIncreaseFont}
                  onDecreaseFont={onDecreaseFont}
                  isHighContrast={isHighContrast}
                  onToggleContrast={onToggleContrast}
                />
              </>
            ) : null}
          </div>
        </div>
      </aside>
      {isDrawerOpen ? <div className={styles.backdrop} onClick={() => setIsDrawerOpen(false)} /> : null}
    </>
  )
}
