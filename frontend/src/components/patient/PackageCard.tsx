import React from 'react'
import type { HealthPackage } from '../../lib/api'
import { useI18n } from '../../lib/i18n'

interface PackageCardProps {
  pkg: HealthPackage
}

export const PackageCard: React.FC<PackageCardProps> = ({ pkg }) => {
  const { t } = useI18n()

  return (
    <article className="card package-card">
      <h3>{pkg.name}</h3>
      <p>{pkg.description}</p>
      <p className="package-card__price">
        {t('services.packages.priceLabel')} {pkg.price}
      </p>
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
