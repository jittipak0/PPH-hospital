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
  consent: z.literal(true, {
    errorMap: () => ({ message: 'โปรดยืนยันการยินยอมการจัดเก็บข้อมูลส่วนบุคคล' })
  })
})

export const contactSchema = z.object({
  fullName: z.string().min(2, 'กรุณากรอกชื่อ'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์'),
  message: z.string().min(10, 'กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร'),
  captcha: z.string().min(4, 'กรุณากรอก CAPTCHA'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'โปรดยอมรับการจัดการข้อมูลส่วนบุคคลก่อนส่งข้อความ' })
  })
})

export type AppointmentFormValues = z.infer<typeof appointmentSchema>
export type ContactFormValues = z.infer<typeof contactSchema>
