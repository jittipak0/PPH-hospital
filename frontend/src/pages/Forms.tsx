import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PageMeta } from '../components/common/PageMeta'
import { siteSections } from '../config/siteMap'

export const FormsOverviewPage: React.FC = () => {
  const formsSection = siteSections.find((section) => section.id === 'forms')

  return (
    <div>
      <PageMeta
        title="แบบฟอร์มและธุรการ"
        description="ศูนย์รวมแบบฟอร์มสำคัญของโรงพยาบาลโพนพิสัย ทั้งการขอประวัติการรักษา การรับบริจาค และประเมินความพึงพอใจ"
        url="https://www.pph-hospital.local/forms"
      />
      <Container>
        <header>
          <h1>แบบฟอร์ม/ธุรการ</h1>
          <p>เลือกบริการที่ต้องการและยื่นคำขอผ่านระบบออนไลน์ได้ทันที ลดขั้นตอนการเดินทางและประหยัดเวลา</p>
        </header>
      </Container>
      <PageSection id="forms" title="แบบฟอร์มที่เปิดให้บริการ" background="muted">
        <Grid columns={3}>
          {formsSection?.children?.map((child) => (
            <article className="card" key={child.path}>
              <h3>{child.label}</h3>
              <p>อ่านรายละเอียดเอกสารและยื่นคำขอผ่านระบบออนไลน์ พร้อมรับอีเมลยืนยัน</p>
              <a className="btn btn-outline" href={child.path}>
                กรอกแบบฟอร์ม
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="support" title="ศูนย์ช่วยเหลือ">
        <p>ติดต่อทีมธุรการ โทร 042-000-555 ต่อ 1800 หรืออีเมล forms@pph-hospital.go.th (วันจันทร์-ศุกร์ 08:30-16:30 น.)</p>
      </PageSection>
    </div>
  )
}

export default FormsOverviewPage
