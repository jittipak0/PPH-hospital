const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const sessionModel = require('../models/sessionModel')
const { logActivity } = require('../utils/logger')

const deleteAccount = async ({ userId, password, ip }) => {
  const user = userModel.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    const error = new Error('Password confirmation failed')
    error.status = 401
    throw error
  }

  sessionModel.deleteSessionsByUser(userId)
  userModel.deleteUser(userId)
  logActivity({ userId, action: 'ACCOUNT_DELETED', ip })
  return { success: true }
}

module.exports = { deleteAccount }
