import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/common/PageMeta'
import { MedicalRecordRequestForm } from '../../components/forms/MedicalRecordRequestForm'

export const MedicalRecordRequestPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="แบบขอประวัติการรักษา"
        description="ยื่นคำขอสำเนาประวัติการรักษาของโรงพยาบาลโพนพิสัยผ่านระบบออนไลน์"
        url="https://www.pph-hospital.local/forms/medical-record-request"
      />
      <Container>
        <header>
          <h1>แบบขอประวัติการรักษา</h1>
          <p>
            สำหรับผู้ป่วยหรือญาติที่ได้รับมอบอำนาจ สามารถยื่นคำขอรับสำเนาประวัติการรักษาได้ผ่านแบบฟอร์มนี้ กรุณากรอกข้อมูลให้ครบถ้วนและแนบสำเนาบัตรประชาชน
          </p>
        </header>
      </Container>
      <PageSection id="request-form" title="กรอกแบบฟอร์ม">
        <MedicalRecordRequestForm />
      </PageSection>
      <PageSection id="note" title="เอกสารที่ต้องใช้">
        <ul>
          <li>สำเนาบัตรประชาชนของผู้ป่วยหรือผู้ได้รับมอบอำนาจ</li>
          <li>หนังสือมอบอำนาจ (กรณีผู้ยื่นคำขอไม่ใช่ผู้ป่วย)</li>
          <li>เอกสารแสดงความสัมพันธ์ เช่น ทะเบียนบ้าน สูติบัตร หรือใบมรณะบัตร</li>
        </ul>
      </PageSection>
    </div>
  )
}

export default MedicalRecordRequestPage
