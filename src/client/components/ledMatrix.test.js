import { h } from 'preact'
import { shallow } from 'preact-render-spy'

import LedMatrix from './ledMatrix'
import { Table, TableCell } from './table'

describe('LedMatrix component', () => {
  const expectTableLengthToEqual0 = value => {
    const wrapper = shallow(<LedMatrix matrix={value} />)
    expect(wrapper.find(Table).length).toEqual(0)
  }

  describe('should NOT render a Table', () => {
    test('when matrix is undefined', () => {
      expectTableLengthToEqual0()
    })
    test('when matrix is null', () => {
      expectTableLengthToEqual0(null)
    })
    test('when matrix is empty array', () => {
      expectTableLengthToEqual0([])
    })
    test('when matrix lenght is not a perfect square', () => {
      expectTableLengthToEqual0([1, 1, 1, 1, 1, 1])
    })
  })

  test('should render a Table when matrix length is a perfect square', () => {
    const matrix = Array(4).fill(0)
    const wrapper = shallow(<LedMatrix matrix={matrix} />)
    expect(wrapper.find(Table).length).toEqual(1)
    expect(wrapper.find('tr').length).toEqual(2)
    expect(wrapper.find(TableCell).length).toEqual(4)
  })
})
