export type PageMeta = {
  title: string
  slug: string
  path: string
  category:
    | 'about'
    | 'academic'
    | 'programs'
    | 'legal'
    | 'procurement'
    | 'services'
    | 'internal'
    | 'donation'
    | 'feedback'
  auth?: boolean
}

export const PAGES: PageMeta[] = [
  { title: 'ทำเนียบโครงสร้างการบริหาร', slug: 'leadership', path: '/about/leadership', category: 'about' },
  { title: 'ประวัติโรงพยาบาล', slug: 'history', path: '/about/history', category: 'about' },
  { title: 'วิสัยทัศน์/พันธกิจ/ค่านิยม', slug: 'vision-mission-values', path: '/about/vision-mission-values', category: 'about' },
  { title: 'ผลงานวิชาการ', slug: 'publications', path: '/academic/publications', category: 'academic' },
  { title: 'ชมรมจริยธรรม', slug: 'ethics-club', path: '/ethics/club', category: 'academic' },
  { title: 'Health Rider', slug: 'health-rider', path: '/programs/health-rider', category: 'programs' },
  { title: 'ลดการตีตราและเลือกปฏิบัติ', slug: 'anti-stigma', path: '/programs/anti-stigma', category: 'programs' },
  { title: 'ข้อมูล พรบ', slug: 'acts', path: '/legal/acts', category: 'legal' },
  { title: 'จัดซื้อจัดจ้าง/ข่าวสาร ITA', slug: 'procurement-ita', path: '/procurement-ita', category: 'procurement' },
  { title: 'บริการออนไลน์', slug: 'online-services', path: '/online-services', category: 'services' },
  { title: 'ขอประวัติการรักษา', slug: 'medical-record-request', path: '/forms/medical-record-request', category: 'services' },
  { title: 'การรับบริจาค', slug: 'donation', path: '/donation', category: 'donation' },
  { title: 'ประเมินความพึงพอใจ', slug: 'satisfaction', path: '/feedback/satisfaction', category: 'feedback' },
  { title: 'ระบบเบิกจ่ายน้ำมัน', slug: 'fuel-claims', path: '/internal/fuel-claims', category: 'internal', auth: true },
  { title: 'ศูนย์จัดเก็บเอกสาร', slug: 'archive-center', path: '/internal/archive-center', category: 'internal', auth: true }
]
