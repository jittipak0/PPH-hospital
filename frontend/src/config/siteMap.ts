export type SiteChild = {
  path: string
  label: string
  description?: string
  ctaLabel?: string
  labelKey?: string
}

export type SiteSection = {
  id: string
  path: string
  label: string
  labelKey?: string
  description: string
  children?: SiteChild[]
}

export const siteSections: SiteSection[] = [
  {
    id: 'about',
    path: '/about',
    label: 'เกี่ยวกับโรงพยาบาล',
    labelKey: 'nav.section.about',
    description: 'ทำความรู้จักองค์กร วิสัยทัศน์ และประวัติการพัฒนาโรงพยาบาลโพนพิสัย',
    children: [
      { path: '/about/leadership', label: 'ทำเนียบโครงสร้างการบริหาร', labelKey: 'nav.section.about.leadership' },
      { path: '/about/history', label: 'ประวัติโรงพยาบาล', labelKey: 'nav.section.about.history' },
      { path: '/about/vision-mission-values', label: 'วิสัยทัศน์ / พันธกิจ / ค่านิยม', labelKey: 'nav.section.about.vision' }
    ]
  },
  {
    id: 'ethics',
    path: '/ethics',
    label: 'ธรรมาภิบาลและจริยธรรม',
    labelKey: 'nav.section.ethics',
    description: 'ยกระดับคุณธรรม จริยธรรม และการปฏิบัติตามกฎหมายภาครัฐ',
    children: [
      { path: '/ethics/club', label: 'ชมรมจริยธรรม', labelKey: 'nav.section.ethics.club' },
      { path: '/ethics/anti-stigma', label: 'การลดการตีตราและเลือกปฏิบัติ', labelKey: 'nav.section.ethics.antiStigma' },
      { path: '/ethics/laws-acts', label: 'ข้อมูลกฎหมายและ พ.ร.บ. ที่เกี่ยวข้อง', labelKey: 'nav.section.ethics.laws' }
    ]
  },
  {
    id: 'academic',
    path: '/academic',
    label: 'วิชาการและผลงาน',
    labelKey: 'nav.section.academic',
    description: 'องค์ความรู้และงานวิจัยที่ถ่ายทอดจากทีมสหสาขาวิชาชีพ',
    children: [{ path: '/academic/publications', label: 'ผลงานวิชาการ', labelKey: 'nav.section.academic.publications' }]
  },
  {
    id: 'programs',
    path: '/programs',
    label: 'โครงการเด่น',
    labelKey: 'nav.section.programs',
    description: 'บริการเชิงรุกและโครงการนำร่องที่ยกระดับคุณภาพชีวิตผู้ป่วย',
    children: [{ path: '/programs/health-rider', label: 'Health Rider – ส่งยาถึงบ้าน', labelKey: 'nav.section.programs.healthRider' }]
  },
  {
    id: 'services',
    path: '/services',
    label: 'บริการออนไลน์',
    labelKey: 'nav.section.services',
    description: 'ใช้บริการโรงพยาบาลผ่านช่องทางดิจิทัลทุกที่ ทุกเวลา',
    children: [{ path: '/services/online', label: 'บริการออนไลน์', labelKey: 'nav.section.services.online' }]
  },
  {
    id: 'transparency',
    path: '/transparency',
    label: 'จัดซื้อจัดจ้าง / ITA',
    labelKey: 'nav.section.transparency',
    description: 'ติดตามความโปร่งใสและรายงานการใช้จ่ายของโรงพยาบาล',
    children: [{ path: '/transparency/procurement-ita', label: 'จัดซื้อจัดจ้าง / ข่าวสาร ITA', labelKey: 'nav.section.transparency.procurement' }]
  },
  {
    id: 'forms',
    path: '/forms',
    label: 'แบบฟอร์มและธุรการ',
    labelKey: 'nav.section.forms',
    description: 'ดาวน์โหลดและส่งแบบฟอร์มบริการต่าง ๆ ของโรงพยาบาล',
    children: [
      { path: '/forms/medical-record-request', label: 'แบบขอประวัติการรักษา', labelKey: 'nav.section.forms.medicalRecord' },
      { path: '/forms/donation', label: 'การรับบริจาค', labelKey: 'nav.section.forms.donation' },
      { path: '/forms/satisfaction', label: 'ประเมินความพึงพอใจ', labelKey: 'nav.section.forms.satisfaction' }
    ]
  },
  {
    id: 'intranet',
    path: '/intranet',
    label: 'ระบบภายใน (สำหรับบุคลากร)',
    labelKey: 'nav.section.intranet',
    description: 'เครื่องมือดิจิทัลสำหรับเจ้าหน้าที่ภายในองค์กร (ต้องเข้าสู่ระบบ)',
    children: [
      { path: '/intranet/fuel-reimbursement', label: 'ระบบเบิกจ่ายน้ำมัน', labelKey: 'nav.section.intranet.fuel' },
      { path: '/intranet/document-center', label: 'ศูนย์จัดเก็บเอกสาร', labelKey: 'nav.section.intranet.documents' }
    ]
  }
]

export const importantQuickLinks: SiteChild[] = [
  { path: '/forms/medical-record-request', label: 'ยื่นขอประวัติการรักษา', ctaLabel: 'เริ่มต้นคำขอ' },
  { path: '/programs/health-rider', label: 'รับยา Health Rider', ctaLabel: 'ดูรายละเอียด' },
  { path: '/services/online', label: 'ใช้บริการออนไลน์', ctaLabel: 'เข้าสู่บริการ' }
]
