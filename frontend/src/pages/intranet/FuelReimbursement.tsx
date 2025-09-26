import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/common/PageMeta'
import { useAuth } from '../../context/AuthContext'

export const FuelReimbursementPage: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      <PageMeta
        title="ระบบเบิกจ่ายน้ำมัน"
        description="ระบบจัดการเบิกจ่ายน้ำมันสำหรับบุคลากรโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/intranet/fuel-reimbursement"
      />
      <Container>
        <header>
          <h1>ระบบเบิกจ่ายน้ำมัน</h1>
          <p>สำหรับเจ้าหน้าที่ที่มีสิทธิเบิกค่าน้ำมันราชการ สามารถบันทึกการเดินทางและติดตามสถานะได้ที่นี่</p>
          {!isAuthenticated && <p className="notice">กรุณาเข้าสู่ระบบเพื่อใช้งานระบบนี้</p>}
        </header>
      </Container>
      <PageSection
        id="instructions"
        title="ขั้นตอนการใช้งาน"
        description="ต้องเข้าสู่ระบบด้วยบัญชีบุคลากรก่อนถึงจะเข้าถึงแบบฟอร์มได้"
      >
        <ol>
          <li>เข้าสู่ระบบด้วยบัญชีบุคลากร</li>
          <li>กรอกข้อมูลการเดินทางและแนบหลักฐานการเติมน้ำมัน</li>
          <li>ส่งคำขอและติดตามสถานะการอนุมัติผ่านแดชบอร์ด</li>
        </ol>
      </PageSection>
    </div>
  )
}

export default FuelReimbursementPage
