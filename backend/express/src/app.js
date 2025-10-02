const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const routes = require('./routes')
const sanitizeRequest = require('./middleware/sanitize')
const csrfProtection = require('./middleware/csrf')
const errorHandler = require('./middleware/errorHandler')
const rememberMe = require('./middleware/rememberMe')

const app = express()

app.disable('x-powered-by')
app.use(helmet())
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true
  })
)
app.use(express.json({ limit: '10kb' }))
app.use(cookieParser())
app.use(morgan('combined'))
app.use(rememberMe)
app.use(sanitizeRequest)
app.use(csrfProtection)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', routes)

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

app.use(errorHandler)

module.exports = app
