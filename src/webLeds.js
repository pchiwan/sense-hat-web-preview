const {
  checkXY,
  getCoord,
  horizontalMirror,
  letterPixels,
  loadImageAsync,
  loadImageSync,
  rgbArray,
  scrollPixels,
  sleep,
  syncCurriedFunction,
  verticalMirror
} = require('./utils')
const {
  BLACK,
  MATRIX_LENGTH,
  MATRIX_SIZE
} = require('./constants')

const ONE_SECOND_IN_MS = 1000
const DEFAULT_SCROLL_SPEED = 0.1
const DEFAULT_FLASH_SPEED = 0.5

const noop = () => {}

const WebLeds = socket => {
  let innerMatrix = Array(MATRIX_LENGTH).fill(BLACK)
  let rotation = 0

  const paint = () => {
    socket.emit('updateMatrix', rotateMatrix(innerMatrix, rotation))
  }

  const rotateMatrix = (matrix, rotation) => {
    const projectedMatrix = []
    for (let y = 0; y < MATRIX_SIZE; y++) {
      for (let x = 0; x < MATRIX_SIZE; x++) {
        projectedMatrix.push(matrix[getCoord(x, y, rotation)])
      }
    }
    return projectedMatrix
  }

  const setMatrixAndPaint = matrix => {
    innerMatrix = matrix
    paint()
  }

  const setPixelAndPaint = (x, y, rgb) => {
    innerMatrix[getCoord(x, y, rotation)] = rgb
    paint()
  }

  const checkAngle = (angle = 0) => {
    if (angle < 0) angle += 360 // negative angle for counterclockwise rotation
    if (!(angle % 90 === 0 && angle >= 0 && angle < 360)) {
      console.error('Rotation must be 0, 90, 180 or 270 degrees')
      return rotation
    }
    return angle
  }

  const clear = (sync = true, r, g, b, callback = noop) => {
    setPixels(sync, Array(MATRIX_LENGTH).fill(rgbArray(r, g, b)), callback)
  }

  const getPixels = (sync = true, callback = noop) => {
    return sync
      ? innerMatrix
      : callback(null, innerMatrix)
  }

  const getPixel = (sync = true, x, y, callback = noop) => {
    try {
      checkXY(x, y)
    } catch (error) {
      return sync
        ? console.error(error.message)
        : callback(error)
    }
  
    return sync
      ? innerMatrix[getCoord(x, y, rotation)]
      : callback(innerMatrix[getCoord(x, y, rotation)])
  }

  const setPixels = (sync = true, matrix, callback = noop) => {
    if (matrix.length !== MATRIX_LENGTH) {
      const errorMessage = `Pixel arrays must have ${MATRIX_LENGTH} elements`
      return sync
        ?  console.error(errorMessage)
        : callback(Error(errorMessage))
    }
    
    return sync
      ? setMatrixAndPaint(matrix)
      : new Promise(resolve => {
        resolve()
        setMatrixAndPaint(matrix)
        callback(null, innerMatrix)
      })
  }

  const setPixel = (sync = true, x, y, r, g, b, callback = noop) => {
    const rgb = rgbArray(r, g, b)

    try {
      checkXY(x, y)
    } catch (error) {
      return sync
        ? console.error(error.messsage)
        : callback(error)
    }

    return sync
      ? setPixelAndPaint(x, y, rgb)
      : new Promise(resolve => {
        resolve()
        setPixelAndPaint(x, y, rgb)
        callback(null, innerMatrix)
      })
  }

  // Sets the LED matrix rotation for viewing, adjust if the Pi is upside
  // down or sideways. 0 is with the Pi HDMI port facing downwards
  const setRotation = (sync = true, angle, redraw = true, callback = noop) => {
    rotation = checkAngle(angle)

    if (!redraw) {
      return callback(null)
    }

    setPixels(sync, innerMatrix, callback)
  }

  // Displays a single text character on the LED matrix using the specified colors
  const showLetter = (sync = true, letter, textColor, backColor, callback = noop) => {
    if (letter.length !== 1) {
      const errorMessage = 'Only one character may be passed into showLetter'
      return sync
        ? console.error(errorMessage)
        : callback(Error(errorMessage))
    }

    const pixels = letterPixels(letter, textColor, backColor)

    // We must rotate the pixel map right through 90 degrees when drawing
    // text, see loadTextAssets
    const previousRotation = rotation
    rotation = (rotation + 90) % 360

    if (sync) {
      setPixels(true, innerMatrix)
      rotation = previousRotation
    } else {
      setPixels(false, pixels, (error) => {
        rotation = previousRotation
        callback(error)
      })
    }
  }

  // Scrolls a string of text across the LED matrix using the specified
  // speed and colors
  const showMessage = (
    sync = true,
    textString,
    scrollSpeed = DEFAULT_SCROLL_SPEED,
    textColor,
    backColor,
    callback = noop
  ) => {
    const pixels = scrollPixels(textString, textColor, backColor)

    // We must rotate the pixel map left through 90 degrees when drawing
    // text, see loadTextAssets
    const previousRotation = rotation
    rotation = (rotation + 90) % 360

    const scrollSync = pixels => {
      if (pixels.length < MATRIX_LENGTH) return
      setPixels(true, pixels.slice(0, MATRIX_LENGTH))
      sleep(scrollSpeed)
      scroll(pixels.slice(MATRIX_SIZE))
    }

    const scroll = pixels => {
      if (pixels.length > MATRIX_LENGTH) {
        setPixels(pixels.slice(0, MATRIX_LENGTH), error => {
          if (error) {
            rotation = previousRotation
            return callback(error)
          }
          setTimeout(scroll, scrollSpeed * ONE_SECOND_IN_MS, pixels.slice(MATRIX_SIZE))
        })
      } else {
        rotation = previousRotation
        return callback(null)
      }
    }

    if (sync) {
      scrollSync(pixels)
      rotation = previousRotation
    } else {
      scroll(pixels)
    }
  }

  const flashMessage = (
    sync = true,
    message,
    flashSpeed = DEFAULT_FLASH_SPEED,
    textColor,
    backColor,
    callback = noop
  ) => {
    const flash = message => {
      if (message.length) {
        showLetter(message[0], textColor, backColor, (error) => {
          if (error) {
            return console.error(error.message)
          }
          setTimeout(flash, flashSpeed * ONE_SECOND_IN_MS, message.slice(1))
        })
      } else {
        return callback(null)
      }
    }

    if (sync) {
      message.split('').forEach(char => {
        showLetter(true, char, textColor, backColor)
        sleep(flashSpeed)
      })
    } else {
      flash(message)
    }
  }

  // Flip LED matrix horizontal
  const flipH = (sync = true, redraw = true, callback = noop) => {
    const flipped = horizontalMirror(innerMatrix)
    
    if (redraw) {
      return setPixels(sync, flipped, callback)
    }
    
    return sync
      ? flipped
      : callback(null, flipped)
  }

  // Flip LED matrix vertical
  const flipV = (sync = true, redraw = true, callback = noop) => {
    const flipped = verticalMirror(innerMatrix)

    if (redraw) {
      return setPixels(sync, flipped, callback)
    }

    return sync
      ? flipped
      : callback(null, flipped)
  }

  const loadImage = (sync = true, filePath, redraw = true, callback = noop) => {
    if (sync) {
      const pixels = loadImageSync(filePath)
      if (redraw) {
        setPixels(true, pixels)
      }
      return pixels
    }

    loadImageAsync(filePath).then(pixels => {
      if (redraw) {
        setPixels(false, pixels, callback)
      } else {
        callback(null, pixels)
      }
    })
  }

  return {
    clear: syncCurriedFunction(false, clear),
    setPixel: syncCurriedFunction(false, setPixel),
    getPixel: syncCurriedFunction(false, getPixel),
    setPixels: syncCurriedFunction(false, setPixels),
    getPixels: syncCurriedFunction(false, getPixels),
    flipH: syncCurriedFunction(false, flipH),
    flipV: syncCurriedFunction(false, flipV),
    setRotation: syncCurriedFunction(false, setRotation),
    showMessage: syncCurriedFunction(false, showMessage),
    flashMessage: syncCurriedFunction(false, flashMessage),
    showLetter: syncCurriedFunction(false, showLetter),
    loadImage: syncCurriedFunction(false, loadImage),
    get rotation () { return rotation },
    set rotation (angle) { setRotation(false, angle) },
    get gamma () {},
    set gamma (arr) {},
    gammaReset: noop,
    get lowLight () {},
    set lowLight (bol) {},
    sync: {
      sleep,
      clear: syncCurriedFunction(true, clear),
      getPixel: syncCurriedFunction(true, getPixel),
      setPixel: syncCurriedFunction(true, setPixel),
      getPixels: syncCurriedFunction(true, getPixels),
      setPixels: syncCurriedFunction(true, setPixels),
      flipH: syncCurriedFunction(true, flipH),
      flipV: syncCurriedFunction(true, flipV),
      setRotation: syncCurriedFunction(true, setRotation),
      showMessage: syncCurriedFunction(true, showMessage),
      flashMessage: syncCurriedFunction(true, flashMessage),
      showLetter: syncCurriedFunction(true, showLetter),
      loadImage: syncCurriedFunction(true, loadImage),
      get rotation () { return rotation },
      set rotation (angle) { setRotation(true, angle, true) },
      get gamma () {},
      set gamma (arr) {},
      gammaReset: noop,
      get lowLight () {},
      set lowLight (bol) {}
    }
  }
}

module.exports = WebLeds
