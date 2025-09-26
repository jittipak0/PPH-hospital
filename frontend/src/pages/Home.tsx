import React from 'react'
import { Link } from 'react-router-dom'
import { Container } from '../components/layout/Container'

const highlightItems = [
  {
    title: 'บริการรักษาครบวงจร',
    description: 'ดูแลผู้ป่วยตั้งแต่การตรวจวินิจฉัย รักษา ฟื้นฟู ไปจนถึงการติดตามต่อเนื่องในชุมชน',
    icon: '🩺'
  },
  {
    title: 'วิชาการและจริยธรรม',
    description: 'ขับเคลื่อนองค์ความรู้และกิจกรรมสร้างค่านิยม ด้วยเครือข่ายบุคลากรมืออาชีพ',
    icon: '📚'
  },
  {
    title: 'เชื่อมโยงชุมชน',
    description: 'โครงการบริการสังคมและการจัดส่งยา Health Rider เพื่อคุณภาพชีวิตที่ดีของทุกครอบครัว',
    icon: '🤝'
  }
]

const quickLinks = [
  {
    title: 'ขอประวัติการรักษา',
    description: 'ยื่นคำขอเวชระเบียนออนไลน์ พร้อมแนบเอกสารและติดตามสถานะได้ทุกขั้นตอน',
    to: '/forms/medical-record-request'
  },
  {
    title: 'ประเมินความพึงพอใจ',
    description: 'ร่วมสะท้อนประสบการณ์การรับบริการ เพื่อพัฒนาคุณภาพอย่างต่อเนื่อง',
    to: '/feedback/satisfaction'
  },
  {
    title: 'การรับบริจาค',
    description: 'สมทบทุนสนับสนุนเครื่องมือแพทย์และกิจกรรมดูแลผู้ป่วยที่ขาดโอกาส',
    to: '/donation'
  }
]

const programCards = [
  {
    title: 'Health Rider ส่งยาถึงบ้าน',
    body: 'ทีมสหวิชาชีพจัดส่งยาและติดตามอาการผู้ป่วยเรื้อรัง พร้อมแนะนำการใช้ยาอย่างถูกต้อง',
    to: '/programs/health-rider'
  },
  {
    title: 'ลดการตีตราและเลือกปฏิบัติ',
    body: 'ร่วมสร้างความเข้าใจเรื่องสุขภาพจิต ผ่านกิจกรรมกับผู้นำชุมชนและภาคีเครือข่าย',
    to: '/programs/anti-stigma'
  }
]

