const { letterPixels, rgbArray } = require('./utils')
const { MATRIX_LENGTH } = require('./constants')

const WebLeds = socket => {
  let innerMatrix
  let rotation

  const paint = () => {
    socket.emit('updateMatrix', innerMatrix)
  }

  const checkAngle = (angle = 0) => {
    if (angle < 0) angle += 360 // negative angle for counterclockwise rotation
    if (!(angle % 90 === 0 && angle >= 0 && angle < 360)) {
      console.error('Rotation must be 0, 90, 180 or 270 degrees')
      return rotation
    }
    return angle
  }

  const clear = (r, g, b, callback = () => {}) => {
    setPixels(Array(MATRIX_LENGTH).fill(rgbArray(r, g, b)), callback)
  }

  const getPixels = (callback = () => {}) => {
    callback(null, innerMatrix)
    return innerMatrix
  }

  const setPixels = (matrix, callback = () => {}) => {
    if (matrix.length !== MATRIX_LENGTH) {
      console.error(`Pixel arrays must have ${MATRIX_LENGTH} elements`)
    }

    innerMatrix = matrix
    paint()
    callback(null, innerMatrix)
  }

  const setPixel = () => {
    console.log('work in progress')
  }

  // Sets the LED matrix rotation for viewing, adjust if the Pi is upside
  // down or sideways. 0 is with the Pi HDMI port facing downwards
  const setRotation = (r, redraw = true, callback = () => {}) => {
    rotation = checkAngle(r)

    if (!redraw) return callback(null)

    getPixels((error, pixels) => {
      if (error) return callback(error)
      setPixels(pixels, callback)
    })
  }

  // Displays a single text character on the LED matrix using the specified colors
  const showLetter = (letter, textColor, backColor, callback = () => {}) => {
    if (letter.length !== 1) {
      callback(Error('Only one character may be passed into showLetter'))
      return
    }

    const pixels = letterPixels(letter, textColor, backColor)

    // We must rotate the pixel map right through 90 degrees when drawing
    // text, see loadTextAssets
    const previousRotation = rotation
    rotation = (rotation + 90) % 360
    setPixels(pixels, (error) => {
      rotation = previousRotation
      callback(error)
    })
  }

  const showMessage = () => {
    console.log('work in progress')
  }

  const flashMessage = () => {
    console.log('work in progress')
  }

  return {
    clear,
    getPixels,
    setPixels,
    setPixel,
    setRotation,
    showLetter,
    showMessage,
    flashMessage,
    sync: {
      setPixelsSync: setPixels,
      setRotationSync: setRotation,
      showLetterSync: showLetter
    }
  }
}

module.exports = WebLeds
