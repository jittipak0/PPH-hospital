import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { AppointmentForm } from '../components/patient/AppointmentForm'
import { PageMeta } from '../components/seo/PageMeta'

export const Appointment: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="นัดหมายแพทย์ออนไลน์ | โรงพยาบาลโพนพิสัย"
        description="จองคิวพบแพทย์ล่วงหน้า สะดวก รวดเร็ว พร้อมรับการยืนยันจากเจ้าหน้าที่ภายใน 24 ชั่วโมง"
        openGraph={{
          title: 'จองนัดแพทย์โรงพยาบาลโพนพิสัย',
          description: 'ระบบนัดหมายออนไลน์สำหรับเลือกแพทย์และเวลาที่สะดวก พร้อมคำแนะนำเตรียมตัวก่อนมาตรวจ',
          type: 'article'
        }}
      />
      <Container>
        <header>
          <h1>นัดหมายแพทย์ออนไลน์</h1>
          <p>
            กรอกข้อมูลให้ครบถ้วนเพื่อยืนยันการนัดหมาย เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมงทำการ โปรดเตรียมเอกสารยืนยันตัวตนเมื่อมาถึงโรงพยาบาล
          </p>
        </header>
      </Container>
      <PageSection id="appointment-form" title="แบบฟอร์มนัดหมาย">
        <AppointmentForm />
      </PageSection>
      <PageSection id="policy" title="ข้อควรทราบก่อนนัดหมาย">
        <ul>
          <li>โรงพยาบาลเปิดให้บริการนัดหมายล่วงหน้าอย่างน้อย 3 วันทำการ</li>
          <li>กรณีเร่งด่วน แนะนำให้ติดต่อศูนย์บริการ 1669 หรือเข้าห้องฉุกเฉินโดยตรง</li>
          <li>ข้อมูลที่กรอกจะถูกจัดเก็บตามมาตรการ PDPA ของโรงพยาบาล</li>
        </ul>
      </PageSection>
    </div>
  )
}
