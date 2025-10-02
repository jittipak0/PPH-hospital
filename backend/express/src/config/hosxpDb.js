const mysql = require('mysql2/promise')
const env = require('./env')

let pool

const getPool = () => {
  if (pool) {
    return pool
  }

  if (!env.hosxp.database || !env.hosxp.user) {
    throw new Error('HOSxP database connection is not fully configured')
  }

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

  return pool
}

module.exports = { getPool }
