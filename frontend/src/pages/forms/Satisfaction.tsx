import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/seo/PageMeta'
import { formsApi, FormApiError, type ValidationErrors } from '../../lib/formsApi'
import { satisfactionSurveySchema, type SatisfactionSurveyFormValues } from '../../lib/validators'
import styles from './Forms.module.scss'

const fieldNameMap: Record<string, keyof SatisfactionSurveyFormValues> = {
  score_overall: 'scoreOverall',
  score_waittime: 'scoreWaitTime',
  score_staff: 'scoreStaff',
  comment: 'comment',
  service_date: 'serviceDate'
}

const applyFieldErrors = (
  errors: ValidationErrors,
  setError: ReturnType<typeof useForm<SatisfactionSurveyFormValues>>['setError']
) => {
  Object.entries(errors).forEach(([field, messages]) => {
    const mapped = fieldNameMap[field] ?? (field as keyof SatisfactionSurveyFormValues)
    const [message] = messages
    if (message) {
      setError(mapped, { type: 'server', message })
    }
  })
}

const scoreOptions = [
  { value: 5, label: 'ดีมาก (5)' },
  { value: 4, label: 'ดี (4)' },
  { value: 3, label: 'ปานกลาง (3)' },
  { value: 2, label: 'พอใช้ (2)' },
  { value: 1, label: 'ควรปรับปรุง (1)' }
]

const today = () => {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

export const SatisfactionSurveyPage: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [referenceId, setReferenceId] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<SatisfactionSurveyFormValues>({
    resolver: zodResolver(satisfactionSurveySchema),
    defaultValues: {
      scoreOverall: 5,
      scoreWaitTime: 4,
      scoreStaff: 5,
      comment: '',
      serviceDate: today()
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    setStatus('idle')
    setStatusMessage('')
    setReferenceId('')

    try {
      const response = await formsApi.submitSatisfactionSurvey({
        scoreOverall: Number(values.scoreOverall),
        scoreWaitTime: Number(values.scoreWaitTime),
        scoreStaff: Number(values.scoreStaff),
        comment: values.comment ?? '',
        serviceDate: values.serviceDate
      })
      setStatus('success')
      setStatusMessage(response.message)
      setReferenceId(response.id)
      reset({ scoreOverall: 5, scoreWaitTime: 4, scoreStaff: 5, comment: '', serviceDate: today() })
    } catch (error) {
      if (error instanceof FormApiError) {
        if (error.fieldErrors) {
          applyFieldErrors(error.fieldErrors, setError)
        }
        setStatus('error')
        setStatusMessage(error.message)
      } else {
        setStatus('error')
        setStatusMessage('ระบบไม่สามารถส่งแบบประเมินได้ โปรดลองใหม่อีกครั้ง')
      }
    }
  })

  return (
    <div>
      <PageMeta
        title="แบบประเมินความพึงพอใจ | โรงพยาบาลโพนพิสัย"
        description="สะท้อนความคิดเห็นของคุณเพื่อพัฒนาการให้บริการของโรงพยาบาลโพนพิสัย"
        openGraph={{
          title: 'ร่วมประเมินความพึงพอใจการรับบริการ',
          description: 'แบบฟอร์มออนไลน์สำหรับประเมินคุณภาพบริการ เวลาในการรอคอย และการดูแลของบุคลากร',
          type: 'article'
        }}
      />

      <section className={styles.hero}>
        <Container>
          <div className={styles.heroContent}>
            <h1>แบบประเมินความพึงพอใจผู้รับบริการ</h1>
            <p>
              เสียงสะท้อนของคุณคือแรงขับเคลื่อนการปรับปรุงบริการ โรงพยาบาลจะสรุปผลสำรวจทุกเดือนและประกาศมาตรการพัฒนาผ่านเว็บไซต์ ITA
            </p>
            <ul className={styles.heroHighlights}>
              <li>ใช้เวลาไม่เกิน 3 นาที</li>
              <li>ข้อมูลถูกรวมแบบไม่ระบุตัวตน</li>
              <li>เผยแพร่ผลสรุปทุกไตรมาส</li>
            </ul>
          </div>
        </Container>
      </section>

      <div className={styles.formShell}>
        <div className={styles.formCard}>
          {status !== 'idle' ? (
            <div className={`${styles.statusMessage} ${status === 'success' ? styles.statusSuccess : styles.statusError}`}>
              <p>{statusMessage}</p>
              {status === 'success' && referenceId ? <p>หมายเลขแบบประเมิน: {referenceId}</p> : null}
            </div>
          ) : null}
          <form onSubmit={onSubmit} noValidate>
            <div className={`${styles.fieldGroup} ${styles.fieldInline}`}>
              <div className={styles.fieldGroup}>
                <label htmlFor="scoreOverall">ความพึงพอใจโดยรวม</label>
                <select id="scoreOverall" {...register('scoreOverall')}>
                  {scoreOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.scoreOverall ? <span className={styles.fieldError}>{errors.scoreOverall.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="scoreWaitTime">ความรวดเร็วในการให้บริการ</label>
                <select id="scoreWaitTime" {...register('scoreWaitTime')}>
                  {scoreOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.scoreWaitTime ? <span className={styles.fieldError}>{errors.scoreWaitTime.message}</span> : null}
              </div>
              <div className={styles.fieldGroup}>
                <label htmlFor="scoreStaff">การดูแลของบุคลากร</label>
                <select id="scoreStaff" {...register('scoreStaff')}>
                  {scoreOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.scoreStaff ? <span className={styles.fieldError}>{errors.scoreStaff.message}</span> : null}
              </div>
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="serviceDate">วันที่เข้ารับบริการ</label>
              <input id="serviceDate" type="date" max={today()} {...register('serviceDate')} />
              {errors.serviceDate ? <span className={styles.fieldError}>{errors.serviceDate.message}</span> : null}
            </div>
            <div className={styles.fieldGroup}>
              <label htmlFor="comment">ข้อเสนอแนะเพิ่มเติม</label>
              <textarea id="comment" rows={3} placeholder="ระบุประสบการณ์ ข้อเสนอแนะ หรือทีมงานที่ต้องการชื่นชม" {...register('comment')} />
              {errors.comment ? <span className={styles.fieldError}>{errors.comment.message}</span> : null}
            </div>
            <div className={styles.formActions}>
              <button type="button" className="btn btn-secondary" onClick={() => reset({ scoreOverall: 5, scoreWaitTime: 4, scoreStaff: 5, comment: '', serviceDate: today() })} disabled={isSubmitting}>
                ล้างข้อมูล
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'กำลังบันทึก...' : 'ส่งแบบประเมิน'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <PageSection
        id="privacy"
        title="การนำผลไปใช้"
        description="ข้อมูลแบบประเมินจะถูกนำไปใช้พัฒนามาตรฐานบริการและสนับสนุนการขับเคลื่อนธรรมาภิบาล"
      >
        <div className={styles.noteCard}>
          <ul>
            <li>โรงพยาบาล anonymize ข้อมูลก่อนประมวลผล และจะไม่เปิดเผยชื่อผู้ประเมิน</li>
            <li>รายงานผลสรุปแบบประเมิน เผยแพร่ผ่านหน้า ITA และบอร์ดโรงพยาบาลทุกไตรมาส</li>
            <li>ข้อเสนอแนะสำคัญจะถูกส่งต่อถึงหัวหน้าหน่วยงานที่เกี่ยวข้องภายใน 5 วันทำการ</li>
            <li>สามารถติดตามผลการปรับปรุงบริการจากการประเมินย้อนหลังได้ที่หน้าโปร่งใส/ITA</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
