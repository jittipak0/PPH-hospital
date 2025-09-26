import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Container } from '../../components/layout/Container'
import { http, ValidationError } from '../../lib/http'
import { useToast } from '../../components/common/ToastProvider'

const channels = [
  { value: 'opd', label: 'ผู้ป่วยนอก (OPD)' },
  { value: 'ipd', label: 'ผู้ป่วยใน (IPD)' },
  { value: 'online', label: 'ช่องทางออนไลน์' }
]

type FormValues = {
  channel: 'opd' | 'ipd' | 'online'
  score_service: number
  score_clean: number
  score_speed: number
  comment?: string
  contact_optin: boolean
  pdpa: boolean
}

const scoreOptions = [1, 2, 3, 4, 5]

export const SatisfactionSurveyForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      channel: 'opd',
      contact_optin: false,
      pdpa: false,
      score_service: 5,
      score_clean: 5,
      score_speed: 5
    }
  })
  const { showToast } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async ({ pdpa: _pdpa, ...values }: FormValues) => {
    setSubmitError(null)
    try {
      await http.postJson('/api/forms/satisfaction', values)
      showToast('บันทึกแบบประเมินเรียบร้อยแล้ว ขอบคุณสำหรับข้อเสนอแนะ')
      reset()
    } catch (error) {
      if (error instanceof ValidationError) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { type: 'server', message: messages.join(' ') })
        })
        showToast('ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบ', 'error')
        return
      }

      setSubmitError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
      showToast('ไม่สามารถส่งแบบประเมินได้', 'error')
    }
  }

  return (
    <Container>
      <section className="form-section">
        <header>
          <h1>ประเมินความพึงพอใจการรับบริการ</h1>
          <p>
            กรุณาให้คะแนนความพึงพอใจในประเด็นต่าง ๆ เพื่อช่วยให้ทีมงานพัฒนาคุณภาพบริการอย่างต่อเนื่อง คะแนน 1 หมายถึงไม่พึงพอใจเลย และ 5 หมายถึงพึงพอใจมากที่สุด
          </p>
        </header>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <fieldset className="form-field form-field--full">
            <legend>ท่านรับบริการผ่านช่องทางใด *</legend>
            <div className="radio-group">
              {channels.map((channel) => (
                <label key={channel.value} className="radio-option">
                  <input type="radio" value={channel.value} {...register('channel', { required: 'กรุณาเลือกช่องทางรับบริการ' })} />
                  <span>{channel.label}</span>
                </label>
              ))}
            </div>
            {errors.channel && <p className="form-error">{errors.channel.message}</p>}
          </fieldset>

          <div className="form-field">
            <label>การให้บริการโดยรวม *</label>
            <div className="likert">
              {scoreOptions.map((score) => (
                <label key={`service-${score}`}>
                  <input type="radio" value={score} {...register('score_service', { valueAsNumber: true, required: true })} />
                  <span>{score}</span>
                </label>
              ))}
            </div>
            {errors.score_service && <p className="form-error">กรุณาให้คะแนนการให้บริการ</p>}
          </div>

          <div className="form-field">
            <label>ความสะอาดและความปลอดภัยของสถานที่ *</label>
            <div className="likert">
              {scoreOptions.map((score) => (
                <label key={`clean-${score}`}>
                  <input type="radio" value={score} {...register('score_clean', { valueAsNumber: true, required: true })} />
                  <span>{score}</span>
                </label>
              ))}
            </div>
            {errors.score_clean && <p className="form-error">กรุณาให้คะแนนด้านความสะอาด</p>}
          </div>

          <div className="form-field">
            <label>ความรวดเร็วและการจัดการคิว *</label>
            <div className="likert">
              {scoreOptions.map((score) => (
                <label key={`speed-${score}`}>
                  <input type="radio" value={score} {...register('score_speed', { valueAsNumber: true, required: true })} />
                  <span>{score}</span>
                </label>
              ))}
            </div>
            {errors.score_speed && <p className="form-error">กรุณาให้คะแนนด้านความรวดเร็ว</p>}
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="comment">ข้อเสนอแนะเพิ่มเติม</label>
            <textarea id="comment" rows={4} {...register('comment', { maxLength: { value: 1000, message: 'ข้อความยาวเกิน 1000 ตัวอักษร' } })} />
            {errors.comment && <p className="form-error">{errors.comment.message}</p>}
          </div>

          <div className="form-field form-field--full">
            <label className="checkbox-option">
              <input type="checkbox" {...register('contact_optin')} />
              <span>ยินดีให้เจ้าหน้าที่ติดต่อกลับเพื่อรับทราบผลการดำเนินการ</span>
            </label>
          </div>

          <div className="form-field form-field--full">
            <label className="checkbox-option">
              <input type="checkbox" {...register('pdpa', { required: 'กรุณายืนยันการยินยอมตาม PDPA' })} />
              <span>รับทราบและยินยอมให้ใช้ข้อมูลเพื่อปรับปรุงคุณภาพบริการตามนโยบายความเป็นส่วนตัว</span>
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
              {isSubmitting ? 'กำลังส่งแบบประเมิน...' : 'ส่งแบบประเมิน'}
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
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .form-field--full {
          grid-column: 1 / -1;
        }
        .radio-group,
        .likert {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .likert label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          font-weight: 600;
        }
        .likert span {
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(15, 118, 110, 0.1);
        }
        .checkbox-option,
        .radio-option {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }
        .form-field textarea {
          padding: 0.65rem 0.75rem;
          border: 1px solid rgba(15, 23, 42, 0.15);
          border-radius: 10px;
          font: inherit;
          resize: vertical;
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

export default SatisfactionSurveyForm
