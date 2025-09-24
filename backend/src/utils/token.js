const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const parseDuration = (value) => {
  const match = value.match(/^(\d+)([smhd])$/i);
  if (!match) {
    throw new Error('Invalid duration format, expected number + s/m/h/d');
  }
  const amount = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  const multipliers = {
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
  };
  return amount * multipliers[unit];
};

const generateAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
      username: user.username,
    },
    config.jwtSecret,
    { expiresIn: config.tokenExpiry }
  );

const generateRefreshToken = () => crypto.randomBytes(40).toString('hex');

const getRefreshTokenExpiryDate = () => {
  const expiresInMs = parseDuration(config.refreshTokenExpiry);
  return new Date(Date.now() + expiresInMs);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiryDate,
  parseDuration,
};
