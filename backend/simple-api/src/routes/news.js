import { Router } from 'express'
import { toPublicDto } from '../data/news.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({
    news: toPublicDto(),
    lastUpdated: new Date().toISOString()
  })
})

export default router
