const path = require('path')

const imagePath = path.join(process.cwd(), 'src', 'space_invader.png')

let senseLeds

const black = [0, 0, 0]
const blue = [0, 0, 255]
const green = [0, 255, 0]
const red = [255, 0, 0]
const white = [255, 255, 255]
const yellow = [255, 255, 0]

let currentShapeIndex = 0

const { shapes } = (() => {
  const _ = black
  const B = blue
  const G = green
  const R = red
  const W = white
  const Y = yellow

  const shapes = {
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
    world: [
      _, _, W, W, B, B, _, _,
      _, G, B, G, B, B, W, _,
      G, G, G, G, G, B, B, W,
      G, G, G, G, B, B, B, B,
      B, G, B, B, B, B, B, B,
      B, B, G, B, G, G, G, B,
      _, B, B, B, G, G, G, _,
      _, _, B, B, B, G, _, _
    ],
    star: [
      _, _, _, Y, Y, _, _, _,
      _, _, _, Y, Y, _, _, _,
      Y, Y, Y, Y, Y, Y, Y, Y,
      _, Y, Y, Y, Y, Y, Y, _,
      _, _, Y, Y, Y, Y, _, _,
      _, Y, Y, Y, Y, Y, Y, _,
      _, Y, Y, _, _, Y, Y, _,
      _, Y, _, _, _, _, Y, _
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

module.exports = async (_senseJoystick, _senseLeds) => {
  // Setup input callbacks
  const joystick = await _senseJoystick.getJoystick()
  joystick.on('press', async val => {
    if (val === 'click') {
      changeShape()
    }
    if (val === 'right') {
      await senseLeds.showMessage('hello world!')
      console.log('showMessage finished')
    }
    if (val === 'up') {
      await senseLeds.flashMessage('hello world!')
      console.log('flashMessage finished')
    }
    if (val === 'down') {
      senseLeds.flipV()
    }
    if (val === 'left') {
      senseLeds.loadImage(imagePath)
    }
  })

  senseLeds = _senseLeds

  const currentShape = shapes.heart
  drawShape(currentShape)
}