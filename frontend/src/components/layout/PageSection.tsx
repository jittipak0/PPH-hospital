import React from 'react'
import { Container } from './Container'

interface PageSectionProps {
  id?: string
  title: string
  description?: string
  children: React.ReactNode
  background?: 'default' | 'muted'
}

export const PageSection: React.FC<PageSectionProps> = ({ id, title, description, children, background = 'default' }) => {
  return (
    <section id={id} aria-labelledby={`${id ?? title}-heading`} className={`page-section page-section--${background}`}>
      <Container>
        <header className="page-section__header">
          <h2 id={`${id ?? title}-heading`}>{title}</h2>
          {description && <p className="page-section__description">{description}</p>}
        </header>
        <div className="page-section__body">{children}</div>
      </Container>
    </section>
  )
}
