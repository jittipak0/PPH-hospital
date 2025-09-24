const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const env = require('../config/env')
const { addDurationToNow } = require('./time')

/**
 * Generate a signed JWT with role-based claims.
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      username: user.username
    },
    env.jwtSecret,
    {
      expiresIn: env.tokenExpiry
    }
  )
}

/**
 * Create a refresh token (stored hashed) that expires according to configuration.
 */
const generateRefreshToken = () => {
  const token = `${uuidv4()}${uuidv4()}`
  const hashed = bcrypt.hashSync(token, 10)
  const expiresAt = addDurationToNow(env.refreshTokenExpiry)
  return { token, hashed, expiresAt }
}

const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtSecret)
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken
}
