const opn = require('better-opn')
const args = require('minimist')(process.argv.slice(2));

const WebJoystick = require('./webJoystick')
const WebLeds = require('./webLeds')

const { DEFAULT_PORT } = require('./constants')
const PORT = args['port'] || DEFAULT_PORT

try {
  if (!args['file']) {
    throw Error('Missing application entry file from arguments')
  }

  const app = require(args['file'])

  if (!app) {
    throw Error('Could not import from application entry file')
  }

  if (typeof app !== 'function') {
    throw Error('Application entry is not a function')
  }

  const server = require('./server')
  const io = require('socket.io')(server)

  if (args['launch']) {
    opn(`http://localhost:${PORT}`)
  }

  io.on('connection', socket => {
    app(WebJoystick(socket), WebLeds(socket))
    
    console.log('Sense HAT web emulator started!')
  })
} catch (error) {
  console.error(error)
}
