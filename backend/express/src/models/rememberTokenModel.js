const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const db = require('../config/db')

const HASH_ROUNDS = 12

const createToken = ({ userId, expiresAt }) => {
  const id = uuidv4()
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = bcrypt.hashSync(token, HASH_ROUNDS)
  const timestamp = new Date().toISOString()
  db.prepare(
    'INSERT INTO remember_tokens (id, userId, tokenHash, expiresAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, userId, tokenHash, expiresAt, timestamp, timestamp)

  return { id, token, expiresAt, createdAt: timestamp }
}

const findByToken = (token) => {
  const tokens = db.prepare('SELECT * FROM remember_tokens').all()
  for (const record of tokens) {
    if (bcrypt.compareSync(token, record.tokenHash)) {
      return record
    }
  }
  return null
}

const deleteByToken = (token) => {
  const tokens = db.prepare('SELECT * FROM remember_tokens').all()
  for (const record of tokens) {
    if (bcrypt.compareSync(token, record.tokenHash)) {
      db.prepare('DELETE FROM remember_tokens WHERE id = ?').run(record.id)
      return true
    }
  }
  return false
}

const deleteById = (id) => {
  db.prepare('DELETE FROM remember_tokens WHERE id = ?').run(id)
}

const deleteByUserId = (userId) => {
  db.prepare('DELETE FROM remember_tokens WHERE userId = ?').run(userId)
}

const rotateToken = (id, expiresAt) => {
  const token = crypto.randomBytes(32).toString('hex')
  const tokenHash = bcrypt.hashSync(token, HASH_ROUNDS)
  const timestamp = new Date().toISOString()
  db.prepare('UPDATE remember_tokens SET tokenHash = ?, expiresAt = ?, updatedAt = ? WHERE id = ?').run(
    tokenHash,
    expiresAt,
    timestamp,
    id
  )
  return { token, expiresAt }
}

module.exports = {
  createToken,
  findByToken,
  deleteByToken,
  deleteById,
  deleteByUserId,
  rotateToken
}
