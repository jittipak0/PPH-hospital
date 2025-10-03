const fs = require('fs')
const path = require('path')
const auditLogModel = require('../models/auditLogModel')
const { baseLogger } = require('./debugLogger')

const logDirectory = path.resolve(__dirname, '../../logs')
fs.mkdirSync(logDirectory, { recursive: true })
const logFilePath = path.join(logDirectory, 'audit.log')

const logger = baseLogger.child({ module: 'auditTrail' })

/**
 * Persist user activity to both the database and an append-only log file.
 */
const logActivity = ({ userId = null, action, ip }) => {
  logger.info('Recording audit log entry', { userId, action, ip })
  const entry = auditLogModel.createLog({ userId, action, ip })
  const line = `${entry.createdAt} | user=${entry.userId ?? 'anonymous'} | action=${action} | ip=${ip ?? 'unknown'}\n`
  fs.appendFileSync(logFilePath, line, { encoding: 'utf8' })
  logger.debug('Audit log entry persisted', { entry })
}

module.exports = { logActivity, logFilePath }
