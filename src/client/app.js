import { h, render } from 'preact'

import Console from './components/console'
import SenseHAT from './components/senseHat'
import { isArrowKey } from './utils'

const App = socket => {
  const handleKeyEvent = event => {
    if (isArrowKey(event.keyCode)) {
      event.preventDefault()
    }

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
}

export default App
