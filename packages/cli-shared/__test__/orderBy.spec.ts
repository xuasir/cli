import { orderBy } from '../src'

describe('test orderBy ', () => {
  const by = ['a', 'b', 'c', 'd']
  const target = ['b', 'd', 'e', 'c', 'f']
  test('should return origin arrary when by is empty', () => {
    expect(orderBy(target, [])).toEqual(target)
  })

  test('should order ', () => {
    expect(orderBy(target, by)).toEqual(['b', 'c', 'd', 'e', 'f'])
  })
})
