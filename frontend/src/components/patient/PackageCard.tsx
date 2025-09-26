import React from 'react'
import type { HealthPackage } from '../../lib/api'
import styles from './PackageCard.module.scss'

interface PackageCardProps {
  pkg: HealthPackage
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  return (
    <article className={`card ${styles.packageCard}`}>
      <h3 className={styles.title}>{pkg.name}</h3>
      <p>{pkg.description}</p>
      <p className={styles.price}>ราคา {pkg.price}</p>
      <ul className={styles.list}>
        {pkg.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}
