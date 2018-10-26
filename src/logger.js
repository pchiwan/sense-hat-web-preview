import { h, render } from 'preact'

import Console from './components/console'

const Logger = () => {
  let consoleRef

  const getConsoleRef = node => {
    consoleRef = node
  }

  render(
    <Console ref={getConsoleRef} />,
    document.getElementById('joystick-log')
  )

  return {
    log: message => {
      consoleRef.pushItem(message)
    }
  }
}

export const logger = Logger()
