import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, type Doctor } from '../../lib/api'
import { createAppointmentSchema, type AppointmentFormValues } from '../../lib/validators'
import { useAppointment } from '../../hooks/useAppointment'
import { useI18n } from '../../lib/i18n'

const CAPTCHA_TOKEN = '1234'

export const AppointmentForm: React.FC = () => {
  const { t, language } = useI18n()
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { submitAppointment, status, referenceCode, error: submitError, reset } = useAppointment()

  const schema = useMemo(() => createAppointmentSchema(t), [t])
  const getFieldId = (name: string) => `appointment-${name}`

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError,
    reset: resetForm
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      nationalId: '',
      patientCode: '',
      department: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      captcha: '',
      consent: false
    }
  })

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const data = await api.fetchDoctors(language)
        if (!cancelled) {
          setDoctors(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(t('appointment.form.loadError'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [language, t])

  const departmentOptions = useMemo(() => Array.from(new Set(doctors.map((doctor) => doctor.department))), [doctors])
  const selectedDepartment = watch('department')
  const doctorsInDepartment = useMemo(
    () => doctors.filter((doctor) => !selectedDepartment || doctor.department === selectedDepartment),
    [doctors, selectedDepartment]
  )

  const onSubmit = async (values: AppointmentFormValues) => {
    if (values.captcha !== CAPTCHA_TOKEN) {
      setFormError('captcha', { type: 'validate', message: t('appointment.form.captchaInvalid') })
      return
    }
    await submitAppointment(values)
    resetForm({
      fullName: '',
      nationalId: '',
      patientCode: '',
      department: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      captcha: '',
      consent: false
    })
  }

  useEffect(() => {
    if (status === 'success') {
      const timer = window.setTimeout(() => {
        reset()
      }, 8000)
      return () => window.clearTimeout(timer)
    }
    return undefined
  }, [status, reset])

  if (loading) {
    return <p role="status">{t('appointment.form.loading')}</p>
  }

  if (error) {
    return (
      <p role="alert" className="error">
        {error}
      </p>
    )
  }

  return (
    <form className="card appointment-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={status === 'submitting'}>
        <legend>{t('appointment.form.legend')}</legend>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor={getFieldId('fullName')}>{t('appointment.form.fullName')}</label>
            <input
              id={getFieldId('fullName')}
              type="text"
              {...register('fullName')}
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName && <span className="error">{errors.fullName.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor={getFieldId('nationalId')}>{t('appointment.form.nationalId')}</label>
            <input
              id={getFieldId('nationalId')}
              type="text"
              inputMode="numeric"
              {...register('nationalId')}
              aria-invalid={Boolean(errors.nationalId)}
            />
            {errors.nationalId && <span className="error">{errors.nationalId.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor={getFieldId('patientCode')}>{t('appointment.form.patientCode')}</label>
            <input
              id={getFieldId('patientCode')}
              type="text"
              {...register('patientCode')}
              aria-invalid={Boolean(errors.patientCode)}
            />
            {errors.patientCode && <span className="error">{errors.patientCode.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor={getFieldId('department')}>{t('appointment.form.department')}</label>
            <select
              id={getFieldId('department')}
              {...register('department')}
              aria-invalid={Boolean(errors.department)}
            >
              <option value="">{t('form.selectPlaceholder')}</option>
              {departmentOptions.map((department) => (
                <option value={department} key={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department && <span className="error">{errors.department.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor={getFieldId('doctorId')}>{t('appointment.form.doctor')}</label>
            <select
              id={getFieldId('doctorId')}
              {...register('doctorId')}
              aria-invalid={Boolean(errors.doctorId)}
            >
              <option value="">{t('form.selectPlaceholder')}</option>
              {doctorsInDepartment.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.specialty})
                </option>
              ))}
            </select>
            {errors.doctorId && <span className="error">{errors.doctorId.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor={getFieldId('appointmentDate')}>{t('appointment.form.date')}</label>
            <input
              id={getFieldId('appointmentDate')}
              type="date"
              {...register('appointmentDate')}
              aria-invalid={Boolean(errors.appointmentDate)}
            />
            {errors.appointmentDate && <span className="error">{errors.appointmentDate.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor={getFieldId('appointmentTime')}>{t('appointment.form.time')}</label>
            <input
              id={getFieldId('appointmentTime')}
              type="time"
              {...register('appointmentTime')}
              aria-invalid={Boolean(errors.appointmentTime)}
            />
            {errors.appointmentTime && <span className="error">{errors.appointmentTime.message}</span>}
          </div>
          <div className="form-field">
            <label htmlFor={getFieldId('captcha')}>{t('appointment.form.captcha.label')}</label>
            <input
              id={getFieldId('captcha')}
              type="text"
              inputMode="numeric"
              {...register('captcha')}
              aria-invalid={Boolean(errors.captcha)}
              aria-describedby={`${getFieldId('captcha')}-hint`}
            />
            <p id={`${getFieldId('captcha')}-hint`} className="form-hint">
              {t('appointment.form.captcha.hint')}
            </p>
            {errors.captcha && <span className="error">{errors.captcha.message}</span>}
          </div>
        </div>
        <label className="consent-checkbox">
          <input type="checkbox" {...register('consent')} />
          <span>
            {t('appointment.form.consent')}{' '}
            <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
              {t('contact.form.consentLink')}
            </a>
          </span>
        </label>
        {errors.consent && <span className="error">{errors.consent.message}</span>}
        <button type="submit" className="submit-button">
          {status === 'submitting' ? t('appointment.form.submitting') : t('appointment.form.submit')}
        </button>
        {submitError && <p className="error" role="alert">{submitError}</p>}
        {status === 'success' && referenceCode && (
          <p className="success" role="status">
            {t('appointment.form.successMessage')}{' '}
            <strong>{referenceCode}</strong> {t('appointment.form.successFollowup')}
          </p>
        )}
      </fieldset>
    </form>
  )
}
