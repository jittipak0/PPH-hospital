const authService = require('../services/authService')
const { parseDuration } = require('../utils/time')
const env = require('../config/env')

const login = async (req, res, next) => {
  try {
    const { username, password, acceptPolicies, rememberMe } = req.validatedBody
    const result = await authService.login({ username, password, acceptPolicies, rememberMe, ip: req.ip })
    const maxAge = parseDuration(env.refreshTokenExpiry)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge
    })
    if (result.rememberMeToken) {
      const rememberMaxAge = parseDuration(env.rememberTokenExpiry)
      res.cookie(env.rememberTokenCookieName, result.rememberMeToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: rememberMaxAge
      })
    } else {
      res.clearCookie(env.rememberTokenCookieName, {
        httpOnly: true,
        sameSite: 'strict',
        secure: true
      })
    }
    const { rememberMeToken, ...payload } = result
    return res.json(payload)
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
    const rememberToken = req.cookies?.[env.rememberTokenCookieName]
    if (!refreshToken && !rememberToken) {
      return res.status(400).json({ message: 'Refresh or remember-me token required for logout' })
    }
    const response = authService.logout({ refreshToken, rememberToken, userId: req.user?.id, ip: req.ip })
    if (refreshToken) {
      res.clearCookie('refreshToken')
    }
    res.clearCookie(env.rememberTokenCookieName, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true
    })
    return res.json(response)
  } catch (error) {
    return next(error)
  }
}

module.exports = { login, refresh, logout }
