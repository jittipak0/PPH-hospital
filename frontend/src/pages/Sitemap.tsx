import React from 'react'
import { Container } from '../components/layout/Container'
import { PageSection } from '../components/layout/PageSection'
import { PageMeta } from '../components/seo/PageMeta'

const sitemapSections = [
  {
    title: 'เกี่ยวกับโรงพยาบาล',
    links: [
      { label: 'ภาพรวม', href: '/about' },
      { label: 'ทำเนียบโครงสร้างการบริหาร', href: '/about/leadership' },
      { label: 'ประวัติโรงพยาบาล', href: '/about/history' },
      { label: 'วิสัยทัศน์/พันธกิจ/ค่านิยม', href: '/about/vision-mission-values' }
    ]
  },
  {
    title: 'ธรรมาภิบาล/จริยธรรม',
    links: [
      { label: 'แนวนโยบายธรรมาภิบาล', href: '/ethics' },
      { label: 'ชมรมจริยธรรม', href: '/ethics/club' },
      { label: 'การลดการตีตราและเลือกปฏิบัติ', href: '/ethics/anti-stigma' },
      { label: 'ข้อมูลกฎหมายและพระราชบัญญัติ', href: '/ethics/laws-acts' }
    ]
  },
  {
    title: 'วิชาการและผลงาน',
    links: [{ label: 'ผลงานวิชาการ', href: '/academic/publications' }]
  },
  {
    title: 'โครงการ/บริการเด่น',
    links: [
      { label: 'โครงการ Health Rider', href: '/programs/health-rider' },
      { label: 'บริการออนไลน์', href: '/services/online' },
      { label: 'จัดซื้อจัดจ้าง/ข่าวสาร ITA', href: '/transparency/procurement-ita' }
    ]
  },
  {
    title: 'แบบฟอร์ม/ธุรการ',
    links: [
      { label: 'แบบขอประวัติการรักษา', href: '/forms/medical-record-request' },
      { label: 'แบบฟอร์มรับบริจาค', href: '/forms/donation' },
      { label: 'แบบประเมินความพึงพอใจ', href: '/forms/satisfaction' }
    ]
  },
  {
    title: 'ระบบภายใน (บุคลากร)',
    links: [
      { label: 'ระบบเบิกจ่ายน้ำมัน', href: '/intranet/fuel-reimbursement' },
      { label: 'ศูนย์จัดเก็บเอกสาร', href: '/intranet/document-center' }
    ]
  },
  {
    title: 'ข้อมูลทั่วไป',
    links: [
      { label: 'หน้าแรก', href: '/' },
      { label: 'รายชื่อแพทย์', href: '/doctors' },
      { label: 'นัดหมายแพทย์', href: '/appointment' },
      { label: 'ข่าวสาร/กิจกรรม', href: '/news' },
      { label: 'ติดต่อเรา', href: '/contact' },
      { label: 'เข้าสู่ระบบบุคลากร', href: '/login' },
      { label: 'นโยบายความเป็นส่วนตัว', href: '/privacy-policy' },
      { label: 'เงื่อนไขการใช้งาน', href: '/terms' }
    ]
  }
]

export const SitemapPage: React.FC = () => {
  return (
    <div>
      <PageMeta
        title="แผนผังเว็บไซต์ | โรงพยาบาลโพนพิสัย"
        description="รวบรวมลิงก์ทั้งหมดของเว็บไซต์โรงพยาบาลโพนพิสัย แบ่งตามหมวดหมู่เพื่อเข้าถึงข้อมูลได้รวดเร็ว"
        openGraph={{
          title: 'แผนผังเว็บไซต์โรงพยาบาลโพนพิสัย',
          description: 'ดูแผนผังหน้าเว็บไซต์ทั้งหมด ทั้งหมวดข้อมูลโรงพยาบาล บริการ ฟอร์ม และระบบภายใน',
          type: 'article'
        }}
      />

      <Container as="section">
        <h1>แผนผังเว็บไซต์</h1>
        <p>
          เลือกหัวข้อที่ต้องการเพื่อไปยังหน้าข้อมูล บริการแบบฟอร์ม และระบบภายในได้โดยตรง
        </p>
      </Container>

      <PageSection id="sitemap" title="รายการลิงก์ทั้งหมด" description="จัดกลุ่มตามหมวดหมู่ของเว็บไซต์">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          {sitemapSections.map((section) => (
            <div key={section.title} className="card">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  )
}
