const env = require('../config/env')
const { parseDuration, addDurationToNow } = require('../utils/time')
const rememberTokenModel = require('../models/rememberTokenModel')
const userModel = require('../models/userModel')

let rememberCookieMaxAge

const getRememberCookieMaxAge = () => {
  if (!rememberCookieMaxAge) {
    rememberCookieMaxAge = parseDuration(env.rememberTokenExpiry)
  }
  return rememberCookieMaxAge
}

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: true
}

const setRememberCookie = (res, name, token) => {
  res.cookie(name, token, {
    ...baseCookieOptions,
    maxAge: getRememberCookieMaxAge()
  })
}

const clearRememberCookie = (res, name) => {
  res.clearCookie(name, baseCookieOptions)
}

const rememberMe = (req, res, next) => {
  try {
    const cookieName = env.rememberTokenCookieName
    const token = req.cookies?.[cookieName]
    if (!token) {
      return next()
    }

    const record = rememberTokenModel.findByToken(token)
    if (!record) {
      clearRememberCookie(res, cookieName)
      return next()
    }

    if (new Date(record.expiresAt) <= new Date()) {
      rememberTokenModel.deleteById(record.id)
      clearRememberCookie(res, cookieName)
      return next()
    }

    const user = userModel.findById(record.userId)
    if (!user) {
      rememberTokenModel.deleteById(record.id)
      clearRememberCookie(res, cookieName)
      return next()
    }

    if (!req.user) {
      req.user = {
        id: user.id,
        username: user.username,
        role: user.role,
        acceptedPolicies: Boolean(user.acceptedPolicies)
      }
    }

    const rotationExpiresAt = addDurationToNow(env.rememberTokenExpiry)
    const rotated = rememberTokenModel.rotateToken(record.id, rotationExpiresAt)
    setRememberCookie(res, cookieName, rotated.token)

    return next()
  } catch (error) {
    return next(error)
  }
}

module.exports = rememberMe
