import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PageMeta } from '../components/common/PageMeta'
import { siteSections } from '../config/siteMap'

export const TransparencyOverviewPage: React.FC = () => {
  const section = siteSections.find((item) => item.id === 'transparency')

  return (
    <div>
      <PageMeta
        title="จัดซื้อจัดจ้าง/ITA"
        description="ติดตามข้อมูลจัดซื้อจัดจ้างและดัชนีความโปร่งใสของโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/transparency"
      />
      <Container>
        <header>
          <h1>จัดซื้อจัดจ้าง / ข่าวสาร ITA</h1>
          <p>เผยแพร่ข้อมูลการจัดซื้อจัดจ้างอย่างโปร่งใส พร้อมผลการประเมิน ITA เพื่อสร้างความเชื่อมั่นแก่ประชาชน</p>
        </header>
      </Container>
      <PageSection id="summary" title="หัวข้อข้อมูล" background="muted">
        <Grid columns={1}>
          {section?.children?.map((child) => (
            <article className="card" key={child.path}>
              <h3>{child.label}</h3>
              <p>เข้าดูประกาศจัดซื้อจัดจ้าง ผลคะแนน ITA และรายงานการใช้จ่ายประจำไตรมาส</p>
              <a className="btn btn-outline" href={child.path}>
                ไปยังหน้ารายละเอียด
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="contacts" title="ช่องทางติดต่อสอบถาม">
        <Grid columns={2}>
          <article className="card">
            <h3>งานพัสดุ</h3>
            <p>โทร 042-000-777 ต่อ 2100 (วันทำการ 08:30-16:30 น.)</p>
          </article>
          <article className="card">
            <h3>ทีม ITA</h3>
            <p>อีเมล ita@pph-hospital.go.th หรือกรอกแบบฟอร์มร้องเรียนผ่าน Intranet</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default TransparencyOverviewPage
