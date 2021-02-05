import Chainable from './chainable'

class ChainedSet<T = any, U = any> extends Chainable<T> {
  store: Set<U>

  constructor(parent?: T) {
    super(parent)
    this.store = new Set()
  }

  // base action
  set(value: U) {
    this.store.add(value)
    return this
  }

  prepend(value: U) {
    this.store = new Set([value, ...this.store])
    return this
  }

  clear() {
    this.store.clear()
    return this
  }

  delete(value: U) {
    this.store.delete(value)
    return this
  }

  has(value: U) {
    return this.store.has(value)
  }

  // values
  values() {
    return [...this.store]
  }

  mergeBase(arr: U[]) {
    this.store = new Set([...arr, ...this.store])
    return this
  }
}

export type IChainedSet = InstanceType<typeof ChainedSet>

export default ChainedSet
