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
  curryFunction,
  verticalMirror
} = require('./utils')
const {
  BLACK,
  MATRIX_LENGTH,
  MATRIX_SIZE
} = require('./constants')

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
      ? innerMatrix.slice(0)
      : callback(null, innerMatrix.slice(0))
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

  const setPixelsSync = matrix => {
    if (matrix.length !== MATRIX_LENGTH) {
      const errorMessage = `Pixel arrays must have ${MATRIX_LENGTH} elements`
      return console.error(errorMessage)
    }
    setMatrixAndPaint(matrix)
  }

  const setPixelsAsync = (matrix, callback = noop) => {
    return new Promise((resolve, reject) => {
      if (matrix.length !== MATRIX_LENGTH) {
        const errorMessage = `Pixel arrays must have ${MATRIX_LENGTH} elements`
        return reject(callback(Error(errorMessage)))
      }
      setMatrixAndPaint(matrix)
      callback(null, innerMatrix)
      resolve(innerMatrix)
    })
  }

  // Accepts a array containing 64 smaller arays of [R,G,B] pixels and
  // updates the LED matrix. R,G,B elements must intergers between 0
  // and 255
  const setPixels = (sync = true, matrix, callback = noop) => {
    return (sync ? setPixelsSync : setPixelsAsync)(matrix, callback)
  }
  
  const setPixelSync = (x, y, r, g, b) => {
    const rgb = rgbArray(r, g, b)

    try {
      checkXY(x, y)
    } catch (error) {
      return console.error(error.messsage)
    }
    
    setPixelAndPaint(x, y, rgb)
  }

  // Updates the single [R,G,B] pixel specified by x and y on the LED matrix
  // Top left = 0,0 Bottom right = 7,7
  // e.g. sense.setPixel(x, y, r, g, b, callback)
  // or
  // pixel = [r, g, b]
  const setPixelAsync = (x, y, r, g, b, callback = noop) => {
    return new Promise((resolve, reject) => {
      const rgb = rgbArray(r, g, b)

      try {
        checkXY(x, y)
      } catch (error) {
        return reject(callback(error))
      }

      setPixelAndPaint(x, y, rgb)
      callback(null, innerMatrix)
      resolve(innerMatrix)
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

  const showLetterSync = (letter, textColor, backColor) => {
    if (letter.length !== 1) {
      const errorMessage = 'Only one character may be passed into showLetter'
      return console.error(errorMessage)
    }

    const pixels = letterPixels(letter, textColor, backColor)

    // We must rotate the pixel map right through 90 degrees when drawing
    // text, see loadTextAssets
    const previousRotation = rotation
    rotation = (checkAngle(rotation - 90)) % 360

    setPixelsSync(pixels)
    rotation = previousRotation
  }

  // Displays a single text character on the LED matrix using the specified colors
  const showLetterAsync = (letter, textColor, backColor, callback = noop) => {
    return new Promise(async (resolve, reject) => {
      if (letter.length !== 1) {
        const errorMessage = 'Only one character may be passed into showLetter'
        return reject(callback(Error(errorMessage)))
      }

      const pixels = letterPixels(letter, textColor, backColor)

      // We must rotate the pixel map right through 90 degrees when drawing
      // text, see loadTextAssets
      const previousRotation = rotation
      rotation = (checkAngle(rotation - 90)) % 360

      try {
        await setPixelsAsync(pixels)
        resolve(pixels)
      } catch (error) {
        reject(callback(error))
      } finally {
        rotation = previousRotation
      }
    })
  }

  // Scrolls a string of text across the LED matrix using the specified
  // speed and colors
  const showMessage = (
    textString,
    scrollSpeed = DEFAULT_SCROLL_SPEED,
    textColor,
    backColor,
    callback = noop
  ) => {
    return new Promise((resolve, reject) => {
      const pixels = scrollPixels(textString, textColor, backColor)

      // We must rotate the pixel map left through 90 degrees when drawing
      // text, see loadTextAssets
      const previousRotation = rotation
      rotation = (checkAngle(rotation - 90)) % 360

      const scroll = async pixels => {
        if (pixels.length < MATRIX_LENGTH) {
          rotation = previousRotation
          return resolve(callback(null))
        }

        try {
          await setPixelsAsync(pixels.slice(0, MATRIX_LENGTH))
          await sleep(scrollSpeed)
          scroll(pixels.slice(MATRIX_SIZE))
        } catch (error) {
          rotation = previousRotation
          return reject(callback(error))
        }
      }

      scroll(pixels)
    })
  }

  const flashMessage = (
    message,
    flashSpeed = DEFAULT_FLASH_SPEED,
    textColor,
    backColor,
    callback = noop
  ) => {
    return new Promise((resolve, reject) => {
      const flash = async (message) => {
        if (!message.length) {
          return resolve(callback(null))
        }

        try {
          await showLetterAsync(message[0], textColor, backColor)
          await sleep(flashSpeed)
          flash(message.slice(1))
        } catch (error) {
          return reject(console.error(error.message))
        }
      }

      flash(message)
    })
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
        setPixelsSync(pixels)
      }
      return pixels
    }

    loadImageAsync(filePath).then(pixels => {
      if (redraw) {
        setPixelsAsync(pixels, callback)
      } else {
        callback(null, pixels)
      }
    })
  }

  return {
    clear: curryFunction(false, clear),
    setPixel: setPixelAsync,
    getPixel: curryFunction(false, getPixel),
    setPixels: setPixelsAsync,
    getPixels: curryFunction(false, getPixels),
    flipH: curryFunction(false, flipH),
    flipV: curryFunction(false, flipV),
    setRotation: curryFunction(false, setRotation),
    showMessage,
    flashMessage,
    showLetter: showLetterAsync,
    loadImage: curryFunction(false, loadImage),
    get rotation () { return rotation },
    set rotation (angle) { setRotation(false, angle) },
    get gamma () {},
    set gamma (arr) {},
    gammaReset: noop,
    get lowLight () {},
    set lowLight (bol) {},
    sync: {
      sleep,
      clear: curryFunction(true, clear),
      getPixel: curryFunction(true, getPixel),
      setPixel: setPixelSync,
      getPixels: curryFunction(true, getPixels),
      setPixels: setPixelsSync,
      flipH: curryFunction(true, flipH),
      flipV: curryFunction(true, flipV),
      setRotation: curryFunction(true, setRotation),
      showMessage,
      flashMessage,
      showLetter: showLetterSync,
      loadImage: curryFunction(true, loadImage),
      get rotation () { return rotation },
      set rotation (angle) { setRotation(true, angle) },
      get gamma () {},
      set gamma (arr) {},
      gammaReset: noop,
      get lowLight () {},
      set lowLight (bol) {}
    }
  }
}

module.exports = WebLeds
