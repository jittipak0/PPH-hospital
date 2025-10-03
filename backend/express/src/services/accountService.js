const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const sessionModel = require('../models/sessionModel')
const { logActivity } = require('../utils/logger')
const { baseLogger } = require('../utils/debugLogger')

const serviceLogger = baseLogger.child({ service: 'accountService' })

const resolveLogger = (logger) => {
  if (logger && typeof logger.child === 'function') {
    return logger.child({ service: 'accountService' })
  }
  return serviceLogger
}

const deleteAccount = async ({ userId, password, ip, logger }) => {
  const log = resolveLogger(logger)
  log.debug('Loading account for deletion', { userId })
  const user = userModel.findById(userId)
  if (!user) {
    log.warn('Attempted to delete non-existent user', { userId })
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  log.debug('Verifying account password before deletion', { userId })
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    log.warn('Account deletion password mismatch', { userId })
    const error = new Error('Password confirmation failed')
    error.status = 401
    throw error
  }

  log.debug('Deleting sessions prior to account removal', { userId })
  sessionModel.deleteSessionsByUser(userId)
  log.debug('Removing user record', { userId })
  userModel.deleteUser(userId)
  logActivity({ userId, action: 'ACCOUNT_DELETED', ip })
  log.info('Account deleted successfully', { userId })
  return { success: true }
}

module.exports = { deleteAccount }
