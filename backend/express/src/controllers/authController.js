const authService = require('../services/authService')
const { parseDuration } = require('../utils/time')
const env = require('../config/env')

const login = async (req, res, next) => {
  try {
    const { username, password, acceptPolicies, rememberMe } = req.validatedBody
    const result = await authService.login({ username, password, acceptPolicies, ip: req.ip })
    const maxAge = parseDuration(env.refreshTokenExpiry)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge
    })
    if (rememberMe && result.user.cid) {
      res.cookie('ccid', result.user.cid, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        path: '/'
      })
    } else {
      res.clearCookie('ccid', { path: '/' })
    }
    return res.json(result)
  } catch (error) {
    if (error.code === 'POLICY_ACCEPTANCE_REQUIRED') {
      return res.status(error.status).json({
        message: error.message,
        code: error.code
      })
    }
    return next(error)
  }
}

const refresh = (req, res, next) => {
  try {
    const { refreshToken } = req.validatedBody
    const result = authService.refreshTokens({ refreshToken, ip: req.ip })
    const maxAge = parseDuration(env.refreshTokenExpiry)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge
    })
    return res.json(result)
  } catch (error) {
    return next(error)
  }
}

const logout = (req, res, next) => {
  try {
    const refreshToken = req.validatedBody?.refreshToken || req.cookies?.refreshToken
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required for logout' })
    }
    const response = authService.logout({ refreshToken, userId: req.user?.id, ip: req.ip })
    res.clearCookie('refreshToken')
    res.clearCookie('ccid', { path: '/' })
    return res.json(response)
  } catch (error) {
    return next(error)
  }
}

module.exports = { login, refresh, logout }
