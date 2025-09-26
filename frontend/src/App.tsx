import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'
import { Breadcrumb } from './components/common/Breadcrumb'
import { CookieConsent } from './components/common/CookieConsent'
import { Container } from './components/layout/Container'
import { Home } from './pages/Home'
import { Login } from './pages/auth/Login'
import { DashboardPage } from './pages/dashboard/Dashboard'
import { PrivacyPolicyPage } from './pages/PrivacyPolicy'
import { TermsPage } from './pages/Terms'
import { PAGES } from './pages.config'

const PageRenderer = lazy(() => import('./pages/PageRenderer'))
const OnlineServices = lazy(() => import('./pages/OnlineServices'))
const MedicalRecordRequestForm = lazy(() => import('./pages/forms/MedicalRecordRequestForm'))
const DonationForm = lazy(() => import('./pages/forms/DonationForm'))
const SatisfactionSurveyForm = lazy(() => import('./pages/forms/SatisfactionSurveyForm'))
const FuelClaimForm = lazy(() => import('./pages/forms/FuelClaimForm'))
const ArchiveRequestForm = lazy(() => import('./pages/forms/ArchiveRequestForm'))
const SitemapPage = lazy(() => import('./pages/Sitemap'))

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const StandardPageLayout: React.FC = () => (
  <>
    <Container>
      <Breadcrumb />
    </Container>
    <Outlet />
  </>
)

export default function App(): React.ReactElement {
  const [fontScale, setFontScale] = useState(1)
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString())
  }, [fontScale])

  useEffect(() => {
    document.body.classList.toggle('high-contrast', isHighContrast)
  }, [isHighContrast])

  const increaseFont = () => setFontScale((value) => clamp(Number((value + 0.1).toFixed(1)), 0.8, 1.5))
  const decreaseFont = () => setFontScale((value) => clamp(Number((value - 0.1).toFixed(1)), 0.8, 1.5))

  const cmsPaths = useMemo(
    () =>
      PAGES.filter((page) => ['about', 'academic', 'programs', 'legal', 'procurement'].includes(page.category)).map(
        (page) => page.path
      ),
    []
  )

  return (
    <BrowserRouter>
      <Navbar
        onIncreaseFont={increaseFont}
        onDecreaseFont={decreaseFont}
        isHighContrast={isHighContrast}
        onToggleContrast={() => setIsHighContrast((prev) => !prev)}
      />
      <main>
        <Suspense
          fallback={
            <Container>
              <div className="page-loading" role="status">
                <span className="page-loading__spinner" aria-hidden="true" />
                <p>กำลังโหลดข้อมูล...</p>
              </div>
            </Container>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<StandardPageLayout />}>
              <Route path="/online-services" element={<OnlineServices />} />
              <Route path="/forms/medical-record-request" element={<MedicalRecordRequestForm />} />
              <Route path="/donation" element={<DonationForm />} />
              <Route path="/feedback/satisfaction" element={<SatisfactionSurveyForm />} />
              <Route path="/internal/fuel-claims" element={<FuelClaimForm />} />
              <Route path="/internal/archive-center" element={<ArchiveRequestForm />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              {cmsPaths.map((path) => (
                <Route key={path} path={path} element={<PageRenderer />} />
              ))}
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CookieConsent />
    </BrowserRouter>
  )
}
