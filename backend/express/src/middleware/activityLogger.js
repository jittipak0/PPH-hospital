const { logActivity } = require('../utils/logger')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ middleware: 'activityLogger' })

/**
 * Middleware factory that logs the provided action after the handler runs.
 */
const logAction = (action) => (req, _res, next) => {
  req.log?.debug('Activity logger invoked', { action })
  if (req.user) {
    req.log?.info('Recording user activity', { action, userId: req.user.id })
    logActivity({ userId: req.user.id, action, ip: req.ip })
  } else {
    logger.debug('Activity logger skipped due to missing user', { action })
  }
  next()
}

module.exports = { logAction }
