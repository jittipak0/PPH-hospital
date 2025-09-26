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

export type MedicalRecordRequestPayload = {
  fullName: string
  hn: string
  citizenId: string
  phone: string
  email: string
  address: string
  reason: string
  consent: boolean
  idcardFile: File
}

export type DonationFormPayload = {
  donorName: string
  amount: number
  channel: 'cash' | 'bank_transfer' | 'online'
  phone?: string
  email?: string
  wantsReceipt: boolean
  consent: boolean
  notes?: string
}

export type SatisfactionSurveyPayload = {
  fullName: string
  hn?: string
  serviceDate: string
  serviceType: 'outpatient' | 'inpatient' | 'emergency' | 'telemedicine'
  rating: number
  feedback?: string
  phone?: string
  email?: string
  consent: boolean
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

const clinics: Clinic[] = [
  {
    id: 'internal',
    name: 'อายุรกรรม',
    description: 'ดูแลผู้ป่วยที่มีโรคเรื้อรัง โรคเบาหวาน ความดันโลหิตสูง และโรคติดเชื้อทั่วไป',
    operatingHours: 'วันจันทร์ - ศุกร์ 08:30-16:30 น.'
  },
  {
    id: 'surgery',
    name: 'ศัลยกรรม',
    description: 'บริการผ่าตัดทั่วไปและเฉพาะทาง พร้อมห้องผ่าตัดมาตรฐาน',
    operatingHours: 'วันจันทร์ - ศุกร์ 09:00-16:00 น.'
  },
  {
    id: 'pediatrics',
    name: 'กุมารเวชกรรม',
    description: 'คลินิกสำหรับเด็กแรกเกิดถึงวัยรุ่น พร้อมวัคซีนและการติดตามพัฒนาการ',
    operatingHours: 'วันจันทร์ - เสาร์ 08:00-17:00 น.'
  }
]

const doctors: Doctor[] = [
  {
    id: 'd1',
    name: 'นพ. ธนากร ใจดี',
    department: 'อายุรกรรม',
    specialty: 'โรคหัวใจและหลอดเลือด',
    position: 'แพทย์ผู้เชี่ยวชาญเฉพาะทาง',
    phone: '02-000-1234',
    schedule: [
      { day: 'จันทร์', time: '09:00-12:00', clinic: 'คลินิกหัวใจ (ในเวลาราชการ)' },
      { day: 'พุธ', time: '13:00-16:00', clinic: 'คลินิกหัวใจ (ในเวลาราชการ)' },
      { day: 'เสาร์', time: '09:00-12:00', clinic: 'คลินิกพิเศษนอกเวลา' }
    ]
  },
  {
    id: 'd2',
    name: 'พญ. ศศิธร วัฒนะ',
    department: 'กุมารเวชกรรม',
    specialty: 'ทารกแรกเกิดและทารกคลอดก่อนกำหนด',
    position: 'หัวหน้าศูนย์กุมารเวชกรรม',
    phone: '02-000-2345',
    schedule: [
      { day: 'อังคาร', time: '09:00-12:00', clinic: 'คลินิกเด็กสุขภาพดี' },
      { day: 'พฤหัสบดี', time: '13:00-16:00', clinic: 'คลินิกทารกแรกเกิด' }
    ]
  },
  {
    id: 'd3',
    name: 'นพ. ปวริศร์ มงคลชัย',
    department: 'ศัลยกรรม',
    specialty: 'ศัลยกรรมทางเดินอาหารและตับ',
    position: 'แพทย์เฉพาะทางศัลยกรรมทั่วไป',
    phone: '02-000-3456',
    schedule: [
      { day: 'จันทร์', time: '13:00-16:00', clinic: 'คลินิกศัลยกรรมทั่วไป' },
      { day: 'ศุกร์', time: '09:00-12:00', clinic: 'คลินิกศัลยกรรมมะเร็งตับ' }
    ]
  }
]

const newsItems: NewsItem[] = [
  {
    id: 'n3',
    title: 'เปิดศูนย์ฟื้นฟูผู้ป่วยโรคหลอดเลือดสมองครบวงจร',
    summary: 'โรงพยาบาลเปิดให้บริการศูนย์ฟื้นฟูผู้ป่วยโรคหลอดเลือดสมอง ด้วยทีมสหสาขาวิชาชีพและอุปกรณ์ทันสมัย',
    content:
      'โรงพยาบาลพร้อมให้บริการฟื้นฟูผู้ป่วยโรคหลอดเลือดสมองครบวงจร ตั้งแต่การรักษาเฉียบพลัน การฟื้นฟูทางกายภาพ และการติดตามที่บ้าน โดยทำงานร่วมกับทีมกายภาพบำบัด โภชนาการ และนักจิตวิทยา',
    publishedAt: '2024-09-12T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3'
  },
  {
    id: 'n2',
    title: 'บริการฉีดวัคซีนไข้หวัดใหญ่ฟรีสำหรับกลุ่มเสี่ยง',
    summary: 'เปิดให้ฉีดวัคซีนไข้หวัดใหญ่สำหรับผู้สูงอายุ 65 ปีขึ้นไป หญิงตั้งครรภ์ และผู้ป่วยโรคเรื้อรัง 7 กลุ่ม',
    content:
      'เพื่อป้องกันการแพร่ระบาดของไข้หวัดใหญ่ โรงพยาบาลจัดบริการฉีดวัคซีนฟรีสำหรับกลุ่มเสี่ยงทุกวันอังคาร-พฤหัสบดี เวลา 09:00-15:00 น. ที่คลินิกเวชปฏิบัติทั่วไป ชั้น 2 อาคารผู้ป่วยนอก',
    publishedAt: '2024-08-30T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
  },
  {
    id: 'n1',
    title: 'งานวิ่งการกุศล “ก้าวด้วยใจ เพื่อผู้ป่วยยากไร้”',
    summary: 'ขอเชิญร่วมวิ่งการกุศลเพื่อระดมทุนช่วยเหลือผู้ป่วยยากไร้ ในวันอาทิตย์ที่ 10 พฤศจิกายน 2567',
    content:
      'งานวิ่งแบ่งออกเป็น 3 ระยะ 3 กม. 5 กม. และ 10 กม. รายได้หลังหักค่าใช้จ่ายจะนำไปจัดซื้ออุปกรณ์ทางการแพทย์สำหรับผู้ป่วยยากไร้ ผู้สนใจสมัครได้ที่เว็บไซต์และเคาน์เตอร์ประชาสัมพันธ์',
    publishedAt: '2024-07-22T08:00:00.000Z',
    imageUrl: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017'
  }
]

const articles: Article[] = [
  {
    id: 'a1',
    title: '5 เคล็ดลับดูแลสุขภาพหัวใจสำหรับผู้สูงอายุ',
    summary: 'ปรับพฤติกรรมการกิน การออกกำลังกาย และการตรวจสุขภาพเพื่อลดความเสี่ยงโรคหัวใจ',
    content:
      'ควบคุมอาหารที่มีไขมันอิ่มตัว ออกกำลังกายสม่ำเสมอ ตรวจความดันโลหิต และรับประทานยาตามแพทย์สั่งอย่างเคร่งครัด',
    imageUrl: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb'
  },
  {
    id: 'a2',
    title: 'เตรียมตัวก่อนตรวจสุขภาพประจำปีอย่างไรให้พร้อม',
    summary: 'ตรวจสอบการงดอาหาร น้ำดื่ม และยาบางชนิดก่อนเข้ารับการตรวจ เพื่อผลตรวจที่แม่นยำ',
    content:
      'ก่อนตรวจสุขภาพควรงดอาหารอย่างน้อย 8 ชั่วโมง เตรียมเอกสารสิทธิการรักษา และพักผ่อนให้เพียงพอ',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528'
  }
]

const packages: HealthPackage[] = [
  {
    id: 'p1',
    name: 'โปรแกรมตรวจสุขภาพผู้สูงอายุ',
    description: 'ครอบคลุมการตรวจเลือด คลื่นหัวใจ และการประเมินความเสี่ยงโรคกระดูกพรุน',
    price: '3,900 บาท',
    highlights: ['ตรวจเลือด 15 รายการ', 'X-ray ปอดและกระดูกสันหลัง', 'ปรึกษาแพทย์เฉพาะทาง']
  },
  {
    id: 'p2',
    name: 'โปรแกรมตรวจสุขภาพวัยทำงาน',
    description: 'เน้นคัดกรองโรคเรื้อรัง เช่น เบาหวาน ความดัน และไขมันในเลือด',
    price: '2,700 บาท',
    highlights: ['ตรวจเลือด 12 รายการ', 'ตรวจสมรรถภาพหัวใจ', 'อัลตราซาวด์ช่องท้องส่วนบน']
  }
]

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return {} as T
  }
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = (data as { message?: string; error?: { message?: string } }).message ??
      (data as { error?: { message?: string } }).error?.message ??
      'ไม่สามารถเชื่อมต่อระบบได้'
    throw new Error(message)
  }
  return data as T
}

