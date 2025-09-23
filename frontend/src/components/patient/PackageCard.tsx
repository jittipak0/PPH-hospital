import React from 'react'
import type { HealthPackage } from '../../lib/api'

interface PackageCardProps {
  pkg: HealthPackage
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  return (
    <article className="card package-card">
      <h3>{pkg.name}</h3>
      <p>{pkg.description}</p>
      <p className="package-card__price">ราคา {pkg.price}</p>
      <ul>
        {pkg.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <style>{`
        .package-card h3 {
          color: var(--color-primary);
          margin-top: 0;
        }
        .package-card__price {
          font-weight: 700;
          margin: 0.75rem 0;
        }
        .package-card ul {
          padding-left: 1.2rem;
        }
      `}</style>
    </article>
  )
}
