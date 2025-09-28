import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/seo/PageMeta'

const onlineServices = [
  {
    title: 'ระบบนัดหมายแพทย์ออนไลน์',
    description: 'เลือกแพทย์และเวลาเข้ารับบริการล่วงหน้า พร้อมรับ SMS ยืนยันและแจ้งเตือนก่อนถึงวันนัด'
  },
  {
    title: 'Telemedicine',
    description: 'พบแพทย์ผ่านวิดีโอคอลสำหรับผู้ป่วยโรคเรื้อรังและผู้ป่วยติดเตียง พร้อมส่งยาด้วยบริการ Health Rider'
  },
  {
    title: 'คลังผลตรวจออนไลน์',
    description: 'ดาวน์โหลดผลตรวจทางห้องปฏิบัติการและภาพวินิจฉัย พร้อมคำแนะนำเบื้องต้นจากแพทย์'
  },
  {
    title: 'แจ้งเรื่องร้องเรียน/ขอคำปรึกษา',
    description: 'ติดต่อศูนย์บริการลูกค้าผ่านแบบฟอร์มออนไลน์ รับเลข Ticket และติดตามสถานะได้ตลอดเวลา'
  }
]

const quickLinks = [
  { label: 'นัดหมายออนไลน์', url: '#appointment' },
  { label: 'ติดตามผลตรวจ', url: '#results' },
  { label: 'ติดต่อเจ้าหน้าที่', url: '#contact' }
]

export const OnlineServicesPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="บริการออนไลน์ | โรงพยาบาลโพนพิสัย"
        description="รวมบริการออนไลน์ โรงพยาบาลโพนพิสัย เช่น นัดหมายแพทย์ Telemedicine ติดตามผลตรวจ และแจ้งเรื่องออนไลน์"
        openGraph={{
          title: 'บริการออนไลน์โรงพยาบาลโพนพิสัย',
          description: 'เข้าถึงบริการนัดหมาย Telemedicine ผลตรวจ และศูนย์บริการลูกค้าในช่องทางออนไลน์เดียว',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>บริการออนไลน์</h1>
        <p>
          โรงพยาบาลพัฒนาช่องทางออนไลน์เพื่อให้ผู้ป่วยเข้าถึงบริการได้รวดเร็วขึ้น ลดเวลารอคอย และสนับสนุนการดูแลต่อเนื่องจากที่บ้าน
        </p>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {quickLinks.map((link) => (
            <a key={link.label} href={link.url} className="btn btn-secondary">
              {link.label}
            </a>
          ))}
        </div>
      </Container>

      <PageSection
        id="catalog"
        title="บริการออนไลน์ที่พร้อมใช้งาน"
        description="สามารถเข้าผ่านเว็บไซต์หรือแอปพลิเคชัน PPH Connect"
      >
        <Grid columns={4}>
          {onlineServices.map((service) => (
            <article key={service.title} className="card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        id="appointment"
        title="ระบบนัดหมายออนไลน์"
        description="พร้อมบริการแจ้งเตือนและยืนยันนัดผ่าน SMS/LINE"
        background="muted"
      >
        <div className="card">
          <ul>
            <li>ล็อกอินด้วยเลขบัตรประชาชนและ OTP เพื่อความปลอดภัย</li>
            <li>เลือกแพทย์เฉพาะทางและเวลาที่สะดวก ระบบจะแสดงคิวว่างแบบเรียลไทม์</li>
            <li>สามารถยกเลิกหรือเลื่อนนัดได้ล่วงหน้า 24 ชั่วโมงผ่านเว็บไซต์หรือคอลเซ็นเตอร์ 042-123-456</li>
          </ul>
        </div>
      </PageSection>

      <PageSection
        id="results"
        title="ติดตามผลตรวจออนไลน์"
        description="ดาวน์โหลดผลตรวจอย่างปลอดภัยด้วยการเข้ารหัสข้อมูล"
      >
        <div className="card">
          <p>
            หลังแพทย์ลงผลตรวจ ผู้ป่วยสามารถเข้าสู่ระบบเพื่อดูผลได้ทันที ระบบแจ้งเตือนผ่านอีเมล/LINE เมื่อมีผลใหม่ โดยข้อมูลจะถูกเก็บรักษาในศูนย์ข้อมูลของโรงพยาบาลภายใต้มาตรฐาน PDPA
          </p>
        </div>
      </PageSection>

      <PageSection
        id="contact"
        title="ศูนย์บริการลูกค้าออนไลน์"
        description="ให้บริการทุกวัน 08.00-20.00 น. ตอบกลับภายใน 1 วันทำการ"
        background="muted"
      >
        <div className="card">
          <ul>
            <li>แจ้งเรื่องร้องเรียน ข้อเสนอแนะ หรือขอเอกสารผ่านแบบฟอร์มออนไลน์</li>
            <li>ตรวจสอบสถานะ Ticket ได้ที่หน้า “ติดตามเรื่อง” ด้วยหมายเลขที่ได้รับทางอีเมล</li>
            <li>กรณีเร่งด่วนสามารถติดต่อ Live Chat หรือสายด่วน 1669 ตลอด 24 ชั่วโมง</li>
          </ul>
        </div>
      </PageSection>
    </div>
  )
}
