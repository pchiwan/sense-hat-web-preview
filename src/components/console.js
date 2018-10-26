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
  backgroundColor: 'lightgrey',
  marginTop: '15px',
  fontSize: '14px',
  fontWeight: '500',
  width: '100%'
}

class Console extends Component {
  constructor (props) {
    super(props)

    this.state = {
      items: []
    }

    this.clearConsole = this.clearConsole.bind(this)
  }

  pushItem (item) {
    this.setState({
      items: [item, ...this.state.items]
    })
  }

  clearConsole () {
    this.setState({
      items: []
    })
  }

  render () {
    return (
      <div style={{ width: '250px' }}>
        <div style={consoleStyles}>
          <ul style={listStyles}>
            {this.state.items.map(item =>
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
