
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
    'actions.bookAppointment': 'จองคิวแพทย์ออนไลน์',
    'actions.viewDoctors': 'ค้นหาแพทย์',
    'actions.viewServices': 'ดูบริการทั้งหมด',
    'actions.downloadWebView': 'ดาวน์โหลด WebView',
    'cookie.message': 'เว็บไซต์นี้ใช้คุกกี้เพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด โปรดอ่านนโยบายความเป็นส่วนตัว',
    'cookie.accept': 'ยอมรับคุกกี้',
    'cookie.reject': 'ปฏิเสธ',
    'language.th': 'ไทย',
    'language.en': 'English',
    'download.webview.ariaLabel': 'เปิดเมนูดาวน์โหลดโปรเจกต์ WebView สำหรับ Android และ iOS',
    'download.webview.menuTitle': 'ดาวน์โหลดแพ็กเกจมือถือ',
    'download.webview.menuHint': 'สร้างโปรเจกต์ Expo ที่พร้อมสำหรับการ build แอป native จากเว็บไซต์โรงพยาบาล',
    'download.webview.androidLabel': 'โปรเจกต์ Android WebView (.zip)',
    'download.webview.androidDescription': 'ใช้ Expo CLI หรือ Android Studio เพื่อสร้างไฟล์ APK/AAB',
    'download.webview.iosLabel': 'โปรเจกต์ iOS WebView (.zip)',
    'download.webview.iosDescription': 'เปิดด้วย Xcode หรือ EAS เพื่อสร้างไฟล์ IPA สำหรับแจกจ่าย',
    'download.webview.preparing': 'กำลังเตรียมโปรเจกต์สำหรับดาวน์โหลด…',
    'download.webview.ready': 'เริ่มดาวน์โหลดแล้ว โปรดตรวจสอบโฟลเดอร์ดาวน์โหลดของคุณ',
    'download.webview.error': 'ไม่สามารถสร้างโปรเจกต์ได้ โปรดลองอีกครั้ง'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Patient Services',
    'nav.appointment': 'Book Appointment',
    'nav.doctors': 'Find Doctors',
    'nav.news': 'News & Events',
    'nav.contact': 'Contact',
    'actions.bookAppointment': 'Book a doctor appointment',
    'actions.viewDoctors': 'Find doctors',
    'actions.viewServices': 'View all services',
    'actions.downloadWebView': 'Download WebView',
    'cookie.message': 'We use cookies to ensure you get the best experience. Please review our privacy policy.',
    'cookie.accept': 'Accept cookies',
    'cookie.reject': 'Decline',
    'language.th': 'ไทย',
    'language.en': 'English',
    'download.webview.ariaLabel': 'Open the download menu for Android and iOS WebView projects',
    'download.webview.menuTitle': 'Choose a mobile bundle',
    'download.webview.menuHint': 'Generate an Expo project that wraps the hospital site inside a native shell.',
    'download.webview.androidLabel': 'Android WebView project (.zip)',
    'download.webview.androidDescription': 'Build an APK or AAB with the Expo CLI or Android Studio.',
    'download.webview.iosLabel': 'iOS WebView project (.zip)',
    'download.webview.iosDescription': 'Open in Xcode or use EAS to produce an IPA for release.',
    'download.webview.preparing': 'Preparing the project archive…',
    'download.webview.ready': 'Download started. Check your downloads folder.',
    'download.webview.error': 'Unable to generate the project. Please try again.'
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
