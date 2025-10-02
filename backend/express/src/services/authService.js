const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')
const sessionModel = require('../models/sessionModel')
const rememberTokenModel = require('../models/rememberTokenModel')
const { generateAccessToken, generateRefreshToken } = require('../utils/token')
const { logActivity } = require('../utils/logger')
const { addDurationToNow } = require('../utils/time')
const env = require('../config/env')

const login = async ({ username, password, acceptPolicies = false, rememberMe = false, ip }) => {
  const user = userModel.findByUsername(username)
  if (!user) {
    const error = new Error('Invalid username or password')
    error.status = 401
    throw error
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
  if (!isValidPassword) {
    const error = new Error('Invalid username or password')
    error.status = 401
    throw error
  }

  if (!user.acceptedPolicies) {
    if (!acceptPolicies) {
      const error = new Error('Privacy policy must be accepted before access is granted')
      error.status = 412
      error.code = 'POLICY_ACCEPTANCE_REQUIRED'
      throw error
    }
    userModel.acceptPolicies(user.id)
  }

  const hydrated = userModel.findById(user.id)
  const accessToken = generateAccessToken(hydrated)
  const { token: refreshToken, hashed, expiresAt } = generateRefreshToken()
  sessionModel.createSession({ userId: hydrated.id, refreshTokenHash: hashed, expiresAt })

  let rememberMeToken
  if (rememberMe) {
    const rememberExpiresAt = addDurationToNow(env.rememberTokenExpiry)
    const tokenRecord = rememberTokenModel.createToken({ userId: hydrated.id, expiresAt: rememberExpiresAt })
    rememberMeToken = tokenRecord.token
  }

  logActivity({ userId: hydrated.id, action: 'LOGIN', ip })

  return {
    accessToken,
    refreshToken,
    rememberMeToken,
    user: {
      id: hydrated.id,
      username: hydrated.username,
      role: hydrated.role,
      acceptedPolicies: Boolean(hydrated.acceptedPolicies)
    }
  }
}

const refreshTokens = ({ refreshToken, ip }) => {
  const session = sessionModel.findSessionByToken(refreshToken)
  if (!session) {
    const error = new Error('Refresh token not found')
    error.status = 401
    throw error
  }

  if (new Date(session.expiresAt) < new Date()) {
    sessionModel.deleteSessionByToken(refreshToken)
    const error = new Error('Refresh token expired')
    error.status = 401
    throw error
  }

  const user = userModel.findById(session.userId)
  if (!user) {
    sessionModel.deleteSessionByToken(refreshToken)
    const error = new Error('User associated with refresh token no longer exists')
    error.status = 401
    throw error
  }

  // Rotate refresh tokens to prevent replay attacks.
  sessionModel.deleteSessionByToken(refreshToken)
  const { token: newToken, hashed, expiresAt } = generateRefreshToken()
  sessionModel.createSession({ userId: user.id, refreshTokenHash: hashed, expiresAt })

  const accessToken = generateAccessToken(user)
  logActivity({ userId: user.id, action: 'REFRESH', ip })

  return {
    accessToken,
    refreshToken: newToken,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      acceptedPolicies: Boolean(user.acceptedPolicies)
    }
  }
}

const logout = ({ refreshToken, rememberToken, userId, ip }) => {
  if (refreshToken) {
    sessionModel.deleteSessionByToken(refreshToken)
  }
  if (rememberToken) {
    rememberTokenModel.deleteByToken(rememberToken)
  }
  if (userId) {
    logActivity({ userId, action: 'LOGOUT', ip })
  }
  return { success: true }
}

module.exports = { login, refreshTokens, logout }
