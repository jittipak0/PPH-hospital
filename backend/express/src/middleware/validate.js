/**
 * Validate request bodies using a Zod schema and return structured errors.
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body)
      req.validatedBody = parsed
      req.log?.debug('Request body validated', { body: parsed })
      return next()
    } catch (error) {
      const issues = error.errors?.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
      req.log?.warn('Request body validation failed', { issues })
      return res.status(400).json({ message: 'Invalid request payload', issues })
    }
  }
}

module.exports = { validateBody }
