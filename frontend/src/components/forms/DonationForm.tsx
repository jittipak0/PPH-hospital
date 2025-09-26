import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../lib/api'
import { donationFormSchema, type DonationFormValues } from '../../lib/validators'

export const DonationForm: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [referenceId, setReferenceId] = useState<number | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      donorName: '',
      amount: 1000,
      channel: 'bank_transfer',
      phone: '',
      email: '',
      wantsReceipt: true,
      consent: false,
      notes: ''
    }
  })

  const onSubmit = async (values: DonationFormValues) => {
    try {
      setStatus('submitting')
      setError(null)
      const response = await api.submitDonation({
        donorName: values.donorName,
        amount: Number(values.amount),
        channel: values.channel,
        phone: values.phone,
        email: values.email,
        wantsReceipt: values.wantsReceipt,
        consent: values.consent,
        notes: values.notes
      })
      setReferenceId(response.data.id)
      setStatus('success')
      reset({
        donorName: '',
        amount: 1000,
        channel: 'bank_transfer',
        phone: '',
        email: '',
        wantsReceipt: true,
        consent: false,
        notes: ''
      })
    } catch (err) {
      console.error(err)
      setStatus('error')
      setError(err instanceof Error ? err.message : 'ไม่สามารถบันทึกการบริจาคได้')
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset disabled={status === 'submitting'}>
        <legend>แบบฟอร์มการรับบริจาค</legend>
        <div className="form-grid">
          <label>
            ชื่อผู้บริจาค / องค์กร
            <input type="text" {...register('donorName')} aria-invalid={Boolean(errors.donorName)} />
            {errors.donorName && <span className="error">{errors.donorName.message}</span>}
          </label>
          <label>
            จำนวนเงิน (บาท)
            <input type="number" step="0.01" {...register('amount', { valueAsNumber: true })} aria-invalid={Boolean(errors.amount)} />
            {errors.amount && <span className="error">{errors.amount.message}</span>}
          </label>
          <label>
            ช่องทางการบริจาค
            <select {...register('channel')} aria-invalid={Boolean(errors.channel)}>
              <option value="cash">เงินสด</option>
              <option value="bank_transfer">โอนผ่านธนาคาร</option>
              <option value="online">ชำระออนไลน์ (PromptPay/บัตร)</option>
            </select>
            {errors.channel && <span className="error">{errors.channel.message}</span>}
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
          <label className="form__notes">
            รายละเอียดเพิ่มเติม / ข้อความถึงโรงพยาบาล
            <textarea rows={4} {...register('notes')} aria-invalid={Boolean(errors.notes)} />
            {errors.notes && <span className="error">{errors.notes.message}</span>}
          </label>
        </div>
        <label className="consent">
          <input type="checkbox" {...register('wantsReceipt')} /> ต้องการใบเสร็จลดหย่อนภาษี
        </label>
        <label className="consent">
          <input type="checkbox" {...register('consent')} /> ยินยอมให้โรงพยาบาลจัดเก็บข้อมูลการบริจาคตามนโยบาย PDPA
        </label>
        {errors.consent && <span className="error">{errors.consent.message}</span>}
        <button type="submit" className="btn btn-primary">
          {status === 'submitting' ? 'กำลังบันทึก...' : 'ส่งแบบฟอร์มบริจาค'}
        </button>
        {status === 'success' && referenceId && (
          <p className="success" role="status">
            ขอบคุณสำหรับการสนับสนุน! หมายเลขอ้างอิงการบริจาค #{referenceId}
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
        .form__notes {
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

export default DonationForm
