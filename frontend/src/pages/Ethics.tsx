import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PageMeta } from '../components/common/PageMeta'
import { siteSections } from '../config/siteMap'

export const EthicsOverviewPage: React.FC = () => {
  const ethicsSection = siteSections.find((section) => section.id === 'ethics')

  return (
    <div>
      <PageMeta
        title="ธรรมาภิบาลและจริยธรรม"
        description="ข้อมูลธรรมาภิบาล การปลูกฝังวัฒนธรรมจริยธรรม และมาตรการลดการเลือกปฏิบัติของโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/ethics"
      />
      <Container>
        <header>
          <h1>ธรรมาภิบาลและจริยธรรม</h1>
          <p>
            โรงพยาบาลโพนพิสัยเชื่อว่าความไว้วางใจของประชาชนเริ่มจากการทำงานอย่างโปร่งใส ยึดหลักจริยธรรม และเคารพความหลากหลาย
          </p>
        </header>
      </Container>
      <PageSection id="highlights" title="หัวข้อสำคัญ" background="muted">
        <Grid columns={3}>
          {ethicsSection?.children?.map((child) => (
            <article className="card" key={child.path}>
              <h3>{child.label}</h3>
              <p>
                เรียนรู้มาตรการ บทบาท และกิจกรรมที่เราดำเนินการเพื่อสร้างวัฒนธรรมองค์กรที่เป็นธรรมและปลอดการเลือกปฏิบัติ
              </p>
              <a className="btn btn-outline" href={child.path}>
                อ่านเพิ่มเติม
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="whistle-blower" title="ช่องทางแจ้งเรื่องจริยธรรม">
        <Grid columns={2}>
          <article className="card">
            <h3>สายด่วนธรรมาภิบาล</h3>
            <p>โทร 042-000-555 ต่อ 1500 ตลอด 24 ชั่วโมง พร้อมระบบรับแจ้งนิรนาม</p>
          </article>
          <article className="card">
            <h3>อีเมลรายงาน</h3>
            <p>ส่งข้อมูลไปยัง ethics@pph-hospital.go.th พร้อมหลักฐานประกอบ ทีมธรรมาภิบาลจะตอบกลับภายใน 5 วันทำการ</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default EthicsOverviewPage
