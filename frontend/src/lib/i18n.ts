
import {
  createContext,
  createElement,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode
} from 'react'


type Language = 'th' | 'en'

type Dictionary = Record<Language, Record<string, string>>

const dictionary: Dictionary = {
  th: {
    'nav.home': 'หน้าแรก',
    'nav.about': 'เกี่ยวกับเรา',
    'nav.services': 'บริการผู้ป่วย',
    'nav.appointment': 'นัดหมายแพทย์',
    'nav.doctors': 'ค้นหาแพทย์',
    'nav.news': 'ข่าวสาร/กิจกรรม',
    'nav.contact': 'ติดต่อเรา',
    'nav.section.about': 'เกี่ยวกับโรงพยาบาล',
    'nav.section.about.leadership': 'ทำเนียบโครงสร้างการบริหาร',
    'nav.section.about.history': 'ประวัติโรงพยาบาล',
    'nav.section.about.vision': 'วิสัยทัศน์ / พันธกิจ / ค่านิยม',
    'nav.section.ethics': 'ธรรมาภิบาลและจริยธรรม',
    'nav.section.ethics.club': 'ชมรมจริยธรรม',
    'nav.section.ethics.antiStigma': 'การลดการตีตราและเลือกปฏิบัติ',
    'nav.section.ethics.laws': 'ข้อมูลกฎหมายและ พ.ร.บ.',
    'nav.section.academic': 'วิชาการและผลงาน',
    'nav.section.academic.publications': 'ผลงานวิชาการ',
    'nav.section.programs': 'โครงการเด่น',
    'nav.section.programs.healthRider': 'Health Rider – ส่งยาถึงบ้าน',
    'nav.section.services': 'บริการออนไลน์',
    'nav.section.services.online': 'บริการออนไลน์',
    'nav.section.transparency': 'จัดซื้อจัดจ้าง / ITA',
    'nav.section.transparency.procurement': 'จัดซื้อจัดจ้าง/ข่าวสาร ITA',
    'nav.section.forms': 'แบบฟอร์มและธุรการ',
    'nav.section.forms.medicalRecord': 'แบบขอประวัติการรักษา',
    'nav.section.forms.donation': 'การรับบริจาค',
    'nav.section.forms.satisfaction': 'ประเมินความพึงพอใจ',
    'nav.section.intranet': 'ระบบภายใน',
    'nav.section.intranet.fuel': 'ระบบเบิกจ่ายน้ำมัน',
    'nav.section.intranet.documents': 'ศูนย์จัดเก็บเอกสาร',
    'actions.bookAppointment': 'จองคิวแพทย์ออนไลน์',
    'actions.viewDoctors': 'ค้นหาแพทย์',
    'actions.viewServices': 'ดูบริการทั้งหมด',
    'actions.downloadWebView': 'ดาวน์โหลดชุด WebView (Android/iOS)',
    'cookie.message': 'เว็บไซต์นี้ใช้คุกกี้เพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด โปรดอ่านนโยบายความเป็นส่วนตัว',
    'cookie.accept': 'ยอมรับคุกกี้',
    'cookie.reject': 'ปฏิเสธ',
    'language.th': 'ไทย',
    'language.en': 'English',
    'download.webview.ariaLabel': 'ดาวน์โหลดชุดโค้ด WebView สำหรับอุปกรณ์พกพา',
    'download.webview.preparing': 'กำลังเตรียมแพ็กเกจ...'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Patient Services',
    'nav.appointment': 'Book Appointment',
    'nav.doctors': 'Find Doctors',
    'nav.news': 'News & Events',
    'nav.contact': 'Contact',
    'nav.section.about': 'About the Hospital',
    'nav.section.about.leadership': 'Leadership & Governance',
    'nav.section.about.history': 'Hospital History',
    'nav.section.about.vision': 'Vision / Mission / Values',
    'nav.section.ethics': 'Governance & Ethics',
    'nav.section.ethics.club': 'Ethics Club',
    'nav.section.ethics.antiStigma': 'Anti-stigma Initiatives',
    'nav.section.ethics.laws': 'Relevant Laws & Acts',
    'nav.section.academic': 'Academic & Research',
    'nav.section.academic.publications': 'Publications',
    'nav.section.programs': 'Featured Programs',
    'nav.section.programs.healthRider': 'Health Rider – Home Delivery',
    'nav.section.services': 'Digital Services',
    'nav.section.services.online': 'Online Services',
    'nav.section.transparency': 'Procurement / ITA',
    'nav.section.transparency.procurement': 'Procurement & ITA Updates',
    'nav.section.forms': 'Forms & Administration',
    'nav.section.forms.medicalRecord': 'Medical Record Request',
    'nav.section.forms.donation': 'Donations',
    'nav.section.forms.satisfaction': 'Satisfaction Survey',
    'nav.section.intranet': 'Intranet Systems',
    'nav.section.intranet.fuel': 'Fuel Reimbursement',
    'nav.section.intranet.documents': 'Document Center',
    'actions.bookAppointment': 'Book a doctor appointment',
    'actions.viewDoctors': 'Find doctors',
    'actions.viewServices': 'View all services',
    'actions.downloadWebView': 'Download WebView kit (Android/iOS)',
    'cookie.message': 'We use cookies to ensure you get the best experience. Please review our privacy policy.',
    'cookie.accept': 'Accept cookies',
    'cookie.reject': 'Decline',
    'language.th': 'ไทย',
    'language.en': 'English',
    'download.webview.ariaLabel': 'Download a ready-to-use WebView wrapper kit for mobile',
    'download.webview.preparing': 'Preparing archive...'
  }
}

type I18nContextValue = {
  language: Language
  switchLanguage: (language: Language) => void
  t: (key: string) => string
}


type I18nProviderProps = {
  children: ReactNode
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

export function I18nProvider({ children }: I18nProviderProps): ReactElement {
  const [language, setLanguage] = useState<Language>('th')

  const value = useMemo<I18nContextValue>(() => ({
    language,
    switchLanguage: (next) => setLanguage(next),
    t: (key) => dictionary[language][key] ?? key
  }), [language])


  return createElement(I18nContext.Provider, { value }, children)

}

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
