import { h, Component } from 'preact'

import Checkbox from './checkbox'
import LedMatrix from './ledMatrix'

import { MATRIX_LENGTH } from '../../constants'
import senseHatImage from './sense-hat.png'

const BGIMAGE_OFFSET = 38

const matrixStyles = {
  display: 'flex',
  justifyContent: 'center',
  height: '320px'
}

class SenseHAT extends Component {
  constructor (props) {
    super(props)

    this.socket = props.socket

    this.state = {
      matrix: [...Array(MATRIX_LENGTH).keys()],
      displayBoard: true,
      bgLeft: 0
    }

    this.getMatrixRef = this.getMatrixRef.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.toggleBoard = this.toggleBoard.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()

    if (this.socket) {
      this.socket.on('updateMatrix', matrix => {
        this.setState({
          matrix
        })
      })
    } else {
      throw new Error('Could not bind to socket')
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize () {
    this.setState({
      bgLeft: this.matrixRef && this.matrixRef.getBoundingClientRect().left
    })
  }

  toggleBoard () {
    this.setState({
      displayBoard: !this.state.displayBoard
    })
  }

  getMatrixRef (node) {
    this.matrixRef = node
  }

  render () {
    const { displayBoard, matrix } = this.state

    const matrixStylesWithBg = {
      ...matrixStyles,
      backgroundImage: `url('${senseHatImage}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: '361px',
      backgroundPositionX: `${this.state.bgLeft - BGIMAGE_OFFSET}px`
    }

    return (
      <div>
        <div style={displayBoard ? matrixStylesWithBg : matrixStyles}>
          <LedMatrix
            getRef={this.getMatrixRef}
            showCellBorders={!displayBoard}
            matrix={matrix}
          />
        </div>
        <Checkbox
          label='Display Sense HAT'
          checked={displayBoard}
          onChange={this.toggleBoard}
        />
      </div>
    )
  }
}

export default SenseHAT
