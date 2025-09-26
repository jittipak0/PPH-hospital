import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, type Doctor } from '../../lib/api'
import { appointmentSchema, type AppointmentFormValues } from '../../lib/validators'
import { useAppointment } from '../../hooks/useAppointment'
import styles from './AppointmentForm.module.scss'

const CAPTCHA_TOKEN = '1234'

export const AppointmentForm: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { submitAppointment, status, referenceCode, error: submitError, reset } = useAppointment()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError: setFormError,
    reset: resetForm
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
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
        const data = await api.fetchDoctors()
        if (!cancelled) {
          setDoctors(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError('ไม่สามารถโหลดรายชื่อแพทย์สำหรับการนัดหมายได้')
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
  }, [])

  const departmentOptions = useMemo(() => Array.from(new Set(doctors.map((doctor) => doctor.department))), [doctors])
  const selectedDepartment = watch('department')
  const doctorsInDepartment = useMemo(
    () => doctors.filter((doctor) => !selectedDepartment || doctor.department === selectedDepartment),
    [doctors, selectedDepartment]
  )

  const onSubmit = async (values: AppointmentFormValues) => {
    if (values.captcha !== CAPTCHA_TOKEN) {
      setFormError('captcha', { type: 'validate', message: 'กรุณากรอก CAPTCHA 1234 เพื่อตรวจสอบความปลอดภัย' })
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
  }, [status, reset])

  if (loading) {
    return <p role="status">กำลังเตรียมแบบฟอร์มนัดหมาย...</p>
  }

  if (error) {
    return (
      <p role="alert" className={styles.error}>
        {error}
      </p>
    )
  }

  return (
    <form className={`card ${styles.appointmentForm}`} onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset className={styles.fieldset} disabled={status === 'submitting'}>
        <legend>นัดหมายแพทย์ออนไลน์</legend>
        <div className={styles.formGrid}>
          <label className={styles.label}>
            ชื่อ-นามสกุลผู้ป่วย
            <input
              className={styles.input}
              type="text"
              {...register('fullName')}
              aria-invalid={Boolean(errors.fullName)}
            />
            {errors.fullName ? <span className={styles.error}>{errors.fullName.message}</span> : null}
          </label>
          <label className={styles.label}>
            เลขบัตรประชาชน 13 หลัก
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              {...register('nationalId')}
              aria-invalid={Boolean(errors.nationalId)}
            />
            {errors.nationalId ? <span className={styles.error}>{errors.nationalId.message}</span> : null}
          </label>
          <label className={styles.label}>
            รหัสผู้ป่วย (ถ้ามี)
            <input
              className={styles.input}
              type="text"
              {...register('patientCode')}
              aria-invalid={Boolean(errors.patientCode)}
            />
            {errors.patientCode ? <span className={styles.error}>{errors.patientCode.message}</span> : null}
          </label>
          <label className={styles.label}>
            เลือกแผนกที่ต้องการเข้ารับบริการ
            <select className={styles.select} {...register('department')} aria-invalid={Boolean(errors.department)}>
              <option value="">-- กรุณาเลือก --</option>
              {departmentOptions.map((department) => (
                <option value={department} key={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department ? <span className={styles.error}>{errors.department.message}</span> : null}
          </label>
          <label className={styles.label}>
            เลือกแพทย์
            <select className={styles.select} {...register('doctorId')} aria-invalid={Boolean(errors.doctorId)}>
              <option value="">-- กรุณาเลือก --</option>
              {doctorsInDepartment.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.specialty})
                </option>
              ))}
            </select>
            {errors.doctorId ? <span className={styles.error}>{errors.doctorId.message}</span> : null}
          </label>
          <label className={styles.label}>
            วันที่ต้องการนัดหมาย
            <input
              className={styles.input}
              type="date"
              {...register('appointmentDate')}
              aria-invalid={Boolean(errors.appointmentDate)}
            />
            {errors.appointmentDate ? <span className={styles.error}>{errors.appointmentDate.message}</span> : null}
          </label>
          <label className={styles.label}>
            เวลาที่ต้องการนัดหมาย
            <input
              className={styles.input}
              type="time"
              {...register('appointmentTime')}
              aria-invalid={Boolean(errors.appointmentTime)}
            />
            {errors.appointmentTime ? <span className={styles.error}>{errors.appointmentTime.message}</span> : null}
          </label>
          <label className={styles.label}>
            CAPTCHA ป้องกันสแปม (กรุณากรอก 1234)
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              {...register('captcha')}
              aria-invalid={Boolean(errors.captcha)}
            />
            {errors.captcha ? <span className={styles.error}>{errors.captcha.message}</span> : null}
          </label>
        </div>
        <label className={`${styles.label} ${styles.consent}`}>
          <input className={styles.consentInput} type="checkbox" {...register('consent')} />
          <span>
            ข้าพเจ้าตกลงให้โรงพยาบาลจัดเก็บและใช้ข้อมูลส่วนบุคคลตาม{' '}
            <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
              นโยบายความเป็นส่วนตัว
            </a>
          </span>
        </label>
        {errors.consent ? <span className={styles.error}>{errors.consent.message}</span> : null}
        <button type="submit" className={styles.submitButton}>
          {status === 'submitting' ? 'กำลังส่งข้อมูล...' : 'ยืนยันการนัดหมาย'}
        </button>
        {submitError ? (
          <p className={styles.error} role="alert">
            {submitError}
          </p>
        ) : null}
        {status === 'success' && referenceCode && (
          <p className={styles.success} role="status">
            ส่งคำขอนัดหมายสำเร็จ! หมายเลขอ้างอิงของคุณคือ {referenceCode} เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันอีกครั้ง
          </p>
        )}
      </fieldset>
    </form>
  )
}
