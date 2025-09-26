import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/common/PageMeta'

const publications = [
  {
    title: 'แนวทางดูแลผู้ป่วยหัวใจล้มเหลวชุมชนชนบท',
    authors: 'นพ. ธนากร ใจดี และคณะ',
    year: 2024,
    link: '#'
  },
  {
    title: 'ผลการใช้เทคโนโลยี Health Rider ในการลดอัตราเข้าโรงพยาบาลซ้ำ',
    authors: 'พญ. ศศิธร วัฒนะ และคณะ',
    year: 2023,
    link: '#'
  },
  {
    title: 'การประยุกต์ใช้ AI ในระบบคัดกรองผู้ป่วยฉุกเฉิน',
    authors: 'ดร. จินตนา เจริญสุข',
    year: 2023,
    link: '#'
  }
]

export const PublicationsPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ผลงานวิชาการ"
        description="ฐานข้อมูลผลงานวิชาการและงานวิจัยที่จัดทำโดยทีมโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/academic/publications"
      />
      <Container>
        <header>
          <h1>ผลงานวิชาการ</h1>
          <p>
            ดาวน์โหลดบทความและงานวิจัยที่เผยแพร่ทั้งในและต่างประเทศ เพื่อแบ่งปันองค์ความรู้สู่ทีมบุคลากรและประชาชนทั่วไป
          </p>
        </header>
      </Container>
      <PageSection id="latest" title="ผลงานล่าสุด" background="muted">
        <ul className="publication-list">
          {publications.map((publication) => (
            <li key={publication.title}>
              <h3>{publication.title}</h3>
              <p className="publication-meta">
                {publication.authors} · {publication.year}
              </p>
              <a className="btn btn-outline" href={publication.link}>
                ดาวน์โหลดเอกสาร
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection
        id="submission"
        title="ส่งผลงานเพื่อเผยแพร่"
        description="บุคลากรสามารถส่งบทความหรือโปสเตอร์วิชาการได้ตลอดทั้งปี"
      >
        <p>
          ส่งไฟล์ต้นฉบับและแบบฟอร์มอนุมัติผ่านอีเมล academic@pph-hospital.go.th พร้อมข้อมูลติดต่อกลับ ทีมงานจะตอบรับภายใน
          7 วันทำการ
        </p>
      </PageSection>
      <style>{`
        .publication-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1.25rem;
        }
        .publication-list li {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .publication-meta {
          color: var(--color-muted);
          margin: 0.5rem 0 1rem;
        }
      `}</style>
    </div>
  )
}

export default PublicationsPage
