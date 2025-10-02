const { verifyAccessToken } = require('../utils/token')
const userModel = require('../models/userModel')
const { logActivity } = require('../utils/logger')

const authenticate = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const token = header.split(' ')[1]

  try {
    const payload = verifyAccessToken(token)
    const user = userModel.findById(payload.sub)
    if (!user) {
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

    logActivity({ userId: user.id, action: 'ACCESS', ip: req.ip })
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authenticate
