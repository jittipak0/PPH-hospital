const { z } = require('zod')

const optionalIsoDateString = z
  .union([z.string(), z.undefined(), z.null()])
  .transform((value) => {
    if (typeof value !== 'string') {
      return undefined
    }
    const trimmed = value.trim()
    return trimmed.length === 0 ? undefined : trimmed
  })
  .refine((value) => value === undefined || !Number.isNaN(Date.parse(value)), {
    message: 'กรุณากรอกวันที่เผยแพร่ให้ถูกต้อง (ISO 8601)'
  })

const newsBaseSchema = z.object({
  title: z.string().min(3, 'กรุณากรอกหัวข้ออย่างน้อย 3 ตัวอักษร').max(160),
  summary: z.string().min(10, 'สรุปต้องยาวอย่างน้อย 10 ตัวอักษร').max(280),
  content: z.string().min(20, 'เนื้อหาต้องยาวอย่างน้อย 20 ตัวอักษร'),
  imageUrl: z.string().url('รูปภาพต้องเป็น URL ที่ถูกต้อง').max(500),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().int().min(0).max(999).optional(),
  publishedAt: optionalIsoDateString
})

const createNewsSchema = newsBaseSchema
const updateNewsSchema = newsBaseSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: 'ต้องมีข้อมูลอย่างน้อย 1 รายการเพื่ออัปเดต'
  })

module.exports = { createNewsSchema, updateNewsSchema }
