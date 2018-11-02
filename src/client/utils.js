export function isValidColorValue (value) {
  return value >= 0 && value <= 255
}

export function rgbArrayToString (rgbArray) {
  return rgbArray.length === 3 && rgbArray.every(isValidColorValue)
    ? `rgb(${rgbArray.join(',')})`
    : 'black'
}

export function isPerfectSquare (number) {
  return number > 0 && Math.sqrt(number) % 1 === 0
}


