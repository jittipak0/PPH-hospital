import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/seo/PageMeta'

const activities = [
  {
    title: 'คลินิกปรึกษาจริยธรรม',
    detail: 'เปิดให้บุคลากรและประชาชนปรึกษากรณีจริยธรรมทางการแพทย์ทุกวันพุธ เวลา 13.00-15.00 น.'
  },
  {
    title: 'Ethics Talk',
    detail: 'เวทีแลกเปลี่ยนประเด็นจริยธรรม ประจำเดือนครั้งที่ 1 ของทุกเดือน พร้อมสรุปเผยแพร่ใน Intranet'
  },
  {
    title: 'โครงการ “ใจใส่ ใจรักษ์”',
    detail: 'เวิร์กช็อปปลูกจิตสำนึกด้านจริยธรรมสำหรับบุคลากรใหม่และนักศึกษาแพทย์/พยาบาล'
  }
]

const committee = [
  { name: 'นพ. พิชัย ศรีโพนพิสัย', role: 'ที่ปรึกษา' },
  { name: 'พว. สุนิสา ประสิทธิสุข', role: 'ประธานชมรม' },
  { name: 'น.ส. ลลิตา ธรรมคุณ', role: 'เลขานุการ' },
  { name: 'คณะกรรมการตัวแทนจากทุกกลุ่มภารกิจ', role: 'กรรมการ' }
]

export const EthicsClubPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ชมรมจริยธรรมโรงพยาบาล | โรงพยาบาลโพนพิสัย"
        description="ทำความรู้จักภารกิจของชมรมจริยธรรม กิจกรรมและช่องทางให้คำปรึกษาด้านจริยธรรมทางการแพทย์"
        openGraph={{
          title: 'ชมรมจริยธรรมโรงพยาบาลโพนพิสัย',
          description: 'ชมรมจริยธรรมจัดกิจกรรมเสริมสร้างวัฒนธรรมการดูแลผู้ป่วยที่โปร่งใสและมีจริยธรรม พร้อมให้คำปรึกษาแก่บุคลากร',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>ชมรมจริยธรรมโรงพยาบาลโพนพิสัย</h1>
        <p>
          ชมรมจริยธรรมเป็นหน่วยงานสนับสนุนที่ช่วยให้บุคลากรตัดสินใจเชิงจริยธรรมได้อย่างถูกต้อง และสร้างบรรยากาศองค์กรที่ให้ความสำคัญกับสิทธิมนุษยชน ความเท่าเทียม และความโปร่งใสในการให้บริการ
        </p>
      </Container>

      <PageSection
        id="committee"
        title="คณะทำงานชมรมจริยธรรม"
        description="ประกอบด้วยตัวแทนจากทุกสายวิชาชีพเพื่อสะท้อนมุมมองที่หลากหลาย"
      >
        <div className="card">
          <ul>
            {committee.map((member) => (
              <li key={member.name}>
                <strong>{member.name}</strong> — {member.role}
              </li>
            ))}
          </ul>
        </div>
      </PageSection>

      <PageSection id="activities" title="กิจกรรมหลัก" description="ตารางกิจกรรมชมรมจริยธรรมประจำไตรมาส">
        <Grid columns={3}>
          {activities.map((activity) => (
            <article key={activity.title} className="card">
              <h3>{activity.title}</h3>
              <p>{activity.detail}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        id="contact"
        title="ช่องทางติดต่อชมรม"
        description="พร้อมให้คำปรึกษาเรื่องความขัดแย้งทางจริยธรรมและแนวทางการจัดการ"
        background="muted"
      >
        <div className="card">
          <ul>
            <li>ห้องทำงานชมรม จัดอยู่ชั้น 4 อาคารอำนวยการ เปิดทำการวันจันทร์-ศุกร์ 08.30-16.30 น.</li>
            <li>โทร 042-123-456 ต่อ 1409 หรือส่งอีเมล ethicsclub@pph-hospital.go.th</li>
            <li>สำหรับกรณีเร่งด่วน ติดต่อสายด่วนจริยธรรม 08-1234-5678 (24 ชั่วโมง) หรือแจ้งผ่านระบบ Whistleblowing</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
