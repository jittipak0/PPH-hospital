import type { Language } from './i18n'

export type Clinic = {
  id: string
  name: string
  description: string
  operatingHours: string
}

export type DoctorSchedule = {
  day: string
  time: string
  clinic: string
}

export type Doctor = {
  id: string
  name: string
  department: string
  specialty: string
  position: string
  phone: string
  schedule: DoctorSchedule[]
}

export type NewsItem = {
  id: string
  title: string
  summary: string
  content: string
  publishedAt: string
  imageUrl: string
}

export type Article = {
  id: string
  title: string
  summary: string
  content: string
  imageUrl: string
}

export type HealthPackage = {
  id: string
  name: string
  description: string
  price: string
  highlights: string[]
}

export type AppointmentPayload = {
  fullName: string
  nationalId: string
  patientCode?: string
  department: string
  doctorId: string
  appointmentDate: string
  appointmentTime: string
  consent: boolean
}

export type ContactPayload = {
  fullName: string
  email: string
  phone: string
  message: string
  consent: boolean
}

type LocalizedString = Record<Language, string>

type ClinicSeed = {
  id: string
  name: LocalizedString
  description: LocalizedString
  operatingHours: LocalizedString
}

type DoctorSeed = {
  id: string
  name: LocalizedString
  department: LocalizedString
  specialty: LocalizedString
  position: LocalizedString
  phone: string
  schedule: Array<{
    day: LocalizedString
    time: string
    clinic: LocalizedString
  }>
}

type NewsSeed = {
  id: string
  title: LocalizedString
  summary: LocalizedString
  content: LocalizedString
  publishedAt: string
  imageUrl: string
}

type ArticleSeed = {
  id: string
  title: LocalizedString
  summary: LocalizedString
  content: LocalizedString
  imageUrl: string
}

type PackageSeed = {
  id: string
  name: LocalizedString
  description: LocalizedString
  price: LocalizedString
  highlights: Array<LocalizedString>
}

const clinicsSeed: ClinicSeed[] = [
  {
    id: 'internal',
    name: { th: 'อายุรกรรม', en: 'Internal Medicine' },
    description: {
      th: 'ดูแลผู้ป่วยโรคเรื้อรัง เบาหวาน ความดันโลหิตสูง และโรคติดเชื้อทั่วไป',
      en: 'Care for chronic diseases such as diabetes, hypertension, and general infectious diseases.'
    },
    operatingHours: { th: 'จันทร์-ศุกร์ 08:30-16:30 น.', en: 'Mon-Fri 08:30-16:30' }
  },
  {
    id: 'surgery',
    name: { th: 'ศัลยกรรม', en: 'Surgery' },
    description: {
      th: 'บริการผ่าตัดทั่วไปและเฉพาะทาง พร้อมห้องผ่าตัดมาตรฐาน',
      en: 'General and specialist surgery with fully equipped operating theatres.'
    },
    operatingHours: { th: 'จันทร์-ศุกร์ 09:00-16:00 น.', en: 'Mon-Fri 09:00-16:00' }
  },
  {
    id: 'pediatrics',
    name: { th: 'กุมารเวชกรรม', en: 'Paediatrics' },
    description: {
      th: 'คลินิกสำหรับเด็กแรกเกิดถึงวัยรุ่น พร้อมวัคซีนและการติดตามพัฒนาการ',
      en: 'Care for newborns to adolescents, including vaccination and developmental follow-up.'
    },
    operatingHours: { th: 'จันทร์-เสาร์ 08:00-17:00 น.', en: 'Mon-Sat 08:00-17:00' }
  }
]