export const Home: React.FC = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <Container>
          <div className="hero__grid">
            <div>
              <p className="hero__label">โรงพยาบาลโพนพิสัย</p>
              <h1>ดูแลสุขภาพจิตและกายด้วยหัวใจของความเป็นมนุษย์</h1>
              <p className="hero__subtitle">
                เรามุ่งมั่นให้ทุกคนเข้าถึงบริการที่ปลอดภัย มีคุณภาพ และให้ความสำคัญกับศักดิ์ศรีความเป็นมนุษย์
                ผ่านทีมสหสาขาวิชาชีพและบริการเชิงรุกที่เชื่อมถึงบ้านและชุมชน
              </p>
              <div className="hero__actions">
                <Link to="/online-services" className="btn btn-primary">
                  สำรวจบริการออนไลน์
                </Link>
                <Link to="/about/vision-mission-values" className="btn btn-secondary">
                  วิสัยทัศน์และพันธกิจ
                </Link>
              </div>
            </div>
            <div className="hero__figure" aria-hidden="true">
              <img
                src="https://images.unsplash.com/photo-1587502536402-61d0d3196bfd?auto=format&fit=crop&w=960&q=80"
                alt="ทีมสหสาขาวิชาชีพ"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="highlights">
        <Container>
          <div className="highlights__grid">
            {highlightItems.map((item) => (
              <article key={item.title} className="card highlight-card">
                <span className="highlight-card__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="quick-links" aria-label="ช่องทางบริการด่วน">
        <Container>
          <header className="section-header">
            <h2>บริการออนไลน์สำหรับประชาชน</h2>
            <p>เลือกทำรายการได้ทันที ระบบปกป้องข้อมูลตามมาตรฐาน PDPA</p>
          </header>
          <div className="quick-links__grid">
            {quickLinks.map((link) => (
              <article key={link.to} className="card quick-link">
                <h3>{link.title}</h3>
                <p>{link.description}</p>
                <Link to={link.to} className="quick-link__action">
                  เริ่มทำรายการ
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="programs" aria-label="โครงการบริการสังคม">
        <Container>
          <header className="section-header">
            <h2>โครงการที่เราภาคภูมิใจ</h2>
            <p>ทำงานเชิงรุกเพื่อยกระดับคุณภาพชีวิตและลดความเหลื่อมล้ำด้านสุขภาพ</p>
          </header>
          <div className="programs__grid">
            {programCards.map((program) => (
              <article key={program.title} className="card program-card">
                <h3>{program.title}</h3>
                <p>{program.body}</p>
                <Link to={program.to} className="program-card__link">
                  อ่านรายละเอียดโครงการ
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="cta">
        <Container>
          <div className="cta__content">
            <div>
              <h2>ร่วมขับเคลื่อนการดูแลสุขภาพจิตไทย</h2>
              <p>
                การสนับสนุนของคุณช่วยให้เราพัฒนาบริการ ฟื้นฟูผู้ป่วย และสร้างเครือข่ายความเข้าใจเรื่องสุขภาพจิตอย่างยั่งยืน
              </p>
            </div>
            <div className="cta__actions">
              <Link to="/donation" className="btn btn-primary">
                สนับสนุนการทำงานของเรา
              </Link>
              <Link to="/feedback/satisfaction" className="btn btn-outline">
                ส่งคำแนะนำเพิ่มเติม
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <style>{`
        .home-page {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          padding-bottom: 4rem;
        }
        .hero {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(32, 201, 151, 0.1));
          padding: 4rem 0;
        }
        .hero__grid {
          display: grid;
          gap: 3rem;
          align-items: center;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }
        .hero__label {
          font-weight: 600;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .hero h1 {
          font-size: clamp(2rem, 3vw, 3rem);
          margin: 0.5rem 0 1rem;
        }
        .hero__subtitle {
          font-size: 1.05rem;
          color: var(--color-muted);
          max-width: 540px;
        }
        .hero__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 2rem;
        }
        .hero__figure img {
          border-radius: 24px;
          width: 100%;
          height: auto;
          box-shadow: var(--shadow-sm);
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 999px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        .btn-primary {
          background: var(--color-primary);
          color: #fff;
        }
        .btn-secondary {
          background: #fff;
          border: 2px solid rgba(13, 110, 253, 0.2);
          color: var(--color-primary);
        }
        .btn-outline {
          border: 2px solid var(--color-primary);
          color: var(--color-primary);
        }
        .highlights__grid,
        .quick-links__grid,
        .programs__grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }
        .highlight-card {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .highlight-card__icon {
          font-size: 2.5rem;
        }
        .section-header {
          margin-bottom: 1.5rem;
        }
        .section-header h2 {
          margin-bottom: 0.5rem;
        }
        .section-header p {
          color: var(--color-muted);
          max-width: 580px;
        }
        .quick-link__action,
        .program-card__link {
          margin-top: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--color-primary);
          font-weight: 600;
          text-decoration: none;
        }
        .quick-link__action::after,
        .program-card__link::after {
          content: '→';
        }
        .cta {
          background: linear-gradient(120deg, rgba(13, 110, 253, 0.12), rgba(32, 201, 151, 0.12));
          padding: 3rem 0;
        }
        .cta__content {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          align-items: center;
        }
        .cta__actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        @media (max-width: 768px) {
          .hero__actions,
          .cta__actions {
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  )
}
