import { h, render } from 'preact'

import Matrix from './components/matrix'
import { MATRIX_LENGTH } from './constants'

const WebLeds = () => {
  let matrixRef
  let innerMatrix

  const getMatrixRef = node => {
    matrixRef = node
  }

  render(<Matrix ref={getMatrixRef} />, document.getElementById('matrix'))

  const paint = () => {
    matrixRef.updateMatrix(innerMatrix)
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
