const MockedSocket = require('socket.io-mock')

const WebJoystick = require('./webJoystick')
const {
  KEY_TO_DIRECTION,
  KEYDOWN_EVENT,
  KEY_UP
} = require('./constants')

describe('WebJoystick', () => {
  let webJoystick
  let mocket

  beforeEach(() => {
    mocket = new MockedSocket()
    webJoystick = WebJoystick(mocket.socketClient).sync.getJoystick()
  })

  test('does NOT execute subscriber callbacks for invalid event type', done => {
    const listener = jest.fn()
    webJoystick.on('foobar', listener)

    mocket.emit('handleKeyEvent', {
      eventType: 'foobar',
      keyCode: KEY_UP
    })

    expect(listener).not.toHaveBeenCalled()
    done()
  })

  test('does NOT execute subscriber callbacks for invalid direction', done => {
    const listener = jest.fn()
    webJoystick.on('press', listener)

    mocket.emit('handleKeyEvent', {
      eventType: KEYDOWN_EVENT,
      keyCode: 32
    })

    expect(listener).not.toHaveBeenCalled()
    done()
  })

  test('executes subscriber callbacks for valid event type and direction', done => {
    const listener = jest.fn()
    webJoystick.on('press', listener)

    mocket.emit('handleKeyEvent', {
      eventType: KEYDOWN_EVENT,
      keyCode: KEY_UP
    })

    expect(listener).toHaveBeenCalledWith(KEY_TO_DIRECTION[KEY_UP])
    done()
  })
})
