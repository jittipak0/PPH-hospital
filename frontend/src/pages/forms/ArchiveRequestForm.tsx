import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { useAuth } from '../../context/AuthContext'
import { http, ValidationError } from '../../lib/http'
import { useToast } from '../../components/common/ToastProvider'

type FormValues = {
  staff_id: string
  document_type: string
  ref_no: string
  needed_date: string
  note?: string
  pdpa: boolean
}

export const ArchiveRequestForm: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      staff_id: user?.id ?? '',
      document_type: '',
      ref_no: '',
      needed_date: '',
      note: '',
      pdpa: false
    }
  })
  const { showToast } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setValue('staff_id', user?.id ?? '')
  }, [user, setValue])

  const onSubmit = async ({ pdpa: _pdpa, ...values }: FormValues) => {
    setSubmitError(null)
    try {
      await http.postJson('/api/forms/archive-requests', values)
      showToast('บันทึกคำขอเรียบร้อยแล้ว')
      reset()
      setValue('staff_id', user?.id ?? '')
    } catch (error) {
      if (error instanceof ValidationError) {
        Object.entries(error.errors).forEach(([field, messages]) => {
          setError(field as keyof FormValues, { type: 'server', message: messages.join(' ') })
        })
        showToast('ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', 'error')
        return
      }

      setSubmitError(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ')
      showToast('ไม่สามารถส่งคำขอได้', 'error')
    }
  }

  if (!isAuthenticated) {
    return (
      <Container>
        <section className="form-section">
          <header>
            <h1>ศูนย์จัดเก็บเอกสาร</h1>
            <p>กรุณาเข้าสู่ระบบเพื่อขอเบิกแฟ้มเอกสารและติดตามสถานะการอนุมัติ</p>
          </header>
          <div className="card">
            <p>สำหรับเจ้าหน้าที่ที่ได้รับสิทธิ์เท่านั้น</p>
            <Link to="/login" className="btn btn-primary">
              เข้าสู่ระบบบุคลากร
            </Link>
          </div>
        </section>
      </Container>
    )
  }

  return (
    <Container>
      <section className="form-section">
        <header>
          <h1>คำขอใช้เอกสารจากศูนย์จัดเก็บ</h1>
          <p>ระบุประเภทเอกสารและรหัสอ้างอิงที่ต้องการใช้ พร้อมกำหนดวันที่ต้องใช้เอกสารอย่างน้อย 1 วันทำการล่วงหน้า</p>
        </header>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label htmlFor="staff_id">รหัสพนักงาน *</label>
            <input id="staff_id" type="text" readOnly {...register('staff_id', { required: 'กรุณาระบุรหัสพนักงาน' })} />
            {errors.staff_id && <p className="form-error">{errors.staff_id.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="document_type">ประเภทเอกสาร *</label>
            <input id="document_type" type="text" {...register('document_type', { required: 'กรุณาระบุประเภทเอกสาร', maxLength: 255 })} />
            {errors.document_type && <p className="form-error">{errors.document_type.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="ref_no">รหัสอ้างอิง/เลขที่แฟ้ม *</label>
            <input id="ref_no" type="text" {...register('ref_no', { required: 'กรุณาระบุเลขที่แฟ้ม', maxLength: 255 })} />
            {errors.ref_no && <p className="form-error">{errors.ref_no.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="needed_date">วันที่ต้องใช้ *</label>
            <input id="needed_date" type="date" {...register('needed_date', { required: 'กรุณาเลือกวันที่ต้องการใช้เอกสาร' })} />
            {errors.needed_date && <p className="form-error">{errors.needed_date.message}</p>}
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="note">รายละเอียดเพิ่มเติม</label>
            <textarea id="note" rows={4} {...register('note')} />
          </div>

          <div className="form-field form-field--full">
            <label className="checkbox-option">
              <input type="checkbox" {...register('pdpa', { required: 'กรุณายืนยันการยินยอมการใช้ข้อมูล' })} />
              <span>ยินยอมให้ใช้ข้อมูลเพื่อการจัดการงานสารบรรณและการตรวจสอบภายใน</span>
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
              {isSubmitting ? 'กำลังบันทึกคำขอ...' : 'ส่งคำขอใช้เอกสาร'}
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

export default ArchiveRequestForm
