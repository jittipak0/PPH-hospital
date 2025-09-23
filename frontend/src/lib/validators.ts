import { z } from 'zod'

export const createAppointmentSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z
      .string()
      .min(2, t('validation.fullName.required'))
      .regex(/^[\p{L}\p{Script=Thai}\s.]+$/u, t('validation.fullName.format')),
    nationalId: z
      .string()
      .length(13, t('validation.nationalId.length'))
      .regex(/^[0-9]+$/, t('validation.nationalId.numeric')),
    patientCode: z
      .string()
      .max(10, t('validation.patientCode.length'))
      .optional()
      .or(z.literal('')),
    department: z.string().min(1, t('validation.department.required')),
    doctorId: z.string().min(1, t('validation.doctor.required')),
    appointmentDate: z.string().min(1, t('validation.appointmentDate.required')),
    appointmentTime: z.string().min(1, t('validation.appointmentTime.required')),
    captcha: z.string().min(4, t('validation.captcha.required')),
    consent: z.literal(true, {
      errorMap: () => ({ message: t('validation.consent.required') })
    })
  })

export const createContactSchema = (t: (key: string) => string) =>
  z.object({
    fullName: z.string().min(2, t('validation.contact.fullName')),
    email: z.string().email(t('validation.contact.email')),
    phone: z.string().min(9, t('validation.contact.phone')),
    message: z.string().min(10, t('validation.contact.message')),
    captcha: z.string().min(4, t('validation.contact.captcha')),
    consent: z.literal(true, {
      errorMap: () => ({ message: t('validation.contact.consent') })
    })
  })

export type AppointmentFormValues = z.infer<ReturnType<typeof createAppointmentSchema>>
export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>
