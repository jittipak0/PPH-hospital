import React, { createContext, useContext, useMemo, useState } from 'react'

type Language = 'th' | 'en'

type Dictionary = Record<Language, Record<string, string>>

const dictionary: Dictionary = {
  th: {
    'nav.home': 'หน้าแรก',
    'nav.about': 'เกี่ยวกับโรงพยาบาล',
    'nav.services': 'บริการผู้ป่วย',
    'nav.appointment': 'นัดหมายแพทย์',
    'nav.doctors': 'ค้นหาแพทย์',
    'nav.news': 'ข่าวสาร/กิจกรรม',
    'nav.contact': 'ติดต่อเรา',
    'nav.ethics': 'ธรรมาภิบาล/จริยธรรม',
    'nav.academic': 'วิชาการและผลงาน',
    'nav.programs': 'โครงการเด่น',
    'nav.transparency': 'ความโปร่งใส',
    'nav.forms': 'แบบฟอร์ม/ธุรการ',
    'nav.intranet': 'ระบบภายใน',
    'nav.sitemap': 'แผนผังเว็บไซต์',
    'nav.about.leadership': 'ทำเนียบโครงสร้างการบริหาร',
    'nav.about.history': 'ประวัติโรงพยาบาล',
    'nav.about.visionMissionValues': 'วิสัยทัศน์/พันธกิจ/ค่านิยม',
    'nav.ethics.club': 'ชมรมจริยธรรม',
    'nav.ethics.antiStigma': 'ลดการตีตราและเลือกปฏิบัติ',
    'nav.ethics.lawsActs': 'ข้อมูลพระราชบัญญัติที่เกี่ยวข้อง',
    'nav.academic.publications': 'ผลงานวิชาการ',
    'nav.programs.healthRider': 'Health Rider (ส่งยาถึงบ้าน)',
    'nav.services.online': 'บริการออนไลน์',
    'nav.transparency.procurementIta': 'จัดซื้อจัดจ้าง/ข่าวสาร ITA',
    'nav.forms.medicalRecordRequest': 'แบบขอประวัติการรักษา',
    'nav.forms.donation': 'แบบฟอร์มรับบริจาค',
    'nav.forms.satisfaction': 'ประเมินความพึงพอใจ',
    'nav.intranet.fuelReimbursement': 'ระบบเบิกจ่ายน้ำมัน',
    'nav.intranet.documentCenter': 'ศูนย์จัดเก็บเอกสาร',
    'actions.bookAppointment': 'จองคิวแพทย์ออนไลน์',
    'actions.viewDoctors': 'ค้นหาแพทย์',
    'actions.viewServices': 'ดูบริการทั้งหมด',
    'actions.readMore': 'อ่านรายละเอียด',
    'breadcrumb.about': 'เกี่ยวกับโรงพยาบาล',
    'breadcrumb.ethics': 'ธรรมาภิบาล/จริยธรรม',
    'breadcrumb.academic': 'วิชาการและผลงาน',
    'breadcrumb.programs': 'โครงการ/บริการเด่น',
    'breadcrumb.services': 'บริการผู้ป่วย',
    'breadcrumb.transparency': 'ความโปร่งใส',
    'breadcrumb.forms': 'แบบฟอร์ม/ธุรการ',
    'breadcrumb.intranet': 'ระบบภายใน',
    'breadcrumb.sitemap': 'แผนผังเว็บไซต์',
    'cookie.message': 'เว็บไซต์นี้ใช้คุกกี้เพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด โปรดอ่านนโยบายความเป็นส่วนตัว',
    'cookie.accept': 'ยอมรับคุกกี้',
    'cookie.reject': 'ปฏิเสธ',
    'language.th': 'ไทย',
    'language.en': 'English'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About the Hospital',
    'nav.services': 'Patient Services',
    'nav.appointment': 'Book Appointment',
    'nav.doctors': 'Find Doctors',
    'nav.news': 'News & Events',
    'nav.contact': 'Contact',
    'nav.ethics': 'Ethics & Governance',
    'nav.academic': 'Academics & Research',
    'nav.programs': 'Featured Programs',
    'nav.transparency': 'Transparency',
    'nav.forms': 'Forms & Administration',
    'nav.intranet': 'Intranet',
    'nav.sitemap': 'Sitemap',
    'nav.about.leadership': 'Leadership Structure',
    'nav.about.history': 'Hospital History',
    'nav.about.visionMissionValues': 'Vision, Mission & Values',
    'nav.ethics.club': 'Ethics Club',
    'nav.ethics.antiStigma': 'Anti-stigma Initiatives',
    'nav.ethics.lawsActs': 'Relevant Laws & Acts',
    'nav.academic.publications': 'Academic Publications',
    'nav.programs.healthRider': 'Health Rider (Home Delivery)',
    'nav.services.online': 'Online Services',
    'nav.transparency.procurementIta': 'Procurement & ITA Updates',
    'nav.forms.medicalRecordRequest': 'Medical Record Request',
    'nav.forms.donation': 'Donation Form',
    'nav.forms.satisfaction': 'Satisfaction Survey',
    'nav.intranet.fuelReimbursement': 'Fuel Reimbursement',
    'nav.intranet.documentCenter': 'Document Center',
    'actions.bookAppointment': 'Book a doctor appointment',
    'actions.viewDoctors': 'Find doctors',
    'actions.viewServices': 'View all services',
    'actions.readMore': 'Read more',
    'breadcrumb.about': 'About the Hospital',
    'breadcrumb.ethics': 'Ethics & Governance',
    'breadcrumb.academic': 'Academics & Research',
    'breadcrumb.programs': 'Programs & Services',
    'breadcrumb.services': 'Patient Services',
    'breadcrumb.transparency': 'Transparency',
    'breadcrumb.forms': 'Forms & Administration',
    'breadcrumb.intranet': 'Intranet',
    'breadcrumb.sitemap': 'Sitemap',
    'cookie.message': 'We use cookies to ensure you get the best experience. Please review our privacy policy.',
    'cookie.accept': 'Accept cookies',
    'cookie.reject': 'Decline',
    'language.th': 'ไทย',
    'language.en': 'English'
  }
}

type I18nContextValue = {
  language: Language
  switchLanguage: (language: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('th')

  const value = useMemo<I18nContextValue>(() => ({
    language,
    switchLanguage: (next) => setLanguage(next),
    t: (key) => dictionary[language][key] ?? key
  }), [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
