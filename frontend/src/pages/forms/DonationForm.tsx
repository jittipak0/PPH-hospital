import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Container } from '../../components/layout/Container'
import { http, ValidationError } from '../../lib/http'
import { useToast } from '../../components/common/ToastProvider'

const donationChannels = [
  { value: 'bank', label: 'โอนผ่านธนาคาร' },
  { value: 'qr', label: 'สแกน QR พร้อมเพย์' },
  { value: 'cash', label: 'บริจาคเป็นเงินสด' }
]

type FormValues = {
  donor_name: string
  phone?: string
  email?: string
  amount: number
  channel: 'bank' | 'qr' | 'cash'
  message?: string
  pdpa: boolean
}

export const DonationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      channel: 'bank',
      pdpa: false
    }
  })
  const { showToast } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async ({ pdpa: _pdpa, ...values }: FormValues) => {
    setSubmitError(null)

    try {
      await http.postJson('/api/forms/donations', values)
      showToast('ส่งคำขอบริจาคเรียบร้อยแล้ว')
      reset()
    } catch (error) {
      if (error instanceof ValidationError) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { type: 'server', message: messages.join(' ') })
        })
        showToast('ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', 'error')
        return
      }

      setSubmitError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
      showToast('ไม่สามารถส่งข้อมูลได้', 'error')
    }
  }

  return (
    <Container>
      <section className="form-section">
        <header>
          <h1>แบบฟอร์มแจ้งความประสงค์บริจาค</h1>
          <p>
            ขอบคุณที่ร่วมสนับสนุนการทำงานของโรงพยาบาล โปรดระบุจำนวนเงินและช่องทางที่สะดวก พร้อมข้อมูลติดต่อเพื่อให้เจ้าหน้าที่ส่งหลักฐานการรับเงินกลับไป
          </p>
        </header>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label htmlFor="donor_name">ชื่อ-นามสกุลผู้บริจาค *</label>
            <input
              id="donor_name"
              type="text"
              {...register('donor_name', { required: 'กรุณาระบุชื่อ-นามสกุล', maxLength: { value: 255, message: 'ชื่อยาวเกินไป' } })}
            />
            {errors.donor_name && <p className="form-error">{errors.donor_name.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="phone">เบอร์โทรศัพท์ที่ติดต่อได้</label>
            <input id="phone" type="tel" {...register('phone', { maxLength: 30 })} />
            {errors.phone && <p className="form-error">{errors.phone.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="email">อีเมลสำหรับส่งหลักฐาน</label>
            <input
              id="email"
              type="email"
              {...register('email', { pattern: { value: /.+@.+\..+/, message: 'รูปแบบอีเมลไม่ถูกต้อง' } })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="amount">จำนวนเงินที่บริจาค (บาท) *</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="1"
              {...register('amount', {
                required: 'กรุณาระบุจำนวนเงิน',
                valueAsNumber: true,
                min: { value: 1, message: 'จำนวนเงินต้องมากกว่า 0' }
              })}
            />
            {errors.amount && <p className="form-error">{errors.amount.message}</p>}
          </div>

          <fieldset className="form-field form-field--full">
            <legend>ช่องทางการบริจาค *</legend>
            <div className="radio-group">
              {donationChannels.map((channel) => (
                <label key={channel.value} className="radio-option">
                  <input type="radio" value={channel.value} {...register('channel', { required: 'กรุณาเลือกช่องทางบริจาค' })} />
                  <span>{channel.label}</span>
                </label>
              ))}
            </div>
            {errors.channel && <p className="form-error">{errors.channel.message}</p>}
          </fieldset>

          <div className="form-field form-field--full">
            <label htmlFor="message">ข้อความถึงทีมงาน (ถ้ามี)</label>
            <textarea id="message" rows={4} {...register('message', { maxLength: { value: 500, message: 'ข้อความยาวเกิน 500 ตัวอักษร' } })} />
            {errors.message && <p className="form-error">{errors.message.message}</p>}
          </div>

          <div className="form-field form-field--full">
            <label className="checkbox-option">
              <input type="checkbox" {...register('pdpa', { required: 'กรุณายืนยันการยินยอมตาม PDPA' })} />
              <span>
                ข้าพเจ้ายินยอมให้โรงพยาบาลจัดเก็บและใช้ข้อมูลส่วนบุคคลเพื่อประสานงานด้านการบริจาค ตามนโยบายความเป็นส่วนตัว และรับทราบว่าจะมีการติดต่อกลับเพื่อยืนยันข้อมูล
              </span>
            </label>
            {errors.pdpa && <p className="form-error">{errors.pdpa.message}</p>}
          </div>

          {submitError && (
            <div className="form-field form-field--full">
              <p className="form-error" role="alert">
                {submitError}
              </p>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งแบบฟอร์มบริจาค'}
            </button>
          </div>
        </form>
      </section>
      <style>{`
        .form-section {
          padding-bottom: 3rem;
        }
        .form-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-field--full {
          grid-column: 1 / -1;
        }
        .form-field input,
        .form-field textarea {
          padding: 0.65rem 0.75rem;
          border: 1px solid rgba(15, 23, 42, 0.15);
          border-radius: 10px;
          font: inherit;
        }
        .form-field textarea {
          resize: vertical;
        }
        .radio-group {
          display: grid;
          gap: 0.5rem;
        }
        .radio-option,
        .checkbox-option {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }
        .form-error {
          color: #ef4444;
          font-size: 0.9rem;
        }
        .form-actions {
          grid-column: 1 / -1;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </Container>
  )
}

export default DonationForm
