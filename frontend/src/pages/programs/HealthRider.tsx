import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/seo/PageMeta'
import { formsApi, FormApiError, type ValidationErrors } from '../../lib/formsApi'
import { healthRiderApplicationSchema, type HealthRiderApplicationFormValues } from '../../lib/validators'
import styles from '../forms/Forms.module.scss'

const fieldNameMap: Record<string, keyof HealthRiderApplicationFormValues> = {
  full_name: 'fullName',
  hn: 'hn',
  address: 'address',
  district: 'district',
  province: 'province',
  zipcode: 'zipcode',
  phone: 'phone',
  line_id: 'lineId',
  consent: 'consent'
}

const applyFieldErrors = (
  errors: ValidationErrors,
  setError: ReturnType<typeof useForm<HealthRiderApplicationFormValues>>['setError']
) => {
  Object.entries(errors).forEach(([field, messages]) => {
    const mapped = fieldNameMap[field] ?? (field as keyof HealthRiderApplicationFormValues)
    const [message] = messages
    if (message) {
      setError(mapped, { type: 'server', message })
    }
  })
}

export const HealthRiderPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [referenceId, setReferenceId] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<HealthRiderApplicationFormValues>({
    resolver: zodResolver(healthRiderApplicationSchema),
    defaultValues: {
      fullName: '',
      hn: '',
      address: '',
      district: '',
      province: '',
      zipcode: '',
      phone: '',
      lineId: '',
      consent: false
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setStatus('idle')
    setStatusMessage('')
    setReferenceId('')

    try {
      const response = await formsApi.submitHealthRiderApplication({
        fullName: values.fullName,
        hn: values.hn,
        address: values.address,
        district: values.district,
        province: values.province,
        zipcode: values.zipcode,
        phone: values.phone,
        lineId: values.lineId ?? '',
        consent: values.consent
      })

      setStatus('success')
      setStatusMessage(response.message)
      setReferenceId(response.id)
      reset({ fullName: '', hn: '', address: '', district: '', province: '', zipcode: '', phone: '', lineId: '', consent: false })
    } catch (error) {
      if (error instanceof FormApiError) {
        if (error.fieldErrors) {
          applyFieldErrors(error.fieldErrors, setError)
        }
        setStatus('error')
        setStatusMessage(error.message)
      } else {
        setStatus('error')
        setStatusMessage('ระบบไม่สามารถบันทึกคำขอได้ โปรดลองใหม่อีกครั้ง')
      }
    }
  })

  return (
    <div>
      <PageMeta
        title="Health Rider ส่งยาถึงบ้าน | โรงพยาบาลโพนพิสัย"
        description="บริการจัดส่งยาและเวชภัณฑ์ถึงบ้านสำหรับผู้ป่วยโรคเรื้อรังและผู้สูงอายุ ลงทะเบียนรับบริการล่วงหน้าได้ที่นี่"
        openGraph={{
          title: 'สมัครโครงการ Health Rider ส่งยาถึงบ้าน',
          description: 'กรอกข้อมูลผู้ป่วยและที่อยู่จัดส่ง เพื่อให้ทีม Health Rider นัดหมายและจัดส่งยาอย่างปลอดภัย',
          type: 'article'
        }}
      />

      <section className={styles.hero}>
        <Container>
          <div className={styles.heroContent}>
            <h1>Health Rider ส่งยาถึงบ้าน</h1>
            <p>
              บริการจัดส่งยาและเวชภัณฑ์สำหรับผู้ป่วยโรคเรื้อรัง ผู้สูงอายุ หรือผู้ที่มีข้อจำกัดในการเดินทาง ครอบคลุมอำเภอโพนพิสัยและพื้นที่ใกล้เคียงภายในรัศมี 30 กิโลเมตร
            </p>
            <ul className={styles.heroHighlights}>
              <li>ส่งยาภายใน 24-48 ชั่วโมงหลังยืนยัน</li>
              <li>ติดตามสถานะผ่าน SMS / LINE Official</li>
              <li>เจ้าหน้าที่พยาบาลตรวจสอบยาให้ก่อนส่งมอบ</li>
            </ul>
          </div>
        </Container>
      </section>

      <div className={styles.formShell}>
        <div className={styles.formCard}>
          {status !== 'idle' ? (
            <div className={`${styles.statusMessage} ${status === 'success' ? styles.statusSuccess : styles.statusError}`}>
              <p>{statusMessage}</p>
              {status === 'success' && referenceId ? <p>หมายเลขคำขอ: {referenceId}</p> : null}
            </div>
          ) : null}
          <form onSubmit={onSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <label htmlFor="fullName">ชื่อ-นามสกุลผู้ป่วย</label>
              <input id="fullName" type="text" {...register('fullName')} />
              {errors.fullName ? <span className={styles.fieldError}>{errors.fullName.message}</span> : null}
            </div>
            <div className={`${styles.fieldGroup} ${styles.fieldInline}`}>
              <div className={styles.fieldGroup}>
                <label htmlFor="hn">หมายเลข HN</label>
                <input id="hn" type="text" {...register('hn')} />
                {errors.hn ? <span className={styles.fieldError}>{errors.hn.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="phone">เบอร์โทรศัพท์</label>
                <input id="phone" type="tel" inputMode="tel" {...register('phone')} />
                {errors.phone ? <span className={styles.fieldError}>{errors.phone.message}</span> : null}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="address">ที่อยู่จัดส่ง</label>
              <textarea id="address" rows={3} {...register('address')} />
              {errors.address ? <span className={styles.fieldError}>{errors.address.message}</span> : null}
            </div>
            <div className={`${styles.fieldGroup} ${styles.fieldInline}`}>
              <div className={styles.fieldGroup}>
                <label htmlFor="district">เขต/อำเภอ</label>
                <input id="district" type="text" {...register('district')} />
                {errors.district ? <span className={styles.fieldError}>{errors.district.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="province">จังหวัด</label>
                <input id="province" type="text" {...register('province')} />
                {errors.province ? <span className={styles.fieldError}>{errors.province.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="zipcode">รหัสไปรษณีย์</label>
                <input id="zipcode" type="text" inputMode="numeric" {...register('zipcode')} />
                {errors.zipcode ? <span className={styles.fieldError}>{errors.zipcode.message}</span> : null}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="lineId">LINE ID (ถ้ามี)</label>
              <input id="lineId" type="text" {...register('lineId')} />
              <p className={styles.helperText}>ใช้สำหรับแจ้งเตือนสถานะการจัดส่งผ่าน LINE Official โรงพยาบาล</p>
              {errors.lineId ? <span className={styles.fieldError}>{errors.lineId.message}</span> : null}
            </div>
            <div className={styles.fieldGroup}>
              <label className="checkbox">
                <input type="checkbox" {...register('consent')} />{' '}
                ข้าพเจ้ายินยอมให้ทีม Health Rider จัดเก็บและใช้ข้อมูลเพื่อการจัดส่งยา และติดต่อกลับหากมีข้อสงสัย
              </label>
              {errors.consent ? <span className={styles.fieldError}>{errors.consent.message}</span> : null}
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-secondary" onClick={() => reset()} disabled={isSubmitting}>
                ล้างข้อมูล
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'กำลังส่งคำขอ...' : 'สมัครรับบริการส่งยา'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PageSection
        id="coverage"
        title="พื้นที่ให้บริการและขั้นตอน"
        description="Health Rider ให้บริการส่งยาโดยเจ้าหน้าที่โรงพยาบาล พร้อมตรวจสอบความถูกต้องของยาและอธิบายวิธีใช้"
      >
        <div className={styles.noteCard}>
          <ul>
            <li>ให้บริการในอำเภอโพนพิสัย ศรีเชียงใหม่ ปากคาด และพื้นที่ติดกันในรัศมีไม่เกิน 30 กิโลเมตร</li>
            <li>เจ้าหน้าที่จะโทรศัพท์ยืนยันรายการยาและช่วงเวลาส่งภายใน 1 วันทำการหลังได้รับคำขอ</li>
            <li>ในวันจัดส่ง ผู้รับต้องเตรียมบัตรประชาชนและเอกสารแนบ (ถ้ามี) เพื่อยืนยันตัวตน</li>
            <li>มีค่าส่ง 40 บาทต่อเที่ยว (ยกเว้นผู้ป่วยติดเตียง/ผู้ป่วยยากไร้) ชำระปลายทางโดยเงินสดหรือพร้อมเพย์</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
