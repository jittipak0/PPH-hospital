import React, { createContext, useContext, useMemo, useState } from 'react'

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
    'cookie.message': 'เว็บไซต์นี้ใช้คุกกี้เพื่อให้คุณได้รับประสบการณ์ที่ดีที่สุด โปรดอ่านนโยบายความเป็นส่วนตัว',
    'cookie.accept': 'ยอมรับคุกกี้',
    'cookie.reject': 'ปฏิเสธ',
    'language.th': 'ไทย',
    'language.en': 'English'
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
