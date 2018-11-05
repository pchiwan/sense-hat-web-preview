const BLACK = [0, 0, 0]
const WHITE = [255, 255, 255]

const KEY_ENTER = 13
const KEY_LEFT = 37
const KEY_UP = 38
const KEY_RIGHT = 39
const KEY_DOWN = 40
const KEY_A = 65
const KEY_D = 68
const KEY_S = 83
const KEY_W = 87

const ARROW_KEYS = [
  KEY_LEFT,
  KEY_UP,
  KEY_RIGHT,
  KEY_DOWN
]

const KEYDOWN_EVENT = 'keydown'
const KEYUP_EVENT = 'keyup'

const KEY_TO_DIRECTION = {
  [KEY_UP]: 'up',
  [KEY_W]: 'up',
  [KEY_RIGHT]: 'right',
  [KEY_D]: 'right',
  [KEY_DOWN]: 'down',
  [KEY_S]: 'down',
  [KEY_LEFT]: 'left',
  [KEY_A]: 'left',
  [KEY_ENTER]: 'click'
}

const KEY_TO_JOYSTICK_EVENT = {
  [KEYDOWN_EVENT]: 'press',
  [KEYUP_EVENT]: 'release'
}

const KEY_TO_STRING = {
  [KEY_UP]: 'UP ⬆',
  [KEY_W]: 'UP ⬆',
  [KEY_RIGHT]: 'RIGHT ➡',
  [KEY_D]: 'RIGHT ➡',
  [KEY_DOWN]: 'DOWN ⬇',
  [KEY_S]: 'DOWN ⬇',
  [KEY_LEFT]: 'LEFT ⬅',
  [KEY_A]: 'LEFT ⬅',
  [KEY_ENTER]: 'CLICK'
}

const MATRIX_SIZE = 8
const MATRIX_LENGTH = MATRIX_SIZE * MATRIX_SIZE

const ONE_SECOND_IN_MS = 1000

const PORT = process.env.PORT || 3000

module.exports = {
  BLACK,
  WHITE,
  ARROW_KEYS,
  KEY_TO_DIRECTION,
  KEY_TO_JOYSTICK_EVENT,
  KEY_TO_STRING,
  MATRIX_SIZE,
  MATRIX_LENGTH,
  ONE_SECOND_IN_MS,
  PORT
}
