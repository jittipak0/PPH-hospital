import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Container } from '../../components/layout/Container'
import { http, ValidationError } from '../../lib/http'
import { useToast } from '../../components/common/ToastProvider'

type FormValues = {
  citizen_id: string
  hn: string
  fullname: string
  dob: string
  phone: string
  email: string
  purpose: string
  date_range?: string
  delivery_method: 'pickup' | 'post' | 'elec'
  consent: boolean
  files: FileList
}

const deliveryOptions = [
  { value: 'pickup', label: 'รับเองที่โรงพยาบาล' },
  { value: 'post', label: 'จัดส่งทางไปรษณีย์ (คิดค่าบริการตามจริง)' },
  { value: 'elec', label: 'รับผ่านอีเมลแบบเข้ารหัส' }
]

export const MedicalRecordRequestForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      delivery_method: 'pickup',
      consent: false
    }
  })
  const { showToast } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null)
    const formData = new FormData()
    formData.append('citizen_id', values.citizen_id)
    formData.append('hn', values.hn)
    formData.append('fullname', values.fullname)
    formData.append('dob', values.dob)
    formData.append('phone', values.phone)
    formData.append('email', values.email)
    formData.append('purpose', values.purpose)
    if (values.date_range) {
      formData.append('date_range', values.date_range)
    }
    formData.append('delivery_method', values.delivery_method)
    formData.append('consent', values.consent ? '1' : '0')

    if (values.files && values.files.length > 0) {
      Array.from(values.files).forEach((file) => {
        formData.append('files[]', file)
      })
    }

    try {
      await http.postFormData('/api/forms/medical-records', formData)
      showToast('ส่งคำขอเรียบร้อยแล้ว')
      reset()
    } catch (error) {
      if (error instanceof ValidationError) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { type: 'server', message: messages.join(' ') })
        })
        showToast('ข้อมูลบางส่วนไม่ถูกต้อง', 'error')
        return
      }

      setSubmitError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
      showToast('ไม่สามารถส่งคำขอได้', 'error')
    }
  }

  return (
    <Container>
      <section className="form-section">
        <header>
          <h1>ขอสำเนาประวัติการรักษา</h1>
          <p>
            โปรดกรอกข้อมูลให้ครบถ้วนเพื่อช่วยให้เจ้าหน้าที่ตรวจสอบตัวตนและดำเนินการได้รวดเร็ว ระบบจะติดต่อกลับภายใน 3 วันทำการ
          </p>
        </header>
        <form onSubmit={handleSubmit(onSubmit)} className="form-grid" noValidate>
          <div className="form-field">
            <label htmlFor="citizen_id">เลขบัตรประชาชน *</label>
            <input
              id="citizen_id"
              type="text"
              {...register('citizen_id', {
                required: 'กรุณากรอกเลขบัตรประชาชน',
                pattern: { value: /^\d{6,13}$/, message: 'รูปแบบเลขบัตรไม่ถูกต้อง' }
              })}
            />
            {errors.citizen_id && <p className="form-error">{errors.citizen_id.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="hn">HN *</label>
            <input
              id="hn"
              type="text"
              {...register('hn', { required: 'กรุณากรอกหมายเลข HN', maxLength: { value: 20, message: 'HN ต้องไม่เกิน 20 ตัวอักษร' } })}
            />
            {errors.hn && <p className="form-error">{errors.hn.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="fullname">ชื่อ-นามสกุลผู้ยื่นคำขอ *</label>
            <input id="fullname" type="text" {...register('fullname', { required: 'กรุณากรอกชื่อ-นามสกุล' })} />
            {errors.fullname && <p className="form-error">{errors.fullname.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="dob">วันเดือนปีเกิด *</label>
            <input id="dob" type="date" {...register('dob', { required: 'กรุณาเลือกวันเดือนปีเกิด' })} />
            {errors.dob && <p className="form-error">{errors.dob.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="phone">เบอร์โทรศัพท์สำหรับติดต่อกลับ *</label>
            <input id="phone" type="tel" {...register('phone', { required: 'กรุณากรอกเบอร์โทรศัพท์', maxLength: 30 })} />
            {errors.phone && <p className="form-error">{errors.phone.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="email">อีเมล *</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'กรุณากรอกอีเมล', pattern: { value: /.+@.+\..+/, message: 'รูปแบบอีเมลไม่ถูกต้อง' } })}
            />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="purpose">วัตถุประสงค์ *</label>
            <textarea
              id="purpose"
              rows={4}
              {...register('purpose', { required: 'กรุณาระบุวัตถุประสงค์', minLength: { value: 10, message: 'กรุณาระบุรายละเอียดเพิ่มเติม' } })}
            />
            {errors.purpose && <p className="form-error">{errors.purpose.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="date_range">ช่วงเวลาที่ต้องการ (ถ้ามี)</label>
            <input id="date_range" type="text" placeholder="เช่น มกราคม 2566 - ธันวาคม 2566" {...register('date_range')} />
          </div>

          <fieldset className="form-field form-field--full">
            <legend>วิธีรับเอกสาร *</legend>
            {deliveryOptions.map((option) => (
              <label key={option.value} className="radio-option">
                <input type="radio" value={option.value} {...register('delivery_method', { required: 'กรุณาเลือกวิธีรับเอกสาร' })} />
                <span>{option.label}</span>
              </label>
            ))}
            {errors.delivery_method && <p className="form-error">{errors.delivery_method.message}</p>}
          </fieldset>

          <div className="form-field form-field--full">
            <label htmlFor="files">แนบไฟล์ประกอบ (สำเนาบัตรประชาชน ใบมอบอำนาจ ฯลฯ) สูงสุด 5 ไฟล์</label>
            <input
              id="files"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              {...register('files')}
            />
            {errors.files && <p className="form-error">{errors.files.message as string}</p>}
          </div>

          <div className="form-field form-field--full">
            <label className="checkbox-option">
              <input type="checkbox" {...register('consent', { required: 'กรุณายืนยันการยินยอมการใช้ข้อมูลส่วนบุคคล' })} />
              <span>
                ข้าพเจ้ายินยอมให้โรงพยาบาลใช้และจัดเก็บข้อมูลส่วนบุคคลตามวัตถุประสงค์ของการให้บริการ รวมทั้งยืนยันว่าข้อมูลที่กรอกถูกต้อง
              </span>
            </label>
            {errors.consent && <p className="form-error">{errors.consent.message}</p>}
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
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}
            </button>
          </div>
        </form>
      </section>
      <style>{`
        .form-section {
          padding-bottom: 3rem;
        }
        .form-section header {
          margin-bottom: 1.5rem;
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
        .form-field label,
        .form-field legend {
          font-weight: 600;
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
        .radio-option,
        .checkbox-option {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          font-weight: 500;
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

export default MedicalRecordRequestForm
