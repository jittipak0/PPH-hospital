import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { PageMeta } from '../components/seo/PageMeta'
import { api } from '../lib/api'
import { contactSchema, type ContactFormValues } from '../lib/validators'

const CAPTCHA_TOKEN = '5678'

export const Contact: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      message: '',
      captcha: '',
      consent: false
    }
  })

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [feedback, setFeedback] = useState<string>('')

  const onSubmit = async (values: ContactFormValues) => {
    if (values.captcha !== CAPTCHA_TOKEN) {
      setError('captcha', { type: 'validate', message: 'กรุณากรอก CAPTCHA 5678 ให้ถูกต้อง' })
      return
    }
    try {
      setStatus('loading')
      await api.submitContact(values)
      setFeedback('ส่งข้อความเรียบร้อย เจ้าหน้าที่จะติดต่อกลับภายใน 3 วันทำการ')
      setStatus('success')
      reset()
    } catch (err) {
      console.error(err)
      setStatus('error')
      setFeedback('ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้งหรือโทร 02-000-1111')
    }
  }

  return (
    <div>
      <PageMeta
        title="ติดต่อโรงพยาบาล | โรงพยาบาลโพนพิสัย"
        description="ติดต่อโรงพยาบาลโพนพิสัยสำหรับสอบถามข้อมูล นัดหมาย และส่งข้อเสนอแนะผ่านแบบฟอร์มออนไลน์"
        openGraph={{
          title: 'ติดต่อโรงพยาบาลโพนพิสัย',
          description: 'ข้อมูลติดต่อโรงพยาบาล ช่องทางโทรศัพท์ อีเมล และแบบฟอร์มแจ้งข้อเสนอแนะออนไลน์',
          type: 'article'
        }}
      />
      <Container>
        <header>
          <h1>ติดต่อโรงพยาบาล</h1>
          <p>สอบถามข้อมูลทั่วไป นัดหมายผ่านเจ้าหน้าที่ หรือส่งข้อร้องเรียน/ข้อเสนอแนะผ่านแบบฟอร์มด้านล่าง</p>
        </header>
      </Container>

      <PageSection id="contact-info" title="ข้อมูลการติดต่อ">
        <div className="contact-grid">
          <div className="card">
            <h3>📍 ที่อยู่</h3>
            <p>123 ถนนสุขภาพดี แขวงประชาธิปไตย เขตเมืองหลวง กรุงเทพมหานคร 10200</p>
          </div>
          <div className="card">
            <h3>☎️ โทรศัพท์</h3>
            <p>ศูนย์บริการข้อมูล: <a href="tel:020001111">02-000-1111</a></p>
            <p>นัดหมายผู้ป่วยนอก: <a href="tel:020001222">02-000-1222</a></p>
          </div>
          <div className="card">
            <h3>✉️ อีเมล</h3>
            <p><a href="mailto:info@publichospital.go.th">info@publichospital.go.th</a></p>
            <p><a href="mailto:complaint@publichospital.go.th">complaint@publichospital.go.th</a></p>
          </div>
        </div>
      </PageSection>

      <PageSection id="map" title="แผนที่โรงพยาบาล">
        <div className="map-wrapper">
          <iframe
            title="แผนที่ติดต่อโรงพยาบาล"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.792975200286!2d100.493088375097!3d13.745570897166702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e298d02c5d4b53%3A0xdbc3cfc9ad1bc105!2sMinistry%20of%20Public%20Health!5e0!3m2!1sth!2sth!4v1717470000000!5m2!1sth!2sth"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </PageSection>

      <PageSection id="feedback" title="ร้องเรียน/ข้อเสนอแนะ">
        <form className="card" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-grid">
            <label>
              ชื่อ-นามสกุล
              <input type="text" {...register('fullName')} aria-invalid={Boolean(errors.fullName)} />
              {errors.fullName && <span className="error">{errors.fullName.message}</span>}
            </label>
            <label>
              อีเมล
              <input type="email" {...register('email')} aria-invalid={Boolean(errors.email)} />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </label>
            <label>
              เบอร์โทรศัพท์
              <input type="tel" {...register('phone')} aria-invalid={Boolean(errors.phone)} />
              {errors.phone && <span className="error">{errors.phone.message}</span>}
            </label>
          </div>
          <label>
            รายละเอียดข้อเสนอแนะหรือข้อร้องเรียน
            <textarea rows={5} {...register('message')} aria-invalid={Boolean(errors.message)} />
            {errors.message && <span className="error">{errors.message.message}</span>}
          </label>
          <label>
            CAPTCHA ป้องกันสแปม (กรุณากรอก 5678)
            <input type="text" {...register('captcha')} aria-invalid={Boolean(errors.captcha)} />
            {errors.captcha && <span className="error">{errors.captcha.message}</span>}
          </label>
          <label className="consent">
            <input type="checkbox" {...register('consent')} />
            <span>
              ข้าพเจ้ายินยอมให้โรงพยาบาลจัดเก็บและประมวลผลข้อมูลตาม{' '}
              <a href="https://www.example-hospital.go.th/privacy" target="_blank" rel="noopener noreferrer">
                นโยบายความเป็นส่วนตัว
              </a>
            </span>
          </label>
          {errors.consent && <span className="error">{errors.consent.message}</span>}
          <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
            {status === 'loading' ? 'กำลังส่งข้อมูล...' : 'ส่งข้อความ'}
          </button>
          {feedback && (
            <p className={status === 'success' ? 'success' : 'error'} role="status">
              {feedback}
            </p>
          )}
        </form>
      </PageSection>
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }
        .map-wrapper iframe {
          width: 100%;
          min-height: 320px;
          border: 0;
          border-radius: var(--radius-md);
        }
        form.card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }
        label {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-weight: 600;
        }
        input,
        textarea {
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          border: 1px solid rgba(15, 23, 42, 0.2);
          font-size: 1rem;
        }
        textarea {
          resize: vertical;
        }
        .consent {
          flex-direction: row;
          align-items: flex-start;
          gap: 0.75rem;
          font-weight: 500;
        }
        .consent input {
          margin-top: 0.3rem;
        }
        .error {
          color: #b91c1c;
          font-size: 0.9rem;
        }
        .success {
          color: #047857;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
