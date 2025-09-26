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
  fullName: z.string().min(3, 'กรุณากรอกชื่อ-นามสกุล'),
  hn: z.string().min(1, 'กรุณากรอกรหัสผู้ป่วย'),
  citizenId: z
    .string()
    .length(13, 'กรุณากรอกเลขบัตรประชาชน 13 หลัก')
    .regex(/^[0-9]+$/, 'กรอกเฉพาะตัวเลข'),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  address: z.string().min(10, 'กรุณากรอกที่อยู่ให้ครบถ้วน'),
  reason: z.string().min(10, 'กรุณากรอกรายละเอียดเหตุผล'),
  consent: z
    .boolean()
    .refine((value) => value === true, { message: 'โปรดยืนยันการยินยอม' }),
  idcardFile: z
    .instanceof(File, { message: 'กรุณาอัปโหลดไฟล์บัตรประชาชน' })
    .refine((file) => file.size <= 5 * 1024 * 1024, 'ไฟล์ต้องมีขนาดไม่เกิน 5MB')
})

export const donationFormSchema = z.object({
  donorName: z.string().min(3, 'กรุณากรอกชื่อผู้บริจาค'),
  amount: z
    .number({ invalid_type_error: 'กรุณากรอกจำนวนเงินเป็นตัวเลข' })
    .min(1, 'จำนวนเงินต้องมากกว่า 0'),
  channel: z.enum(['cash', 'bank_transfer', 'online'], { message: 'กรุณาเลือกช่องทางบริจาค' }),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์').optional(),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง').optional(),
  wantsReceipt: z.boolean(),
  consent: z
    .boolean()
    .refine((value) => value === true, { message: 'ต้องยินยอมให้จัดเก็บข้อมูลก่อนส่งแบบฟอร์ม' }),
  notes: z.string().max(1000, 'รายละเอียดเพิ่มเติมไม่ควรเกิน 1000 ตัวอักษร').optional()
})

export const satisfactionSurveySchema = z.object({
  fullName: z.string().min(3, 'กรุณากรอกชื่อ-นามสกุล'),
  hn: z.string().optional(),
  serviceDate: z.string().min(1, 'กรุณาเลือกวันที่เข้ารับบริการ'),
  serviceType: z.enum(['outpatient', 'inpatient', 'emergency', 'telemedicine'], {
    message: 'กรุณาเลือกประเภทบริการ'
  }),
  rating: z.number({ invalid_type_error: 'กรุณาให้คะแนนระหว่าง 1-5' }).min(1).max(5),
  feedback: z.string().max(1500, 'ความคิดเห็นไม่ควรเกิน 1500 ตัวอักษร').optional(),
  phone: z.string().optional(),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง').optional(),
  consent: z
    .boolean()
    .refine((value) => value === true, { message: 'กรุณายืนยันความยินยอม' })
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
export type ContactFormValues = z.infer<typeof contactSchema>
export type MedicalRecordRequestFormValues = z.infer<typeof medicalRecordRequestSchema>
export type DonationFormValues = z.infer<typeof donationFormSchema>
export type SatisfactionSurveyFormValues = z.infer<typeof satisfactionSurveySchema>
