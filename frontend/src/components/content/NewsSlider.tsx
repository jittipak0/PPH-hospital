import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { NewsItem } from '../../lib/api'
import styles from './NewsSlider.module.scss'

type NewsSliderProps = {
  items: NewsItem[]
  interval?: number
}

type SliderItem = NewsItem & { formattedDate: string }

export const NewsSlider: React.FC<NewsSliderProps> = ({ items, interval = 8000 }) => {
  const slides = useMemo<SliderItem[]>(
    () =>
      items.map((item) => ({
        ...item,
        formattedDate: new Date(item.publishedAt).toLocaleDateString('th-TH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      })),
    [items]
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (slides.length <= 1) {
      return
    }
    setActiveIndex(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || isPaused) {
      return
    }
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, interval)
    return () => window.clearInterval(timer)
  }, [slides.length, interval, isPaused])

  useEffect(() => {
    if (activeIndex >= slides.length && slides.length > 0) {
      setActiveIndex(0)
    }
  }, [activeIndex, slides.length])

  const goToIndex = (index: number) => {
    if (slides.length === 0) return
    const nextIndex = (index + slides.length) % slides.length
    setActiveIndex(nextIndex)
  }

  const handlePrev = () => goToIndex(activeIndex - 1)
  const handleNext = () => goToIndex(activeIndex + 1)

  if (slides.length === 0) {
    return null
  }

  return (
    <div className={styles.slider} aria-roledescription="carousel">
      <div
        className={styles.viewport}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex
          const className = `${styles.slide} ${isActive ? styles.slideActive : styles.slideHidden}`
          return (
            <article
              key={slide.id}
              className={className}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${slides.length}`}
            >
              <div
                className={styles.slideBackground}
                style={{ backgroundImage: `url(${slide.imageUrl}?auto=format&fit=crop&w=1600&q=80)` }}
                role="presentation"
              />
              <div className={styles.overlay}>
                <span className={styles.eyebrow}>ข่าวเด่น</span>
                <h3>{slide.title}</h3>
                <p>{slide.summary}</p>
                <div className={styles.meta}>
                  <time dateTime={slide.publishedAt}>{slide.formattedDate}</time>
                  <Link to="/news" state={{ highlight: slide.id }} className="btn btn-secondary">
                    อ่านรายละเอียด
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
        {slides.length > 1 ? (
          <>
            <button type="button" className={`${styles.navButton} ${styles.navPrev}`} onClick={handlePrev} aria-label="ข่าวก่อนหน้า">
              {'<'}
            </button>
            <button type="button" className={`${styles.navButton} ${styles.navNext}`} onClick={handleNext} aria-label="ข่าวถัดไป">
              {'>'}
            </button>
          </>
        ) : null}
      </div>
      {slides.length > 1 ? (
        <div className={styles.indicators} role="group" aria-label="ตัวบ่งชี้สไลด์">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex
            const indicatorClass = `${styles.indicator} ${isActive ? styles.indicatorActive : ''}`
            return (
              <button
                type="button"
                key={slide.id}
                className={indicatorClass}
                onClick={() => goToIndex(index)}
                aria-label={`เลือกข่าวลำดับที่ ${index + 1}`}
                aria-current={isActive ? 'true' : undefined}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

