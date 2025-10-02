const { z } = require('zod')

const loginSchema = z.object({
  username: z.string().min(1).max(50),
  password: z.string().min(1).max(128),
  acceptPolicies: z.boolean().optional(),
  rememberMe: z.boolean().optional(),
  csrfToken: z.string().optional()
})

const refreshSchema = z.object({
  refreshToken: z.string().min(20)
})

const logoutSchema = z.object({
  refreshToken: z.string().min(20).optional()
})

module.exports = { loginSchema, refreshSchema, logoutSchema }
