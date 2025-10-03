const newsModel = require('../models/newsModel')

const listNews = (req, res) => {
  const logger = req.log?.child({ controller: 'staffController', action: 'listNews' })
  logger?.debug('Listing staff news')
  const news = newsModel.listNews()
  logger?.info('Staff news listed', { count: news.length })
  res.json({ news })
}

module.exports = { listNews }
