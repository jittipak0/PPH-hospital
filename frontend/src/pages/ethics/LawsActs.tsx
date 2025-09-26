import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { Grid } from '../../components/layout/Grid'
import { PageMeta } from '../../components/common/PageMeta'

const laws = [
  {
    name: 'พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)',
    summary: 'แนวปฏิบัติในการเก็บ ใช้ เปิดเผยข้อมูลผู้ป่วยอย่างปลอดภัย พร้อมมาตรการขอความยินยอม'
  },
  {
    name: 'พระราชบัญญัติสุขภาพแห่งชาติ พ.ศ. 2550',
    summary: 'สิทธิของผู้ป่วยในการรับรู้ข้อมูล การรักษาตามเจตจำนง และการมีส่วนร่วมกำหนดนโยบายสุขภาพ'
  },
  {
    name: 'มาตรฐานความปลอดภัยสารสนเทศภาครัฐ',
    summary: 'แนวทางด้าน Cybersecurity และการบริหารความเสี่ยงสารสนเทศสำหรับโรงพยาบาลรัฐ'
  }
]

export const LawsActsPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="ข้อมูล พ.ร.บ. และข้อกำหนดที่เกี่ยวข้อง"
        description="สรุปพระราชบัญญัติ นโยบาย และข้อบังคับสำคัญที่เกี่ยวข้องกับการให้บริการสุขภาพของโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/ethics/laws-acts"
      />
      <Container>
        <header>
          <h1>ข้อมูล พ.ร.บ. และข้อกำหนดที่เกี่ยวข้อง</h1>
          <p>
            เรารวบรวมพระราชบัญญัติ มาตรฐาน และคู่มือการปฏิบัติงานด้านความปลอดภัยข้อมูลและสิทธิผู้ป่วย เพื่อให้บุคลากรและประชาชนเข้าถึงง่าย
          </p>
        </header>
      </Container>
      <PageSection id="laws" title="กฎหมายและข้อบังคับที่ต้องรู้" background="muted">
        <Grid columns={3}>
          {laws.map((law) => (
            <article className="card" key={law.name}>
              <h3>{law.name}</h3>
              <p>{law.summary}</p>
              <a className="btn btn-outline" href="#download" aria-describedby="download">
                ดาวน์โหลดฉบับเต็ม
              </a>
            </article>
          ))}
        </Grid>
      </PageSection>
      <PageSection id="download" title="ดาวน์โหลดเอกสาร" description="เอกสารจะเปิดในหน้าต่างใหม่">
        <ul className="document-list">
          <li>
            <a href="https://www.pph-hospital.go.th/files/pdpa-policy.pdf" target="_blank" rel="noopener noreferrer">
              นโยบายการคุ้มครองข้อมูลส่วนบุคคล (PDF)
            </a>
          </li>
          <li>
            <a href="https://www.pph-hospital.go.th/files/patient-rights.pdf" target="_blank" rel="noopener noreferrer">
              สิทธิผู้ป่วยและแนวปฏิบัติ (PDF)
            </a>
          </li>
          <li>
            <a href="https://www.pph-hospital.go.th/files/ita-guideline.pdf" target="_blank" rel="noopener noreferrer">
              คู่มือปฏิบัติเรื่องความโปร่งใส ITA (PDF)
            </a>
          </li>
        </ul>
      </PageSection>
      <style>{`
        .document-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0.75rem;
        }
        .document-list a {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 600;
          color: var(--color-primary);
        }
        .document-list a::before {
          content: '⬇️';
        }
      `}</style>
    </div>
  )
}

export default LawsActsPage
