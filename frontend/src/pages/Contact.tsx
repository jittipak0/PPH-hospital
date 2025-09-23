import React, { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { api } from '../lib/api'
import { createContactSchema, type ContactFormValues } from '../lib/validators'
import { useI18n } from '../lib/i18n'

const CAPTCHA_TOKEN = '5678'

export const Contact: React.FC = () => {
  const { t } = useI18n()
  const schema = useMemo(() => createContactSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
      captcha: '',
      consent: false
    }
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState<string>('')

  const onSubmit = async (values: ContactFormValues) => {
    if (values.captcha !== CAPTCHA_TOKEN) {
      setError('captcha', { type: 'validate', message: t('contact.form.captchaInvalid') })
      return
    }
    try {
      setStatus('loading')
      await api.submitContact(values)
      setFeedback(t('contact.form.success'))
      setStatus('success')
      reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
      setFeedback(t('contact.form.error'))
    }
  }

  return (
    <div>
      <Container>
        <header>
          <h1>{t('contact.title')}</h1>
          <p>{t('contact.intro')}</p>
        </header>
      </Container>

      <PageSection id="contact-info" title={t('contact.info.title')}>
        <div className="contact-grid">
          <div className="card">
            <h3>{t('contact.info.address.title')}</h3>
            <p>{t('contact.info.address.detail')}</p>
          </div>
          <div className="card">
            <h3>{t('contact.info.phone.title')}</h3>
            <p>
              {t('contact.info.phone.hotline')}: <a href="tel:020001111">02-000-1111</a>
            </p>
            <p>
              {t('contact.info.phone.appointment')}: <a href="tel:020001222">02-000-1222</a>
            </p>
          </div>
          <div className="card">
            <h3>{t('contact.info.email.title')}</h3>
            <p><a href="mailto:info@publichospital.go.th">info@publichospital.go.th</a></p>
            <p><a href="mailto:complaint@publichospital.go.th">complaint@publichospital.go.th</a></p>
          </div>
        </div>
      </PageSection>

      <PageSection id="map" title={t('contact.map.title')}>
        <div className="map-wrapper">
          <iframe
            title={t('contact.map.title')}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792975200286!2d100.493088375097!3d13.745570897166702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298d02c5d4b53%3A0xdbc3cfc9ad1bc105!2sMinistry%20of%20Public%20Health!5e0!3m2!1sth!2sth!4v1717470000000!5m2!1sth!2sth"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </PageSection>

      <PageSection id="feedback" title={t('contact.form.title')}>
        <form className="card contact-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <label>
              {t('contact.form.fullName')}
              <input type="text" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} />
              {errors.fullName && <span className="error">{errors.fullName.message}</span>}
            </label>
            <label>
              {t('contact.form.email')}
              <input type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </label>
            <label>
              {t('contact.form.phone')}
              <input type="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} />
              {errors.phone && <span className="error">{errors.phone.message}</span>}
            </label>
          </div>
          <label>
            {t('contact.form.message')}
            <textarea rows={5} {...register('message')} aria-invalid={Boolean(errors.message)} />
            {errors.message && <span className="error">{errors.message.message}</span>}
          </label>
          <label>
            {t('contact.form.captcha')}
            <input type="text" {...register('captcha')} aria-invalid={Boolean(errors.captcha)} />
            {errors.captcha && <span className="error">{errors.captcha.message}</span>}
          </label>
          <label className="contact-consent">
            <input type="checkbox" {...register('consent')} />
            <span>
              {t('contact.form.consent')}{' '}
              <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
                {t('contact.form.consentLink')}
              </a>
            </span>
          </label>
          {errors.consent && <span className="error">{errors.consent.message}</span>}
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? t('contact.form.submitting') : t('contact.form.submit')}
          </button>
          {feedback && (
            <p className={status === 'success' ? 'success' : 'error'} role="status">
              {feedback}
            </p>
          )}
        </form>
      </PageSection>
    </div>
  )
}
