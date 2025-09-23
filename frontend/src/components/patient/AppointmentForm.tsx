import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, type Doctor } from '../../lib/api'
import { appointmentSchema, type AppointmentFormValues } from '../../lib/validators'
import { useAppointment } from '../../hooks/useAppointment'

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
    return <p role="alert" style={{ color: 'crimson' }}>{error}</p>
  }

  return (
    <form className="card appointment-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={status === 'submitting'}>
        <legend>นัดหมายแพทย์ออนไลน์</legend>
        <div className="form-grid">
          <label>
            ชื่อ-นามสกุลผู้ป่วย
            <input type="text" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} />
            {errors.fullName && <span className="error">{errors.fullName.message}</span>}
          </label>
          <label>
            เลขบัตรประชาชน 13 หลัก
            <input type="text" inputMode="numeric" {...register('nationalId')} aria-invalid={Boolean(errors.nationalId)} />
            {errors.nationalId && <span className="error">{errors.nationalId.message}</span>}
          </label>
          <label>
            รหัสผู้ป่วย (ถ้ามี)
            <input type="text" {...register('patientCode')} aria-invalid={Boolean(errors.patientCode)} />
            {errors.patientCode && <span className="error">{errors.patientCode.message}</span>}
          </label>
          <label>
            เลือกแผนกที่ต้องการเข้ารับบริการ
            <select {...register('department')} aria-invalid={Boolean(errors.department)}>
              <option value="">-- กรุณาเลือก --</option>
              {departmentOptions.map((department) => (
                <option value={department} key={department}>
                  {department}
                </option>
              ))}
            </select>
            {errors.department && <span className="error">{errors.department.message}</span>}
          </label>
          <label>
            เลือกแพทย์
            <select {...register('doctorId')} aria-invalid={Boolean(errors.doctorId)}>
              <option value="">-- กรุณาเลือก --</option>
              {doctorsInDepartment.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.specialty})
                </option>
              ))}
            </select>
            {errors.doctorId && <span className="error">{errors.doctorId.message}</span>}
          </label>
          <label>
            วันที่ต้องการนัดหมาย
            <input type="date" {...register('appointmentDate')} aria-invalid={Boolean(errors.appointmentDate)} />
            {errors.appointmentDate && <span className="error">{errors.appointmentDate.message}</span>}
          </label>
          <label>
            เวลาที่ต้องการนัดหมาย
            <input type="time" {...register('appointmentTime')} aria-invalid={Boolean(errors.appointmentTime)} />
            {errors.appointmentTime && <span className="error">{errors.appointmentTime.message}</span>}
          </label>
          <label>
            CAPTCHA ป้องกันสแปม (กรุณากรอก 1234)
            <input type="text" inputMode="numeric" {...register('captcha')} aria-invalid={Boolean(errors.captcha)} />
            {errors.captcha && <span className="error">{errors.captcha.message}</span>}
          </label>
        </div>
        <label className="consent-checkbox">
          <input type="checkbox" {...register('consent')} />
          <span>
            ข้าพเจ้าตกลงให้โรงพยาบาลจัดเก็บและใช้ข้อมูลส่วนบุคคลตาม{' '}
            <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
              นโยบายความเป็นส่วนตัว
            </a>
          </span>
        </label>
        {errors.consent && <span className="error">{errors.consent.message}</span>}
        <button type="submit" className="submit-button">
          {status === 'submitting' ? 'กำลังส่งข้อมูล...' : 'ยืนยันการนัดหมาย'}
        </button>
        {submitError && <p className="error" role="alert">{submitError}</p>}
        {status === 'success' && referenceCode && (
          <p className="success" role="status">
            ส่งคำขอนัดหมายสำเร็จ! หมายเลขอ้างอิงของคุณคือ {referenceCode} เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยันอีกครั้ง
          </p>
        )}
      </fieldset>
      <style>{`
        .appointment-form {
          border-top: 4px solid var(--color-primary);
        }
        .appointment-form fieldset {
          border: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-weight: 600;
        }
        input, select {
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(15, 23, 42, 0.2);
          font-size: 1rem;
        }
        .consent-checkbox {
          flex-direction: row;
          align-items: flex-start;
          gap: 0.75rem;
          font-weight: 500;
        }
        .consent-checkbox input {
          margin-top: 0.25rem;
        }
        .submit-button {
          align-self: flex-start;
          background: var(--color-secondary);
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
        }
        .error {
          color: #b91c1c;
          font-size: 0.9rem;
        }
        .success {
          color: #047857;
          font-weight: 600;
        }
      `}</style>
    </form>
  )
}
