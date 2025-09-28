import React from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Breadcrumb } from './components/common/Breadcrumb'
import { Container } from './components/layout/Container'
import { useAuth } from './context/AuthContext'
import type { Role } from './lib/secureApi'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Appointment } from './pages/Appointment'
import { Doctors } from './pages/Doctors'
import { News } from './pages/News'
import { Contact } from './pages/Contact'
import { Login } from './pages/auth/Login'
import { DashboardPage } from './pages/dashboard/Dashboard'
import { PrivacyPolicyPage } from './pages/PrivacyPolicy'
import { TermsPage } from './pages/Terms'
import { SitemapPage } from './pages/Sitemap'
import { LeadershipPage } from './pages/about/Leadership'
import { HistoryPage } from './pages/about/History'
import { VisionMissionValuesPage } from './pages/about/VisionMissionValues'
import { EthicsOverviewPage } from './pages/ethics/Overview'
import { EthicsClubPage } from './pages/ethics/Club'
import { AntiStigmaPage } from './pages/ethics/AntiStigma'
import { LawsActsPage } from './pages/ethics/LawsActs'
import { PublicationsPage } from './pages/academic/Publications'
import { HealthRiderPage } from './pages/programs/HealthRider'
import { OnlineServicesPage } from './pages/services/Online'
import { ProcurementItaPage } from './pages/transparency/ProcurementIta'
import { MedicalRecordRequestPage } from './pages/forms/MedicalRecordRequest'
import { DonationPage } from './pages/forms/Donation'
import { SatisfactionSurveyPage } from './pages/forms/Satisfaction'
import { FuelReimbursementPage } from './pages/intranet/FuelReimbursement'
import { DocumentCenterPage } from './pages/intranet/DocumentCenter'
import { NotFoundPage } from './pages/NotFound'

type RequireAuthProps = {
  roles?: Role[]
}

const RequireAuth: React.FC<RequireAuthProps> = ({ roles }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles && (!user || !roles.includes(user.role))) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

const withBreadcrumb = (element: React.ReactElement): React.ReactElement => (
  <>
    <Container>
      <Breadcrumb />
    </Container>
    {element}
  </>
)

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={withBreadcrumb(<About />)} />
    <Route path="/about/leadership" element={withBreadcrumb(<LeadershipPage />)} />
    <Route path="/about/history" element={withBreadcrumb(<HistoryPage />)} />
    <Route path="/about/vision-mission-values" element={withBreadcrumb(<VisionMissionValuesPage />)} />

    <Route path="/ethics" element={withBreadcrumb(<EthicsOverviewPage />)} />
    <Route path="/ethics/club" element={withBreadcrumb(<EthicsClubPage />)} />
    <Route path="/ethics/anti-stigma" element={withBreadcrumb(<AntiStigmaPage />)} />
    <Route path="/ethics/laws-acts" element={withBreadcrumb(<LawsActsPage />)} />

    <Route path="/academic/publications" element={withBreadcrumb(<PublicationsPage />)} />

    <Route path="/programs/health-rider" element={withBreadcrumb(<HealthRiderPage />)} />

    <Route path="/services" element={withBreadcrumb(<Services />)} />
    <Route path="/services/online" element={withBreadcrumb(<OnlineServicesPage />)} />

    <Route path="/transparency/procurement-ita" element={withBreadcrumb(<ProcurementItaPage />)} />

    <Route path="/forms/medical-record-request" element={withBreadcrumb(<MedicalRecordRequestPage />)} />
    <Route path="/forms/donation" element={withBreadcrumb(<DonationPage />)} />
    <Route path="/forms/satisfaction" element={withBreadcrumb(<SatisfactionSurveyPage />)} />

    <Route path="/appointment" element={withBreadcrumb(<Appointment />)} />
    <Route path="/doctors" element={withBreadcrumb(<Doctors />)} />
    <Route path="/news" element={withBreadcrumb(<News />)} />
    <Route path="/contact" element={withBreadcrumb(<Contact />)} />

    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/terms" element={<TermsPage />} />
    <Route path="/sitemap" element={withBreadcrumb(<SitemapPage />)} />

    <Route element={<RequireAuth roles={['staff']} />}>
      <Route path="/intranet/fuel-reimbursement" element={withBreadcrumb(<FuelReimbursementPage />)} />
      <Route path="/intranet/document-center" element={withBreadcrumb(<DocumentCenterPage />)} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
)
