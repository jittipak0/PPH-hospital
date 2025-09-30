const newsModel = require('../models/newsModel')
const auditLogModel = require('../models/auditLogModel')

const listPublicNews = (_req, res) => {
  const news = newsModel.listNews()
  res.json({ news })
}

const listFeaturedNews = (_req, res) => {
  const news = newsModel.listFeaturedNews()
  res.json({ news })
}

const createNews = (req, res) => {
  const payload = req.validatedBody
  const news = newsModel.createNews(payload)
  auditLogModel.createLog({
    userId: req.user?.id ?? null,
    action: 'created news ' + news.id,
    ip: req.ip ?? null
  })
  res.status(201).json({ news })
}

const updateNews = (req, res) => {
  const { id } = req.params
  const existing = newsModel.getNewsById(id)
  if (!existing) {
    return res.status(404).json({ message: 'ไม่พบข้อมูลข่าวประชาสัมพันธ์' })
  }
  const payload = req.validatedBody
  const news = newsModel.updateNews(id, payload)
  auditLogModel.createLog({
    userId: req.user?.id ?? null,
    action: 'updated news ' + id,
    ip: req.ip ?? null
  })
  res.json({ news })
}

const deleteNews = (req, res) => {
  const { id } = req.params
  const existing = newsModel.getNewsById(id)
  if (!existing) {
    return res.status(404).json({ message: 'ไม่พบข้อมูลข่าวประชาสัมพันธ์' })
  }
  newsModel.deleteNews(id)
  auditLogModel.createLog({
    userId: req.user?.id ?? null,
    action: 'deleted news ' + id,
    ip: req.ip ?? null
  })
  res.status(204).send()
}

module.exports = { listPublicNews, listFeaturedNews, createNews, updateNews, deleteNews }
