import { h, render } from 'preact'

import SenseHAT from './components/senseHat'
import { MATRIX_LENGTH } from './constants'

const WebLeds = () => {
  let senseHatRef
  let innerMatrix

  const getSenseHatRef = node => {
    senseHatRef = node
  }

  render(
    <SenseHAT ref={getSenseHatRef} />,
    document.getElementById('sense-hat')
  )

  const paint = () => {
    senseHatRef.updateMatrix(innerMatrix)
  }

  const setPixels = matrix => {
    if (matrix.length !== MATRIX_LENGTH) {
      console.error(`Pixel arrays must have ${MATRIX_LENGTH} elements`)
    }

    innerMatrix = matrix
    paint()
  }

  const setPixel = () => {
    console.log('work in progress')
  }

  const getPixels = () => {
    return innerMatrix
  }

  const showMessage = () => {
    console.log('work in progress')
  }

  return {
    getPixels,
    setPixels,
    setPixel,
    showMessage
  }
}

export default WebLeds()
