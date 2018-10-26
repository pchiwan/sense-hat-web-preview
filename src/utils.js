export const isValidColorIntensity = value => {
  return value >= 0 && value <= 255
}

export const rgbArrayToColor = rgbArray => {
  return rgbArray.length === 3 && rgbArray.every(isValidColorIntensity)
    ? `rgb(${rgbArray.join(',')})`
    : 'black'
}
