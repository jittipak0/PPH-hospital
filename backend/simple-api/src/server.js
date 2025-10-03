import createApp from './app.js'

const PORT = process.env.PORT || 4000
const app = createApp()

app.listen(PORT, () => {
  console.log(`Simple API listening on http://localhost:${PORT}`)
})
