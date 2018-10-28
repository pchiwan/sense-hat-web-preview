const fs = require('fs')
const PNG = require('pngjs').PNG

const { MATRIX_SIZE, BLACK, WHITE } = require('./constants')
const TEXT_ASSETS = 'sense_hat_text'
const LETTER_PIXELS = 5 * 8

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
    return Array.from(new Array(3), (_, j) => png.data[i * 4 + j]);
  })
}

function loadImageSync(filePath) {
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

// Builds a character indexed object of pixels used by show_message
function loadTextAssets(textImageFile, textFile) {
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

function getCharPixels(character, letters) {
  return character.length === 1 && character in letters
    ? letters[character]
    : letters['?']
}

function letterPixels(letter, textColor = WHITE, backColor = BLACK) {
  return Array(MATRIX_SIZE).fill(backColor)
    .concat(getCharPixels(letter).map(rgb => isBlack(rgb) ? backColor : textColor))
    .concat(Array(MATRIX_SIZE * 2).fill(backColor))
}

module.exports = {
  letters,
  letterPixels,
  rgbArray
}
