const { logActivity } = require('../utils/logger')

/**
 * Middleware factory that logs the provided action after the handler runs.
 */
const logAction = (action) => (req, _res, next) => {
  if (req.user) {
    logActivity({ userId: req.user.id, action, ip: req.ip })
  }
  next()
}

module.exports = { logAction }
