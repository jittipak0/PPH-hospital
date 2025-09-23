import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { AppointmentForm } from '../components/patient/AppointmentForm'
import { useI18n } from '../lib/i18n'

export const Appointment: React.FC = () => {
  const { t } = useI18n()
  return (
    <div>
      <Container>
        <header>
          <h1>{t('appointment.title')}</h1>
          <p>{t('appointment.intro')}</p>
        </header>
      </Container>
      <PageSection id="appointment-form" title={t('appointment.section.form')}>
        <AppointmentForm />
      </PageSection>
      <PageSection id="policy" title={t('appointment.section.notice')}>
        <ul>
          <li>{t('appointment.notice.item1')}</li>
          <li>{t('appointment.notice.item2')}</li>
          <li>{t('appointment.notice.item3')}</li>
        </ul>
      </PageSection>
    </div>
  )
}
