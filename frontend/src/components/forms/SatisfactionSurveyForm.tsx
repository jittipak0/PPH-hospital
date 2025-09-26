import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../lib/api'
import { satisfactionSurveySchema, type SatisfactionSurveyFormValues } from '../../lib/validators'

export const SatisfactionSurveyForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SatisfactionSurveyFormValues>({
    resolver: zodResolver(satisfactionSurveySchema),
    defaultValues: {
      fullName: '',
      hn: '',
      serviceDate: '',
      serviceType: 'outpatient',
      rating: 5,
      feedback: '',
      phone: '',
      email: '',
      consent: false
    }
  })

  const onSubmit = async (values: SatisfactionSurveyFormValues) => {
    try {
      setStatus('submitting')
      setError(null)
      await api.submitSatisfactionSurvey({
        fullName: values.fullName,
        hn: values.hn || undefined,
        serviceDate: values.serviceDate,
        serviceType: values.serviceType,
        rating: values.rating,
        feedback: values.feedback || undefined,
        phone: values.phone || undefined,
        email: values.email || undefined,
        consent: values.consent
      })
      setStatus('success')
      reset({
        fullName: '',
        hn: '',
        serviceDate: '',
        serviceType: 'outpatient',
        rating: 5,
        feedback: '',
        phone: '',
        email: '',
        consent: false
      })
    } catch (err) {
      console.error(err)
      setStatus('error')
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกแบบประเมินได้')
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={status === 'submitting'}>
        <legend>แบบประเมินความพึงพอใจ</legend>
        <div className="form-grid">
          <label>
            ชื่อ-นามสกุล
            <input type="text" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} />
            {errors.fullName && <span className="error">{errors.fullName.message}</span>}
          </label>
          <label>
            เลข HN (ถ้ามี)
            <input type="text" {...register('hn')} aria-invalid={Boolean(errors.hn)} />
            {errors.hn && <span className="error">{errors.hn.message}</span>}
          </label>
          <label>
            วันที่เข้ารับบริการ
            <input type="date" {...register('serviceDate')} aria-invalid={Boolean(errors.serviceDate)} />
            {errors.serviceDate && <span className="error">{errors.serviceDate.message}</span>}
          </label>
          <label>
            ประเภทบริการ
            <select {...register('serviceType')} aria-invalid={Boolean(errors.serviceType)}>
              <option value="outpatient">ผู้ป่วยนอก</option>
              <option value="inpatient">ผู้ป่วยใน</option>
              <option value="emergency">ฉุกเฉิน</option>
              <option value="telemedicine">บริการทางไกล</option>
            </select>
            {errors.serviceType && <span className="error">{errors.serviceType.message}</span>}
          </label>
          <label>
            ให้คะแนนความพึงพอใจ (1-5)
            <input type="number" min={1} max={5} {...register('rating', { valueAsNumber: true })} aria-invalid={Boolean(errors.rating)} />
            {errors.rating && <span className="error">{errors.rating.message}</span>}
          </label>
          <label className="form__feedback">
            ความคิดเห็นเพิ่มเติม
            <textarea rows={4} {...register('feedback')} aria-invalid={Boolean(errors.feedback)} />
            {errors.feedback && <span className="error">{errors.feedback.message}</span>}
          </label>
          <label>
            เบอร์โทรศัพท์ (ถ้ามี)
            <input type="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </label>
          <label>
            อีเมล (ถ้ามี)
            <input type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" {...register('consent')} /> ยืนยันการยินยอมให้จัดเก็บข้อมูลเพื่อนำไปปรับปรุงบริการ
        </label>
        {errors.consent && <span className="error">{errors.consent.message}</span>}
        <button type="submit" className="btn btn-primary">
          {status === 'submitting' ? 'กำลังบันทึก...' : 'ส่งแบบประเมิน'}
        </button>
        {status === 'success' && (
          <p className="success" role="status">
            ขอบคุณสำหรับความคิดเห็นของคุณ เราจะนำไปปรับปรุงการบริการต่อไป
          </p>
        )}
        {status === 'error' && error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
      </fieldset>
      <style>{`
        .form {
          border-top: 4px solid var(--color-primary);
          display: block;
          padding: 1.5rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem 1.5rem;
        }
        .form__feedback {
          grid-column: 1 / -1;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-weight: 600;
        }
        input,
        textarea,
        select {
          padding: 0.65rem 0.75rem;
          border-radius: 12px;
          border: 1px solid rgba(15, 23, 42, 0.15);
          font-size: 1rem;
        }
        .error {
          color: #dc2626;
          font-size: 0.9rem;
        }
        .success {
          color: #0f766e;
          margin-top: 1rem;
        }
        .consent {
          margin: 0.75rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }
      `}</style>
    </form>
  )
}

export default SatisfactionSurveyForm
