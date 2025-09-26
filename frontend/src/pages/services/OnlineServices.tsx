import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

const onlineServices = [
  {
    name: 'จองคิวพบแพทย์ออนไลน์',
    detail: 'เลือกแพทย์และแผนก ตรวจสอบรอบเวลาก่อนมายังโรงพยาบาล'
  },
  {
    name: 'ติดตามผลตรวจทางห้องปฏิบัติการ',
    detail: 'เข้าสู่ระบบเพื่อดูผลตรวจและคำแนะนำจากแพทย์ได้ทันที'
  },
  {
    name: 'Health Rider',
    detail: 'จัดส่งยาและอุปกรณ์ทางการแพทย์ถึงบ้าน พร้อมติดตามอาการผ่านวิดีโอคอล'
  }
]

const supportChannels = [
  {
    title: 'ศูนย์บริการดิจิทัล',
    contact: 'โทร 042-000-888 ต่อ 1200 | LINE @pph-digital'
  },
  {
    title: 'ศูนย์ข้อมูลสิทธิการรักษา',
    contact: 'โทร 042-000-222 ต่อ 1300 (จันทร์-ศุกร์ 08:30-16:30 น.)'
  }
]

export const OnlineServicesPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="บริการออนไลน์"
        description="ศูนย์รวมบริการดิจิทัลของโรงพยาบาลโพนพิสัย ทั้งการจองคิว ติดตามผล และจัดส่งยาถึงบ้าน"
        url="https://www.pph-hospital.local/services/online"
      />
      <Container>
        <header>
          <h1>บริการออนไลน์</h1>
          <p>
            ใช้งานบริการดิจิทัลของโรงพยาบาลได้ทุกที่ทุกเวลา ลดการรอคิวและเพิ่มความสะดวกให้ผู้รับบริการและครอบครัว
          </p>
        </header>
      </Container>
      <PageSection id="services" title="บริการหลัก" background="muted">
        <Grid columns={3}>
          {onlineServices.map((service) => (
            <article className="card" key={service.name}>
              <h3>{service.name}</h3>
              <p>{service.detail}</p>
              <a className="btn btn-outline" href="#start">
                เริ่มต้นใช้งาน
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="start" title="ขั้นตอนการใช้งาน">
        <ol className="steps">
          <li>ลงทะเบียนหรือเข้าสู่ระบบด้วยบัญชีบุคลากร/ผู้รับบริการ</li>
          <li>เลือกบริการที่ต้องการ เช่น นัดหมายแพทย์หรือรับยา Health Rider</li>
          <li>ยืนยันข้อมูลและรับการแจ้งเตือนผ่าน SMS/อีเมลเมื่อสถานะเปลี่ยน</li>
        </ol>
      </PageSection>
      <PageSection id="support" title="ช่องทางช่วยเหลือ">
        <Grid columns={2}>
          {supportChannels.map((channel) => (
            <article className="card" key={channel.title}>
              <h3>{channel.title}</h3>
              <p>{channel.contact}</p>
            </article>
          ))}
        </Grid>
      </PageSection>
      <style>{`
        .steps {
          list-style: decimal;
          padding-left: 1.25rem;
          display: grid;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default OnlineServicesPage
