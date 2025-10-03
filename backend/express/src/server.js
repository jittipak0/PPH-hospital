const app = require('./app')
const env = require('./config/env')
const { baseLogger } = require('./utils/debugLogger')

const port = env.port

app.listen(port, () => {
  baseLogger.info('Secure hospital API listening', { port })
})
