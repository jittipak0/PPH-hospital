const userModel = require('../models/userModel')
const sessionModel = require('../models/sessionModel')
const personnelModel = require('../models/personnelModel')
const { generateAccessToken, generateRefreshToken } = require('../utils/token')
const { logActivity } = require('../utils/logger')

const login = async ({ username, password, acceptPolicies = false, ip }) => {
  let personnel
  try {
    personnel = await personnelModel.authenticate({ username, password })
  } catch (error) {
    console.error('Failed to connect to HOSxP database', error)
    const err = new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลบุคลากรได้')
    err.status = 503
    throw err
  }

  if (!personnel) {
    const error = new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    error.status = 401
    throw error
  }

  const syncedUser = userModel.upsertPersonnelUser({
    username: personnel.username || username,
    cid: personnel.cid,
    fullName: personnel.fullName,
    department: personnel.department,
    role: personnel.role
  })

  if (!syncedUser.acceptedPolicies) {
    if (!acceptPolicies) {
      const error = new Error('จำเป็นต้องยอมรับนโยบายความเป็นส่วนตัวก่อนเข้าใช้งาน')
      error.status = 412
      error.code = 'POLICY_ACCEPTANCE_REQUIRED'
      throw error
    }
    userModel.acceptPolicies(syncedUser.id)
  }

  userModel.updateLastLogin(syncedUser.id)
  const hydrated = userModel.findById(syncedUser.id)
  const accessToken = generateAccessToken(hydrated)
  const { token: refreshToken, hashed, expiresAt } = generateRefreshToken()
  sessionModel.createSession({ userId: hydrated.id, refreshTokenHash: hashed, expiresAt })

  logActivity({ userId: hydrated.id, action: 'LOGIN', ip })

  return {
    accessToken,
    refreshToken,
    user: formatUserPayload(hydrated)
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
    user: formatUserPayload(user)
  }
}

const logout = ({ refreshToken, userId, ip }) => {
  sessionModel.deleteSessionByToken(refreshToken)
  if (userId) {
    logActivity({ userId, action: 'LOGOUT', ip })
  }
  return { success: true }
}

const formatUserPayload = (user) => ({
  id: user.id,
  username: user.username,
  role: user.role,
  acceptedPolicies: Boolean(user.acceptedPolicies),
  cid: user.cid ?? null,
  fullName: user.fullName ?? user.username,
  department: user.department ?? null,
  lastLoginAt: user.lastLoginAt ?? null
})

module.exports = { login, refreshTokens, logout }
