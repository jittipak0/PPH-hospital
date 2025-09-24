const db = require('../config/db')

const listNews = () => {
  return db.prepare('SELECT id, title, content, publishedAt FROM news ORDER BY publishedAt DESC').all()
}

module.exports = { listNews }
