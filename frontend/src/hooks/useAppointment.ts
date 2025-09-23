import { useState } from 'react'
import { api } from '../lib/api'
import type { AppointmentFormValues } from '../lib/validators'
import { useI18n } from '../lib/i18n'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export const useAppointment = () => {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [referenceCode, setReferenceCode] = useState<string | null>(null)
  const { t } = useI18n()

  const submitAppointment = async (values: AppointmentFormValues) => {
    try {
      setStatus('submitting')
      setError(null)
      const { referenceCode: ref } = await api.submitAppointment({
        fullName: values.fullName,
        nationalId: values.nationalId,
        patientCode: values.patientCode || undefined,
        department: values.department,
        doctorId: values.doctorId,
        appointmentDate: values.appointmentDate,
        appointmentTime: values.appointmentTime,
        consent: values.consent
      })
      setReferenceCode(ref)
      setStatus('success')
    } catch (err) {
      console.error(err)
      setError(t('appointment.submitError'))
      setStatus('error')
    }
  }

  const reset = () => {
    setStatus('idle')
    setReferenceCode(null)
    setError(null)
  }

  return {
    status,
    error,
    referenceCode,
    submitAppointment,
    reset
  }
}
