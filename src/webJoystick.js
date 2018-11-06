const Logger = require('./logger')
const {
  KEY_TO_JOYSTICK_EVENT,
  KEY_TO_DIRECTION,
  KEY_TO_STRING
} = require('./constants')

const WebJoystick = socket => {
  const logger = Logger(socket)
  const subscribers = {}

  const emitEvent = (joystickEvent, direction) => {
    if (subscribers[joystickEvent]) {
      subscribers[joystickEvent].forEach(handlerFn => handlerFn(direction))
    }
  }

  const handleKeyEvent = ({keyCode, eventType}) => {
    const joystickEvent = KEY_TO_JOYSTICK_EVENT[eventType]
    const direction = KEY_TO_DIRECTION[keyCode]

    if (joystickEvent && direction) {
      emitEvent(joystickEvent, direction)

      if (KEY_TO_STRING[keyCode]) {
        logger.log(`${joystickEvent} ${KEY_TO_STRING[keyCode]}`)
      }
    }
  }

  const addEventHandler = (eventName, handlerFn) => {
    if (!subscribers[eventName]) {
      subscribers[eventName] = []
    }
    subscribers[eventName].push(handlerFn)
  }

  socket.on('handleKeyEvent', handleKeyEvent)

  return {
    on: addEventHandler
  }
}

module.exports = socket => {
  const webJoystick = WebJoystick(socket)

  return {
    getJoystick: () => Promise.resolve(webJoystick),
    sync: {
      getJoystick: () => webJoystick
    }
  }
}
