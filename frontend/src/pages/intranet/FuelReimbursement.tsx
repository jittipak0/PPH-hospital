import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/seo/PageMeta'

export const FuelReimbursementPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ระบบเบิกจ่ายน้ำมัน | โรงพยาบาลโพนพิสัย"
        description="ระบบภายในสำหรับเจ้าหน้าที่โรงพยาบาลโพนพิสัย เพื่อบันทึกและติดตามการเบิกจ่ายค่าน้ำมัน"
        openGraph={{
          title: 'ระบบเบิกจ่ายน้ำมันบุคลากร',
          description: 'เข้าสู่ระบบเพื่อบันทึกการเดินทาง ตรวจสอบสถานะการอนุมัติ และดาวน์โหลดรายงานเบิกค่าน้ำมัน',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>ระบบเบิกจ่ายน้ำมัน (เฉพาะบุคลากร)</h1>
        <p>
          ระบบนี้ใช้สำหรับบันทึกรายการเดินทางราชการของบุคลากรที่ได้รับสิทธิ์ พร้อมแนบหลักฐานและติดตามสถานะการอนุมัติแบบเรียลไทม์ ระบบจะซิงก์ข้อมูลกับฝ่ายการเงินโดยอัตโนมัติ
        </p>
      </Container>

      <PageSection
        id="workflow"
        title="ขั้นตอนการใช้งาน"
        description="ขั้นตอนมาตรฐานในการยื่นเบิกจ่ายน้ำมัน"
      >
        <ol className="card">
          <li>เข้าสู่ระบบด้วยบัญชี SSO ของบุคลากร (ต้องเปิดใช้งาน 2FA)</li>
          <li>เลือก “สร้างคำขอใหม่” ระบุรายละเอียดการเดินทาง ระยะทาง และหน่วยงานผู้อนุมัติ</li>
          <li>แนบไฟล์ใบเสร็จ/สลิปน้ำมัน และบันทึกคำขอ</li>
          <li>ผู้บังคับบัญชาอนุมัติผ่านระบบ จากนั้นฝ่ายการเงินจะดำเนินการภายใน 3 วันทำการ</li>
        </ol>
      </PageSection>

      <PageSection
        id="support"
        title="คู่มือและช่องทางสนับสนุน"
        description="กรณีใช้งานไม่ได้หรือพบข้อผิดพลาด โปรดติดต่อทีมงาน"
        background="muted"
      >
        <div className="card">
          <ul>
            <li>คู่มือการใช้งานอยู่ใน Intranet &gt; Knowledge Base &gt; Finance &gt; Fuel Reimbursement</li>
            <li>ศูนย์ช่วยเหลือ ICT โทร 1403 หรืออีเมล it-support@pph-hospital.go.th</li>
            <li>ปัญหาด้านเอกสารติดต่อฝ่ายการเงิน โทร 1308 หรือ finance@pph-hospital.go.th</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
