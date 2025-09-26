import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PageMeta } from '../components/common/PageMeta'
import { siteSections } from '../config/siteMap'
import { useAuth } from '../context/AuthContext'

export const IntranetOverviewPage: React.FC = () => {
  const intranetSection = siteSections.find((section) => section.id === 'intranet')
  const { isAuthenticated } = useAuth()

  return (
    <div>
      <PageMeta
        title="ระบบภายใน"
        description="เครื่องมือและระบบภายในของโรงพยาบาลโพนพิสัยสำหรับบุคลากร ต้องเข้าสู่ระบบเพื่อใช้งาน"
        url="https://www.pph-hospital.local/intranet"
      />
      <Container>
        <header>
          <h1>ระบบภายในสำหรับบุคลากร</h1>
          <p>รวมเครื่องมือที่ช่วยให้บุคลากรทำงานได้สะดวก รวดเร็ว และปลอดภัย ทั้งระบบเบิกจ่ายและศูนย์เอกสาร</p>
          {!isAuthenticated && (
            <p className="notice">กรุณาเข้าสู่ระบบเพื่อเข้าถึงบริการทั้งหมด</p>
          )}
        </header>
      </Container>
      <PageSection id="systems" title="ระบบที่ให้บริการ" background="muted">
        <Grid columns={2}>
          {intranetSection?.children?.map((child) => (
            <article className="card" key={child.path}>
              <h3>{child.label}</h3>
              <p>เครื่องมือสำหรับเจ้าหน้าที่ภายใน เพื่อเพิ่มประสิทธิภาพการทำงานและการสื่อสารในองค์กร</p>
              <a className="btn btn-outline" href={child.path}>
                เข้าสู่ระบบ
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
    </div>
  )
}

export default IntranetOverviewPage
