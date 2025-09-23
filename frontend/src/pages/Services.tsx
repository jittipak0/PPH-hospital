import React, { useEffect, useState } from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PackageCard } from '../components/patient/PackageCard'
import { api, type Clinic, type HealthPackage } from '../lib/api'
import { useI18n } from '../lib/i18n'

export const Services: React.FC = () => {
  const [packages, setPackages] = useState<HealthPackage[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const { t } = useI18n()
  const newPatientSteps = [
    'services.process.new.steps.1',
    'services.process.new.steps.2',
    'services.process.new.steps.3',
    'services.process.new.steps.4'
  ] as const
  const returningPatientSteps = [
    'services.process.returning.steps.1',
    'services.process.returning.steps.2',
    'services.process.returning.steps.3'
  ] as const
  const patientRights = [
    {
      title: 'services.rights.universal.title',
      description: 'services.rights.universal.description'
    },
    {
      title: 'services.rights.socialSecurity.title',
      description: 'services.rights.socialSecurity.description'
    },
    {
      title: 'services.rights.governmentOfficer.title',
      description: 'services.rights.governmentOfficer.description'
    },
    {
      title: 'services.rights.privateInsurance.title',
      description: 'services.rights.privateInsurance.description'
    }
  ] as const

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [pkg, clinicItems] = await Promise.all([api.fetchHealthPackages(), api.fetchClinics()])
      if (!cancelled) {
        setPackages(pkg)
        setClinics(clinicItems)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <Container>
        <header>
          <h1>{t('services.header.title')}</h1>
          <p>{t('services.header.description')}</p>
        </header>
      </Container>

      <PageSection id="process" title={t('services.process.title')}>
        <Grid columns={2}>
          <article className="card">
            <h3>{t('services.process.new.title')}</h3>
            <ol>
              {newPatientSteps.map((stepKey) => (
                <li key={stepKey}>{t(stepKey)}</li>
              ))}
            </ol>
          </article>
          <article className="card">
            <h3>{t('services.process.returning.title')}</h3>
            <ol>
              {returningPatientSteps.map((stepKey) => (
                <li key={stepKey}>{t(stepKey)}</li>
              ))}
            </ol>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="clinics" title={t('services.clinics.title')}>
        <Grid columns={clinics.length > 0 ? Math.min(clinics.length, 3) : 3}>
          {clinics.map((clinic) => (
            <article key={clinic.id} className="card">
              <h3>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p>
                <strong>{t('common.operatingHours')}</strong> {clinic.operatingHours}
              </p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        id="packages"
        title={t('services.packages.title')}
        description={t('services.packages.description')}
      >
        <Grid columns={packages.length > 0 ? Math.min(packages.length, 3) : 2}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </Grid>
      </PageSection>

      <PageSection id="rights" title={t('services.rights.title')}>
        <Grid columns={2}>
          {patientRights.map((item) => (
            <article className="card" key={item.title}>
              <h3>{t(item.title)}</h3>
              <p>{t(item.description)}</p>
            </article>
          ))}
        </Grid>
      </PageSection>
    </div>
  )
}
