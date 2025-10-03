const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const { baseLogger } = require('../utils/debugLogger')

// Load environment variables from .env file if available
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

const logger = baseLogger.child({ module: 'env' })
logger.debug('Environment variables loaded', { envPath, envFileExists: fs.existsSync(envPath) })

const requiredVariables = ['JWT_SECRET', 'TOKEN_EXPIRY', 'REFRESH_TOKEN_EXPIRY']

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    logger.warn(`Environment variable ${variable} is not set. Falling back to development default.`)
  }
}

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  tokenExpiry: process.env.TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  dbUrl: process.env.DB_URL || 'sqlite:./src/data/hospital.db',
  hosxp: {
    host: process.env.HOSXP_HOST || 'localhost',
    port: Number(process.env.HOSXP_PORT || 3306),
    user: process.env.HOSXP_USER || '',
    password: process.env.HOSXP_PASSWORD || '',
    database: process.env.HOSXP_DATABASE || '',
    ssl: /^true$/i.test(process.env.HOSXP_SSL || 'false')
  }
}
