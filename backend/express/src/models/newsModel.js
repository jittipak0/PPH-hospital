const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')

const mapNewsRow = (row) => ({
  id: row.id,
  title: row.title,
  summary: row.summary ?? '',
  content: row.content,
  imageUrl: row.imageUrl ?? '',
  publishedAt: row.publishedAt,
  isFeatured: Boolean(row.isFeatured),
  displayOrder: row.displayOrder ?? 0
})

const listNews = () => {
  const rows = db
    .prepare(
      'SELECT id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder ' +
        'FROM news ' +
        'ORDER BY publishedAt DESC'
    )
    .all()
  return rows.map(mapNewsRow)
}

const listFeaturedNews = () => {
  const rows = db
    .prepare(
      'SELECT id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder ' +
        'FROM news ' +
        'WHERE isFeatured = 1 ' +
        'ORDER BY displayOrder ASC, publishedAt DESC'
    )
    .all()
  return rows.map(mapNewsRow)
}

const getNewsById = (id) => {
  const row = db
    .prepare(
      'SELECT id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder ' +
        'FROM news ' +
        'WHERE id = ?'
    )
    .get(id)
  return row ? mapNewsRow(row) : null
}

const createNews = ({ title, summary, content, imageUrl, publishedAt, isFeatured = false, displayOrder = 0 }) => {
  const id = uuidv4()
  const publishedValue = publishedAt ?? new Date().toISOString()
  db.prepare(
    'INSERT INTO news (id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, title, summary, content, imageUrl, publishedValue, isFeatured ? 1 : 0, displayOrder)
  return getNewsById(id)
}

const updateNews = (id, updates) => {
  const fields = []
  const values = []
  const updatableFields = ['title', 'summary', 'content', 'imageUrl', 'publishedAt', 'isFeatured', 'displayOrder']

  updatableFields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(updates, field)) {
      fields.push(field + ' = ?')
      if (field === 'isFeatured') {
        values.push(updates[field] ? 1 : 0)
      } else {
        values.push(updates[field])
      }
    }
  })

  if (fields.length === 0) {
    return getNewsById(id)
  }

  const setClause = fields.join(', ')
  values.push(id)
  db.prepare('UPDATE news SET ' + setClause + ' WHERE id = ?').run(...values)
  return getNewsById(id)
}

const deleteNews = (id) => {
  db.prepare('DELETE FROM news WHERE id = ?').run(id)
}

module.exports = { listNews, listFeaturedNews, getNewsById, createNews, updateNews, deleteNews }
