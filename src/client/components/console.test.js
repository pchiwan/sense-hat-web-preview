import { h } from 'preact'
import { shallow } from 'preact-render-spy'
import MockedSocket from 'socket.io-mock'

import Console from './console'

describe('Console component', () => {
  test('throws an error when socket is null', () => {
    expect(() => shallow(<Console />)).toThrowError('Could not bind to socket')
  })

  describe('when socket is NOT null', () => {
    const messages = ['foo', 'bar', 'man']
    let mocket
    let wrapper

    beforeEach(() => {
      mocket = new MockedSocket()
      wrapper = shallow(<Console socket={mocket} />)
      wrapper.setState({ messages })
    })

    test('renders a list of messages', () => {
      expect(wrapper.find('ul').length).toEqual(1)
      expect(wrapper.find('li').length).toEqual(messages.length)
    })

    test(`appends message to console when event 'message' is received through socket`, () => {
      const newMessage = 'hello world'
      mocket.socketClient.emit('message', newMessage)
      expect(wrapper.state('messages')).toEqual([newMessage, ...messages])
    })

    test('clears messages when button is clicked', () => {
      expect(wrapper.state('messages').length).toEqual(messages.length)
      wrapper.find('[onClick]').simulate('click')
      expect(wrapper.state('messages').length).toEqual(0)
    })
  })
})
