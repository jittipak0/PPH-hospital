import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/common/PageMeta'
import { useAuth } from '../../context/AuthContext'

export const DocumentCenterPage: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div>
      <PageMeta
        title="ศูนย์จัดเก็บเอกสาร"
        description="จัดเก็บประกาศ หนังสือราชการ และคู่มือปฏิบัติงานสำหรับบุคลากรโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/intranet/document-center"
      />
      <Container>
        <header>
          <h1>ศูนย์จัดเก็บเอกสาร</h1>
          <p>เข้าถึงประกาศ หนังสือคำสั่ง และคู่มือการทำงานล่าสุดผ่านระบบเอกสารดิจิทัล</p>
          {!isAuthenticated && <p className="notice">ต้องเข้าสู่ระบบจึงจะดาวน์โหลดเอกสารได้</p>}
        </header>
      </Container>
      <PageSection id="categories" title="หมวดเอกสาร" background="muted">
        <ul className="document-categories">
          <li>ประกาศนโยบายและคำสั่ง</li>
          <li>คู่มือการปฏิบัติงาน (SOP)</li>
          <li>แบบฟอร์มและสัญญาภายใน</li>
        </ul>
      </PageSection>
      <PageSection id="access" title="วิธีเข้าถึง">
        <ol>
          <li>เข้าสู่ระบบด้วยบัญชีบุคลากร</li>
          <li>เลือกหมวดเอกสารและค้นหาด้วยคำสำคัญหรือเลขที่หนังสือ</li>
          <li>ดาวน์โหลดเอกสาร PDF/Word พร้อมตรวจสอบสถานะการแก้ไขล่าสุด</li>
        </ol>
      </PageSection>
      <style>{`
        .document-categories {
          list-style: disc;
          padding-left: 1.5rem;
          display: grid;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default DocumentCenterPage
