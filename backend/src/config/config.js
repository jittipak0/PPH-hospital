const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const ensureValue = (value, fallback) => {
  if (value === undefined || value === null || value === '') {
    if (fallback === undefined) {
      throw new Error('Missing required environment configuration');
    }
    return fallback;
  }
  return value;
};

const config = {
  port: parseInt(process.env.PORT, 10) || 4000,
  dbUrl: ensureValue(process.env.DB_URL, 'sqlite://./data/database.sqlite'),
  jwtSecret: ensureValue(process.env.JWT_SECRET, null),
  refreshTokenSecret: ensureValue(process.env.REFRESH_TOKEN_SECRET, null),
  tokenExpiry: ensureValue(process.env.TOKEN_EXPIRY, '15m'),
  refreshTokenExpiry: ensureValue(process.env.REFRESH_TOKEN_EXPIRY, '7d'),
  csrfSecret: ensureValue(process.env.CSRF_SECRET, 'csrf-secret'),
};

const parseSqlitePath = (databaseUrl) => {
  if (!databaseUrl.startsWith('sqlite://')) {
    throw new Error('Only sqlite URLs are supported in this starter project');
  }
  const relativePath = databaseUrl.replace('sqlite://', '');
  return path.resolve(process.cwd(), relativePath);
};

config.sqlitePath = parseSqlitePath(config.dbUrl);

module.exports = config;
