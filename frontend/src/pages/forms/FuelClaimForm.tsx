import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Container } from '../../components/layout/Container'
import { useAuth } from '../../context/AuthContext'
import { http, ValidationError } from '../../lib/http'
import { useToast } from '../../components/common/ToastProvider'

type FormValues = {
  staff_id: string
  dept: string
  vehicle_plate: string
  trip_date: string
  liters: number | undefined
  amount: number | undefined
  receipt?: FileList
  note?: string
  pdpa: boolean
}

export const FuelClaimForm: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    setError,
    reset
  } = useForm<FormValues>({
    defaultValues: {
      staff_id: user?.id ?? '',
      dept: '',
      vehicle_plate: '',
      trip_date: '',
      liters: undefined,
      amount: undefined,
      note: '',
      pdpa: false
    }
  })
  const { showToast } = useToast()
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    setValue('staff_id', user?.id ?? '')
  }, [user, setValue])

  const onSubmit = async ({ receipt, pdpa: _pdpa, ...values }: FormValues) => {
    setSubmitError(null)
    if (values.liters === undefined || Number.isNaN(values.liters)) {
      setError('liters', { type: 'manual', message: 'กรุณาระบุปริมาณน้ำมัน' })
      return
    }
    if (values.amount === undefined || Number.isNaN(values.amount)) {
      setError('amount', { type: 'manual', message: 'กรุณาระบุจำนวนเงิน' })
      return
    }
    const formData = new FormData()
    formData.append('staff_id', values.staff_id)
    formData.append('dept', values.dept)
    formData.append('vehicle_plate', values.vehicle_plate)
    formData.append('trip_date', values.trip_date)
    formData.append('liters', String(values.liters))
    formData.append('amount', String(values.amount))
    if (values.note) {
      formData.append('note', values.note)
    }
    if (receipt && receipt.length > 0) {
      formData.append('receipt', receipt[0])
    }

    try {
      await http.postFormData('/api/forms/fuel-claims', formData)
      showToast('ส่งคำขอเบิกค่าน้ำมันเรียบร้อยแล้ว')
      const staffId = getValues('staff_id')
      reset()
      setValue('staff_id', staffId)
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
            <h1>ระบบเบิกจ่ายน้ำมัน</h1>
            <p>กรุณาเข้าสู่ระบบบุคลากรเพื่อใช้งานแบบฟอร์มเบิกน้ำมันและติดตามสถานะการอนุมัติ</p>
          </header>
          <div className="card">
            <p>ระบบนี้จำกัดเฉพาะบุคลากรที่ได้รับสิทธิ์เท่านั้น</p>
            <Link to="/login" className="btn btn-primary">
              ไปยังหน้าล็อกอินบุคลากร
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
          <h1>ยื่นคำขอเบิกค่าน้ำมัน</h1>
          <p>
            กรอกข้อมูลการเดินทางและแนบหลักฐานการเติมน้ำมัน ระบบจะบันทึกคำขอพร้อมบันทึกการตรวจสอบเพื่อความโปร่งใส ตามนโยบายคุ้มครองข้อมูลของหน่วยงาน
          </p>
        </header>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-field">
            <label htmlFor="staff_id">รหัสพนักงาน *</label>
            <input id="staff_id" type="text" readOnly {...register('staff_id', { required: 'กรุณาระบุรหัสพนักงาน' })} />
            {errors.staff_id && <p className="form-error">{errors.staff_id.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="dept">หน่วยงาน/แผนก *</label>
            <input id="dept" type="text" {...register('dept', { required: 'กรุณาระบุหน่วยงาน', maxLength: 255 })} />
            {errors.dept && <p className="form-error">{errors.dept.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="vehicle_plate">ทะเบียนรถที่ใช้เดินทาง *</label>
            <input id="vehicle_plate" type="text" {...register('vehicle_plate', { required: 'กรุณาระบุทะเบียนรถ', maxLength: 20 })} />
            {errors.vehicle_plate && <p className="form-error">{errors.vehicle_plate.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="trip_date">วันที่เดินทาง *</label>
            <input id="trip_date" type="date" {...register('trip_date', { required: 'กรุณาเลือกวันที่เดินทาง' })} />
            {errors.trip_date && <p className="form-error">{errors.trip_date.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="liters">ปริมาณน้ำมัน (ลิตร) *</label>
            <input
              id="liters"
              type="number"
              step="0.1"
              min="0.1"
              {...register('liters', {
                required: 'กรุณาระบุปริมาณน้ำมัน',
                valueAsNumber: true,
                min: { value: 0.1, message: 'ต้องมากกว่า 0' }
              })}
            />
            {errors.liters && <p className="form-error">{errors.liters.message}</p>}
          </div>

          <div className="form-field">
            <label htmlFor="amount">จำนวนเงิน (บาท) *</label>
            <input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              {...register('amount', {
                required: 'กรุณาระบุจำนวนเงิน',
                valueAsNumber: true,
                min: { value: 0, message: 'จำนวนเงินต้องไม่ติดลบ' }
              })}
            />
            {errors.amount && <p className="form-error">{errors.amount.message}</p>}
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="receipt">แนบใบเสร็จ (PDF/JPG/PNG)</label>
            <input id="receipt" type="file" accept=".pdf,.jpg,.jpeg,.png" {...register('receipt')} />
            {errors.receipt && <p className="form-error">{errors.receipt.message as string}</p>}
          </div>

          <div className="form-field form-field--full">
            <label htmlFor="note">รายละเอียดเพิ่มเติม</label>
            <textarea id="note" rows={4} {...register('note')} />
          </div>

          <div className="form-field form-field--full">
            <label className="checkbox-option">
              <input type="checkbox" {...register('pdpa', { required: 'กรุณายืนยันการยินยอมการใช้ข้อมูล' })} />
              <span>ยืนยันการใช้ข้อมูลเพื่อวัตถุประสงค์ภายในและการตรวจสอบตามระเบียบของโรงพยาบาล</span>
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
              {isSubmitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอเบิกน้ำมัน'}
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

export default FuelClaimForm