const doctorsSeed: DoctorSeed[] = [
  {
    id: 'd1',
    name: { th: 'นพ. ธนากร ใจดี', en: 'Dr. Thanakorn Jaidee' },
    department: { th: 'อายุรกรรม', en: 'Internal Medicine' },
    specialty: { th: 'โรคหัวใจและหลอดเลือด', en: 'Cardiology' },
    position: { th: 'แพทย์ผู้เชี่ยวชาญเฉพาะทางโรคหัวใจ', en: 'Cardiology specialist' },
    phone: '02-000-1234',
    schedule: [
      {
        day: { th: 'จันทร์', en: 'Monday' },
        time: '09:00-12:00',
        clinic: { th: 'คลินิกหัวใจ (ในเวลาราชการ)', en: 'Cardiac clinic (business hours)' }
      },
      {
        day: { th: 'พุธ', en: 'Wednesday' },
        time: '13:00-16:00',
        clinic: { th: 'คลินิกหัวใจ (ในเวลาราชการ)', en: 'Cardiac clinic (business hours)' }
      },
      {
        day: { th: 'เสาร์', en: 'Saturday' },
        time: '09:00-12:00',
        clinic: { th: 'คลินิกพิเศษนอกเวลา', en: 'After-hours special clinic' }
      }
    ]
  },
  {
    id: 'd2',
    name: { th: 'พญ. ศศิธร วัฒนะ', en: 'Dr. Sasithorn Wattana' },
    department: { th: 'กุมารเวชกรรม', en: 'Paediatrics' },
    specialty: { th: 'ทารกแรกเกิดและคลอดก่อนกำหนด', en: 'Neonatology' },
    position: { th: 'หัวหน้าศูนย์กุมารเวชกรรม', en: 'Head of Paediatric Centre' },
    phone: '02-000-2345',
    schedule: [
      {
        day: { th: 'อังคาร', en: 'Tuesday' },
        time: '09:00-12:00',
        clinic: { th: 'คลินิกเด็กสุขภาพดี', en: 'Well-baby clinic' }
      },
      {
        day: { th: 'พฤหัสบดี', en: 'Thursday' },
        time: '13:00-16:00',
        clinic: { th: 'คลินิกทารกแรกเกิด', en: 'Neonatal clinic' }
      }
    ]
  },
  {
    id: 'd3',
    name: { th: 'นพ. ปวริศร์ มงคลชัย', en: 'Dr. Pawarit Mongkolchai' },
    department: { th: 'ศัลยกรรม', en: 'Surgery' },
    specialty: { th: 'ศัลยกรรมทางเดินอาหารและตับ', en: 'Hepatobiliary surgery' },
    position: { th: 'แพทย์เฉพาะทางศัลยกรรมทั่วไป', en: 'General surgery specialist' },
    phone: '02-000-3456',
    schedule: [
      {
        day: { th: 'จันทร์', en: 'Monday' },
        time: '13:00-16:00',
        clinic: { th: 'คลินิกศัลยกรรมทั่วไป', en: 'General surgery clinic' }
      },
      {
        day: { th: 'ศุกร์', en: 'Friday' },
        time: '09:00-12:00',
        clinic: { th: 'คลินิกศัลยกรรมมะเร็งตับ', en: 'Liver cancer clinic' }
      }
    ]
  }
]

