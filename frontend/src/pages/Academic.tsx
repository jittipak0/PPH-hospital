import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PageMeta } from '../components/common/PageMeta'
import { siteSections } from '../config/siteMap'

export const AcademicOverviewPage: React.FC = () => {
  const academicSection = siteSections.find((section) => section.id === 'academic')

  return (
    <div>
      <PageMeta
        title="วิชาการและผลงาน"
        description="รวบรวมองค์ความรู้ งานวิจัย และนวัตกรรมทางการแพทย์ของโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/academic"
      />
      <Container>
        <header>
          <h1>วิชาการและผลงาน</h1>
          <p>
            เราสนับสนุนการสร้างองค์ความรู้และการเผยแพร่ผลงานวิชาการ เพื่อยกระดับคุณภาพการรักษาและการให้บริการสุขภาพของประเทศ
          </p>
        </header>
      </Container>
      <PageSection id="highlights" title="หมวดเนื้อหา" background="muted">
        <Grid columns={2}>
          {academicSection?.children?.map((child) => (
            <article className="card" key={child.path}>
              <h3>{child.label}</h3>
              <p>ติดตามบทความ งานวิจัย และสื่อการเรียนรู้ที่เผยแพร่เพื่อบุคลากรและประชาชน</p>
              <a className="btn btn-outline" href={child.path}>
                เข้าดูเนื้อหา
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="supports" title="สิ่งสนับสนุนนักวิจัย">
        <Grid columns={3}>
          <article className="card">
            <h3>กองทุนวิจัยโรงพยาบาล</h3>
            <p>เปิดรับข้อเสนอวิจัยที่ตอบโจทย์ชุมชน ระหว่างเดือนมกราคม-มีนาคมของทุกปี</p>
          </article>
          <article className="card">
            <h3>ที่ปรึกษาด้านสถิติ</h3>
            <p>บริการที่ปรึกษาและอบรมการใช้เครื่องมือวิเคราะห์ข้อมูลเชิงสถิติสำหรับบุคลากรทุกระดับ</p>
          </article>
          <article className="card">
            <h3>คลังข้อมูลเปิด</h3>
            <p>เตรียมเปิดคลังข้อมูลสุขภาพ (Open Data) เพื่อสนับสนุนการวิจัยและนวัตกรรมสุขภาพดิจิทัล</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default AcademicOverviewPage
