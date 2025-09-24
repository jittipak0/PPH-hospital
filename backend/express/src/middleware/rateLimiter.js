const rateLimit = require('express-rate-limit')

// Protect authentication endpoints from brute-force attempts.
const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.'
})

module.exports = { authRateLimiter }
