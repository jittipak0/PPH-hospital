const { getDb } = require('../db');

const createLog = ({ userId, action, ipAddress }) => {
  const db = getDb();
  const statement = db.prepare(`
    INSERT INTO audit_logs (user_id, action, ip_address)
    VALUES (?, ?, ?)
  `);
  statement.run(userId || null, action, ipAddress || null);
};

const listLogs = () => {
  const db = getDb();
  return db
    .prepare(
      'SELECT id, user_id as userId, action, ip_address as ipAddress, created_at as createdAt FROM audit_logs ORDER BY created_at DESC'
    )
    .all();
};

module.exports = {
  createLog,
  listLogs,
};
