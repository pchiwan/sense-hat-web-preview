const WebJoystick = require('./webJoystick')
const WebLeds = require('./webLeds')
const app = require('./app')

const server = require('./server')
const io = require('socket.io')(server)

io.on('connection', socket => {
  app(WebJoystick(socket), WebLeds(socket))
})
