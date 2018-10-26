import { h, Component } from 'preact'

import { Table, TableCell } from './table'
import { MATRIX_SIZE } from '../constants'
import { rgbArrayToColor } from '../utils'

class Matrix extends Component {
  constructor () {
    super()

    this.state = {
      matrix: []
    }
  }

  updateMatrix (matrix) {
    this.setState({
      matrix
    })
  }

  render () {
    return (
      <Table>{
        [...Array(MATRIX_SIZE)].map((_, i) => (
          <tr key={`tr-${i}`}>
            {this.state.matrix
              .slice(i * MATRIX_SIZE, i * MATRIX_SIZE + MATRIX_SIZE)
              .map((value, j) => (
                <TableCell
                  key={`td-${i}-${j}`}
                  color={rgbArrayToColor(value)}
                />
              ))
            }
          </tr>
        ))}
      </Table>
    )
  }
}

export default Matrix
