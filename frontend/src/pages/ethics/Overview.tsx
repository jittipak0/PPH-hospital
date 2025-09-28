import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/seo/PageMeta'

const initiatives = [
  {
    title: 'คณะกรรมการธรรมาภิบาล',
    description: 'ดูแลการกำกับดูแลกิจการที่ดี การบริหารความเสี่ยง และการปฏิบัติตามกฎหมาย'
  },
  {
    title: 'ระบบแจ้งเบาะแส (Whistleblowing)',
    description: 'เปิดช่องทางให้บุคลากรและประชาชนแจ้งพฤติกรรมที่ไม่เหมาะสมโดยเก็บข้อมูลเป็นความลับ'
  },
  {
    title: 'โครงการวัฒนธรรมองค์กรโปร่งใส',
    description: 'จัดอบรมและสื่อสารนโยบายด้านจริยธรรมและการต่อต้านการทุจริตเป็นประจำทุกปี'
  }
]

export const EthicsOverviewPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ธรรมาภิบาลและจริยธรรม | โรงพยาบาลโพนพิสัย"
        description="แนวปฏิบัติด้านธรรมาภิบาล การป้องกันการทุจริต และการส่งเสริมวัฒนธรรมจริยธรรมของโรงพยาบาล"
        openGraph={{
          title: 'นโยบายธรรมาภิบาลโรงพยาบาลโพนพิสัย',
          description: 'รู้จักระบบธรรมาภิบาล ช่องทางแจ้งเบาะแส และมาตรการด้านจริยธรรมของโรงพยาบาลโพนพิสัย',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>ธรรมาภิบาลและจริยธรรม</h1>
        <p>
          โรงพยาบาลโพนพิสัยยึดมั่นในการบริหารงานอย่างโปร่งใส ตรวจสอบได้ และให้ความสำคัญกับสิทธิผู้ป่วย โดยวางโครงสร้างธรรมาภิบาลที่ครอบคลุมด้านนโยบาย การปฏิบัติ และการติดตามประเมินผล
        </p>
      </Container>

      <PageSection
        id="initiatives"
        title="มาตรการด้านธรรมาภิบาล"
        description="ดำเนินโครงการต่อเนื่องเพื่อส่งเสริมความซื่อสัตย์และความรับผิดชอบของบุคลากร"
      >
        <Grid columns={3}>
          {initiatives.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        id="policies"
        title="นโยบายสำคัญ"
        description="ประกอบด้วยแนวปฏิบัติหลัก 4 ด้านที่ครอบคลุมบุคลากรทุกระดับ"
        background="muted"
      >
        <div className="card">
          <ul>
            <li>นโยบายการต่อต้านการรับสินบนและผลประโยชน์ทับซ้อน พร้อมคู่มือการตัดสินใจทางจริยธรรม</li>
            <li>นโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) และแนวทางการจัดเก็บ/เผยแพร่ข้อมูลผู้ป่วย</li>
            <li>นโยบายสิทธิมนุษยชนและความเท่าเทียม บังคับใช้กับทั้งบุคลากรและผู้รับบริการ</li>
            <li>นโยบายความโปร่งใสด้านการจัดซื้อจัดจ้างและการบริหารงบประมาณ</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
