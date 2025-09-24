const { getDb } = require('../db');

const listAnnouncements = () => {
  const db = getDb();
  return db
    .prepare('SELECT id, title, content, created_at as createdAt FROM announcements ORDER BY created_at DESC')
    .all();
};

module.exports = {
  listAnnouncements,
};
