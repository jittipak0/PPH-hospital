const authService = require('../services/authService')
const { parseDuration } = require('../utils/time')
const env = require('../config/env')

const login = async (req, res, next) => {
  const logger = req.log?.child({ controller: 'authController', action: 'login' })
  try {
    const { username, password, acceptPolicies, rememberMe } = req.validatedBody
    logger?.debug('Processing login request', {
      username,
      acceptPolicies,
      rememberMe
    })
    const result = await authService.login({
      username,
      password,
      acceptPolicies,
      ip: req.ip,
      logger
    })
    logger?.info('Login successful', { userId: result.user.id })
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
    logger?.debug('Login response prepared with cookies', {
      rememberMe,
      hasCid: Boolean(result.user.cid)
    })
    return res.json(result)
  } catch (error) {
    logger?.error('Login failed', { error })
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
  const logger = req.log?.child({ controller: 'authController', action: 'refresh' })
  try {
    const { refreshToken } = req.validatedBody
    logger?.debug('Processing token refresh request')
    const result = authService.refreshTokens({ refreshToken, ip: req.ip, logger })
    logger?.info('Refresh token rotated', { userId: result.user.id })
    const maxAge = parseDuration(env.refreshTokenExpiry)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge
    })
    logger?.debug('Refresh token cookie updated')
    return res.json(result)
  } catch (error) {
    logger?.error('Token refresh failed', { error })
    return next(error)
  }
}

const logout = (req, res, next) => {
  const logger = req.log?.child({ controller: 'authController', action: 'logout' })
  try {
    const refreshToken = req.validatedBody?.refreshToken || req.cookies?.refreshToken
    if (!refreshToken) {
      logger?.warn('Logout attempted without refresh token')
      return res.status(400).json({ message: 'Refresh token required for logout' })
    }
    logger?.debug('Processing logout', { hasUser: Boolean(req.user?.id) })
    const response = authService.logout({ refreshToken, userId: req.user?.id, ip: req.ip, logger })
    res.clearCookie('refreshToken')
    res.clearCookie('ccid', { path: '/' })
    logger?.info('Logout completed', { userId: req.user?.id })
    return res.json(response)
  } catch (error) {
    logger?.error('Logout failed', { error })
    return next(error)
  }
}

module.exports = { login, refresh, logout }
