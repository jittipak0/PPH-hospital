const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ module: 'auditLogModel' })

const createLog = ({ userId = null, action, ip }) => {
  logger.debug('Creating audit log record', { userId, action, ip })
  const id = uuidv4()
  const createdAt = new Date().toISOString()
  db.prepare('INSERT INTO audit_logs (id, userId, action, ip, createdAt) VALUES (?, ?, ?, ?, ?)').run(
    id,
    userId,
    action,
    ip,
    createdAt
  )
  logger.debug('Audit log record created', { id, userId, action, ip, createdAt })
  return { id, userId, action, ip, createdAt }
}

const listLogs = () => {
  logger.debug('Fetching audit log entries')
  return db
    .prepare(
      `SELECT audit_logs.id, audit_logs.action, audit_logs.ip, audit_logs.createdAt, users.username as username
       FROM audit_logs LEFT JOIN users ON users.id = audit_logs.userId
       ORDER BY audit_logs.createdAt DESC`
    )
    .all()
}

module.exports = { createLog, listLogs }
