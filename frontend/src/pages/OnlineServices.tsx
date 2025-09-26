import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'

const services = [
  {
    title: 'ยื่นคำขอเวชระเบียน',
    description: 'กรอกข้อมูลและแนบเอกสารเพื่อขอสำเนาประวัติการรักษาแบบออนไลน์ ปลอดภัยด้วยระบบยืนยันตัวตน',
    to: '/forms/medical-record-request'
  },
  {
    title: 'บริจาคเพื่อสนับสนุนโรงพยาบาล',
    description: 'เลือกช่องทางบริจาคทั้งโอนธนาคาร สแกน QR หรือบริจาคเป็นเงินสด พร้อมรับหลักฐานอิเล็กทรอนิกส์',
    to: '/donation'
  },
  {
    title: 'ประเมินความพึงพอใจการรับบริการ',
    description: 'ร่วมประเมินคุณภาพการให้บริการ ความสะอาด และความรวดเร็ว เพื่อช่วยให้เราพัฒนาต่อเนื่อง',
    to: '/feedback/satisfaction'
  }
]

export const OnlineServices: React.FC = () => {
  return (
    <section className="online-services">
      <Container>
        <header className="online-services__header">
          <h1>บริการออนไลน์</h1>
          <p>
            ศูนย์รวมบริการสำคัญที่สามารถดำเนินการได้ทันทีจากบ้านของคุณ โดยข้อมูลทั้งหมดถูกจัดเก็บตามมาตรฐานความปลอดภัยของโรงพยาบาล
          </p>
        </header>
        <div className="online-services__grid">
          {services.map((service) => (
            <article key={service.title} className="card online-service-card">
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              <Link to={service.to} className="online-service-card__action">
                ทำรายการ
              </Link>
            </article>
          ))}
        </div>
      </Container>
      <style>{`
        .online-services__header {
          margin-bottom: 2rem;
        }
        .online-services__header h1 {
          margin-bottom: 0.75rem;
        }
        .online-services__header p {
          max-width: 620px;
          color: var(--color-muted);
        }
        .online-services__grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }
        .online-service-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .online-service-card__action {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: none;
        }
        .online-service-card__action::after {
          content: '→';
        }
      `}</style>
    </section>
  )
}

export default OnlineServices
