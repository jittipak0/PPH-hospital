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
import { useI18n } from './lib/i18n'

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

export default function App(): React.ReactElement {
  const [fontScale, setFontScale] = useState(1)
  const [isHighContrast, setIsHighContrast] = useState(false)
  const { t } = useI18n()

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
            path="/sitemap"
            element={
              <Container>
                <Breadcrumb />
                <section>
                  <h2>{t('sitemap.title')}</h2>
                  <ul>
                    <li><a href="/">{t('nav.home')}</a></li>
                    <li><a href="/about">{t('nav.about')}</a></li>
                    <li><a href="/services">{t('nav.services')}</a></li>
                    <li><a href="/appointment">{t('nav.appointment')}</a></li>
                    <li><a href="/doctors">{t('nav.doctors')}</a></li>
                    <li><a href="/news">{t('nav.news')}</a></li>
                    <li><a href="/contact">{t('nav.contact')}</a></li>
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
