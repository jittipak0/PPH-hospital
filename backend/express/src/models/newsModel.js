const { v4: uuidv4 } = require('uuid')
const db = require('../config/db')
const { baseLogger } = require('../utils/debugLogger')

const logger = baseLogger.child({ model: 'newsModel' })

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
  logger.debug('Fetching all news entries')
  const rows = db
    .prepare(
      'SELECT id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder ' +
        'FROM news ' +
        'ORDER BY publishedAt DESC'
    )
    .all()
  const mapped = rows.map(mapNewsRow)
  logger.debug('News entries fetched', { count: mapped.length })
  return mapped
}

const listFeaturedNews = () => {
  logger.debug('Fetching featured news entries')
  const rows = db
    .prepare(
      'SELECT id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder ' +
        'FROM news ' +
        'WHERE isFeatured = 1 ' +
        'ORDER BY displayOrder ASC, publishedAt DESC'
    )
    .all()
  const mapped = rows.map(mapNewsRow)
  logger.debug('Featured news entries fetched', { count: mapped.length })
  return mapped
}

const getNewsById = (id) => {
  logger.debug('Fetching news entry by id', { id })
  const row = db
    .prepare(
      'SELECT id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder ' +
        'FROM news ' +
        'WHERE id = ?'
    )
    .get(id)
  const mapped = row ? mapNewsRow(row) : null
  if (!mapped) {
    logger.debug('No news entry found with id', { id })
  }
  return mapped
}

const createNews = ({ title, summary, content, imageUrl, publishedAt, isFeatured = false, displayOrder = 0 }) => {
  logger.debug('Creating news entry', { title, isFeatured, displayOrder })
  const id = uuidv4()
  const publishedValue = publishedAt ?? new Date().toISOString()
  db.prepare(
    'INSERT INTO news (id, title, summary, content, imageUrl, publishedAt, isFeatured, displayOrder) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, title, summary, content, imageUrl, publishedValue, isFeatured ? 1 : 0, displayOrder)
  logger.debug('News entry created', { id })
  return getNewsById(id)
}

const updateNews = (id, updates) => {
  logger.debug('Updating news entry', { id, fields: Object.keys(updates || {}) })
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
    logger.debug('No fields provided for news update', { id })
    return getNewsById(id)
  }

  const setClause = fields.join(', ')
  values.push(id)
  db.prepare('UPDATE news SET ' + setClause + ' WHERE id = ?').run(...values)
  logger.debug('News entry updated in database', { id })
  return getNewsById(id)
}

const deleteNews = (id) => {
  logger.debug('Deleting news entry', { id })
  db.prepare('DELETE FROM news WHERE id = ?').run(id)
}

module.exports = { listNews, listFeaturedNews, getNewsById, createNews, updateNews, deleteNews }
