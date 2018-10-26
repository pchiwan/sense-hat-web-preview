export const KEY_ENTER = 13
export const KEY_LEFT = 37
export const KEY_UP = 38
export const KEY_RIGHT = 39
export const KEY_DOWN = 40
export const KEY_A = 65
export const KEY_D = 68
export const KEY_S = 83
export const KEY_W = 87

export const KEYDOWN_EVENT = 'keydown'
export const KEYUP_EVENT = 'keyup'

export const KEY_TO_JOYSTICK_EVENT = {
  [KEYDOWN_EVENT]: 'press',
  [KEYUP_EVENT]: 'release'
}

export const KEY_TO_DIRECTION = {
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

export const KEY_TO_STRING = {
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
