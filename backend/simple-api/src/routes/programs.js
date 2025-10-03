import { Router } from 'express'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { verifyToken } from '../middleware/csrf.js'
import { failure, success } from '../utils/responses.js'

const router = Router()

const formatZodError = (error) =>
  error.errors.reduce((acc, item) => {
    const key = item.path.join('.') || 'form'
    acc[key] = [...(acc[key] ?? []), item.message]
    return acc
  }, {})

router.post('/health-rider/apply', verifyToken, (req, res) => {
  const schema = z.object({
    full_name: z.string().min(1, 'กรุณาระบุชื่อ-นามสกุล'),
    hn: z.string().min(1, 'กรุณาระบุหมายเลข HN'),
    address: z.string().min(5, 'กรุณาระบุที่อยู่'),
    district: z.string().min(2, 'กรุณาระบุเขต/อำเภอ'),
    province: z.string().min(2, 'กรุณาระบุจังหวัด'),
    zipcode: z
      .string()
      .regex(/^[0-9]{5}$/u, 'กรุณาระบุรหัสไปรษณีย์ 5 หลัก'),
    phone: z
      .string()
      .regex(/^[0-9]{9,10}$/u, 'กรุณาระบุเบอร์โทรศัพท์ 9-10 หลัก'),
    line_id: z.string().optional(),
    consent: z.coerce.boolean()
  })

  const parseResult = schema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(422).json(
      failure(422, 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', formatZodError(parseResult.error))
    )
  }

  const referenceId = `HR-${nanoid(6).toUpperCase()}`
  console.info('health-rider', parseResult.data)

  return res.json(success('รับสมัครเข้าร่วมโปรแกรม Health Rider เรียบร้อยแล้ว', { id: referenceId }))
})

export default router
