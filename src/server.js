const path = require('path')
const express = require('express')

const app = express()
const server = require('http').createServer(app)

const PORT = process.env.PORT || 3000

app.use('/dist', express.static(`${path.join(__dirname, '..')}/dist`))
app.use('/assets', express.static(`${__dirname}/assets`))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

/**
 * start listening to connections
 */
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}.`)
})

module.exports = server
