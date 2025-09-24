const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const sessionModel = require('../models/sessionModel')
const { logActivity } = require('../utils/logger')

const createUser = async ({ username, password, role, actorId, ip }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const created = userModel.createUser({ username, password: hashedPassword, role, acceptedPolicies: 0 })
  logActivity({ userId: actorId, action: `CREATE_USER:${created.id}`, ip })
  return created
}

const updateUser = async ({ id, updates, actorId, ip }) => {
  const payload = { ...updates }
  if (updates.password) {
    payload.password = await bcrypt.hash(updates.password, 10)
  }
  if (typeof updates.acceptedPolicies === 'boolean') {
    payload.acceptedPolicies = updates.acceptedPolicies ? 1 : 0
  }
  const updated = userModel.updateUser(id, payload)
  if (updated) {
    logActivity({ userId: actorId, action: `UPDATE_USER:${id}`, ip })
  }
  return updated
}

const deleteUser = ({ id, actorId, ip }) => {
  sessionModel.deleteSessionsByUser(id)
  const result = userModel.deleteUser(id)
  logActivity({ userId: actorId, action: `DELETE_USER:${id}`, ip })
  return result
}

module.exports = { createUser, updateUser, deleteUser }
