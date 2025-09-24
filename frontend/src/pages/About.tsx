import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { Grid } from '../components/layout/Grid'

export const About: React.FC = () => {
  return (
    <div>
      <Container>
        <header>
          <h1>เกี่ยวกับโรงพยาบาลโพนพิสัย</h1>
          <p>
            โรงพยาบาลโพนพิสัยเป็นโรงพยาบาลศูนย์ของภาครัฐ ก่อตั้งในปี พ.ศ. 2508 ด้วยพันธกิจในการให้บริการทางการแพทย์ที่มีคุณภาพและเข้าถึงได้สำหรับประชาชนทุกกลุ่ม
          </p>
        </header>
      </Container>

      <PageSection id="history" title="ประวัติความเป็นมา">
        <p>
          จากโรงพยาบาลขนาด 60 เตียงในวันแรก เรายกระดับสู่โรงพยาบาลศูนย์ที่มีเตียงกว่า 850 เตียง พร้อมศูนย์ความเชี่ยวชาญเฉพาะทาง 12 ศูนย์ ให้การดูแลผู้ป่วยทั้งในและนอกเขตกรุงเทพมหานคร
          โรงพยาบาลได้รับการรับรองมาตรฐาน HA/Hospital Accreditation อย่างต่อเนื่อง และพัฒนานวัตกรรมการดูแลผู้ป่วยร่วมกับมหาวิทยาลัยชั้นนำ
        </p>
      </PageSection>

      <PageSection id="vision" title="วิสัยทัศน์และพันธกิจ">
        <Grid columns={2}>
          <article className="card">
            <h3>วิสัยทัศน์</h3>
            <p>เป็นโรงพยาบาลรัฐชั้นนำที่มุ่งเน้นสุขภาพเชิงรุก บริการด้วยหัวใจ และขับเคลื่อนด้วยเทคโนโลยีที่ปลอดภัย</p>
          </article>
          <article className="card">
            <h3>พันธกิจ</h3>
            <ul>
              <li>ให้บริการทางการแพทย์ที่มีมาตรฐานและเป็นธรรม</li>
              <li>พัฒนาระบบสุขภาพที่ยั่งยืนด้วยการมีส่วนร่วมของชุมชน</li>
              <li>ผลิตและพัฒนาบุคลากรด้านสาธารณสุขอย่างต่อเนื่อง</li>
            </ul>
          </article>
        </Grid>
      </PageSection>

      <PageSection id="executives" title="คณะผู้บริหาร">
        <Grid columns={3}>
          {[{
            name: 'นพ. อภิสิทธิ์ ศรีประชา',
            role: 'ผู้อำนวยการโรงพยาบาล'
          }, {
            name: 'พญ. อรอุมา ตั้งจิตร',
            role: 'รองผู้อำนวยการด้านการแพทย์'
          }, {
            name: 'นาง จุฑารัตน์ ทองใจ',
            role: 'รองผู้อำนวยการด้านการพยาบาล'
          }, {
            name: 'นาย ศิริชัย พูนผล',
            role: 'รองผู้อำนวยการด้านบริหาร'
          }].map((executive) => (
            <article className="card" key={executive.name}>
              <h3>{executive.name}</h3>
              <p>{executive.role}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection id="information" title="ข้อมูลทั่วไปขององค์กร">
        <Grid columns={2}>
          <article className="card">
            <h3>จำนวนเตียงและบุคลากร</h3>
            <p>มีเตียงรองรับผู้ป่วย 850 เตียง บุคลากร 3,200 คน ประกอบด้วยแพทย์ผู้เชี่ยวชาญ 420 คน และพยาบาลวิชาชีพ 1,600 คน</p>
          </article>
          <article className="card">
            <h3>มาตรฐานและรางวัล</h3>
            <p>ได้รับการรับรองมาตรฐาน HA 3 สมัยติดต่อกัน และรางวัลโรงพยาบาลสีเขียวจากกระทรวงสาธารณสุข</p>
          </article>
        </Grid>
      </PageSection>
    </div>
  )
}
