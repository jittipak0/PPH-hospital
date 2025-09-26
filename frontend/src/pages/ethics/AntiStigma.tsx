import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

const initiatives = [
  {
    title: 'นโยบายไม่เลือกปฏิบัติ',
    description: 'กำหนดมาตรการชัดเจนต่อการปฏิบัติหน้าที่อย่างเท่าเทียม พร้อมช่องทางร้องเรียนที่โปร่งใส'
  },
  {
    title: 'หลักสูตรอบรมการสื่อสารเชิงบวก',
    description: 'เพิ่มทักษะบุคลากรในการสื่อสารกับผู้รับบริการที่หลากหลาย สร้างประสบการณ์ที่ปลอดภัย'
  },
  {
    title: 'โครงการเพื่อนคู่คิด',
    description: 'จัดอาสาสมัครคอยให้ข้อมูลและกำลังใจแก่ผู้รับบริการกลุ่มเปราะบาง ทั้งผู้พิการและผู้ป่วยจิตเวช'
  }
]

export const AntiStigmaPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="การลดการตีตราและเลือกปฏิบัติ"
        description="มาตรการของโรงพยาบาลโพนพิสัยเพื่อลดการตีตราและเลือกปฏิบัติ ดูแลผู้รับบริการทุกคนอย่างเท่าเทียม"
        url="https://www.pph-hospital.local/ethics/anti-stigma"
      />
      <Container>
        <header>
          <h1>การลดการตีตราและเลือกปฏิบัติ</h1>
          <p>
            เรามุ่งสร้างสภาพแวดล้อมที่เปิดกว้างและปลอดภัย ให้ผู้รับบริการทุกคนได้รับการปฏิบัติด้วยความเคารพและศักดิ์ศรีความเป็นมนุษย์
          </p>
        </header>
      </Container>
      <PageSection id="initiatives" title="มาตรการหลัก" background="muted">
        <Grid columns={3}>
          {initiatives.map((initiative) => (
            <article className="card" key={initiative.title}>
              <h3>{initiative.title}</h3>
              <p>{initiative.description}</p>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="services" title="บริการสนับสนุน">
        <Grid columns={2}>
          <article className="card">
            <h3>ห้องให้คำปรึกษา</h3>
            <p>เปิดให้คำปรึกษาแบบส่วนตัวสำหรับผู้รับบริการและครอบครัว โดยนักจิตวิทยาและนักสังคมสงเคราะห์วิชาชีพ</p>
          </article>
          <article className="card">
            <h3>ชุดความรู้ภาษามือและล่าม</h3>
            <p>จัดหาอาสาสมัครล่ามภาษามือและคู่มือสื่อสารหลายภาษา เพื่อให้ผู้รับบริการเข้าถึงข้อมูลทางการแพทย์ครบถ้วน</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default AntiStigmaPage
