import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../lib/api'
import { medicalRecordRequestSchema, type MedicalRecordRequestFormValues } from '../../lib/validators'

export const MedicalRecordRequestForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [referenceId, setReferenceId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<MedicalRecordRequestFormValues>({
    resolver: zodResolver(medicalRecordRequestSchema),
    defaultValues: {
      fullName: '',
      hn: '',
      citizenId: '',
      phone: '',
      email: '',
      address: '',
      reason: '',
      consent: false,
      idcardFile: undefined as unknown as File
    }
  })

  const onSubmit = async (values: MedicalRecordRequestFormValues) => {
    try {
      setStatus('submitting')
      setError(null)
      const response = await api.submitMedicalRecordRequest({
        fullName: values.fullName,
        hn: values.hn,
        citizenId: values.citizenId,
        phone: values.phone,
        email: values.email,
        address: values.address,
        reason: values.reason,
        consent: values.consent,
        idcardFile: values.idcardFile
      })
      setReferenceId(response.data.id)
      setStatus('success')
      reset({
        fullName: '',
        hn: '',
        citizenId: '',
        phone: '',
        email: '',
        address: '',
        reason: '',
        consent: false,
        idcardFile: undefined as unknown as File
      })
    } catch (err) {
      console.error(err)
      setStatus('error')
      setError(err instanceof Error ? err.message : 'ไม่สามารถส่งคำขอได้')
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={status === 'submitting'}>
        <legend>แบบขอประวัติการรักษา</legend>
        <div className="form-grid">
          <label>
            ชื่อ-นามสกุล
            <input type="text" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} />
            {errors.fullName && <span className="error">{errors.fullName.message}</span>}
          </label>
          <label>
            หมายเลข HN
            <input type="text" {...register('hn')} aria-invalid={Boolean(errors.hn)} />
            {errors.hn && <span className="error">{errors.hn.message}</span>}
          </label>
          <label>
            เลขบัตรประชาชน
            <input type="text" inputMode="numeric" {...register('citizenId')} aria-invalid={Boolean(errors.citizenId)} />
            {errors.citizenId && <span className="error">{errors.citizenId.message}</span>}
          </label>
          <label>
            เบอร์โทรศัพท์ติดต่อ
            <input type="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </label>
          <label>
            อีเมล
            <input type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </label>
          <label className="form__address">
            ที่อยู่จัดส่งเอกสาร
            <textarea rows={3} {...register('address')} aria-invalid={Boolean(errors.address)} />
            {errors.address && <span className="error">{errors.address.message}</span>}
          </label>
          <label className="form__reason">
            เหตุผลในการขอประวัติการรักษา
            <textarea rows={4} {...register('reason')} aria-invalid={Boolean(errors.reason)} />
            {errors.reason && <span className="error">{errors.reason.message}</span>}
          </label>
          <label>
            สำเนาบัตรประชาชน (PDF/JPG/PNG)
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(event) => {
                const file = event.target.files?.[0]
                setValue('idcardFile', file as File, { shouldValidate: true })
              }}
            />
            {errors.idcardFile && <span className="error">{errors.idcardFile.message}</span>}
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" {...register('consent')} /> ยินยอมให้โรงพยาบาลจัดเก็บและใช้ข้อมูลตามมาตรการ PDPA
        </label>
        {errors.consent && <span className="error">{errors.consent.message}</span>}
        <button type="submit" className="btn btn-primary">
          {status === 'submitting' ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอ'}
        </button>
        {status === 'success' && referenceId && (
          <p className="success" role="status">
            ส่งคำขอสำเร็จ หมายเลขอ้างอิง #{referenceId} ทีมงานจะติดต่อกลับภายใน 3 วันทำการ
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
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem 1.5rem;
        }
        .form__address,
        .form__reason {
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
          margin: 1rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }
      `}</style>
    </form>
  )
}

export default MedicalRecordRequestForm
