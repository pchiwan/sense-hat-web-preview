import { logger } from './utils'

import {
  KEY_TO_JOYSTICK_EVENT,
  KEY_TO_DIRECTION,
  KEY_TO_STRING
} from './constants'

const WebJoystick = () => {
  const subscribers = {}

  const emitEvent = (joystickEvent, direction) => {
    if (subscribers[joystickEvent]) {
      subscribers[joystickEvent].forEach(handlerFn => handlerFn(direction))
    }
  }

  const handleKeyEvent = event => {
    const { keyCode } = event
    const joystickEvent = KEY_TO_JOYSTICK_EVENT[event.type]
    emitEvent(joystickEvent, KEY_TO_DIRECTION[keyCode])
    logger.log(`${joystickEvent} ${KEY_TO_STRING[keyCode]}`)
  }

  const on = (eventName, handlerFn) => {
    if (!subscribers[eventName]) {
      subscribers[eventName] = []
    }
    subscribers[eventName].push(handlerFn)
  }

  document.addEventListener('keydown', handleKeyEvent)
  document.addEventListener('keyup', handleKeyEvent)

  return {
    on
  }
}

export default {
  getJoystick: () => {
    return new Promise((resolve) => {
      resolve(WebJoystick())
    })
  }
}
