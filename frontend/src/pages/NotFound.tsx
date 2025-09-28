import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'
import { PageMeta } from '../components/seo/PageMeta'

export const NotFoundPage: React.FC = () => {
  return (
    <Container as="section">
      <PageMeta
        title="ไม่พบหน้าที่ต้องการ | โรงพยาบาลโพนพิสัย"
        description="ไม่พบหน้าที่คุณกำลังค้นหา โปรดกลับสู่หน้าแรกของโรงพยาบาลโพนพิสัย"
      />
      <h1>ไม่พบหน้าที่คุณต้องการ</h1>
      <p>โปรดตรวจสอบลิงก์หรือกลับสู่หน้าแรกเพื่อค้นหาข้อมูลที่ต้องการ</p>
      <Link to="/" className="btn btn-primary">
        กลับหน้าแรก
      </Link>
    </Container>
  )
}
