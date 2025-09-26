import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/common/PageMeta'
import { DonationForm } from '../../components/forms/DonationForm'

export const DonationPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="การรับบริจาค"
        description="แจ้งความประสงค์บริจาคให้โรงพยาบาลโพนพิสัย เพื่อสนับสนุนการพัฒนาบริการและอุปกรณ์ทางการแพทย์"
        url="https://www.pph-hospital.local/forms/donation"
      />
      <Container>
        <header>
          <h1>การรับบริจาค</h1>
          <p>
            ขอบคุณสำหรับการสนับสนุน ผู้บริจาคสามารถกรอกข้อมูลผ่านแบบฟอร์มออนไลน์และเลือกช่องทางโอนเงินที่สะดวก โรงพยาบาลจะจัดส่งใบเสร็จภายใน 7 วันทำการ
          </p>
        </header>
      </Container>
      <PageSection id="donation-form" title="แบบฟอร์มบริจาค">
        <DonationForm />
      </PageSection>
      <PageSection id="benefits" title="การนำเงินบริจาคไปใช้">
        <ul>
          <li>จัดซื้ออุปกรณ์การแพทย์และเทคโนโลยีสำหรับผู้ป่วยหนัก</li>
          <li>สนับสนุนกองทุนช่วยเหลือผู้ป่วยยากไร้</li>
          <li>พัฒนานวัตกรรมบริการสุขภาพดิจิทัลสำหรับชุมชน</li>
        </ul>
      </PageSection>
    </div>
  )
}

export default DonationPage
