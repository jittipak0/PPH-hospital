const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ model: 'sessionModel' })

const createSession = ({ userId, refreshTokenHash, expiresAt }) => {
  logger.debug('Creating session', { userId, expiresAt })
  const id = uuidv4()
  const createdAt = new Date().toISOString()
  db.prepare('INSERT INTO sessions (id, userId, refreshTokenHash, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?)')
    .run(id, userId, refreshTokenHash, expiresAt, createdAt)
  logger.debug('Session created', { sessionId: id })
  return { id, userId, expiresAt, createdAt }
}

const findSessionByToken = (refreshToken) => {
  logger.debug('Searching for session by refresh token')
  const sessions = db.prepare('SELECT * FROM sessions').all()
  for (const session of sessions) {
    if (bcrypt.compareSync(refreshToken, session.refreshTokenHash)) {
      logger.debug('Matching session found', { sessionId: session.id, userId: session.userId })
      return session
    }
  }
  logger.debug('No matching session found for refresh token')
  return null
}

const deleteSessionByToken = (refreshToken) => {
  logger.debug('Deleting session by refresh token')
  const sessions = db.prepare('SELECT * FROM sessions').all()
  for (const session of sessions) {
    if (bcrypt.compareSync(refreshToken, session.refreshTokenHash)) {
      logger.debug('Deleting session', { sessionId: session.id })
      db.prepare('DELETE FROM sessions WHERE id = ?').run(session.id)
      return true
    }
  }
  logger.debug('No session deleted for provided refresh token')
  return false
}

const deleteSessionsByUser = (userId) => {
  logger.debug('Deleting sessions for user', { userId })
  db.prepare('DELETE FROM sessions WHERE userId = ?').run(userId)
}

module.exports = {
  createSession,
  findSessionByToken,
  deleteSessionByToken,
  deleteSessionsByUser
}
