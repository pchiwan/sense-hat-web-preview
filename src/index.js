const senseJoystick = require('./webJoystick').default
const senseLeds = require('./webLeds').default

const black = [0, 0, 0]
const red = [255, 0, 0]
const yellow = [255, 255, 0]
const blue = [0, 0, 255]
const white = [255, 255, 255]

let currentShapeIndex = 0

const { shapes } = (() => {
  const _ = black
  const R = red
  const Y = yellow
  const B = blue
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
      R, _, _, R, R, _, _, R,
      R, _, _, _, _, _, _, R,
      _, R, _, _, _, _, R, _,
      _, _, R, _, _, R, _, _,
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
    drop: [
      _, _, _, _, _, _, _, _,
      _, _, _, B, _, _, _, _,
      _, _, B, _, B, _, _, _,
      _, B, _, _, _, B, _, _,
      _, B, _, _, _, B, _, _,
      _, B, _, _, _, B, _, _,
      _, _, B, B, B, _, _, _,
      _, _, _, _, _, _, _, _
    ]
  }

  return { shapes }
})()

const drawShape = shape => {
  senseLeds.setPixels(shape)
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

// Setup input callbacks
senseJoystick.getJoystick()
  .then((joystick) => {
    joystick.on('press', (val) => {
      if (val === 'click') {
        changeShape()
      }
    })
  })

const startGameLoop = () => {
  const currentShape = shapes.none
  drawShape(currentShape)
}

startGameLoop()
