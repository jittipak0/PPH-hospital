const config = require('./config/config');
const { initializeDatabase } = require('./db');
const sessionModel = require('./models/sessionModel');
const app = require('./app');

initializeDatabase();

const server = app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${config.port}`);
});

setInterval(() => {
  sessionModel.deleteExpiredSessions();
}, 1000 * 60 * 30);

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('unhandledRejection', (error) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled rejection', error);
});
