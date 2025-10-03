const fs = require('fs')
const path = require('path')
const util = require('util')

const logDirectory = path.resolve(__dirname, '../../logs')
fs.mkdirSync(logDirectory, { recursive: true })

const debugLogFilePath = path.join(logDirectory, 'debug.log')
const consoleLevels = {
  TRACE: 'debug',
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
}

const levelWeights = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50
}

const envLogLevel = (process.env.LOG_LEVEL || 'DEBUG').toUpperCase()
const minimumLevel = levelWeights[envLogLevel] ? envLogLevel : 'DEBUG'
const minimumWeight = levelWeights[minimumLevel]

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'cookie', 'secret', 'pass', 'session']

const normalizeValue = (value, seen = new WeakSet()) => {
  if (value === null || value === undefined) {
    return value
  }
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    }
  }
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (Buffer.isBuffer(value)) {
    return value.toString('base64')
  }
  if (typeof value === 'bigint') {
    return value.toString()
  }
  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`
  }
  if (typeof value !== 'object') {
    return value
  }
  if (seen.has(value)) {
    return '[Circular]'
  }
  seen.add(value)
  if (Array.isArray(value)) {
    return value.map((item) => normalizeValue(item, seen))
  }
  if (value instanceof Map) {
    const obj = {}
    for (const [key, val] of value.entries()) {
      obj[key] = normalizeValue(val, seen)
    }
    return obj
  }
  if (value instanceof Set) {
    return Array.from(value.values()).map((item) => normalizeValue(item, seen))
  }
  const normalized = {}
  for (const [key, val] of Object.entries(value)) {
    normalized[key] = normalizeValue(val, seen)
  }
  return normalized
}

const maskSensitive = (input) => {
  if (input === null || input === undefined) {
    return input
  }
  if (typeof input !== 'object') {
    return input
  }
  if (Array.isArray(input)) {
    return input.map((item) => maskSensitive(item))
  }
  const masked = {}
  for (const [key, value] of Object.entries(input)) {
    const lowered = key.toLowerCase()
    if (SENSITIVE_KEYS.some((sensitive) => lowered.includes(sensitive))) {
      masked[key] = '[REDACTED]'
    } else {
      masked[key] = maskSensitive(value)
    }
  }
  return masked
}

const safeSerialize = (value) => {
  try {
    return JSON.stringify(value)
  } catch (error) {
    return JSON.stringify({ error: 'Unable to serialize log payload', detail: error.message })
  }
}

const shouldLog = (level) => {
  const weight = levelWeights[level]
  return weight >= minimumWeight
}

const writeToFile = (entry) => {
  const line = safeSerialize(entry) + '\n'
  fs.appendFile(debugLogFilePath, line, (error) => {
    if (error) {
      console.error('Failed to write debug log:', error)
    }
  })
}

const logInternal = (level, message, data, context) => {
  if (!shouldLog(level)) {
    return
  }
  const baseEntry = {
    timestamp: new Date().toISOString(),
    level,
    message
  }
  if (context && Object.keys(context).length > 0) {
    baseEntry.context = context
  }
  if (data !== undefined) {
    baseEntry.data = data
  }
  writeToFile(baseEntry)
  const consoleMethod = console[consoleLevels[level]] || console.log
  const parts = [`[${baseEntry.timestamp}]`, `[${level}]`, message]
  if (baseEntry.context) {
    parts.push(util.inspect(baseEntry.context, { depth: 4, breakLength: Infinity }))
  }
  if (data !== undefined) {
    parts.push(util.inspect(data, { depth: 4, breakLength: Infinity }))
  }
  consoleMethod(parts.join(' '))
}

const createLogger = (initialContext = {}) => {
  const context = maskSensitive(normalizeValue(initialContext)) || {}
  const logger = {
    setContext: (updates = {}) => {
      Object.assign(context, maskSensitive(normalizeValue(updates)) || {})
      return logger
    },
    child: (childContext = {}) => {
      return createLogger({ ...context, ...maskSensitive(normalizeValue(childContext)) })
    },
    log: (level, message, data) => {
      const normalizedData = data !== undefined ? maskSensitive(normalizeValue(data)) : undefined
      logInternal(level, message, normalizedData, context)
    },
    trace: (message, data) => logger.log('TRACE', message, data),
    debug: (message, data) => logger.log('DEBUG', message, data),
    info: (message, data) => logger.log('INFO', message, data),
    warn: (message, data) => logger.log('WARN', message, data),
    error: (message, data) => logger.log('ERROR', message, data)
  }
  return logger
}

const baseLogger = createLogger({ component: 'express-backend' })

module.exports = {
  createLogger,
  baseLogger,
  debugLogFilePath
}
