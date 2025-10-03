const { randomUUID } = require('crypto')
const { createLogger } = require('../utils/debugLogger')

const requestLogger = (req, res, next) => {
  const requestId = randomUUID()
  const logger = createLogger({ requestId, method: req.method, path: req.originalUrl, ip: req.ip })
  const startedAt = process.hrtime.bigint()

  req.requestId = requestId
  req.log = logger
  res.locals = res.locals || {}

  const logResponse = (event) => {
    const durationNs = process.hrtime.bigint() - startedAt
    const durationMs = Number(durationNs) / 1e6
    const responsePayload = res.locals.__responseBody
    logger.debug('Request lifecycle event', {
      event,
      statusCode: res.statusCode,
      durationMs,
      contentLength: res.get('Content-Length') || null,
      response: responsePayload
    })
  }

  logger.debug('Incoming request received', {
    headers: req.headers,
    query: req.query,
    body: req.body
  })

  const originalJson = res.json.bind(res)
  res.json = (body) => {
    res.locals.__responseBody = body
    logger.debug('Preparing JSON response', { body })
    return originalJson(body)
  }

  const originalSend = res.send.bind(res)
  res.send = function sendWithLog(body) {
    res.locals.__responseBody = body
    logger.debug('Preparing response payload', { body })
    return originalSend(body)
  }

  res.on('finish', () => logResponse('finish'))
  res.on('close', () => logResponse('close'))
  req.on('aborted', () => {
    logger.warn('Request aborted by client')
  })

  next()
}

module.exports = requestLogger
