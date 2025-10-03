const rateLimit = require('express-rate-limit')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ module: 'authRateLimiter' })

// Protect authentication endpoints from brute-force attempts.
const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  keyGenerator: (req) => {
    const key = req.ip
    req.log?.debug('Generated rate limiting key', { key })
    return key
  },
  handler: (req, res, _next, options) => {
    const scopedLogger = req.log?.child({ module: 'authRateLimiter' }) ?? logger
    scopedLogger.warn('Authentication rate limit exceeded', {
      ip: req.ip,
      path: req.originalUrl,
      requestId: req.requestId
    })
    res.status(options.statusCode).json({ message: options.message })
  }
})

module.exports = { authRateLimiter }
