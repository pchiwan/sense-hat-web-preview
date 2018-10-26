import { h, Component } from 'preact'

import { Table, TableCell } from './table'
import Checkbox from './checkbox'
import { rgbArrayToColor } from '../utils'
import { MATRIX_SIZE, MATRIX_LENGTH } from '../constants'
import senseHatImage from './sense-hat.png'

const BGIMAGE_OFFSET = 38

const matrixStyles = {
  display: 'flex',
  justifyContent: 'center',
  height: '320px'
}

const tableStyles = {
  borderCollapse: 'separate',
  borderSpacing: '2px 5px',
  position: 'relative',
  top: '57px'
}

class SenseHAT extends Component {
  constructor () {
    super()

    this.state = {
      matrix: [...Array(MATRIX_LENGTH).keys()],
      displayBoard: true,
      bgLeft: 0
    }

    this.getTableRef = this.getTableRef.bind(this)
    this.handleResize = this.handleResize.bind(this)
    this.toggleBoard = this.toggleBoard.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  handleResize () {
    this.setState({
      bgLeft: this.table.getBoundingClientRect().left
    })
  }

  toggleBoard () {
    this.setState({
      displayBoard: !this.state.displayBoard
    })
  }

  getTableRef (node) {
    this.table = node
  }

  updateMatrix (matrix) {
    this.setState({
      matrix
    })
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
          <Table
            getRef={this.getTableRef}
            style={tableStyles}>{
              [...Array(MATRIX_SIZE)].map((_, i) => (
                <tr key={`tr-${i}`}>
                  {matrix
                    .slice(i * MATRIX_SIZE, i * MATRIX_SIZE + MATRIX_SIZE)
                    .map((value, j) => (
                      <TableCell
                        key={`td-${i}-${j}`}
                        color={rgbArrayToColor(value)}
                        showBorder={!displayBoard}
                      />
                    ))
                  }
                </tr>
              ))
            }
          </Table>
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
