const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ model: 'userModel' })

/**
 * Fetch user by username using a parameterized query to mitigate SQL injection.
 */
const findByUsername = (username) => {
  logger.debug('Fetching user by username', { username })
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username)
}

/**
 * Fetch user by id.
 */
const findById = (id) => {
  logger.debug('Fetching user by id', { id })
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id)
}

/**
 * Create a new user account using safe parameter binding.
 */
const createUser = ({
  username,
  password,
  role,
  acceptedPolicies = 0,
  cid = null,
  fullName = null,
  department = null,
  lastLoginAt = null
}) => {
  logger.debug('Creating user record', { username, role })
  const timestamp = new Date().toISOString()
  const id = uuidv4()
  db.prepare(
    `INSERT INTO users (id, username, password, role, acceptedPolicies, cid, fullName, department, lastLoginAt, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    username,
    password,
    role,
    acceptedPolicies ? 1 : 0,
    cid,
    fullName,
    department,
    lastLoginAt,
    timestamp,
    timestamp
  )
  return findById(id)
}

/**
 * Update an existing user. Only provided fields are updated.
 */
const updateUser = (id, updates) => {
  logger.debug('Updating user record', {
    id,
    fields: Object.keys(updates || {}),
    hasPasswordUpdate: Boolean(updates?.password)
  })
  const existing = findById(id)
  if (!existing) {
    logger.warn('Attempted to update missing user', { id })
    return null
  }
  const timestamp = new Date().toISOString()
  const next = {
    username: updates.username ?? existing.username,
    password: updates.password ?? existing.password,
    role: updates.role ?? existing.role,
    acceptedPolicies:
      typeof updates.acceptedPolicies === 'number'
        ? updates.acceptedPolicies
        : existing.acceptedPolicies,
    cid: updates.cid ?? existing.cid,
    fullName: updates.fullName ?? existing.fullName,
    department: updates.department ?? existing.department,
    lastLoginAt: updates.lastLoginAt ?? existing.lastLoginAt
  }
  db.prepare(
    `UPDATE users
     SET username = ?, password = ?, role = ?, acceptedPolicies = ?, cid = ?, fullName = ?, department = ?, lastLoginAt = ?, updatedAt = ?
     WHERE id = ?`
  ).run(
    next.username,
    next.password,
    next.role,
    next.acceptedPolicies,
    next.cid,
    next.fullName,
    next.department,
    next.lastLoginAt,
    timestamp,
    id
  )
  return findById(id)
}

const deleteUser = (id) => {
  logger.debug('Deleting user record', { id })
  return db.prepare('DELETE FROM users WHERE id = ?').run(id)
}

const listUsers = () => {
  logger.debug('Listing all users')
  const users = db
    .prepare(
      `SELECT id, username, role, acceptedPolicies, cid, fullName, department, lastLoginAt, createdAt, updatedAt FROM users`
    )
    .all()
  logger.debug('Users fetched', { count: users.length })
  return users
}

const acceptPolicies = (id) => {
  logger.debug('Marking policies as accepted for user', { id })
  const timestamp = new Date().toISOString()
  db.prepare('UPDATE users SET acceptedPolicies = 1, updatedAt = ? WHERE id = ?').run(timestamp, id)
  return findById(id)
}

const upsertPersonnelUser = ({ username, cid = null, fullName = null, department = null, role = 'staff' }) => {
  logger.debug('Upserting personnel user', { username, role })
  const existing = findByUsername(username)
  const timestamp = new Date().toISOString()
  if (existing) {
    db.prepare(
      `UPDATE users SET role = ?, cid = ?, fullName = ?, department = ?, updatedAt = ? WHERE id = ?`
    ).run(role, cid, fullName, department, timestamp, existing.id)
    return findById(existing.id)
  }

  const placeholderPassword = bcrypt.hashSync(uuidv4(), 10)
  logger.debug('Creating new personnel user placeholder', { username, role })
  return createUser({
    username,
    password: placeholderPassword,
    role,
    acceptedPolicies: 0,
    cid,
    fullName,
    department,
    lastLoginAt: timestamp
  })
}

const updateLastLogin = (id) => {
  logger.debug('Updating last login timestamp', { id })
  const timestamp = new Date().toISOString()
  db.prepare('UPDATE users SET lastLoginAt = ?, updatedAt = ? WHERE id = ?').run(timestamp, timestamp, id)
  return findById(id)
}

module.exports = {
  findByUsername,
  findById,
  createUser,
  updateUser,
  deleteUser,
  listUsers,
  acceptPolicies,
  upsertPersonnelUser,
  updateLastLogin
}
