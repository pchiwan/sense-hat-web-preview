const colors = require('colors/safe')

const COLOR_MAP = {
  '000': colors.bgBlack,
  '25500': colors.bgRed,
  '02550': colors.bgGreen,
  '00255': colors.bgBlue,
  '255255255': colors.bgWhite,
  '2552550': colors.bgYellow
}

function getColorFn (colorArray) {
  return COLOR_MAP[colorArray.join('')]
    ? COLOR_MAP[colorArray.join('')]
    : colors.bgBlack
}

function consoleLogMatrix (matrix) {
  const MatrixSize = Math.sqrt(matrix.length)

  console.log(
    Array(MatrixSize).fill(0).map((_, i) => {
      return matrix
        .slice(i * MatrixSize, i * MatrixSize + MatrixSize)
        .map(value => getColorFn(value)('  '))
        .join('')
    }).join('\n')
  )
}

function expectValueToBeError (value) {
  expect(value).toBeInstanceOf(Error)
}

function reduceMatrix (matrix, callback) {
  const MatrixSize = Math.sqrt(matrix.length)

  for (let y = 0; y < MatrixSize; y++) {
    for (let x = 0; x < MatrixSize; x++) {
      callback(x, y, matrix[y * MatrixSize + x])
    }
  }
}

function conditionallyFillMatrix (matrix, value, conditionFn) {
  const MatrixSize = Math.sqrt(matrix.length)
  const newMatrix = matrix.slice(0)

  for (let y = 0; y < MatrixSize; y++) {
    for (let x = 0; x < MatrixSize; x++) {
      if (conditionFn(x, y, newMatrix[y * MatrixSize + x])) {
        newMatrix[y * MatrixSize + x] = value
      }
    }
  }

  return newMatrix
}

module.exports = {
  conditionallyFillMatrix,
  consoleLogMatrix,
  expectValueToBeError,
  reduceMatrix
}
