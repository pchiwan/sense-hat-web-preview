/* eslint-disable max-nested-callbacks */
const MockedSocket = require('socket.io-mock')

const WebLeds = require('./webLeds')
const { isBlack, equalArrays } = require('./utils')
const { MATRIX_LENGTH, MATRIX_SIZE } = require('./constants')
const {
  conditionallyFillMatrix,
  consoleLogMatrix,
  expectValueToBeError,
  reduceMatrix
} = require('../test/utils')

// enable logs to see output test matrixes
const ENABLE_LOG = false
const log = matrix => ENABLE_LOG && consoleLogMatrix(matrix)


const RED = [255, 0, 0]
const GREEN = [0, 255, 0]
const isRed = color => equalArrays(color, RED)
const isGreen = color => equalArrays(color, GREEN)

describe('WebLeds', () => {
  let webLeds
  let mocket

  beforeEach(() => {
    mocket = new MockedSocket()
    webLeds = new WebLeds(mocket.socketClient)
  })

  test('matrix is initially black', () => {
    const matrix = webLeds.sync.getPixels()
    log(matrix)
    expect(matrix.every(isBlack)).toBeTruthy()
  })

  describe('clear', () => {
    test('fills the matrix with black if invalid color is provided', () => {
      webLeds.sync.clear(300, 0, 0)
      const matrix = webLeds.sync.getPixels()
      log(matrix)
      expect(matrix.every(isBlack)).toBeTruthy()
    })

    test('fills the matrix with provided valid color', () => {
      webLeds.sync.clear(255, 0, 0)
      const matrix = webLeds.sync.getPixels()
      log(matrix)
      expect(matrix.every(isRed)).toBeTruthy()
    })
  })

  describe('setPixels', () => {
    test('returns an error if matrix does not have required length', () => {
      webLeds.setPixels(Array(4).fill(GREEN), expectValueToBeError)
    })

    test('synchronously sets the matrix with required length', () => {
      webLeds.sync.setPixels(Array(MATRIX_LENGTH).fill(GREEN))
      const matrix = webLeds.sync.getPixels()
      log(matrix)
      expect(matrix.every(isGreen)).toBeTruthy()
    })

    test('asynchronously sets the matrix with required length', () => {
      webLeds.setPixels(Array(MATRIX_LENGTH).fill(GREEN), (_, matrix) => {
        expect(matrix.every(isGreen)).toBeTruthy()
      }).then(matrix => {
        expect(matrix.every(isGreen)).toBeTruthy()
      })
    })
  })

  describe('setPixel', () => {
    test('returns an error if x/y coordinates are invalid', () => {
      webLeds.setPixel(9, 0, 0, 0, 0, expectValueToBeError)
      webLeds.setPixel(0, -1, 0, 0, 0, expectValueToBeError)
    })

    test('sets pixel at x/y coordinates with black if invalid color is provided', () => {
      webLeds.sync.setPixel(0, 0, 300, 0, 0)
      expect(isBlack(webLeds.sync.getPixel(0, 0))).toBeTruthy()
    })

    test('synchronously sets pixel at x/y coordinates with valid color', () => {
      webLeds.sync.setPixel(0, 0, 255, 0, 0)
      log(webLeds.sync.getPixels())
      expect(isRed(webLeds.sync.getPixel(0, 0))).toBeTruthy()
    })

    test('asynchronously sets pixel at valid x/y coordinates with valid color', () => {
      webLeds.setPixel(0, 0, 255, 0, 0, (_, matrix) => {
        expect(isRed(matrix[0, 0])).toBeTruthy()
      }).then(matrix => {
        expect(isRed(matrix[0, 0])).toBeTruthy()
      })
    })
  })

  describe('flipH', () => {
    test('flips matrix horizontally', () => {
      let matrix = webLeds.sync.getPixels()
      matrix = conditionallyFillMatrix(matrix, RED, x => x === 0)
      webLeds.sync.setPixels(matrix)
      log(webLeds.sync.getPixels())
      
      matrix = webLeds.sync.flipH(false)
      log(matrix)
      reduceMatrix(matrix, (x, y, value) => {
        if (x === MATRIX_SIZE - 1) {
          expect(equalArrays(value, RED)).toBeTruthy()
        }
      })
    })
  })

  describe('flipV', () => {
    test('flips matrix vertically', () => {
      let matrix = webLeds.sync.getPixels()
      matrix = conditionallyFillMatrix(matrix, RED, (_, y) => y === 0)
      webLeds.sync.setPixels(matrix)
      log(webLeds.sync.getPixels())
      
      matrix = webLeds.sync.flipV(false)
      log(matrix)
      reduceMatrix(matrix, (x, y, value) => {
        if (y === MATRIX_SIZE - 1) {
          expect(equalArrays(value, RED)).toBeTruthy()
        }
      })
    })
  })

  describe('setRotation', () => {
    test('does not set rotation if provided angle is invalid', () => {
      const rotation = webLeds.sync.rotation

      webLeds.sync.setRotation(157)
      expect(webLeds.sync.rotation).toEqual(rotation)

      webLeds.sync.setRotation(360)
      expect(webLeds.sync.rotation).toEqual(rotation)
    })

    test('sets rotation if provided angle is valid', () => {
      webLeds.sync.setRotation(180)
      expect(webLeds.sync.rotation).toEqual(180)

      webLeds.sync.setRotation(-90)
      expect(webLeds.sync.rotation).toEqual(270)
    })

    test('[visual] sets rotation if provided angle is valid', done => {
      // this tests rotation visually
      let matrix = webLeds.sync.getPixels()
      matrix = conditionallyFillMatrix(matrix, RED, (x, y) => x <= 3 && y <= 3)
      webLeds.sync.setPixels(matrix)
      log(webLeds.sync.getPixels())

      mocket.on('updateMatrix', matrix => {
        log(matrix)
        reduceMatrix(matrix, (x, y, value) => {
          if (x > 3 && y <= 3) {
            expect(equalArrays(value, RED)).toBeTruthy()
          }
        })
        done()
      })
  
      webLeds.setRotation(90)
    })
  })
})
