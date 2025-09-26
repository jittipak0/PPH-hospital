import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

const leadershipTeams = [
  {
    title: 'คณะผู้บริหารระดับสูง',
    members: [
      { name: 'นพ. อภิสิทธิ์ ศรีประชา', role: 'ผู้อำนวยการโรงพยาบาล' },
      { name: 'พญ. อรอุมา ตั้งจิตร', role: 'รองผู้อำนวยการด้านการแพทย์' },
      { name: 'นาง จุฑารัตน์ ทองใจ', role: 'รองผู้อำนวยการด้านการพยาบาล' }
    ]
  },
  {
    title: 'คณะกรรมการธรรมาภิบาล',
    members: [
      { name: 'นาย ศิริชัย พูนผล', role: 'ประธานคณะกรรมการ' },
      { name: 'นาง พิมพ์ลดา ภักดี', role: 'เลขานุการ' },
      { name: 'นพ. รังสิมันต์ เอกสกุล', role: 'กรรมการผู้ทรงคุณวุฒิ' }
    ]
  },
  {
    title: 'ผู้อำนวยการศูนย์เชี่ยวชาญ',
    members: [
      { name: 'พญ. ลัดดา ธนภพ', role: 'ศูนย์โรคหัวใจและหลอดเลือด' },
      { name: 'นพ. ภาคภูมิ สุขสันต์', role: 'ศูนย์มะเร็งแบบบูรณาการ' },
      { name: 'ดร. จินตนา เจริญสุข', role: 'ศูนย์นวัตกรรมดิจิทัลทางการแพทย์' }
    ]
  }
]

export const LeadershipPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ทำเนียบโครงสร้างการบริหาร | โรงพยาบาลโพนพิสัย"
        description="โครงสร้างการบริหารโรงพยาบาลโพนพิสัย ครอบคลุมผู้บริหารระดับสูง คณะกรรมการธรรมาภิบาล และศูนย์เชี่ยวชาญต่าง ๆ"
        url="https://www.pph-hospital.local/about/leadership"
      />
      <Container>
        <header>
          <h1>ทำเนียบโครงสร้างการบริหาร</h1>
          <p>
            เราบริหารงานแบบบูรณาการ โดยยึดหลักธรรมาภิบาล โปร่งใส และเน้นผลลัพธ์ด้านคุณภาพบริการ
            ผู้บริหารแต่ละระดับทำงานร่วมกับเครือข่ายชุมชนและพันธมิตรด้านสุขภาพ
          </p>
        </header>
      </Container>
      {leadershipTeams.map((team) => (
        <PageSection key={team.title} id={team.title} title={team.title} background="muted">
          <Grid columns={3}>
            {team.members.map((member) => (
              <article className="card" key={member.name}>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </article>
            ))}
          </Grid>
        </PageSection>
      ))}
      <PageSection id="roles" title="บทบาทและความรับผิดชอบหลัก">
        <Grid columns={2}>
          <article className="card">
            <h3>กำกับทิศทางเชิงกลยุทธ์</h3>
            <p>
              พัฒนาวิสัยทัศน์ เป้าหมาย และตัวชี้วัดด้านคุณภาพบริการที่ตอบโจทย์ประชาชน พร้อมขับเคลื่อนการลงทุนด้านดิจิทัลและบุคลากร
            </p>
          </article>
          <article className="card">
            <h3>การจัดการความเสี่ยงและกำกับดูแล</h3>
            <p>
              ตั้งคณะทำงานเฉพาะด้านธรรมาภิบาล ตรวจสอบการจัดซื้อจัดจ้าง และทบทวนเหตุการณ์สำคัญเพื่อเสริมสร้างความเชื่อมั่นของสาธารณชน
            </p>
          </article>
          <article className="card">
            <h3>พัฒนาศักยภาพบุคลากร</h3>
            <p>
              จัดทำแผนพัฒนาความรู้และทักษะ โดยเฉพาะทักษะดิจิทัล ความปลอดภัยผู้ป่วย และการบริการด้วยหัวใจเพื่อคนไทยทุกกลุ่ม
            </p>
          </article>
          <article className="card">
            <h3>สร้างความร่วมมือกับภาคี</h3>
            <p>
              ประสานงานกับหน่วยงานรัฐ เอกชน และชุมชน เพื่อร่วมพัฒนาระบบสุขภาพปฐมภูมิและบริการต่อเนื่องที่บ้าน
            </p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default LeadershipPage
