const { sanitizeObject } = require('../utils/sanitizer')

/**
 * Sanitize incoming request data to guard against reflected XSS.
 */
const sanitizeRequest = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body)
  }
  if (req.query) {
    req.query = sanitizeObject(req.query)
  }
  if (req.params) {
    req.params = sanitizeObject(req.params)
  }
  next()
}

module.exports = sanitizeRequest
