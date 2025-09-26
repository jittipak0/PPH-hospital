import React from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/common/PageMeta'

const procurementItems = [
  {
    title: 'ประกาศเชิญชวนจัดซื้อเครื่องตรวจวิเคราะห์เลือดอัตโนมัติ',
    date: 'มิถุนายน 2567',
    link: '#'
  },
  {
    title: 'สัญญาจ้างเหมาบริการทำความสะอาดอาคารผู้ป่วยนอก',
    date: 'กรกฎาคม 2567',
    link: '#'
  }
]

const itaScores = [
  { year: '2565', score: '94.57', remark: 'ระดับ AA' },
  { year: '2566', score: '95.22', remark: 'ระดับ AA' },
  { year: '2567', score: '96.01', remark: 'ระดับ AAA (รอประกาศอย่างเป็นทางการ)' }
]

export const ProcurementItaPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="จัดซื้อจัดจ้าง/ข่าวสาร ITA"
        description="ข้อมูลประกาศจัดซื้อจัดจ้าง ผลการประเมิน ITA และช่องทางร้องเรียนความไม่โปร่งใสของโรงพยาบาลโพนพิสัย"
        url="https://www.pph-hospital.local/transparency/procurement-ita"
      />
      <Container>
        <header>
          <h1>จัดซื้อจัดจ้าง / ข่าวสาร ITA</h1>
          <p>
            เผยแพร่ข้อมูลจัดซื้อจัดจ้าง การลงนามสัญญา และผลประเมินความโปร่งใส เพื่อให้ประชาชนตรวจสอบได้ตลอดเวลา
          </p>
        </header>
      </Container>
      <PageSection id="procurement" title="ประกาศจัดซื้อจัดจ้างล่าสุด" background="muted">
        <ul className="procurement-list">
          {procurementItems.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>เผยแพร่เมื่อ {item.date}</p>
              <a className="btn btn-outline" href={item.link}>
                อ่านประกาศฉบับเต็ม
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
      <PageSection id="ita" title="ผลการประเมิน ITA">
        <table className="ita-table">
          <thead>
            <tr>
              <th>ปีงบประมาณ</th>
              <th>คะแนน</th>
              <th>หมายเหตุ</th>
            </tr>
          </thead>
          <tbody>
            {itaScores.map((item) => (
              <tr key={item.year}>
                <td>{item.year}</td>
                <td>{item.score}</td>
                <td>{item.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageSection>
      <PageSection id="complaint" title="ช่องทางร้องเรียน">
        <p>หากพบข้อสงสัยเกี่ยวกับการจัดซื้อจัดจ้าง สามารถแจ้งผ่านอีเมล transparency@pph-hospital.go.th หรือโทร 042-000-999 ต่อ 2200</p>
      </PageSection>
      <style>{`
        .procurement-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1.25rem;
        }
        .procurement-list li {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .ita-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .ita-table th,
        .ita-table td {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid rgba(15, 23, 42, 0.1);
          text-align: left;
        }
        .ita-table th {
          background: rgba(13, 110, 253, 0.1);
        }
        .ita-table tr:last-child td {
          border-bottom: none;
        }
      `}</style>
    </div>
  )
}

export default ProcurementItaPage
