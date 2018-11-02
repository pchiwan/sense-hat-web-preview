const fs = require('fs')
const PNG = require('pngjs').PNG

const { MATRIX_SIZE, BLACK, WHITE } = require('./constants')
const TEXT_ASSETS = 'sense_hat_text'
const LETTER_PIXELS = 5 * 8

const PIXEL_MAP = {
  0: (x, y) => y * MATRIX_SIZE + x,
  90: (x, y) => y + ((MATRIX_SIZE - 1) - x) * MATRIX_SIZE,
  180: (x, y) => ((MATRIX_SIZE - 1) - y) * MATRIX_SIZE + ((MATRIX_SIZE - 1) - x),
  270: (x, y) => (MATRIX_SIZE - 1) - y + x * MATRIX_SIZE
}

function isValidColorValue (value) {
  return value >= 0 && value <= 255
}

function rgbArray (r = 0, g = 0, b = 0) {
  if (
    isValidColorValue(r) &&
    isValidColorValue(g) &&
    isValidColorValue(g)
  ) {
    return [r, g, b]
  }
  return BLACK
}

function pngTopixels (png) {
  return Array.from(new Array(png.width * png.height), (_, i) => {
    return Array.from(new Array(3), (_, j) => png.data[i * 4 + j])
  })
}

// Accepts a path to an 8 x 8 image file and updates the LED matrix with
// the image
function loadImageSync (filePath) {
  try {
    fs.accessSync(filePath)
  } catch (error) {
    throw Error(`${filePath} not found`)
  }

  // load file & convert to pixel array
  const buf = fs.readFileSync(filePath)
  const png = PNG.sync.read(buf)
  const pixels = pngTopixels(png)
  return pixels
}

function loadImageAsync (filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, readFile)

    function readFile(error) {
      if (error) {
        return reject(`${filePath} not found`)
      }
      fs.readFile(filePath, parsePNG)
    }

    function parsePNG(error, buf) {
      if (error) {
        return reject(`${filePath} could not be read`)
      }
      new PNG().parse(buf, convertPNG)
    }

    function convertPNG(error, png) {
      if (error) {
        return reject(`Could not parse PNG ${error.message}`)
      }

      const pixels = pngTopixels(png)
      resolve(pixels)
    }
  })
}

// Builds a character indexed object of pixels used by show_message
function loadTextAssets (textImageFile, textFile) {
  const textPixels = loadImageSync(textImageFile, false)
  const loadedText = fs.readFileSync(textFile, 'utf8')

  return loadedText
    .split('')
    .reduce((letterPixels, char, i) => {
      letterPixels[char] = textPixels.slice(i * LETTER_PIXELS, (i + 1) * LETTER_PIXELS)
      return letterPixels
    }, {})
}

// Text asset files are rotated right through 90 degrees to allow blocks of
// 40 contiguous pixels to represent one 5 x 8 character. These are stored
// in a 8 x 640 pixel png image with characters arranged adjacently
// Consequently we must rotate the pixel map left through 90 degrees to
// compensate when drawing text
const letters = loadTextAssets(
  `${__dirname}/assets/${TEXT_ASSETS}.png`,
  `${__dirname}/assets/${TEXT_ASSETS}.txt`
)

function isBlack (color) {
  return color.every(value => value === 0)
}

function getCharPixels (character) {
  return character.length === 1 && character in letters
    ? letters[character]
    : letters['?']
}

function letterPixels (letter, textColor = WHITE, backColor = BLACK) {
  const letterPadding = Array(MATRIX_SIZE * 2).fill(backColor)

  return Array(MATRIX_SIZE).fill(backColor)
    .concat(getCharPixels(letter).map(
      rgb => isBlack(rgb) ? backColor : textColor)
    )
    .concat(letterPadding)
}

function scrollPixels (message, textColor = WHITE, backColor = BLACK) {
  const stringPadding = Array(MATRIX_SIZE).fill(backColor)
  const letterPadding = Array(MATRIX_SIZE * 2).fill(backColor)

  return message.split('')
    .reduce((pixels, char) => pixels
      .concat(trimWhitespace(getCharPixels(char)).map(
        rgb => isBlack(rgb) ? backColor : textColor)
      )
      .concat(letterPadding), stringPadding)
    .concat(stringPadding)
}

function trimBack (pixels) {
  return pixels.slice(-8).every(isBlack)
    ? trimBack(pixels.slice(0, -8))
    : pixels
}

function trimFront (pixels) {
  return pixels.slice(0, 8).every(isBlack)
    ? trimFront(pixels.slice(8))
    : pixels
}

function trimWhitespace (pixels) {
  return !pixels.every(isBlack)
    ? trimBack(trimFront(pixels))
    : pixels
}

function checkXY (x, y) {
  if (x < 0 || x > MATRIX_SIZE - 1) {
    throw Error(`x=${x} violates 0 <= x <= ${MATRIX_SIZE - 1}`)
  }
  if (y < 0 || y > MATRIX_SIZE - 1) {
    throw Error(`y=${y} violates 0 <= y <= ${MATRIX_SIZE - 1}`)
  }
}

function getCoord (x, y, rotation) {
  return PIXEL_MAP[rotation](x, y)
}

function mirrorH(pixels, width) {
  return pixels.length
    ? pixels
      .slice(0, width)
      .reverse()
      .concat(mirrorH(pixels.slice(width), width))
    : []
}

function horizontalMirror (pixels) {
  return mirrorH(pixels, Math.sqrt(pixels.length))
}

function mirrorV (pixels, width) {
  return pixels.length
    ? pixels
      .slice(pixels.length - width)
      .concat(mirrorV(pixels.slice(0, pixels.length - width), width))
    : []
}

function verticalMirror (pixels) {
  return mirrorV(pixels, Math.sqrt(pixels.length))
}

function sleep (timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout * 1000000))
}

function syncCurriedFunction (sync, func) {
  return (...args) => func.apply(this, [sync, ...[].slice.call(args)])
}

module.exports = {
  checkXY,
  getCharPixels,
  getCoord,
  horizontalMirror,
  isBlack,
  letterPixels,
  loadImageAsync,
  loadImageSync,
  rgbArray,
  scrollPixels,
  sleep,
  syncCurriedFunction,
  trimWhitespace,
  verticalMirror
}
