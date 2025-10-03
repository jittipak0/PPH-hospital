const { logActivity } = require('../utils/logger')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ module: 'errorHandler' })

const errorHandler = (err, req, res, _next) => {
  req.log?.error('Unhandled error captured in request scope', { error: err })
  logger.error('Unhandled error bubbled to error handler', {
    error: err,
    requestId: req.requestId,
    path: req.originalUrl
  })
  if (req.user) {
    logActivity({ userId: req.user.id, action: `ERROR:${err.message}`, ip: req.ip })
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
}

module.exports = errorHandler
