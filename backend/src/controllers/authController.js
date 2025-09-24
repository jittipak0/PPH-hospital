const bcrypt = require('bcryptjs');
const { z } = require('zod');
const config = require('../config/config');
const userModel = require('../models/userModel');
const sessionModel = require('../models/sessionModel');
const { generateAccessToken, generateRefreshToken, getRefreshTokenExpiryDate } = require('../utils/token');
const { sanitizeValue } = require('../utils/sanitizer');
const { logAudit } = require('../utils/logger');

const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8),
  acceptPrivacy: z.boolean().optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

const login = (req, res) => {
  const payload = loginSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: 'Invalid credentials', issues: payload.error.errors });
  }

  const { username, password, acceptPrivacy } = sanitizeValue(payload.data);
  const user = userModel.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const passwordMatches = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  if (!user.acceptedPrivacy) {
    if (!acceptPrivacy) {
      return res.status(403).json({ message: 'Privacy policy must be accepted' });
    }
    userModel.setPrivacyConsent(user.id, true);
    user.acceptedPrivacy = 1;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  const refreshExpiresAt = getRefreshTokenExpiryDate();

  sessionModel.createSession({
    userId: user.id,
    refreshToken,
    userAgent: req.get('user-agent'),
    ipAddress: req.ip,
    expiresAt: refreshExpiresAt.toISOString(),
  });

  logAudit({ userId: user.id, action: 'LOGIN', ipAddress: req.ip });

  return res.json({
    accessToken,
    refreshToken,
    expiresIn: config.tokenExpiry,
    refreshTokenExpiresAt: refreshExpiresAt.toISOString(),
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      acceptedPrivacy: true,
    },
  });
};

const refresh = (req, res) => {
  const payload = refreshSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: 'Refresh token required', issues: payload.error.errors });
  }

  const { refreshToken } = payload.data;
  const session = sessionModel.findByRefreshToken(refreshToken);
  if (!session) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  if (new Date(session.expiresAt) < new Date()) {
    sessionModel.deleteById(session.id);
    return res.status(401).json({ message: 'Refresh token expired' });
  }

  const user = userModel.findById(session.userId);
  if (!user) {
    sessionModel.deleteById(session.id);
    return res.status(401).json({ message: 'User not found' });
  }

  const newAccessToken = generateAccessToken(user);
  const newRefreshToken = generateRefreshToken();
  const refreshExpiresAt = getRefreshTokenExpiryDate();

  sessionModel.deleteById(session.id);
  sessionModel.createSession({
    userId: user.id,
    refreshToken: newRefreshToken,
    userAgent: req.get('user-agent'),
    ipAddress: req.ip,
    expiresAt: refreshExpiresAt.toISOString(),
  });

  logAudit({ userId: user.id, action: 'REFRESH_TOKEN', ipAddress: req.ip });

  return res.json({
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    refreshTokenExpiresAt: refreshExpiresAt.toISOString(),
  });
};

const logout = (req, res) => {
  const payload = refreshSchema.safeParse(req.body);
  if (!payload.success) {
    return res.status(400).json({ message: 'Refresh token required', issues: payload.error.errors });
  }

  const { refreshToken } = payload.data;
  const session = sessionModel.findByRefreshToken(refreshToken);
  if (session) {
    sessionModel.deleteById(session.id);
    logAudit({ userId: session.userId, action: 'LOGOUT', ipAddress: req.ip });
  }
  return res.status(204).send();
};

module.exports = {
  login,
  refresh,
  logout,
};
