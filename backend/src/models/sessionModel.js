const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');

const fingerprintToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const createSession = ({ userId, refreshToken, userAgent, ipAddress, expiresAt }) => {
  const db = getDb();
  const refreshTokenHash = bcrypt.hashSync(refreshToken, 10);
  const fingerprint = fingerprintToken(refreshToken);
  const statement = db.prepare(`
    INSERT INTO sessions (user_id, refresh_token_hash, token_fingerprint, user_agent, ip_address, expires_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const result = statement.run(
    userId,
    refreshTokenHash,
    fingerprint,
    userAgent || null,
    ipAddress || null,
    expiresAt
  );
  return { id: result.lastInsertRowid, fingerprint };
};

const findByRefreshToken = (refreshToken) => {
  const db = getDb();
  const fingerprint = fingerprintToken(refreshToken);
  const session = db
    .prepare(
      `SELECT id, user_id as userId, refresh_token_hash as refreshTokenHash, token_fingerprint as tokenFingerprint, user_agent as userAgent, ip_address as ipAddress, expires_at as expiresAt FROM sessions WHERE token_fingerprint = ?`
    )
    .get(fingerprint);
  if (!session) {
    return null;
  }
  const isValid = bcrypt.compareSync(refreshToken, session.refreshTokenHash);
  if (!isValid) {
    return null;
  }
  return session;
};

const deleteById = (id) => {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE id = ?').run(id);
};

const deleteByFingerprint = (fingerprint) => {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE token_fingerprint = ?').run(fingerprint);
};

const deleteByRefreshToken = (refreshToken) => {
  const fingerprint = fingerprintToken(refreshToken);
  deleteByFingerprint(fingerprint);
};

const deleteExpiredSessions = () => {
  const db = getDb();
  db.prepare('DELETE FROM sessions WHERE datetime(expires_at) < datetime("now")').run();
};

module.exports = {
  createSession,
  findByRefreshToken,
  deleteById,
  deleteByFingerprint,
  deleteByRefreshToken,
  deleteExpiredSessions,
  fingerprintToken,
};
