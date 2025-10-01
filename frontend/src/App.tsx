import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Sidebar } from './components/common/Sidebar'
import { Footer } from './components/common/Footer'
import { CookieConsent } from './components/common/CookieConsent'
import { AppRoutes } from './router'

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
      <div className="app-shell">
        <Sidebar
          onIncreaseFont={increaseFont}
          onDecreaseFont={decreaseFont}
          isHighContrast={isHighContrast}
          onToggleContrast={() => setIsHighContrast((prev) => !prev)}
        />
        <div className="app-content">
          <main className="app-main">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </div>
      <CookieConsent />
    </BrowserRouter>
  )
}
