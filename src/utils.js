import { h, render } from 'preact'

const Logger = () => {
  let domElement

  return {
    log: message => {
      domElement = render(
        <p style={{ lineHeight: '24px' }}>{message}</p>,
        document.getElementById('joystick-log'),
        domElement
      )
    }
  }
}

export const logger = Logger()
