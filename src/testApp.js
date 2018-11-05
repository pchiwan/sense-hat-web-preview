let senseLeds

const black = [0, 0, 0]
const red = [255, 0, 0]
const yellow = [255, 255, 0]
const blue = [0, 0, 255]
const green = [0, 255, 0]
const white = [255, 255, 255]

let currentShapeIndex = 0

const { shapes } = (() => {
  const _ = black
  const R = red
  const Y = yellow
  const B = blue
  const G = green
  const W = white

  const shapes = {
    none: [
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, _, _
    ],
    heart: [
      _, _, _, _, _, _, _, _,
      _, R, R, _, _, R, R, _,
      R, R, R, R, R, R, R, R,
      R, R, R, R, R, R, R, R,
      _, R, R, R, R, R, R, _,
      _, _, R, R, R, R, _, _,
      _, _, _, R, R, _, _, _,
      _, _, _, _, _, _, _, _
    ],
    smiley: [
      _, _, Y, Y, Y, Y, _, _,
      _, Y, Y, Y, Y, Y, Y, _,
      Y, Y, _, Y, Y, _, Y, Y,
      Y, Y, Y, Y, Y, Y, Y, Y,
      Y, W, W, W, W, W, W, Y,
      Y, _, _, _, _, _, _, Y,
      _, Y, R, R, R, R, Y, _,
      _, _, Y, Y, Y, Y, _, _
    ],
    check: [
      _, _, _, _, _, _, _, _,
      _, _, _, _, _, _, G, G,
      _, _, _, _, _, G, G, G,
      G, G, _, _, G, G, G, _,
      G, G, G, G, G, G, _, _,
      _, G, G, G, G, _, _, _,
      _, _, G, G, _, _, _, _,
      _, _, _, _, _, _, _, _
    ]
  }

  return { shapes }
})()

const drawShape = shape => {
  senseLeds.sync.setPixels(shape)
}

const changeShape = () => {
  const keys = Object.keys(shapes)
  currentShapeIndex = currentShapeIndex + 1 < keys.length
    ? currentShapeIndex + 1
    : 0

  drawShape(getShape(currentShapeIndex))
}

const getShape = () => {
  return shapes[Object.keys(shapes)[currentShapeIndex]]
}

module.exports = (_senseJoystick, _senseLeds) => {
  // Setup input callbacks
  _senseJoystick.getJoystick().then((joystick) => {
    joystick.on('press', (val) => {
      if (val === 'click') {
        changeShape()
      }
      if (val === 'right') {
        senseLeds.sync.showMessage('hello world!')
      }
      if (val === 'up') {
        senseLeds.sync.flashMessage('hello world!')
      }
      if (val === 'down') {
        senseLeds.sync.flipV()
      }
      if (val === 'left') {
        senseLeds.sync.flipH()
      }
    })
  })

  senseLeds = _senseLeds

  const currentShape = shapes.none
  drawShape(currentShape)
}
