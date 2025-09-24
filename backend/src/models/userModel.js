const { getDb } = require('../db');

const createUser = ({ username, passwordHash, role, acceptedPrivacy = 0 }) => {
  const db = getDb();
  const statement = db.prepare(`
    INSERT INTO users (username, password_hash, role, accepted_privacy)
    VALUES (?, ?, ?, ?)
  `);
  const result = statement.run(username, passwordHash, role, acceptedPrivacy);
  return { id: result.lastInsertRowid, username, role, acceptedPrivacy };
};

const findByUsername = (username) => {
  const db = getDb();
  return db
    .prepare('SELECT id, username, password_hash as passwordHash, role, accepted_privacy as acceptedPrivacy FROM users WHERE username = ?')
    .get(username);
};

const findById = (id) => {
  const db = getDb();
  return db
    .prepare('SELECT id, username, password_hash as passwordHash, role, accepted_privacy as acceptedPrivacy FROM users WHERE id = ?')
    .get(id);
};

const listUsers = () => {
  const db = getDb();
  return db
    .prepare('SELECT id, username, role, accepted_privacy as acceptedPrivacy, created_at as createdAt FROM users ORDER BY id ASC')
    .all();
};

const updateUserRole = (id, role) => {
  const db = getDb();
  db.prepare('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(role, id);
  return findById(id);
};

const setPrivacyConsent = (id, accepted) => {
  const db = getDb();
  db.prepare('UPDATE users SET accepted_privacy = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(accepted ? 1 : 0, id);
  return findById(id);
};

const deleteUser = (id) => {
  const db = getDb();
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
};

module.exports = {
  createUser,
  findByUsername,
  findById,
  listUsers,
  updateUserRole,
  setPrivacyConsent,
  deleteUser,
};
