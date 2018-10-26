import { h } from 'preact'

const checkboxStyles = {
  lineHeight: '40px',
  fontWeight: 'bold'
}

const Checkbox = ({ checked, label, onChange }) => {
  return (
    <div style={checkboxStyles}>
      <input
        style={{ outline: 'none' }}
        type='checkbox'
        checked={checked}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  )
}

export default Checkbox
