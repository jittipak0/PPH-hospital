import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

const steps = [
  {
    title: 'ลงทะเบียนผู้รับบริการ',
    detail: 'กรอกแบบฟอร์มออนไลน์หรือผ่านเจ้าหน้าที่ คลินิกจะตรวจสอบสิทธิภายใน 1 วันทำการ'
  },
  {
    title: 'ประเมินโดยทีมสหสาขา',
    detail: 'เภสัชกรและพยาบาลทบทวนใบสั่งยา ตรวจสอบความเหมาะสม และกำหนดรอบจัดส่ง'
  },
  {
    title: 'จัดส่งยาและติดตาม',
    detail: 'เจ้าหน้าที่ Health Rider ส่งยาถึงบ้าน พร้อมสอนการใช้ยาและติดตามอาการผ่านแอปพลิเคชัน'
  }
]

const faqs = [
  {
    q: 'พื้นที่ให้บริการครอบคลุมที่ใดบ้าง?',
    a: 'ครอบคลุมในเขตอำเภอโพนพิสัยและตำบลใกล้เคียง 12 ตำบล สามารถตรวจสอบรหัสไปรษณีย์ได้ในแบบฟอร์มออนไลน์'
  },
  {
    q: 'มีค่าใช้จ่ายหรือไม่?',
    a: 'ผู้ป่วยสิทธิประกันสุขภาพถ้วนหน้าและประกันสังคมไม่เสียค่าใช้จ่าย ส่วนผู้ใช้สิทธิอื่นคิดค่าบริการตามระยะทาง'
  },
  {
    q: 'ติดต่อทีม Health Rider ได้อย่างไร?',
    a: 'โทร 042-000-321 ทุกวัน 08:00-18:00 น. หรือแชตผ่าน LINE @pph-healthrider'
  }
]

export const HealthRiderPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="Health Rider – ส่งยาถึงบ้าน"
        description="บริการ Health Rider ของโรงพยาบาลโพนพิสัย ส่งยาถึงบ้านพร้อมติดตามอาการแบบใกล้ชิด"
        url="https://www.pph-hospital.local/programs/health-rider"
      />
      <Container>
        <header>
          <h1>Health Rider (ส่งยาถึงบ้าน)</h1>
          <p>
            บริการจัดส่งยาและอุปกรณ์ทางการแพทย์ถึงบ้านสำหรับผู้ป่วยเรื้อรัง ผู้สูงอายุ และผู้ที่มีข้อจำกัดในการเดินทาง
            พร้อมทีมสหสาขาคอยให้คำแนะนำผ่านออนไลน์
          </p>
          <a className="btn btn-primary" href="/services/online#health-rider">
            สมัครใช้บริการ
          </a>
        </header>
      </Container>
      <PageSection id="process" title="ขั้นตอนการรับบริการ" background="muted">
        <Grid columns={3}>
          {steps.map((step) => (
            <article className="card" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="coverage" title="กลุ่มเป้าหมายและพื้นที่">
        <Grid columns={2}>
          <article className="card">
            <h3>กลุ่มผู้ป่วยที่ให้บริการ</h3>
            <ul>
              <li>ผู้ป่วยโรคเรื้อรังที่ต้องรับยาเป็นประจำ</li>
              <li>ผู้สูงอายุที่มีข้อจำกัดการเดินทาง</li>
              <li>ผู้ป่วยหลังผ่าตัดหรือหลังคลอดที่ต้องการดูแลต่อเนื่อง</li>
            </ul>
          </article>
          <article className="card">
            <h3>พื้นที่ให้บริการ</h3>
            <p>อำเภอโพนพิสัยและอำเภอใกล้เคียง 12 ตำบล (บริการขยายระยะทางสูงสุด 30 กิโลเมตรจากโรงพยาบาล)</p>
          </article>
        </Grid>
      </PageSection>
      <PageSection id="faq" title="คำถามที่พบบ่อย">
        <dl className="faq-list">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt>{faq.q}</dt>
              <dd>{faq.a}</dd>
            </div>
          ))}
        </dl>
      </PageSection>
      <style>{`
        .faq-list {
          display: grid;
          gap: 1rem;
        }
        .faq-list dt {
          font-weight: 700;
        }
        .faq-list dd {
          margin: 0.25rem 0 0;
          color: var(--color-muted);
        }
      `}</style>
    </div>
  )
}

export default HealthRiderPage
