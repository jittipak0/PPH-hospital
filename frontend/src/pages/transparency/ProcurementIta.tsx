import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/seo/PageMeta'

const procurementHighlights = [
  {
    title: 'ประกาศจัดซื้อจัดจ้าง',
    description: 'เผยแพร่ TOR ราคากลาง และผลการพิจารณาทุกสัญญา ผ่านระบบ e-GP และเว็บไซต์โรงพยาบาล'
  },
  {
    title: 'รายงานการใช้จ่ายงบประมาณ',
    description: 'สรุปรายการงบลงทุน งบครุภัณฑ์ และโครงการซ่อมบำรุง เผยแพร่ทุกไตรมาส'
  },
  {
    title: 'ติดตามผลการประเมิน ITA',
    description: 'เปิดเผยคะแนนการประเมินคุณธรรมและความโปร่งใส พร้อมแผนปรับปรุงประจำปี'
  }
]

const latestNotices = [
  { title: 'จัดซื้อเครื่องช่วยหายใจแรงดันสูง 2 เครื่อง', date: '20 กันยายน 2567', status: 'กำลังเปิดรับซอง' },
  { title: 'จ้างเหมาบริการทำความสะอาดอาคารผู้ป่วยนอก', date: '8 กันยายน 2567', status: 'ประกาศผลผู้ชนะแล้ว' },
  { title: 'จัดซื้อยาเวชภัณฑ์รายการสำคัญ (รอบ Q4/2567)', date: '1 กันยายน 2567', status: 'อยู่ระหว่างจัดทำสัญญา' }
]

export const ProcurementItaPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="จัดซื้อจัดจ้างและข่าวสาร ITA | โรงพยาบาลโพนพิสัย"
        description="ติดตามประกาศจัดซื้อจัดจ้าง แผนการใช้จ่าย และผลประเมินความโปร่งใสของโรงพยาบาลโพนพิสัย"
        openGraph={{
          title: 'ศูนย์รวมข้อมูลจัดซื้อจัดจ้างและ ITA',
          description: 'โรงพยาบาลโพนพิสัยเผยแพร่ประกาศจัดซื้อจัดจ้างและรายงาน ITA อย่างโปร่งใส ตรวจสอบได้',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>จัดซื้อจัดจ้างและข่าวสาร ITA</h1>
        <p>
          โรงพยาบาลโพนพิสัยยืนยันความโปร่งใสในการใช้งบประมาณ ด้วยการเผยแพร่ข้อมูลจัดซื้อจัดจ้างและผลการประเมินคุณธรรมและความโปร่งใส (ITA) อย่างต่อเนื่อง
        </p>
      </Container>

      <PageSection id="highlights" title="ประเด็นสำคัญ" description="ข้อมูลหลักที่ประชาชนสามารถเข้าถึงได้">
        <Grid columns={3}>
          {procurementHighlights.map((item) => (
            <article key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </Grid>
      </PageSection>

      <PageSection
        id="notices"
        title="ประกาศล่าสุด"
        description="ตัวอย่างประกาศจัดซื้อจัดจ้างเดือนกันยายน 2567"
        background="muted"
      >
        <div className="card">
          <ul>
            {latestNotices.map((notice) => (
              <li key={notice.title}>
                <strong>{notice.title}</strong> — {notice.date} ({notice.status})
              </li>
            ))}
          </ul>
          <p>
            ดูรายละเอียดทั้งหมดและดาวน์โหลดเอกสารได้ที่ ระบบ e-GP หรือหน้าศูนย์ข้อมูลความโปร่งใสของโรงพยาบาล (<a href="https://www.pph-hospital.go.th/ita" target="_blank" rel="noopener noreferrer">https://www.pph-hospital.go.th/ita</a>)
          </p>
        </div>
      </PageSection>
    </div>
  )
}
