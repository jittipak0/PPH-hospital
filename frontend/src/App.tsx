import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'
import { Breadcrumb } from './components/common/Breadcrumb'
import { CookieConsent } from './components/common/CookieConsent'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Services } from './pages/Services'
import { Appointment } from './pages/Appointment'
import { Doctors } from './pages/Doctors'
import { News } from './pages/News'
import { Contact } from './pages/Contact'
import { Container } from './components/layout/Container'
import { Login } from './pages/auth/Login'
import { DashboardPage } from './pages/dashboard/Dashboard'
import { PrivacyPolicyPage } from './pages/PrivacyPolicy'
import { TermsPage } from './pages/Terms'
import LeadershipPage from './pages/about/Leadership'
import HistoryPage from './pages/about/History'
import VisionMissionValuesPage from './pages/about/VisionMissionValues'
import EthicsOverviewPage from './pages/Ethics'
import EthicsClubPage from './pages/ethics/Club'
import AntiStigmaPage from './pages/ethics/AntiStigma'
import LawsActsPage from './pages/ethics/LawsActs'
import AcademicOverviewPage from './pages/Academic'
import PublicationsPage from './pages/academic/Publications'
import ProgramsOverviewPage from './pages/Programs'
import HealthRiderPage from './pages/programs/HealthRider'
import OnlineServicesPage from './pages/services/OnlineServices'
import TransparencyOverviewPage from './pages/Transparency'
import ProcurementItaPage from './pages/transparency/ProcurementIta'
import FormsOverviewPage from './pages/Forms'
import MedicalRecordRequestPage from './pages/forms/MedicalRecordRequest'
import DonationPage from './pages/forms/Donation'
import SatisfactionPage from './pages/forms/Satisfaction'
import IntranetOverviewPage from './pages/Intranet'
import FuelReimbursementPage from './pages/intranet/FuelReimbursement'
import DocumentCenterPage from './pages/intranet/DocumentCenter'
import { siteSections } from './config/siteMap'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const withBreadcrumb = (content: React.ReactElement) => (
  <>
    <Container>
      <Breadcrumb />
    </Container>
    {content}
  </>
)

const SitemapPage: React.FC = () => (
  <Container>
    <Breadcrumb />
    <section>
      <h2>แผนผังเว็บไซต์</h2>
      <ul className="sitemap">
        <li>
          <a href="/">หน้าแรก</a>
        </li>
        <li>
          <a href="/appointment">นัดหมายแพทย์</a>
        </li>
        <li>
          <a href="/doctors">ค้นหาแพทย์</a>
        </li>
        <li>
          <a href="/news">ข่าวสาร/กิจกรรม</a>
        </li>
        <li>
          <a href="/contact">ติดต่อเรา</a>
        </li>
        {siteSections.map((section) => (
          <li key={section.id}>
            <a href={section.path}>{section.label}</a>
            {section.children ? (
              <ul>
                {section.children.map((child) => (
                  <li key={child.path}>
                    <a href={child.path}>{child.label}</a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
        <li>
          <a href="/privacy-policy">นโยบายความเป็นส่วนตัว</a>
        </li>
      </ul>
    </section>
    <style>{`
      .sitemap {
        list-style: none;
        padding: 0;
        margin: 1rem 0;
        display: grid;
        gap: 0.75rem;
      }
      .sitemap > li > ul {
        list-style: disc;
        margin: 0.5rem 0 0 1.5rem;
        display: grid;
        gap: 0.35rem;
      }
      .sitemap a {
        text-decoration: none;
        color: var(--color-primary);
        font-weight: 600;
      }
    `}</style>
  </Container>
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

  return (
    <BrowserRouter>
      <Navbar
        onIncreaseFont={increaseFont}
        onDecreaseFont={decreaseFont}
        isHighContrast={isHighContrast}
        onToggleContrast={() => setIsHighContrast((prev) => !prev)}
      />
      <main>
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
          <Route path="/academic" element={withBreadcrumb(<AcademicOverviewPage />)} />
          <Route path="/academic/publications" element={withBreadcrumb(<PublicationsPage />)} />
          <Route path="/programs" element={withBreadcrumb(<ProgramsOverviewPage />)} />
          <Route path="/programs/health-rider" element={withBreadcrumb(<HealthRiderPage />)} />
          <Route path="/services" element={withBreadcrumb(<Services />)} />
          <Route path="/services/online" element={withBreadcrumb(<OnlineServicesPage />)} />
          <Route path="/appointment" element={withBreadcrumb(<Appointment />)} />
          <Route path="/doctors" element={withBreadcrumb(<Doctors />)} />
          <Route path="/news" element={withBreadcrumb(<News />)} />
          <Route path="/contact" element={withBreadcrumb(<Contact />)} />
          <Route path="/transparency" element={withBreadcrumb(<TransparencyOverviewPage />)} />
          <Route path="/transparency/procurement-ita" element={withBreadcrumb(<ProcurementItaPage />)} />
          <Route path="/forms" element={withBreadcrumb(<FormsOverviewPage />)} />
          <Route path="/forms/medical-record-request" element={withBreadcrumb(<MedicalRecordRequestPage />)} />
          <Route path="/forms/donation" element={withBreadcrumb(<DonationPage />)} />
          <Route path="/forms/satisfaction" element={withBreadcrumb(<SatisfactionPage />)} />
          <Route path="/intranet" element={withBreadcrumb(<IntranetOverviewPage />)} />
          <Route path="/intranet/fuel-reimbursement" element={withBreadcrumb(<FuelReimbursementPage />)} />
          <Route path="/intranet/document-center" element={withBreadcrumb(<DocumentCenterPage />)} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </BrowserRouter>
  )
}
