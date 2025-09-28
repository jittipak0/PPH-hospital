import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/seo/PageMeta'
import { formsApi, FormApiError, type ValidationErrors } from '../../lib/formsApi'
import { medicalRecordRequestSchema, type MedicalRecordRequestFormValues } from '../../lib/validators'
import styles from './Forms.module.scss'

const fieldNameMap: Record<string, keyof MedicalRecordRequestFormValues> = {
  full_name: 'fullName',
  hn: 'hn',
  citizen_id: 'citizenId',
  phone: 'phone',
  email: 'email',
  address: 'address',
  reason: 'reason',
  consent: 'consent'
}

const applyFieldErrors = (
  errors: ValidationErrors,
  setError: ReturnType<typeof useForm<MedicalRecordRequestFormValues>>['setError']
) => {
  Object.entries(errors).forEach(([field, messages]) => {
    const mapped = fieldNameMap[field] ?? (field as keyof MedicalRecordRequestFormValues)
    const [message] = messages
    if (message) {
      setError(mapped, { type: 'server', message })
    }
  })
}

export const MedicalRecordRequestPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [referenceId, setReferenceId] = useState<string>('')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
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
      consent: false
    }
  })

  const resetFileInput = () => {
    setSelectedFile(null)
    setFileError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      resetFileInput()
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    const maxSizeMb = 5
    if (!allowedTypes.includes(file.type)) {
      setFileError('กรุณาเลือกไฟล์ PDF, JPG หรือ PNG เท่านั้น')
      event.target.value = ''
      setSelectedFile(null)
      return
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      setFileError(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSizeMb} MB`)
      event.target.value = ''
      setSelectedFile(null)
      return
    }

    setFileError(null)
    setSelectedFile(file)
  }

  const onSubmit = handleSubmit(async (values) => {
    setStatus('idle')
    setStatusMessage('')
    setReferenceId('')

    try {
      const response = await formsApi.submitMedicalRecordRequest({
        fullName: values.fullName,
        hn: values.hn,
        citizenId: values.citizenId,
        phone: values.phone,
        email: values.email,
        address: values.address,
        reason: values.reason,
        consent: values.consent,
        idCardFile: selectedFile ?? undefined
      })

      setStatus('success')
      setStatusMessage(response.message)
      setReferenceId(response.id)
      reset()
      resetFileInput()
    } catch (error) {
      if (error instanceof FormApiError) {
        if (error.fieldErrors) {
          applyFieldErrors(error.fieldErrors, setError)
        }
        setStatus('error')
        setStatusMessage(error.message)
      } else {
        setStatus('error')
        setStatusMessage('ระบบไม่สามารถส่งคำขอได้ โปรดลองใหม่อีกครั้ง')
      }
    }
  })

  return (
    <div>
      <PageMeta
        title="แบบคำขอประวัติการรักษา | โรงพยาบาลโพนพิสัย"
        description="ยื่นคำขอรับสำเนาประวัติการรักษาออนไลน์ พร้อมแนวทางการเตรียมเอกสารสำหรับผู้ป่วยและผู้รับมอบอำนาจ"
        openGraph={{
          title: 'ยื่นคำขอรับสำเนาประวัติการรักษาโรงพยาบาลโพนพิสัย',
          description:
            'กรอกแบบฟอร์มออนไลน์เพื่อขอรับสำเนาประวัติการรักษา พร้อมแนบสำเนาบัตรประชาชนและหนังสือมอบอำนาจ (ถ้ามี)',
          type: 'article'
        }}
      />

      <section className={styles.hero}>
        <Container>
          <div className={styles.heroContent}>
            <h1>แบบคำขอรับสำเนาประวัติการรักษา</h1>
            <p>
              ส่งคำขอรับสำเนาประวัติการรักษาผ่านระบบออนไลน์ สะดวก ปลอดภัย พร้อมแจ้งสถานะให้ทราบผ่านอีเมลที่ลงทะเบียนไว้
            </p>
            <ul className={styles.heroHighlights}>
              <li>ระยะเวลาดำเนินการ 3-5 วันทำการ</li>
              <li>แจ้งเตือนผ่านอีเมลเมื่อพร้อมรับเอกสาร</li>
              <li>รองรับการมอบอำนาจรับแทน</li>
            </ul>
          </div>
        </Container>
      </section>

      <div className={styles.formShell}>
        <div className={styles.formCard}>
          {status !== 'idle' ? (
            <div className={`${styles.statusMessage} ${status === 'success' ? styles.statusSuccess : styles.statusError}`}>
              <p>{statusMessage}</p>
              {status === 'success' && referenceId ? <p>เลขอ้างอิงคำขอ: {referenceId}</p> : null}
            </div>
          ) : null}
          <form onSubmit={onSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="fullName">ชื่อ-นามสกุลผู้ขอ</label>
              <input id="fullName" type="text" {...register('fullName')} autoComplete="name" />
              {errors.fullName ? <span className={styles.fieldError}>{errors.fullName.message}</span> : null}
            </div>
            <div className={`${styles.fieldGroup} ${styles.fieldInline}`}>
              <div className={styles.fieldGroup}>
                <label htmlFor="hn">หมายเลข HN</label>
                <input id="hn" type="text" {...register('hn')} autoComplete="off" />
                {errors.hn ? <span className={styles.fieldError}>{errors.hn.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="citizenId">เลขประจำตัวประชาชน 13 หลัก</label>
                <input id="citizenId" type="text" inputMode="numeric" {...register('citizenId')} autoComplete="off" />
                {errors.citizenId ? <span className={styles.fieldError}>{errors.citizenId.message}</span> : null}
              </div>
            </div>
            <div className={`${styles.fieldGroup} ${styles.fieldInline}`}>
              <div className={styles.fieldGroup}>
                <label htmlFor="phone">เบอร์โทรติดต่อ</label>
                <input id="phone" type="tel" inputMode="tel" {...register('phone')} autoComplete="tel" />
                {errors.phone ? <span className={styles.fieldError}>{errors.phone.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">อีเมล</label>
                <input id="email" type="email" {...register('email')} autoComplete="email" />
                {errors.email ? <span className={styles.fieldError}>{errors.email.message}</span> : null}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="address">ที่อยู่สำหรับติดต่อ/จัดส่งเอกสาร</label>
              <textarea id="address" rows={3} {...register('address')} />
              {errors.address ? <span className={styles.fieldError}>{errors.address.message}</span> : null}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="reason">เหตุผลในการขอข้อมูล</label>
              <textarea id="reason" rows={3} {...register('reason')} />
              <p className={styles.helperText}>เช่น ใช้ประกอบการรักษาต่อเนื่อง/ยื่นสิทธิ/ใช้ในการประกัน</p>
              {errors.reason ? <span className={styles.fieldError}>{errors.reason.message}</span> : null}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="idcardFile">แนบสำเนาบัตรประชาชน (ถ้ามี)</label>
              <div className={styles.fileControl}>
                <input
                  id="idcardFile"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {selectedFile ? <span className={styles.fileName}>{selectedFile.name}</span> : null}
                <p className={styles.helperText}>รองรับไฟล์ PDF, JPG, PNG ขนาดไม่เกิน 5 MB</p>
                {fileError ? <span className={styles.fieldError}>{fileError}</span> : null}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label className="checkbox">
                <input type="checkbox" {...register('consent')} />{' '}
                ข้าพเจ้าตกลงให้โรงพยาบาลจัดเก็บ ใช้ และประมวลผลข้อมูลตามนโยบายคุ้มครองข้อมูลส่วนบุคคล
              </label>
              {errors.consent ? <span className={styles.fieldError}>{errors.consent.message}</span> : null}
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-secondary" onClick={() => { reset(); resetFileInput() }} disabled={isSubmitting}>
                ล้างข้อมูล
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'กำลังส่งคำขอ...' : 'ส่งคำขอ'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PageSection
        id="guideline"
        title="เอกสารและขั้นตอนการรับสำเนา"
        description="เตรียมเอกสารให้ครบถ้วนเพื่อให้เจ้าหน้าที่ตรวจสอบและอนุมัติคำขอได้รวดเร็วยิ่งขึ้น"
      >
        <div className={styles.noteCard}>
          <ul>
            <li>เจ้าหน้าที่จะตรวจสอบคำขอภายใน 3-5 วันทำการ และแจ้งผลทางอีเมลที่ระบุ</li>
            <li>ต้องนำบัตรประชาชนตัวจริงมาแสดงตนทุกครั้งเมื่อมารับเอกสารที่เคาน์เตอร์เวชระเบียน</li>
            <li>หากมอบอำนาจให้ผู้อื่นรับแทน กรุณาแนบหนังสือมอบอำนาจและสำเนาบัตรประชาชนของผู้รับมอบ</li>
            <li>กรณีต้องการให้จัดส่งทางไปรษณีย์ เจ้าหน้าที่จะติดต่อแจ้งค่าบริการเพิ่มเติมก่อนดำเนินการ</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
