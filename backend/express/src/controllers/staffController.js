const newsModel = require('../models/newsModel')

const listNews = (_req, res) => {
  const news = newsModel.listNews()
  res.json({ news })
}

module.exports = { listNews }
