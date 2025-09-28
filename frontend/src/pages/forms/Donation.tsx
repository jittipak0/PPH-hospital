import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/seo/PageMeta'
import { formsApi, FormApiError, type ValidationErrors } from '../../lib/formsApi'
import { donationSchema, type DonationFormValues } from '../../lib/validators'
import styles from './Forms.module.scss'

const fieldNameMap: Record<string, keyof DonationFormValues> = {
  donor_name: 'donorName',
  amount: 'amount',
  channel: 'channel',
  phone: 'phone',
  email: 'email',
  note: 'note'
}

const applyFieldErrors = (
  errors: ValidationErrors,
  setError: ReturnType<typeof useForm<DonationFormValues>>['setError']
) => {
  Object.entries(errors).forEach(([field, messages]) => {
    const mapped = fieldNameMap[field] ?? (field as keyof DonationFormValues)
    const [message] = messages
    if (message) {
      setError(mapped, { type: 'server', message })
    }
  })
}

export const DonationPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [referenceId, setReferenceId] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorName: '',
      amount: 500,
      channel: 'cash',
      phone: '',
      email: '',
      note: ''
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setStatus('idle')
    setStatusMessage('')
    setReferenceId('')
    try {
      const response = await formsApi.submitDonation({
        donorName: values.donorName,
        amount: Number(values.amount),
        channel: values.channel,
        phone: values.phone,
        email: values.email,
        note: values.note ?? ''
      })
      setStatus('success')
      setStatusMessage(response.message)
      setReferenceId(response.id)
      reset({ donorName: '', amount: 500, channel: 'cash', phone: '', email: '', note: '' })
    } catch (error) {
      if (error instanceof FormApiError) {
        if (error.fieldErrors) {
          applyFieldErrors(error.fieldErrors, setError)
        }
        setStatus('error')
        setStatusMessage(error.message)
      } else {
        setStatus('error')
        setStatusMessage('ระบบไม่สามารถบันทึกข้อมูลการบริจาคได้ โปรดลองใหม่อีกครั้ง')
      }
    }
  })

  return (
    <div>
      <PageMeta
        title="แบบฟอร์มรับบริจาค | โรงพยาบาลโพนพิสัย"
        description="สนับสนุนโรงพยาบาลโพนพิสัยผ่านการบริจาคเพื่อพัฒนาศูนย์การแพทย์และช่วยเหลือผู้ป่วยยากไร้"
        openGraph={{
          title: 'ร่วมสมทบทุนโรงพยาบาลโพนพิสัย',
          description: 'กรอกแบบฟอร์มบริจาคออนไลน์ เลือกช่องทางชำระเงิน พร้อมรับใบเสร็จอิเล็กทรอนิกส์',
          type: 'article'
        }}
      />

      <section className={styles.hero}>
        <Container>
          <div className={styles.heroContent}>
            <h1>ร่วมสมทบทุนและบริจาค</h1>
            <p>
              ทุกยอดบริจาคช่วยเสริมสร้างศักยภาพการรักษาและสวัสดิการผู้ป่วยยากไร้ โรงพยาบาลมีระบบติดตามสถานะและออกใบเสร็จอิเล็กทรอนิกส์ภายใน 7 วันทำการ
            </p>
            <ul className={styles.heroHighlights}>
              <li>รับใบเสร็จอิเล็กทรอนิกส์ผ่านอีเมล</li>
              <li>เงินบริจาคนำไปลดหย่อนภาษีได้ 2 เท่า</li>
              <li>รายงานความโปร่งใสผ่านเว็บไซต์ ITA</li>
            </ul>
          </div>
        </Container>
      </section>

      <div className={styles.formShell}>
        <div className={styles.formCard}>
          {status !== 'idle' ? (
            <div className={`${styles.statusMessage} ${status === 'success' ? styles.statusSuccess : styles.statusError}`}>
              <p>{statusMessage}</p>
              {status === 'success' && referenceId ? <p>รหัสอ้างอิงการบริจาค: {referenceId}</p> : null}
            </div>
          ) : null}
          <form onSubmit={onSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="donorName">ชื่อผู้บริจาค / หน่วยงาน</label>
              <input id="donorName" type="text" {...register('donorName')} />
              {errors.donorName ? <span className={styles.fieldError}>{errors.donorName.message}</span> : null}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="amount">จำนวนเงิน (บาท)</label>
              <input id="amount" type="number" min={1} step={50} {...register('amount')} />
              {errors.amount ? <span className={styles.fieldError}>{errors.amount.message}</span> : null}
            </div>
            <div className={styles.fieldGroup}>
              <span>ช่องทางการบริจาค</span>
              <label>
                <input type="radio" value="cash" {...register('channel')} /> เงินสด / ชำระที่เคาน์เตอร์
              </label>
              <label>
                <input type="radio" value="bank" {...register('channel')} /> โอนผ่านธนาคาร
              </label>
              <label>
                <input type="radio" value="promptpay" {...register('channel')} /> พร้อมเพย์ | QR Code
              </label>
              {errors.channel ? <span className={styles.fieldError}>{errors.channel.message}</span> : null}
            </div>
            <div className={`${styles.fieldGroup} ${styles.fieldInline}`}>
              <div className={styles.fieldGroup}>
                <label htmlFor="phone">เบอร์โทรติดต่อ</label>
                <input id="phone" type="tel" inputMode="tel" {...register('phone')} />
                {errors.phone ? <span className={styles.fieldError}>{errors.phone.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="email">อีเมลสำหรับใบเสร็จ</label>
                <input id="email" type="email" {...register('email')} />
                {errors.email ? <span className={styles.fieldError}>{errors.email.message}</span> : null}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="note">หมายเหตุเพิ่มเติม (ถ้ามี)</label>
              <textarea id="note" rows={3} {...register('note')} />
              {errors.note ? <span className={styles.fieldError}>{errors.note.message}</span> : null}
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-secondary" onClick={() => reset()} disabled={isSubmitting}>
                ล้างข้อมูล
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'กำลังบันทึก...' : 'ส่งข้อมูลการบริจาค'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PageSection
        id="instruction"
        title="รายละเอียดช่องทางการบริจาค"
        description="หลังกรอกแบบฟอร์มแล้ว กรุณาชำระตามช่องทางที่เลือกและแนบหลักฐานตอบกลับอีเมลยืนยัน"
      >
        <div className={styles.noteCard}>
          <ul>
            <li>
              <strong>เงินสด:</strong> ติดต่อเคาน์เตอร์การเงิน อาคารอำนวยการ ชั้น 1 ทุกวันจันทร์-ศุกร์ 08:30-15:30 น.
            </li>
            <li>
              <strong>โอนผ่านธนาคาร:</strong> ธนาคารกรุงไทย สาขาโพนพิสัย เลขที่บัญชี 123-4-56789-0 ชื่อบัญชี “กองทุนเพื่อผู้ป่วยยากไร้ โรงพยาบาลโพนพิสัย”
            </li>
            <li>
              <strong>พร้อมเพย์:</strong> สแกน QR ตามหมายเลข 099-123-4567 (โรงพยาบาลโพนพิสัย) และส่งสลิปตอบกลับอีเมล
            </li>
            <li>โรงพยาบาลจะออกใบเสร็จอิเล็กทรอนิกส์และส่งทางอีเมลภายใน 7 วันทำการหลังได้รับหลักฐานการชำระเงิน</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
