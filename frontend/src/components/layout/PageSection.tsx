import React from 'react'
import { Container } from './Container'
import styles from './PageSection.module.scss'

interface PageSectionProps {
  id?: string
  title: string
  description?: string
  children: React.ReactNode
  background?: 'default' | 'muted'
}

export const PageSection: React.FC<PageSectionProps> = ({ id, title, description, children, background = 'default' }) => {
  const sectionClass = [styles.pageSection, background === 'muted' ? styles.pageSectionMuted : null]
    .filter(Boolean)
    .join(' ')

  return (
    <section id={id} aria-labelledby={`${id ?? title}-heading`} className={sectionClass}>
      <Container>
        <header className={styles.header}>
          <h2 id={`${id ?? title}-heading`} className={styles.title}>
            {title}
          </h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>
        <div className={styles.body}>{children}</div>
      </Container>
    </section>
  )
}
