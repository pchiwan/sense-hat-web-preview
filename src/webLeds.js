import { h, render } from 'preact'

const MATRIX_SIZE = 8
const MATRIX_LENGTH = MATRIX_SIZE * MATRIX_SIZE

const Table = ({ children }) => (
  <table
    cellPadding='0'
    cellSpacing='0'
    style={{ borderCollapse: 'collapse' }}
  >
    <tbody>
      {children}
    </tbody>
  </table>
)

const TableCell = ({ key, color }) => (
  <td
    key={key}
    style={{
      height: '20px',
      width: '20px',
      backgroundColor: color,
      border: '1px solid darkgrey'
    }}
  />
)

const WebLeds = () => {
  let domElement

  const renderToDom = content => {
    domElement = render(content, document.getElementById('matrix'), domElement)
  }

  const isValidColorIntensity = value => {
    return value >= 0 && value <= 255
  }

  const rgbArrayToColor = rgbArray => {
    return rgbArray.length === 3 && rgbArray.every(isValidColorIntensity)
      ? `rgb(${rgbArray.join(',')})`
      : 'black'
  }

  const setPixels = matrix => {
    if (matrix.length !== MATRIX_LENGTH) {
      console.error(`Pixel arrays must have ${MATRIX_LENGTH} elements`)
    }

    renderToDom((
      <Table>{
        [...Array(MATRIX_SIZE)].map((_, i) => (
          <tr key={`tr-${i}`}>
            {matrix
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
    ))
  }

  const setPixel = () => {
    console.log('work in progress')
  }

  const showMessage = () => {
    console.log('work in progress')
  }

  return {
    setPixels,
    setPixel,
    showMessage
  }
}

export default WebLeds()
