import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

const activities = [
  {
    title: 'เสวนาจริยธรรมรายไตรมาส',
    detail: 'จัดเวทีแลกเปลี่ยนประสบการณ์ด้านจริยธรรมการแพทย์และการบริการจากกรณีศึกษาจริง'
  },
  {
    title: 'โครงการต้นแบบ “ใจใส ใส่ใจ”',
    detail: 'อบรมเชิงปฏิบัติการเพื่อสร้างวัฒนธรรมองค์กรโปร่งใส ให้บุคลากรทุกระดับมีส่วนร่วม'
  },
  {
    title: 'Mentor ด้านจริยธรรม',
    detail: 'จับคู่พี่เลี้ยงกับบุคลากรรุ่นใหม่เพื่อติดตามการปฏิบัติตามจรรยาบรรณและการดูแลผู้ป่วย'
  }
]

export const EthicsClubPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ชมรมจริยธรรม"
        description="ชมรมจริยธรรมของโรงพยาบาลโพนพิสัย ผลักดันกิจกรรมส่งเสริมวัฒนธรรมองค์กรที่โปร่งใสและเคารพสิทธิผู้ป่วย"
        url="https://www.pph-hospital.local/ethics/club"
      />
      <Container>
        <header>
          <h1>ชมรมจริยธรรม</h1>
          <p>
            ชมรมจริยธรรมทำหน้าที่ขับเคลื่อนวัฒนธรรมการทำงานที่โปร่งใส เน้นการเคารพสิทธิผู้ป่วยและเพื่อนร่วมงาน
            ผ่านกิจกรรมแลกเปลี่ยนความรู้และการอบรมต่อเนื่อง
          </p>
        </header>
      </Container>
      <PageSection id="activities" title="กิจกรรมเด่น" background="muted">
        <Grid columns={3}>
          {activities.map((activity) => (
            <article className="card" key={activity.title}>
              <h3>{activity.title}</h3>
              <p>{activity.detail}</p>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="membership" title="ร่วมเป็นสมาชิก">
        <Grid columns={2}>
          <article className="card">
            <h3>คุณสมบัติ</h3>
            <ul>
              <li>เป็นบุคลากรโรงพยาบาลทุกตำแหน่ง</li>
              <li>ผ่านการอบรมจริยธรรมพื้นฐาน</li>
              <li>พร้อมแบ่งปันและเป็นต้นแบบด้านจริยธรรม</li>
            </ul>
          </article>
          <article className="card">
            <h3>ช่องทางสมัคร</h3>
            <p>กรอกแบบฟอร์มออนไลน์หรือส่งอีเมลมาที่ ethics.club@pph-hospital.go.th ภายในวันที่ 30 กันยายนของทุกปี</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default EthicsClubPage
