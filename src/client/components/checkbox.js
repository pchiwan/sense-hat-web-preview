import { h } from 'preact'

const checkboxStyles = {
  lineHeight: '40px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  userSelect: 'none'
}

const Checkbox = ({ checked, label, onChange }) => {
  return (
    <div onClick={onChange} style={checkboxStyles}>
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
