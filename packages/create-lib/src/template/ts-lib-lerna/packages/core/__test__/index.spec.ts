import { helloWord } from '../src'

describe('test index ', () => {
  test('test helloWord ', () => {
    expect(helloWord()).toBe('hello-word')
  })
})