const newsSeed: NewsSeed[] = [
  {
    id: 'n3',
    title: {
      th: 'เปิดศูนย์ฟื้นฟูผู้ป่วยโรคหลอดเลือดสมองครบวงจร',
      en: 'New comprehensive stroke rehabilitation centre opens'
    },
    summary: {
      th: 'โรงพยาบาลเปิดให้บริการศูนย์ฟื้นฟูผู้ป่วยโรคหลอดเลือดสมอง ด้วยทีมสหสาขาวิชาชีพและอุปกรณ์ทันสมัย',
      en: 'The hospital launches a comprehensive stroke rehabilitation centre with multidisciplinary teams and modern equipment.'
    },
    content: {
      th: 'โรงพยาบาลพร้อมให้บริการฟื้นฟูผู้ป่วยโรคหลอดเลือดสมองตั้งแต่การรักษาเฉียบพลัน การฟื้นฟูทางกายภาพ และการติดตามที่บ้าน โดยทำงานร่วมกับทีมกายภาพบำบัด โภชนาการ และนักจิตวิทยา',
      en: 'The new centre delivers acute treatment, physical rehabilitation, and home follow-up for stroke patients, supported by physiotherapists, nutritionists, and clinical psychologists.'
    },
    publishedAt: '2024-09-12T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3'
  },
  {
    id: 'n2',
    title: {
      th: 'บริการฉีดวัคซีนไข้หวัดใหญ่ฟรีสำหรับกลุ่มเสี่ยง',
      en: 'Free influenza vaccination for vulnerable groups'
    },
    summary: {
      th: 'เปิดให้ฉีดวัคซีนไข้หวัดใหญ่สำหรับผู้สูงอายุ หญิงตั้งครรภ์ และผู้ป่วยโรคเรื้อรัง 7 กลุ่ม',
      en: 'Seasonal flu vaccines now available free for seniors, pregnant women, and seven chronic disease groups.'
    },
    content: {
      th: 'บริการฉีดวัคซีนฟรีทุกวันอังคาร-พฤหัสบดี เวลา 09:00-15:00 น. ที่คลินิกเวชปฏิบัติทั่วไป ชั้น 2 อาคารผู้ป่วยนอก',
      en: 'Vaccinations are provided every Tuesday-Thursday from 09:00-15:00 at the general practice clinic, 2nd floor of the outpatient building.'
    },
    publishedAt: '2024-08-30T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
  },
  {
    id: 'n1',
    title: {
      th: 'งานวิ่งการกุศล “ก้าวด้วยใจ เพื่อผู้ป่วยยากไร้”',
      en: 'Charity run “Steps with Care” in support of underprivileged patients'
    },
    summary: {
      th: 'ขอเชิญร่วมวิ่งการกุศลเพื่อระดมทุนช่วยเหลือผู้ป่วยยากไร้ ในวันอาทิตย์ที่ 10 พฤศจิกายน 2567',
      en: 'Join our charity run on Sunday 10 November 2024 to raise funds for patients in need.'
    },
    content: {
      th: 'งานวิ่งแบ่งออกเป็น 3 ระยะ 3 กม. 5 กม. และ 10 กม. รายได้หลังหักค่าใช้จ่ายจะนำไปจัดซื้ออุปกรณ์ทางการแพทย์สำหรับผู้ป่วยยากไร้',
      en: 'The event offers 3 km, 5 km, and 10 km categories. All net proceeds will fund medical equipment for underprivileged patients.'
    },
    publishedAt: '2024-07-22T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017'
  }
]

