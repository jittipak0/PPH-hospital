const { z } = require('zod')

const roleEnum = z.enum(['admin', 'doctor', 'nurse', 'staff'])

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(128),
  role: roleEnum
})

const updateUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(128).optional(),
  role: roleEnum.optional(),
  acceptedPolicies: z.boolean().optional()
})

module.exports = { roleEnum, createUserSchema, updateUserSchema }
