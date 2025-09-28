import React, { useMemo, useState } from 'react'
import { Container } from '../../components/layout/Container'
import { PageSection } from '../../components/layout/PageSection'
import { PageMeta } from '../../components/seo/PageMeta'
import styles from './DocumentCenter.module.scss'

type DocumentItem = {
  title: string
  category: 'policy' | 'form' | 'report'
  updatedAt: string
  fileSize: string
  url: string
}

const documents: DocumentItem[] = [
  {
    title: 'นโยบายความปลอดภัยข้อมูลผู้ป่วย (ฉบับปรับปรุง 2567)',
    category: 'policy',
    updatedAt: '10 กันยายน 2567',
    fileSize: '1.2 MB',
    url: '#'
  },
  {
    title: 'แบบฟอร์มคำขออนุมัติการใช้ภาพถ่ายผู้ป่วย',
    category: 'form',
    updatedAt: '25 สิงหาคม 2567',
    fileSize: '380 KB',
    url: '#'
  },
  {
    title: 'รายงานผลการประเมินคุณธรรมและความโปร่งใส (ITA) 2566',
    category: 'report',
    updatedAt: '5 กรกฎาคม 2567',
    fileSize: '2.5 MB',
    url: '#'
  },
  {
    title: 'คู่มือปฏิบัติงานห้องฉุกเฉิน (ER Manual)',
    category: 'policy',
    updatedAt: '1 กรกฎาคม 2567',
    fileSize: '3.1 MB',
    url: '#'
  },
  {
    title: 'ฟอร์มขออนุญาตใช้รถราชการ',
    category: 'form',
    updatedAt: '18 มิถุนายน 2567',
    fileSize: '220 KB',
    url: '#'
  }
]

export const DocumentCenterPage: React.FC = () => {
  const [category, setCategory] = useState<'all' | DocumentItem['category']>('all')
  const [query, setQuery] = useState('')

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchCategory = category === 'all' || doc.category === category
      const matchQuery = doc.title.toLowerCase().includes(query.trim().toLowerCase())
      return matchCategory && matchQuery
    })
  }, [category, query])

  return (
    <div>
      <PageMeta
        title="ศูนย์จัดเก็บเอกสาร | โรงพยาบาลโพนพิสัย"
        description="ค้นหาและดาวน์โหลดเอกสารภายในสำหรับบุคลากรโรงพยาบาลโพนพิสัย"
        openGraph={{
          title: 'ศูนย์จัดเก็บเอกสารบุคลากร',
          description: 'เข้าสู่ระบบเพื่อค้นหาเอกสาร นโยบาย คู่มือ และรายงานสำคัญของโรงพยาบาล',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>ศูนย์จัดเก็บเอกสาร (สำหรับบุคลากร)</h1>
        <p>
          คลังเอกสารภายในสำหรับดาวน์โหลดนโยบาย คู่มือ และรายงานสำคัญ ทุกไฟล์จำกัดสิทธิ์การเข้าถึง ต้องเข้าสู่ระบบ Intranet เพื่อดาวน์โหลดฉบับสมบูรณ์
        </p>
      </Container>

      <PageSection id="filters" title="ค้นหาเอกสาร" description="กรองเอกสารตามหมวดหมู่หรือค้นหาด้วยคำสำคัญ">
        <div className={styles.filters}>
          <div>
            <label htmlFor="category">หมวดหมู่</label>
            <select id="category" value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>
              <option value="all">ทั้งหมด</option>
              <option value="policy">นโยบาย/คู่มือ</option>
              <option value="form">แบบฟอร์ม</option>
              <option value="report">รายงาน</option>
            </select>
          </div>
          <div>
            <label htmlFor="query">ค้นหา</label>
            <input
              id="query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="พิมพ์คำสำคัญ เช่น ITA, แบบฟอร์ม..."
            />
          </div>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.documentTable}>
            <thead>
              <tr>
                <th>ชื่อเอกสาร</th>
                <th>หมวดหมู่</th>
                <th>ปรับปรุงล่าสุด</th>
                <th>ขนาดไฟล์</th>
                <th>ดาวน์โหลด</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((doc) => (
                <tr key={doc.title}>
                  <td>{doc.title}</td>
                  <td>{doc.category === 'policy' ? 'นโยบาย' : doc.category === 'form' ? 'แบบฟอร์ม' : 'รายงาน'}</td>
                  <td>{doc.updatedAt}</td>
                  <td>{doc.fileSize}</td>
                  <td>
                    <a href={doc.url} className="btn btn-secondary" download>
                      ดาวน์โหลด
                    </a>
                  </td>
                </tr>
              ))}
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>
                    ไม่พบเอกสารที่ตรงกับเงื่อนไข
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </PageSection>
    </div>
  )
}
