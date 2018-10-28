import { h, render } from 'preact'

import Console from './components/console'
import SenseHAT from './components/senseHat'

const socket = window.io()

const handleKeyEvent = event => {
  socket.emit('handleKeyEvent', {
    keyCode: event.keyCode,
    eventType: event.type
  })
}

socket.on('connect', () => {
  document.addEventListener('keydown', handleKeyEvent)
  document.addEventListener('keyup', handleKeyEvent)


  render(
    <SenseHAT socket={socket} />,
    document.getElementById('sense-hat')
  )

  render(
    <Console socket={socket} />,
    document.getElementById('joystick-log')
  )
})

socket.on('disconnect', () => {
  // TODO
})