const articlesSeed: ArticleSeed[] = [
  {
    id: 'a1',
    title: {
      th: '5 เคล็ดลับดูแลสุขภาพหัวใจสำหรับผู้สูงอายุ',
      en: 'Five heart health tips for seniors'
    },
    summary: {
      th: 'ปรับพฤติกรรมการกิน การออกกำลังกาย และการตรวจสุขภาพเพื่อลดความเสี่ยงโรคหัวใจ',
      en: 'Adjust diet, exercise, and routine check-ups to lower heart disease risks.'
    },
    content: {
      th: 'ควบคุมอาหารที่มีไขมันอิ่มตัว ออกกำลังกายสม่ำเสมอ ตรวจความดันโลหิต และรับประทานยาตามแพทย์สั่งอย่างเคร่งครัด',
      en: 'Reduce saturated fats, stay active, monitor blood pressure, and adhere strictly to prescribed medication.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb'
  },
  {
    id: 'a2',
    title: {
      th: 'เตรียมตัวก่อนตรวจสุขภาพประจำปีอย่างไรให้พร้อม',
      en: 'How to prepare for your annual health check-up'
    },
    summary: {
      th: 'ตรวจสอบการงดอาหาร น้ำดื่ม และยาบางชนิดก่อนเข้ารับการตรวจ เพื่อผลตรวจที่แม่นยำ',
      en: 'Check fasting requirements and medication adjustments to ensure accurate results.'
    },
    content: {
      th: 'ควรงดอาหารอย่างน้อย 8 ชั่วโมง เตรียมเอกสารสิทธิการรักษา และพักผ่อนให้เพียงพอ',
      en: 'Fast for at least eight hours, bring entitlement documents, and get adequate rest.'
    },
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528'
  }
]

const packagesSeed: PackageSeed[] = [
  {
    id: 'p1',
    name: { th: 'โปรแกรมตรวจสุขภาพผู้สูงอายุ', en: 'Senior wellness package' },
    description: {
      th: 'ครอบคลุมการตรวจเลือด คลื่นหัวใจ และประเมินความเสี่ยงโรคกระดูกพรุน',
      en: 'Comprehensive blood panels, ECG, and osteoporosis risk assessment.'
    },
    price: { th: '3,900 บาท', en: 'THB 3,900' },
    highlights: [
      { th: 'ตรวจเลือด 15 รายการ', en: '15 blood test items' },
      { th: 'X-ray ปอดและกระดูกสันหลัง', en: 'Chest and spine X-ray' },
      { th: 'ปรึกษาแพทย์เฉพาะทาง', en: 'Specialist consultation' }
    ]
  },
  {
    id: 'p2',
    name: { th: 'โปรแกรมตรวจสุขภาพวัยทำงาน', en: 'Working-age wellness package' },
    description: {
      th: 'คัดกรองโรคเรื้อรัง เช่น เบาหวาน ความดัน และไขมันในเลือด',
      en: 'Screening for chronic illnesses such as diabetes, hypertension, and dyslipidaemia.'
    },
    price: { th: '2,700 บาท', en: 'THB 2,700' },
    highlights: [
      { th: 'ตรวจเลือด 12 รายการ', en: '12 blood test items' },
      { th: 'ตรวจสมรรถภาพหัวใจ', en: 'Cardiac stress screening' },
      { th: 'อัลตราซาวด์ช่องท้องส่วนบน', en: 'Upper abdominal ultrasound' }
    ]
  }
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const localize = <T,>(value: Record<Language, T>, language: Language): T => value[language]

export const api = {
  async fetchClinics(language: Language = 'th'): Promise<Clinic[]> {
    await delay(100)
    return clinicsSeed.map((clinic) => ({
      id: clinic.id,
      name: localize(clinic.name, language),
      description: localize(clinic.description, language),
      operatingHours: localize(clinic.operatingHours, language)
    }))
  },
  async fetchDoctors(language: Language = 'th'): Promise<Doctor[]> {
    await delay(120)
    return doctorsSeed.map((doctor) => ({
      id: doctor.id,
      name: localize(doctor.name, language),
      department: localize(doctor.department, language),
      specialty: localize(doctor.specialty, language),
      position: localize(doctor.position, language),
      phone: doctor.phone,
      schedule: doctor.schedule.map((slot) => ({
        day: localize(slot.day, language),
        time: slot.time,
        clinic: localize(slot.clinic, language)
      }))
    }))
  },
  async fetchNews(language: Language = 'th'): Promise<NewsItem[]> {
    await delay(100)
    return [...newsSeed]
      .map((news) => ({
        id: news.id,
        title: localize(news.title, language),
        summary: localize(news.summary, language),
        content: localize(news.content, language),
        publishedAt: news.publishedAt,
        imageUrl: news.imageUrl
      }))
      .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  },
  async fetchArticles(language: Language = 'th'): Promise<Article[]> {
    await delay(90)
    return articlesSeed.map((article) => ({
      id: article.id,
      title: localize(article.title, language),
      summary: localize(article.summary, language),
      content: localize(article.content, language),
      imageUrl: article.imageUrl
    }))
  },
  async fetchHealthPackages(language: Language = 'th'): Promise<HealthPackage[]> {
    await delay(80)
    return packagesSeed.map((pkg) => ({
      id: pkg.id,
      name: localize(pkg.name, language),
      description: localize(pkg.description, language),
      price: localize(pkg.price, language),
      highlights: pkg.highlights.map((item) => localize(item, language))
    }))
  },
  async submitAppointment(payload: AppointmentPayload): Promise<{ referenceCode: string }> {
    await delay(300)
    const sanitizedName = payload.fullName.replace(/[<>]/g, '')
    const referenceCode = `AP-${Date.now().toString().slice(-6)}`
    console.info('Appointment submitted', { ...payload, fullName: sanitizedName })
    return { referenceCode }
  },
  async submitContact(payload: ContactPayload): Promise<void> {
    await delay(250)
    const sanitizedMessage = payload.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    console.info('Contact message submitted', { ...payload, message: sanitizedMessage })
  }
}

export type { Doctor }
