import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/seo/PageMeta'

const missionItems = [
  'ให้บริการสาธารณสุขที่ปลอดภัย มีคุณภาพ และเข้าถึงได้สำหรับทุกคน',
  'พัฒนาศักยภาพบุคลากรและระบบบริการด้วยนวัตกรรมและเทคโนโลยีดิจิทัล',
  'ขับเคลื่อนการสร้างเสริมสุขภาพเชิงรุกร่วมกับชุมชนและภาคีเครือข่าย',
  'บริหารจัดการด้วยหลักธรรมาภิบาล โปร่งใส และตรวจสอบได้'
]

const values = [
  {
    key: 'C',
    name: 'Compassion',
    description: 'ใส่ใจ เห็นคุณค่า และปฏิบัติต่อผู้ป่วยอย่างมีมนุษยธรรม'
  },
  {
    key: 'A',
    name: 'Accountability',
    description: 'รับผิดชอบต่อผลลัพธ์และพร้อมเปิดเผยข้อมูลอย่างโปร่งใส'
  },
  {
    key: 'R',
    name: 'Resilience',
    description: 'ยืดหยุ่น ปรับตัวได้รวดเร็ว พร้อมรับสถานการณ์วิกฤต'
  },
  {
    key: 'E',
    name: 'Excellence',
    description: 'มุ่งสู่ความเป็นเลิศด้วยมาตรฐานวิชาชีพและนวัตกรรม'
  }
]

export const VisionMissionValuesPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="วิสัยทัศน์ พันธกิจ และค่านิยม | โรงพยาบาลโพนพิสัย"
        description="แนวทางและค่านิยมที่บุคลากรโรงพยาบาลโพนพิสัยยึดถือเพื่อมอบบริการสุขภาพที่ปลอดภัยทั่วถึง"
        openGraph={{
          title: 'วิสัยทัศน์และพันธกิจโรงพยาบาลโพนพิสัย',
          description: 'ทำความรู้จักวิสัยทัศน์ พันธกิจ และค่านิยมหลัก CARE ของบุคลากรโรงพยาบาลโพนพิสัย',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>วิสัยทัศน์ พันธกิจ และค่านิยม</h1>
        <p>
          บุคลากรโรงพยาบาลโพนพิสัยร่วมกันยึดถือวิสัยทัศน์และค่านิยมเดียวกัน เพื่อมอบบริการที่มีคุณภาพและยั่งยืนแก่ประชาชน พร้อมก้าวสู่การเป็นศูนย์การแพทย์แนวหน้าของภูมิภาค
        </p>
      </Container>

      <PageSection id="vision" title="วิสัยทัศน์" description="“โรงพยาบาลศูนย์ระดับภูมิภาคที่ให้บริการแบบยั่งยืน ครอบคลุม และทันสมัย”">
        <div className="card">
          <p>
            เรามุ่งมั่นยกระดับคุณภาพการดูแลผู้ป่วยด้วยมาตรฐานสากล ผสานเทคโนโลยีดิจิทัลและเครือข่ายการแพทย์ เพื่อให้ประชาชนในจังหวัดหนองคายและภูมิภาคได้รับบริการที่รวดเร็ว เท่าเทียม และปลอดภัย
          </p>
        </div>
      </PageSection>

      <PageSection id="mission" title="พันธกิจ" description="4 ภารกิจหลักที่ขับเคลื่อนการดำเนินงานของโรงพยาบาล">
        <ul className="card">
          {missionItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="values" title="ค่านิยม CARE" description="กรอบคุณค่าที่บุคลากรทุกคนยึดถือร่วมกัน">
        <Grid columns={4}>
          {values.map((value) => (
            <article key={value.key} className="card">
              <h3>{value.key} — {value.name}</h3>
              <p>{value.description}</p>
            </article>
          ))}
        </Grid>
      </PageSection>
    </div>
  )
}
