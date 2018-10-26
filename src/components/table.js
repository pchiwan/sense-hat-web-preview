import { h } from 'preact'

export const Table = ({ children }) => (
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

export const TableCell = ({ key, color }) => (
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
