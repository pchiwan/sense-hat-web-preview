import { h, Component } from 'preact'

const consoleStyles = {
  border: '1px solid grey',
  height: '200px',
  overflowY: 'auto',
  backgroundColor: '#2E4053',
  color: 'white',
  fontFamily: 'monospace',
  padding: '5px 8px'
}
const listStyles = {
  textAlign: 'left',
  margin: '0',
  listStyle: 'none',
  padding: '0'
}
const listItemStyles = {
  fontSize: '16px',
  lineHeight: '20px'
}
const buttonStyles = {
  outline: 'none',
  cursor: 'pointer',
  padding: '5px 10px',
  borderRadius: '4px',
  marginTop: '15px',
  fontSize: '14px',
  fontWeight: '500'
}

class Console extends Component {
  constructor (props) {
    super(props)

    this.socket = props.socket

    this.state = {
      messages: []
    }

    this.clearConsole = this.clearConsole.bind(this)
  }

  componentDidMount () {
    if (this.socket) {
      this.socket.on('message', message => {
        this.setState({
          messages: [message, ...this.state.messages]
        })
      })
    } else {
      throw new Error('Could not bind to socket')
    }
  }

  clearConsole () {
    this.setState({
      messages: []
    })
  }

  render () {
    const { messages } = this.state

    return (
      <div style={{ width: '250px' }}>
        <div style={consoleStyles}>
          <ul style={listStyles}>
            {messages.map(item =>
              <li style={listItemStyles}>{item}</li>)
            }
          </ul>
        </div>
        <button style={buttonStyles} onClick={this.clearConsole}>CLEAR</button>
      </div>
    )
  }
}

export default Console
