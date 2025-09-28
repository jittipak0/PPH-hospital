import React, { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from './components/common/Navbar'
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
      <Navbar
        onIncreaseFont={increaseFont}
        onDecreaseFont={decreaseFont}
        isHighContrast={isHighContrast}
        onToggleContrast={() => setIsHighContrast((prev) => !prev)}
      />
      <main>
        <AppRoutes />
      </main>
      <Footer />
      <CookieConsent />
    </BrowserRouter>
  )
}
