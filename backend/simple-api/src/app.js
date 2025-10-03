import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import newsRouter from './routes/news.js'
import formsRouter from './routes/forms.js'
import programsRouter from './routes/programs.js'
import { issueToken } from './middleware/csrf.js'

const createApp = () => {
  const app = express()

  app.use(helmet())
  app.use(
    cors({
      origin: true,
      credentials: true
    })
  )
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
  })

  app.get('/api/security/csrf-token', issueToken)
  app.use('/api/news', newsRouter)
  app.use('/api/forms', formsRouter)
  app.use('/api/programs', programsRouter)

  app.use((req, res) => {
    res.status(404).json({ message: 'ไม่พบหน้าที่คุณร้องขอ' })
  })

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).json({ message: 'ระบบขัดข้อง กรุณาลองใหม่อีกครั้ง' })
  })

  return app
}

export default createApp
