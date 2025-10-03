const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const sessionModel = require('../models/sessionModel')
const { logActivity } = require('../utils/logger')
const { baseLogger } = require('../utils/debugLogger')

const serviceLogger = baseLogger.child({ service: 'userService' })

const resolveLogger = (logger, operation) => {
  if (logger && typeof logger.child === 'function') {
    return logger.child({ service: 'userService', operation })
  }
  return serviceLogger.child({ operation })
}

const createUser = async ({ username, password, role, actorId, ip, logger }) => {
  const log = resolveLogger(logger, 'createUser')
  log.debug('Hashing password for new user', { username })
  const hashedPassword = await bcrypt.hash(password, 10)
  const created = userModel.createUser({ username, password: hashedPassword, role, acceptedPolicies: 0 })
  logActivity({ userId: actorId, action: `CREATE_USER:${created.id}`, ip })
  log.info('Created new user record', { createdUserId: created.id })
  return created
}

const updateUser = async ({ id, updates, actorId, ip, logger }) => {
  const log = resolveLogger(logger, 'updateUser')
  log.debug('Updating user payload', { id })
  const payload = { ...updates }
  if (updates.password) {
    log.debug('Hashing updated password', { id })
    payload.password = await bcrypt.hash(updates.password, 10)
  }
  if (typeof updates.acceptedPolicies === 'boolean') {
    payload.acceptedPolicies = updates.acceptedPolicies ? 1 : 0
  }
  const updated = userModel.updateUser(id, payload)
  if (updated) {
    logActivity({ userId: actorId, action: `UPDATE_USER:${id}`, ip })
    log.info('User updated', { id })
  }
  return updated
}

const deleteUser = ({ id, actorId, ip, logger }) => {
  const log = resolveLogger(logger, 'deleteUser')
  log.debug('Deleting user sessions prior to removal', { id })
  sessionModel.deleteSessionsByUser(id)
  log.debug('Deleting user record', { id })
  const result = userModel.deleteUser(id)
  logActivity({ userId: actorId, action: `DELETE_USER:${id}`, ip })
  log.info('User deleted', { id })
  return result
}

module.exports = { createUser, updateUser, deleteUser }
