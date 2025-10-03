const userModel = require('../models/userModel')
const sessionModel = require('../models/sessionModel')
const personnelModel = require('../models/personnelModel')
const { generateAccessToken, generateRefreshToken } = require('../utils/token')
const { logActivity } = require('../utils/logger')
const { baseLogger } = require('../utils/debugLogger')

const serviceLogger = baseLogger.child({ service: 'authService' })

const resolveLogger = (logger, operation) => {
  if (logger && typeof logger.child === 'function') {
    return logger.child({ service: 'authService', operation })
  }
  return serviceLogger.child({ operation })
}

const login = async ({ username, password, acceptPolicies = false, ip, logger }) => {
  const log = resolveLogger(logger, 'login')
  log.debug('Authenticating user with personnel system', { username, acceptPolicies })
  let personnel
  try {
    personnel = await personnelModel.authenticate({ username, password })
  } catch (error) {
    log.error('Failed to authenticate against personnel database', { error })
    const err = new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลบุคลากรได้')
    err.status = 503
    throw err
  }

  if (!personnel) {
    log.warn('Personnel credentials invalid', { username })
    const error = new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง')
    error.status = 401
    throw error
  }

  log.debug('Synchronizing personnel user to local database', { username: personnel.username })
  const syncedUser = userModel.upsertPersonnelUser({
    username: personnel.username || username,
    cid: personnel.cid,
    fullName: personnel.fullName,
    department: personnel.department,
    role: personnel.role
  })

  if (!syncedUser.acceptedPolicies) {
    if (!acceptPolicies) {
      log.warn('User has not accepted policies', { userId: syncedUser.id })
      const error = new Error('จำเป็นต้องยอมรับนโยบายความเป็นส่วนตัวก่อนเข้าใช้งาน')
      error.status = 412
      error.code = 'POLICY_ACCEPTANCE_REQUIRED'
      throw error
    }
    log.info('User accepting privacy policies', { userId: syncedUser.id })
    userModel.acceptPolicies(syncedUser.id)
  }

  log.debug('Updating user last login timestamp', { userId: syncedUser.id })
  userModel.updateLastLogin(syncedUser.id)
  const hydrated = userModel.findById(syncedUser.id)
  const accessToken = generateAccessToken(hydrated)
  const { token: refreshToken, hashed, expiresAt } = generateRefreshToken()
  log.debug('Creating new session for user', { userId: hydrated.id, sessionExpiresAt: expiresAt })
  sessionModel.createSession({ userId: hydrated.id, refreshTokenHash: hashed, expiresAt })

  logActivity({ userId: hydrated.id, action: 'LOGIN', ip })

  log.info('User login workflow completed', { userId: hydrated.id })

  return {
    accessToken,
    refreshToken,
    user: formatUserPayload(hydrated)
  }
}

const refreshTokens = ({ refreshToken, ip, logger }) => {
  const log = resolveLogger(logger, 'refreshTokens')
  log.debug('Refreshing tokens for session')
  const session = sessionModel.findSessionByToken(refreshToken)
  if (!session) {
    log.warn('Refresh token not found in persistence')
    const error = new Error('Refresh token not found')
    error.status = 401
    throw error
  }

  if (new Date(session.expiresAt) < new Date()) {
    log.warn('Refresh token expired', { sessionId: session.id })
    sessionModel.deleteSessionByToken(refreshToken)
    const error = new Error('Refresh token expired')
    error.status = 401
    throw error
  }

  const user = userModel.findById(session.userId)
  if (!user) {
    log.warn('User associated with refresh token no longer exists', { sessionId: session.id })
    sessionModel.deleteSessionByToken(refreshToken)
    const error = new Error('User associated with refresh token no longer exists')
    error.status = 401
    throw error
  }

  // Rotate refresh tokens to prevent replay attacks.
  log.debug('Rotating refresh token', { sessionId: session.id, userId: user.id })
  sessionModel.deleteSessionByToken(refreshToken)
  const { token: newToken, hashed, expiresAt } = generateRefreshToken()
  sessionModel.createSession({ userId: user.id, refreshTokenHash: hashed, expiresAt })

  const accessToken = generateAccessToken(user)
  logActivity({ userId: user.id, action: 'REFRESH', ip })

  log.info('Issued new tokens for user', { userId: user.id })

  return {
    accessToken,
    refreshToken: newToken,
    user: formatUserPayload(user)
  }
}

const logout = ({ refreshToken, userId, ip, logger }) => {
  const log = resolveLogger(logger, 'logout')
  log.debug('Logging out session', { hasUser: Boolean(userId) })
  sessionModel.deleteSessionByToken(refreshToken)
  if (userId) {
    logActivity({ userId, action: 'LOGOUT', ip })
  }
  log.info('Session invalidated successfully', { userId })
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
