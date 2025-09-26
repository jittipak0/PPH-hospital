import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

const milestones = [
  {
    year: '2508',
    title: 'ก่อตั้งโรงพยาบาลโพนพิสัย',
    description: 'เริ่มให้บริการด้วยเตียง 60 เตียงและทีมแพทย์จากสถานีอนามัยในพื้นที่'
  },
  {
    year: '2536',
    title: 'ยกระดับเป็นโรงพยาบาลศูนย์',
    description: 'เพิ่มเตียงเป็น 350 เตียง เปิดศูนย์เฉพาะทางโรคหัวใจและมะเร็ง'
  },
  {
    year: '2555',
    title: 'เดินหน้าดิจิทัล',
    description: 'พัฒนาระบบเวชระเบียนอิเล็กทรอนิกส์และระบบคิวออนไลน์เพื่อบริการที่รวดเร็ว'
  },
  {
    year: '2566',
    title: 'ผู้นำบริการสุขภาพชุมชน',
    description: 'เปิดโครงการ Health Rider ส่งยาถึงบ้านและบริการติดตามอาการทางไกล'
  }
]

export const HistoryPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ประวัติโรงพยาบาลโพนพิสัย"
        description="เส้นทางการเติบโตของโรงพยาบาลโพนพิสัยจากสถานพยาบาลชุมชนสู่โรงพยาบาลศูนย์ดิจิทัล"
        url="https://www.pph-hospital.local/about/history"
      />
      <Container>
        <header>
          <h1>ประวัติโรงพยาบาลโพนพิสัย</h1>
          <p>
            ตลอดเวลากว่า 60 ปี เรามุ่งมั่นพัฒนาระบบบริการสุขภาพให้ทันสมัย ครอบคลุม และปลอดภัยสำหรับคนไทยทุกคน
            ตั้งแต่โครงสร้างพื้นฐาน บุคลากร ไปจนถึงนวัตกรรมการแพทย์
          </p>
        </header>
      </Container>
      <PageSection id="timeline" title="เหตุการณ์สำคัญ" background="muted">
        <div className="timeline">
          {milestones.map((milestone) => (
            <div className="timeline__item" key={milestone.year}>
              <div className="timeline__year">{milestone.year}</div>
              <div className="timeline__content">
                <h3>{milestone.title}</h3>
                <p>{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
      <PageSection id="future" title="เป้าหมายในทศวรรษหน้า">
        <Grid columns={3}>
          <article className="card">
            <h3>โรงพยาบาลไร้กระดาษ 100%</h3>
            <p>ยกระดับระบบข้อมูลสุขภาพให้เชื่อมโยงกันทุกหน่วยบริการ เพื่อการดูแลที่รวดเร็วและปลอดภัยยิ่งขึ้น</p>
          </article>
          <article className="card">
            <h3>ศูนย์วิจัยชุมชน</h3>
            <p>สนับสนุนงานวิจัยที่ตอบโจทย์สุขภาวะของคนในพื้นที่ พร้อมถ่ายทอดองค์ความรู้สู่ระดับประเทศ</p>
          </article>
          <article className="card">
            <h3>การดูแลต่อเนื่องถึงบ้าน</h3>
            <p>ขยายบริการ telehealth, ส่งยาถึงบ้าน และทีมสหสาขาเยี่ยมบ้านเพื่อผู้ป่วยเรื้อรังและผู้สูงอายุ</p>
          </article>
        </Grid>
      </PageSection>
      <style>{`
        .timeline {
          display: grid;
          gap: 1.5rem;
        }
        .timeline__item {
          display: grid;
          grid-template-columns: 120px 1fr;
          gap: 1rem;
          align-items: start;
        }
        .timeline__year {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-primary);
        }
        .timeline__content {
          background: #fff;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: var(--shadow-sm);
        }
        @media (max-width: 720px) {
          .timeline__item {
            grid-template-columns: 1fr;
          }
          .timeline__year {
            font-size: 1.35rem;
          }
        }
      `}</style>
    </div>
  )
}

export default HistoryPage
