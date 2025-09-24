const { z } = require('zod')

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(128)
})

module.exports = { deleteAccountSchema }
