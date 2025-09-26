import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

export const VisionMissionValuesPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="วิสัยทัศน์ พันธกิจ และค่านิยม"
        description="วิสัยทัศน์ พันธกิจ และค่านิยมหลักของโรงพยาบาลโพนพิสัยในการให้บริการสุขภาพที่เป็นธรรมและทันสมัย"
        url="https://www.pph-hospital.local/about/vision-mission-values"
      />
      <Container>
        <header>
          <h1>วิสัยทัศน์ / พันธกิจ / ค่านิยม</h1>
          <p>
            โรงพยาบาลโพนพิสัยยึดหลักการดูแลผู้รับบริการแบบองค์รวม เน้นการมีส่วนร่วมของชุมชน และการใช้เทคโนโลยีที่ปลอดภัยและเชื่อถือได้
          </p>
        </header>
      </Container>
      <PageSection id="vision" title="วิสัยทัศน์" background="muted">
        <article className="card">
          <p>เป็นโรงพยาบาลศูนย์ชั้นนำที่ขับเคลื่อนสุขภาพเชิงรุกด้วยนวัตกรรมดิจิทัลและหัวใจบริการ</p>
        </article>
      </PageSection>
      <PageSection id="mission" title="พันธกิจ">
        <Grid columns={2}>
          <article className="card">
            <h3>ให้บริการคุณภาพ</h3>
            <p>มอบบริการสุขภาพที่มีมาตรฐานและเข้าถึงได้โดยไม่เลือกปฏิบัติ</p>
          </article>
          <article className="card">
            <h3>พัฒนาบุคลากร</h3>
            <p>พัฒนาทักษะและเส้นทางอาชีพของทีมแพทย์ พยาบาล และบุคลากรสนับสนุนอย่างต่อเนื่อง</p>
          </article>
          <article className="card">
            <h3>ร่วมมือกับชุมชน</h3>
            <p>สร้างเครือข่ายสุขภาพร่วมกับชุมชนเพื่อการป้องกันและดูแลโรคเรื้อรัง</p>
          </article>
          <article className="card">
            <h3>สร้างนวัตกรรม</h3>
            <p>สนับสนุนการทดลองใช้เทคโนโลยีและกระบวนการใหม่เพื่อเพิ่มประสิทธิภาพ</p>
          </article>
        </Grid>
      </PageSection>
      <PageSection id="values" title="ค่านิยม PPH">
        <Grid columns={3}>
          <article className="card">
            <h3>P - Patient First</h3>
            <p>ทุกการตัดสินใจและบริการยึดผู้ป่วยเป็นศูนย์กลาง</p>
          </article>
          <article className="card">
            <h3>P - Professionalism</h3>
            <p>ทำงานด้วยจรรยาบรรณ มาตรฐานวิชาชีพ และการเคารพความแตกต่าง</p>
          </article>
          <article className="card">
            <h3>H - Humanity</h3>
            <p>บริการด้วยความเข้าใจ เห็นใจ และให้เกียรติผู้รับบริการทุกคน</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}

export default VisionMissionValuesPage
