import { z } from 'zod'

export const appointmentSchema = z.object({
  fullName: z
    .string()
    .min(2, 'กรุณากรอกชื่อ-นามสกุล')
    .regex(/^[\p{L}\p{Script=Thai}\s]+$/u, 'ชื่อไม่ควรมีตัวเลขหรืออักขระพิเศษ'),
  nationalId: z
    .string()
    .length(13, 'กรุณากรอกเลขบัตรประชาชน 13 หลัก')
    .regex(/^[0-9]+$/, 'กรอกเฉพาะตัวเลข'),
  patientCode: z
    .string()
    .max(10, 'รหัสผู้ป่วยไม่ควรเกิน 10 หลัก')
    .optional()
    .or(z.literal('')),
  department: z.string().min(1, 'กรุณาเลือกแผนก'),
  doctorId: z.string().min(1, 'กรุณาเลือกแพทย์'),
  appointmentDate: z.string().min(1, 'เลือกวันที่ต้องการนัดหมาย'),
  appointmentTime: z.string().min(1, 'เลือกเวลาที่ต้องการนัดหมาย'),
  captcha: z.string().min(4, 'กรุณากรอก CAPTCHA'),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: 'โปรดยืนยันการยินยอมการจัดเก็บข้อมูลส่วนบุคคล'
    })
})

export const contactSchema = z.object({
  fullName: z.string().min(2, 'กรุณากรอกชื่อ'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์'),
  message: z.string().min(10, 'กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร'),
  captcha: z.string().min(4, 'กรุณากรอก CAPTCHA'),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: 'โปรดยอมรับการจัดการข้อมูลส่วนบุคคลก่อนส่งข้อความ'
    })
})

export const medicalRecordRequestSchema = z.object({
  fullName: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล'),
  hn: z
    .string()
    .regex(/^[A-Za-z0-9-]{3,20}$/u, 'กรุณากรอกหมายเลข HN ระหว่าง 3-20 ตัวอักษร (A-Z, 0-9, -)'),
  citizenId: z
    .string()
    .regex(/^[0-9]{13}$/u, 'กรุณากรอกเลขประจำตัวประชาชน 13 หลัก'),
  phone: z
    .string()
    .regex(/^(0[0-9]{8,9})$/u, 'กรุณากรอกหมายเลขโทรศัพท์ 9-10 หลัก'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  address: z.string().min(10, 'กรุณากรอกที่อยู่โดยละเอียด'),
  reason: z.string().min(10, 'กรุณาระบุเหตุผลอย่างน้อย 10 ตัวอักษร'),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: 'โปรดยืนยันการยินยอมให้โรงพยาบาลจัดเก็บและใช้ข้อมูล'
    })
})

export const donationSchema = z.object({
  donorName: z.string().min(2, 'กรุณากรอกชื่อผู้บริจาค'),
  amount: z.coerce.number().min(1, 'จำนวนเงินต้องมากกว่า 0'),
  channel: z.enum(['cash', 'bank', 'promptpay'], {
    required_error: 'กรุณาเลือกช่องทางการบริจาค'
  }),
  phone: z
    .string()
    .regex(/^(0[0-9]{8,9})$/u, 'กรุณากรอกหมายเลขโทรศัพท์ 9-10 หลัก'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  note: z.string().max(500, 'หมายเหตุไม่ควรเกิน 500 ตัวอักษร').optional().or(z.literal(''))
})

export const satisfactionSurveySchema = z.object({
  scoreOverall: z.coerce.number().min(1, 'ให้คะแนน 1-5').max(5, 'ให้คะแนน 1-5'),
  scoreWaitTime: z.coerce.number().min(1, 'ให้คะแนน 1-5').max(5, 'ให้คะแนน 1-5'),
  scoreStaff: z.coerce.number().min(1, 'ให้คะแนน 1-5').max(5, 'ให้คะแนน 1-5'),
  comment: z.string().max(600, 'ความเห็นไม่ควรเกิน 600 ตัวอักษร').optional().or(z.literal('')),
  serviceDate: z
    .string()
    .min(1, 'โปรดระบุวันที่รับบริการ')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'รูปแบบวันที่ไม่ถูกต้อง')
})

export const healthRiderApplicationSchema = z.object({
  fullName: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล'),
  hn: z
    .string()
    .regex(/^[A-Za-z0-9-]{3,20}$/u, 'กรุณากรอกหมายเลข HN ระหว่าง 3-20 ตัวอักษร'),
  address: z.string().min(10, 'กรุณากรอกที่อยู่สำหรับจัดส่งยา'),
  district: z.string().min(2, 'กรุณากรอกเขต/อำเภอ'),
  province: z.string().min(2, 'กรุณากรอกจังหวัด'),
  zipcode: z
    .string()
    .regex(/^[0-9]{5}$/u, 'กรุณากรอกรหัสไปรษณีย์ 5 หลัก'),
  phone: z
    .string()
    .regex(/^(0[0-9]{8,9})$/u, 'กรุณากรอกหมายเลขโทรศัพท์ 9-10 หลัก'),
  lineId: z.string().max(50, 'Line ID ไม่ควรเกิน 50 ตัวอักษร').optional().or(z.literal('')),
  consent: z
    .boolean()
    .refine((value) => value === true, {
      message: 'โปรดยืนยันการยินยอมให้โรงพยาบาลจัดเก็บและใช้ข้อมูล'
    })
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
export type ContactFormValues = z.infer<typeof contactSchema>
export type MedicalRecordRequestFormValues = z.infer<typeof medicalRecordRequestSchema>
export type DonationFormValues = z.infer<typeof donationSchema>
export type SatisfactionSurveyFormValues = z.infer<typeof satisfactionSurveySchema>
export type HealthRiderApplicationFormValues = z.infer<typeof healthRiderApplicationSchema>
