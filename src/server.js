const path = require('path')
const express = require('express')
const args = require('minimist')(process.argv.slice(2));

const app = express()
const server = require('http').createServer(app)

const { DEFAULT_PORT } = require('./constants')
const PORT = args['port'] || DEFAULT_PORT

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
