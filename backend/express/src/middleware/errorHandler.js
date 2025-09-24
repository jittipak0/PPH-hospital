const { logActivity } = require('../utils/logger')

const errorHandler = (err, req, res, _next) => {
  console.error('Unhandled error:', err)
  if (req.user) {
    logActivity({ userId: req.user.id, action: `ERROR:${err.message}`, ip: req.ip })
  }
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
}

module.exports = errorHandler