export const api = {
  async fetchClinics(): Promise<Clinic[]> {
    await delay(100)
    return clinics
  },
  async fetchDoctors(): Promise<Doctor[]> {
    await delay(120)
    return doctors
  },
  async fetchNews(): Promise<NewsItem[]> {
    await delay(100)
    return [...newsItems].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
  },
  async fetchArticles(): Promise<Article[]> {
    await delay(90)
    return articles
  },
  async fetchHealthPackages(): Promise<HealthPackage[]> {
    await delay(80)
    return packages
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
  },
  async submitMedicalRecordRequest(payload: MedicalRecordRequestPayload): Promise<{ data: { id: number } }> {
    const formData = new FormData()
    formData.append('full_name', payload.fullName)
    formData.append('hn', payload.hn)
    formData.append('citizen_id', payload.citizenId)
    formData.append('phone', payload.phone)
    formData.append('email', payload.email)
    formData.append('address', payload.address)
    formData.append('reason', payload.reason)
    formData.append('consent', payload.consent ? '1' : '0')
    formData.append('idcard_file', payload.idcardFile)

    const response = await fetch(`${API_BASE_URL}/api/forms/medical-record-request`, {
      method: 'POST',
      body: formData
    })

    return handleResponse<{ data: { id: number } }>(response)
  },
  async submitDonation(payload: DonationFormPayload): Promise<{ data: { id: number } }> {
    const response = await fetch(`${API_BASE_URL}/api/forms/donation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donor_name: payload.donorName,
        amount: payload.amount,
        channel: payload.channel,
        phone: payload.phone ?? null,
        email: payload.email ?? null,
        wants_receipt: payload.wantsReceipt,
        consent: payload.consent,
        notes: payload.notes ?? null
      })
    })

    return handleResponse<{ data: { id: number } }>(response)
  },
  async submitSatisfactionSurvey(payload: SatisfactionSurveyPayload): Promise<{ data: { id: number } }> {
    const response = await fetch(`${API_BASE_URL}/api/forms/satisfaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: payload.fullName,
        hn: payload.hn ?? null,
        service_date: payload.serviceDate,
        service_type: payload.serviceType,
        rating: payload.rating,
        feedback: payload.feedback ?? null,
        phone: payload.phone ?? null,
        email: payload.email ?? null,
        consent: payload.consent
      })
    })

    return handleResponse<{ data: { id: number } }>(response)
  }
}

