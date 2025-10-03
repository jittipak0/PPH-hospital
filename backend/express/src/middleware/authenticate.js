const { verifyAccessToken } = require('../utils/token')
const userModel = require('../models/userModel')
const { logActivity } = require('../utils/logger')

const authenticate = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    req.log?.warn('Missing or invalid authorization header')
    return res.status(401).json({ message: 'Authentication required' })
  }

  const token = header.split(' ')[1]

  try {
    req.log?.debug('Verifying access token')
    const payload = verifyAccessToken(token)
    req.log?.debug('Access token verified', { subject: payload.sub })
    const user = userModel.findById(payload.sub)
    if (!user) {
      req.log?.warn('Access token subject not found', { subject: payload.sub })
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      acceptedPolicies: Boolean(user.acceptedPolicies),
      cid: user.cid ?? null,
      fullName: user.fullName ?? user.username,
      department: user.department ?? null,
      lastLoginAt: user.lastLoginAt ?? null
    }

    req.log?.setContext({ userId: req.user.id, userRole: req.user.role })
    req.log?.debug('Request authenticated successfully', {
      userId: req.user.id,
      role: req.user.role
    })
    logActivity({ userId: user.id, action: 'ACCESS', ip: req.ip })
    next()
  } catch (error) {
    req.log?.error('Access token verification failed', { error })
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authenticate
