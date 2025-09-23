import React, { useEffect, useMemo, useState } from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PackageCard } from '../components/patient/PackageCard'
import { api, type Clinic, type HealthPackage } from '../lib/api'
import { useI18n } from '../lib/i18n'

export const Services: React.FC = () => {
  const { t, language } = useI18n()
  const [packages, setPackages] = useState<HealthPackage[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const [pkg, clinicItems] = await Promise.all([api.fetchHealthPackages(language), api.fetchClinics(language)])
      if (!cancelled) {
        setPackages(pkg)
        setClinics(clinicItems)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [language])

  const newPatientSteps = useMemo(
    () => [
      t('services.process.new.step1'),
      t('services.process.new.step2'),
      t('services.process.new.step3'),
      t('services.process.new.step4')
    ],
    [t]
  )
  const returningPatientSteps = useMemo(
    () => [
      t('services.process.returning.step1'),
      t('services.process.returning.step2'),
      t('services.process.returning.step3')
    ],
    [t]
  )

  return (
    <div>
      <Container>
        <header>
          <h1>{t('services.title')}</h1>
          <p>{t('services.intro')}</p>
        </header>
      </Container>

      <PageSection id="process" title={t('services.process.title')}>
        <Grid columns={2}>
          <article className="card">
            <h3>{t('services.process.new.title')}</h3>
            <ol>
              {newPatientSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
          <article className="card">
            <h3>{t('services.process.returning.title')}</h3>
            <ol>
              {returningPatientSteps.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="clinics" title={t('services.clinics.title')} description={t('services.clinics.description')}>
        <Grid columns={clinics.length > 0 ? Math.min(clinics.length, 3) : 3}>
          {clinics.map((clinic) => (
            <article key={clinic.id} className="card">
              <h3>{clinic.name}</h3>
              <p>{clinic.description}</p>
              <p>
                <strong>{t('doctors.scheduleLabel')}:</strong> {clinic.operatingHours}
              </p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="packages" title={t('services.packages.title')} description={t('services.packages.description')}>
        <Grid columns={packages.length > 0 ? Math.min(packages.length, 3) : 2}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </Grid>
      </PageSection>

      <PageSection id="rights" title={t('services.rights.title')}>
        <Grid columns={2}>
          <article className="card">
            <h3>{t('services.rights.gold.title')}</h3>
            <p>{t('services.rights.gold.body')}</p>
          </article>
          <article className="card">
            <h3>{t('services.rights.sso.title')}</h3>
            <p>{t('services.rights.sso.body')}</p>
          </article>
          <article className="card">
            <h3>{t('services.rights.gov.title')}</h3>
            <p>{t('services.rights.gov.body')}</p>
          </article>
          <article className="card">
            <h3>{t('services.rights.private.title')}</h3>
            <p>{t('services.rights.private.body')}</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}
