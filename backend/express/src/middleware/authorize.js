const { baseLogger } = require('../utils/debugLogger')

/**
 * RBAC middleware to ensure the authenticated user has sufficient privileges.
 */
const authorize = (roles = []) => {
  const allowed = Array.isArray(roles) ? roles : [roles]
  const fallbackLogger = baseLogger.child({ middleware: 'authorize', allowedRoles: allowed })
  return (req, res, next) => {
    const logger = req.log?.child({ middleware: 'authorize', allowedRoles: allowed }) ?? fallbackLogger
    if (!req.user) {
      logger.warn('Authorization failed: user context missing')
      return res.status(401).json({ message: 'Authentication required' })
    }
    if (allowed.length > 0 && !allowed.includes(req.user.role)) {
      logger.warn('Authorization failed: role not permitted', { role: req.user.role })
      return res.status(403).json({ message: 'Insufficient permissions' })
    }
    logger.debug('Authorization succeeded', { role: req.user.role })
    next()
  }
}

module.exports = authorize
