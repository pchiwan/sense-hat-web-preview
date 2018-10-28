import { h } from 'preact'

import { Table, TableCell } from './table'
import { rgbArrayToString } from '../utils'
import { MATRIX_SIZE } from '../../constants'

const tableStyles = {
  borderCollapse: 'separate',
  borderSpacing: '2px 5px',
  position: 'relative',
  top: '57px'
}

const LedMatrix = ({ getRef, showCellBorders, matrix }) => (
  <Table
    getRef={getRef}
    style={tableStyles}>{
      [...Array(MATRIX_SIZE)].map((_, i) => (
        <tr key={`tr-${i}`}>
          {matrix
            .slice(i * MATRIX_SIZE, i * MATRIX_SIZE + MATRIX_SIZE)
            .map((value, j) => (
              <TableCell
                key={`td-${i}-${j}`}
                color={rgbArrayToString(value)}
                showBorder={showCellBorders}
              />
            ))
          }
        </tr>
      ))
    }
  </Table>
)

export default LedMatrix
