import React, { useMemo } from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { useI18n } from '../lib/i18n'

export const About: React.FC = () => {
  const { t, language } = useI18n()

  const executives = useMemo(
    () => [
      { th: 'นพ. อภิสิทธิ์ ศรีประชา', en: 'Dr. Apisit Sripracha', role: t('about.executives.director') },
      { th: 'พญ. อรอุมา ตั้งจิตร', en: 'Dr. Oruma Tangjit', role: t('about.executives.medicalDeputy') },
      { th: 'นาง จุฑารัตน์ ทองใจ', en: 'Ms. Jutharat Thongjai', role: t('about.executives.nursingDeputy') },
      { th: 'นาย ศิริชัย พูนผล', en: 'Mr. Sirichai Poonpol', role: t('about.executives.adminDeputy') }
    ],
    [language, t]
  )

  return (
    <div>
      <Container>
        <header>
          <h1>{t('about.title')}</h1>
          <p>{t('about.intro')}</p>
        </header>
      </Container>

      <PageSection id="history" title={t('about.history.title')}>
        <p>{t('about.history.body')}</p>
      </PageSection>

      <PageSection id="vision" title={t('about.vision.title')}>
        <Grid columns={2}>
          <article className="card">
            <h3>{t('about.vision.title')}</h3>
            <p>{t('about.vision.text')}</p>
          </article>
          <article className="card">
            <h3>{t('about.mission.title')}</h3>
            <ul>
              <li>{t('about.mission.item1')}</li>
              <li>{t('about.mission.item2')}</li>
              <li>{t('about.mission.item3')}</li>
            </ul>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="executives" title={t('about.executives.title')}>
        <Grid columns={3}>
          {executives.map((executive) => (
            <article className="card" key={executive.th}>
              <h3>{language === 'th' ? executive.th : executive.en}</h3>
              <p>{executive.role}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="information" title={t('about.info.title')}>
        <Grid columns={2}>
          <article className="card">
            <h3>{t('about.info.capacityTitle')}</h3>
            <p>{t('about.info.capacity')}</p>
          </article>
          <article className="card">
            <h3>{t('about.info.awardsTitle')}</h3>
            <p>{t('about.info.awards')}</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}
