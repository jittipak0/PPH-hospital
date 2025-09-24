const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const db = require('../config/db')

const createSession = ({ userId, refreshTokenHash, expiresAt }) => {
  const id = uuidv4()
  const createdAt = new Date().toISOString()
  db.prepare('INSERT INTO sessions (id, userId, refreshTokenHash, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?)')
    .run(id, userId, refreshTokenHash, expiresAt, createdAt)
  return { id, userId, expiresAt, createdAt }
}

const findSessionByToken = (refreshToken) => {
  const sessions = db.prepare('SELECT * FROM sessions').all()
  for (const session of sessions) {
    if (bcrypt.compareSync(refreshToken, session.refreshTokenHash)) {
      return session
    }
  }
  return null
}

const deleteSessionByToken = (refreshToken) => {
  const sessions = db.prepare('SELECT * FROM sessions').all()
  for (const session of sessions) {
    if (bcrypt.compareSync(refreshToken, session.refreshTokenHash)) {
      db.prepare('DELETE FROM sessions WHERE id = ?').run(session.id)
      return true
    }
  }
  return false
}

const deleteSessionsByUser = (userId) => {
  db.prepare('DELETE FROM sessions WHERE userId = ?').run(userId)
}

module.exports = {
  createSession,
  findSessionByToken,
  deleteSessionByToken,
  deleteSessionsByUser
}
