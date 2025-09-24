const app = require('./app')
const env = require('./config/env')

const port = env.port

app.listen(port, () => {
  console.log(`Secure hospital API listening on port ${port}`)
})
