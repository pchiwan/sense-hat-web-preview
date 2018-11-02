import { h } from 'preact'

import { Table, TableCell } from './table'
import { rgbArrayToString, isPerfectSquare  } from '../utils'

const tableStyles = {
  borderCollapse: 'separate',
  borderSpacing: '2px 5px',
  position: 'relative',
  top: '57px'
}

const LedMatrix = ({ getRef, showCellBorders, matrix }) => {
  if (!matrix || !matrix.length || !isPerfectSquare(matrix.length)) {
    return null
  }

  const MatrixSize = Math.sqrt(matrix.length)

  return (
    <Table
      getRef={getRef}
      style={tableStyles}>{
        [...Array(MatrixSize)].map((_, i) => (
          <tr key={`tr-${i}`}>
            {matrix
              .slice(i * MatrixSize, i * MatrixSize + MatrixSize)
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
}

export default LedMatrix
