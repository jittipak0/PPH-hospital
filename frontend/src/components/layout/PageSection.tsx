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
      <style>{`
        .page-section {
          padding: 3rem 0;
        }
        .page-section--muted {
          background-color: rgba(13, 110, 253, 0.04);
        }
        .page-section__header h2 {
          margin-top: 0;
          font-size: clamp(1.6rem, 3vw, 2rem);
          color: var(--color-primary);
        }
        .page-section__description {
          color: var(--color-muted);
          font-size: 1rem;
          max-width: 720px;
        }
        .page-section__body {
          margin-top: 1.5rem;
        }
      `}</style>
    </section>
  )
}
