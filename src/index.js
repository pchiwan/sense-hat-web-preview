const opn = require('opn')

const WebJoystick = require('./webJoystick')
const WebLeds = require('./webLeds')
const { PORT } = require('./constants')

try {
  if (process.argv.length < 3) {
    throw new Error('Missing application entry file from arguments')
  }

  const app = require(process.argv[2])

  if (!app) {
    throw new Error('Could not import from application entry file')
  }

  if (typeof app !== 'function') {
    throw new Error('Application entry is not a function')
  }

  const server = require('./server')
  const io = require('socket.io')(server)

  opn(`http://localhost:${PORT}`)

  io.on('connection', socket => {
    app(WebJoystick(socket), WebLeds(socket))
    
    console.log('Sense HAT emulation started!')
  })
} catch (e) {
  console.error(e)
}
