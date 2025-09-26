import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'
import { PageMeta } from '../components/common/PageMeta'
import { siteSections } from '../config/siteMap'

export const ProgramsOverviewPage: React.FC = () => {
  const programsSection = siteSections.find((section) => section.id === 'programs')

  return (
    <div>
      <PageMeta
        title="โครงการและบริการเชิงรุก"
        description="สำรวจโครงการเด่นและบริการเชิงรุกของโรงพยาบาลโพนพิสัย เช่น Health Rider และคลินิกชุมชน"
        url="https://www.pph-hospital.local/programs"
      />
      <Container>
        <header>
          <h1>โครงการ/บริการเด่น</h1>
          <p>ยกระดับการดูแลสุขภาพเชิงรุกสู่ชุมชน ผ่านโครงการนำร่องและนวัตกรรมบริการที่ตอบโจทย์ทุกช่วงวัย</p>
        </header>
      </Container>
      <PageSection id="programs" title="รายการโครงการ" background="muted">
        <Grid columns={2}>
          {programsSection?.children?.map((child) => (
            <article className="card" key={child.path}>
              <h3>{child.label}</h3>
              <p>ดูรายละเอียดโครงการ บริการที่มี และวิธีเข้าร่วมสำหรับประชาชน</p>
              <a className="btn btn-outline" href={child.path}>
                ดูรายละเอียด
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="impact" title="ผลลัพธ์ที่คาดหวัง">
        <Grid columns={3}>
          <article className="card">
            <h3>เข้าถึงบริการเร็วขึ้น</h3>
            <p>ลดเวลารอคอยเฉลี่ย 30% ด้วยระบบติดตามสถานะและการจัดส่งยา</p>
          </article>
          <article className="card">
            <h3>คุณภาพชีวิตผู้ป่วยดีขึ้น</h3>
            <p>สนับสนุนการดูแลต่อเนื่องที่บ้าน ช่วยลดการกลับมานอนโรงพยาบาลซ้ำ</p>
          </article>
          <article className="card">
            <h3>ข้อมูลเพื่อวิเคราะห์</h3>
            <p>สะสมข้อมูลเพื่อต่อยอดนโยบายสาธารณะและการจัดสรรทรัพยากรที่แม่นยำ</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default ProgramsOverviewPage
