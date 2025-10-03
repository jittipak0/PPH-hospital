const newsModel = require('../models/newsModel')
const auditLogModel = require('../models/auditLogModel')

const listPublicNews = (req, res) => {
  const logger = req.log?.child({ controller: 'newsController', action: 'listPublicNews' })
  logger?.debug('Listing public news')
  const news = newsModel.listNews()
  logger?.info('Public news listed', { count: news.length })
  res.json({ news })
}

const listFeaturedNews = (req, res) => {
  const logger = req.log?.child({ controller: 'newsController', action: 'listFeaturedNews' })
  logger?.debug('Listing featured news')
  const news = newsModel.listFeaturedNews()
  logger?.info('Featured news listed', { count: news.length })
  res.json({ news })
}

const createNews = (req, res) => {
  const logger = req.log?.child({ controller: 'newsController', action: 'createNews' })
  const payload = req.validatedBody
  logger?.debug('Creating news entry', { title: payload.title })
  const news = newsModel.createNews(payload)
  auditLogModel.createLog({
    userId: req.user?.id ?? null,
    action: 'created news ' + news.id,
    ip: req.ip ?? null
  })
  logger?.info('News entry created', { newsId: news.id })
  res.status(201).json({ news })
}

const updateNews = (req, res) => {
  const logger = req.log?.child({ controller: 'newsController', action: 'updateNews' })
  const { id } = req.params
  logger?.debug('Updating news entry', { newsId: id })
  const existing = newsModel.getNewsById(id)
  if (!existing) {
    logger?.warn('Attempted to update missing news entry', { newsId: id })
    return res.status(404).json({ message: 'ไม่พบข้อมูลข่าวประชาสัมพันธ์' })
  }
  const payload = req.validatedBody
  const news = newsModel.updateNews(id, payload)
  auditLogModel.createLog({
    userId: req.user?.id ?? null,
    action: 'updated news ' + id,
    ip: req.ip ?? null
  })
  logger?.info('News entry updated', { newsId: id })
  res.json({ news })
}

const deleteNews = (req, res) => {
  const logger = req.log?.child({ controller: 'newsController', action: 'deleteNews' })
  const { id } = req.params
  logger?.debug('Deleting news entry', { newsId: id })
  const existing = newsModel.getNewsById(id)
  if (!existing) {
    logger?.warn('Attempted to delete missing news entry', { newsId: id })
    return res.status(404).json({ message: 'ไม่พบข้อมูลข่าวประชาสัมพันธ์' })
  }
  newsModel.deleteNews(id)
  auditLogModel.createLog({
    userId: req.user?.id ?? null,
    action: 'deleted news ' + id,
    ip: req.ip ?? null
  })
  logger?.info('News entry deleted', { newsId: id })
  res.status(204).send()
}

module.exports = { listPublicNews, listFeaturedNews, createNews, updateNews, deleteNews }
