const jwt = require('jsonwebtoken');
const config = require('../config/config');
const userModel = require('../models/userModel');
const auditLogModel = require('../models/auditLogModel');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '').trim()
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = userModel.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      acceptedPrivacy: Boolean(user.acceptedPrivacy),
    };

    auditLogModel.createLog({
      userId: user.id,
      action: `ACCESS:${req.method} ${req.originalUrl}`,
      ipAddress: req.ip,
    });

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
