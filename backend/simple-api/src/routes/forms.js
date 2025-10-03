import { Router } from 'express'
import multer from 'multer'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { verifyToken } from '../middleware/csrf.js'
import { failure, success } from '../utils/responses.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024
  }
})

const formatZodError = (error) =>
  error.errors.reduce((acc, item) => {
    const key = item.path.join('.') || 'form'
    acc[key] = [...(acc[key] ?? []), item.message]
    return acc
  }, {})

router.post(
  '/medical-record-request',
  verifyToken,
  upload.single('idcard_file'),
  (req, res) => {
    const schema = z.object({
      full_name: z.string().min(1, 'กรุณาระบุชื่อ-นามสกุล'),
      hn: z.string().min(1, 'กรุณาระบุหมายเลข HN'),
      citizen_id: z
        .string()
        .regex(/^[0-9]{13}$/u, 'เลขบัตรประชาชนไม่ถูกต้อง'),
      phone: z
        .string()
        .regex(/^[0-9]{9,10}$/u, 'กรุณาระบุเบอร์โทรศัพท์ 9-10 หลัก'),
      email: z.string().email('อีเมลไม่ถูกต้อง'),
      address: z.string().min(5, 'กรุณาระบุที่อยู่สำหรับจัดส่ง'),
      reason: z.string().min(5, 'กรุณาระบุเหตุผลในการขอข้อมูล'),
      consent: z.string().refine((value) => value === '1', {
        message: 'กรุณายืนยันการยินยอมตามเงื่อนไข'
      })
    })

    const parseResult = schema.safeParse(req.body)
    if (!parseResult.success) {
      return res.status(422).json(
        failure(422, 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', formatZodError(parseResult.error))
      )
    }

    if (req.file && req.file.size === 0) {
      return res.status(422).json(
        failure(422, 'ไฟล์แนบไม่ถูกต้อง', { idcard_file: ['ไฟล์แนบว่างเปล่า'] })
      )
    }

    const referenceId = `MR-${nanoid(6).toUpperCase()}`

    console.info('medical-record-request', {
      ...parseResult.data,
      idcard_file: req.file ? { filename: req.file.originalname, size: req.file.size } : undefined
    })

    return res.json(
      success('รับคำขอเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับภายใน 3 วันทำการ', {
        id: referenceId
      })
    )
  }
)

router.post('/donation', verifyToken, (req, res) => {
  const schema = z.object({
    donor_name: z.string().min(1, 'กรุณาระบุชื่อผู้บริจาค'),
    amount: z.coerce.number().min(1, 'จำนวนเงินต้องมากกว่า 0'),
    channel: z.enum(['cash', 'bank', 'promptpay']),
    phone: z
      .string()
      .regex(/^[0-9]{9,10}$/u, 'กรุณาระบุเบอร์โทรศัพท์ 9-10 หลัก'),
    email: z.string().email('อีเมลไม่ถูกต้อง'),
    note: z.string().optional()
  })

  const parseResult = schema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(422).json(
      failure(422, 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', formatZodError(parseResult.error))
    )
  }

  const referenceId = `DN-${nanoid(6).toUpperCase()}`
  console.info('donation', parseResult.data)

  return res.json(success('บันทึกการบริจาคเรียบร้อย ขอบคุณที่สนับสนุนโรงพยาบาล', { id: referenceId }))
})

router.post('/satisfaction', verifyToken, (req, res) => {
  const score = z.coerce.number().min(1).max(5)
  const schema = z.object({
    score_overall: score,
    score_waittime: score,
    score_staff: score,
    comment: z.string().optional(),
    service_date: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'กรุณาระบุวันที่ให้บริการ'
    })
  })

  const parseResult = schema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(422).json(
      failure(422, 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง', formatZodError(parseResult.error))
    )
  }

  const referenceId = `SV-${nanoid(6).toUpperCase()}`
  console.info('satisfaction', parseResult.data)

  return res.json(success('บันทึกแบบประเมินความพึงพอใจเรียบร้อย ขอบคุณสำหรับคำติชม', { id: referenceId }))
})

export default router
