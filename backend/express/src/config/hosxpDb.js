const mysql = require('mysql2/promise')
const env = require('./env')
const { baseLogger } = require('../utils/debugLogger')

let pool

const logger = baseLogger.child({ module: 'hosxp' })

const getPool = () => {
  if (pool) {
    logger.trace('Reusing existing HOSxP pool instance')
    return pool
  }

  if (!env.hosxp.database || !env.hosxp.user) {
    logger.error('HOSxP database configuration incomplete', {
      database: env.hosxp.database,
      user: env.hosxp.user
    })
    throw new Error('HOSxP database connection is not fully configured')
  }

  logger.info('Creating HOSxP MySQL pool', {
    host: env.hosxp.host,
    port: env.hosxp.port,
    database: env.hosxp.database
  })
  pool = mysql.createPool({
    host: env.hosxp.host,
    port: env.hosxp.port,
    user: env.hosxp.user,
    password: env.hosxp.password,
    database: env.hosxp.database,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    ssl: env.hosxp.ssl ? { rejectUnauthorized: false } : undefined,
    charset: 'utf8mb4'
  })

  pool.on('connection', () => logger.debug('New connection established to HOSxP database'))
  pool.on('acquire', () => logger.debug('HOSxP connection acquired from pool'))
  pool.on('release', () => logger.debug('HOSxP connection released back to pool'))
  pool.on('enqueue', () => logger.warn('Waiting for available HOSxP connection in pool'))

  return pool
}

module.exports = { getPool }
