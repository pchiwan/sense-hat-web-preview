import { h } from 'preact'

export const Table = ({ children, getRef, style }) => (
  <table
    ref={getRef}
    cellPadding='0'
    cellSpacing='0'
    style={style}
  >
    <tbody>
      {children}
    </tbody>
  </table>
)

Table.defaultProps = {
  getRef: () => {}
}

export const TableCell = ({ key, color, showBorder }) => (
  <td
    key={key}
    style={{
      height: '20px',
      width: '20px',
      backgroundColor: color,
      border: `${showBorder ? '1px solid darkgrey' : 'none'}`,
      borderRadius: `${showBorder ? '0' : '3px'}`,
      boxSizing: 'border-box'
    }}
  />
)
