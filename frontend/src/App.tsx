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

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

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
          <Route
            path="/"
            element={
              <>
                <Home />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Container>
                  <Breadcrumb />
                </Container>
                <About />
              </>
            }
          />
          <Route
            path="/services"
            element={
              <>
                <Container>
                  <Breadcrumb />
                </Container>
                <Services />
              </>
            }
          />
          <Route
            path="/appointment"
            element={
              <>
                <Container>
                  <Breadcrumb />
                </Container>
                <Appointment />
              </>
            }
          />
          <Route
            path="/doctors"
            element={
              <>
                <Container>
                  <Breadcrumb />
                </Container>
                <Doctors />
              </>
            }
          />
          <Route
            path="/news"
            element={
              <>
                <Container>
                  <Breadcrumb />
                </Container>
                <News />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Container>
                  <Breadcrumb />
                </Container>
                <Contact />
              </>
            }
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivacyPolicyPage />}
          />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/sitemap"
            element={
              <Container>
                <Breadcrumb />
                <section>
                  <h2>แผนผังเว็บไซต์</h2>
                  <ul>
                    <li><a href="/">หน้าแรก</a></li>
                    <li><a href="/about">เกี่ยวกับเรา</a></li>
                    <li><a href="/services">บริการผู้ป่วย</a></li>
                    <li><a href="/appointment">นัดหมายแพทย์</a></li>
                    <li><a href="/doctors">ค้นหาแพทย์</a></li>
                    <li><a href="/news">ข่าวสา/กิจกรรม</a></li>
                    <li><a href="/contact">ติดต่อเรา</a></li>
                    <li><a href="/login">เข้าสู่ระบบบุคลากร</a></li>
                    <li><a href="/privacy-policy">นโยบายความเป็นส่วนตัว</a></li>
                  </ul>
                </section>
              </Container>
            }
          />
        </Routes>
      </main>
      <Footer />
      <CookieConsent />
    </BrowserRouter>
  )
}
