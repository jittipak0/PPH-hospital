const path = require('path')
const dotenv = require('dotenv')

// Load environment variables from .env file if available
const envPath = path.resolve(__dirname, '../../.env')
dotenv.config({ path: envPath })

const requiredVariables = ['JWT_SECRET', 'TOKEN_EXPIRY', 'REFRESH_TOKEN_EXPIRY']

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    console.warn(`⚠️  Environment variable ${variable} is not set. Falling back to a safe default for development.`)
  }
}

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  tokenExpiry: process.env.TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  rememberTokenExpiry: process.env.REMEMBER_TOKEN_EXPIRY || '30d',
  rememberTokenCookieName: process.env.REMEMBER_ME_COOKIE_NAME || 'rememberMe',
  dbUrl: process.env.DB_URL || 'sqlite:./src/data/hospital.db'
}
