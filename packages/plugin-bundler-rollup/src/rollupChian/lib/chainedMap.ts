import Chainable from './chainable'

class ChainedMap<T = any> extends Chainable<T> {
  private store: Map<string, any>

  constructor(parent?: T) {
    super(parent)
    this.store = new Map()
  }

  protected extend(methods: string[]) {
    methods.forEach((method) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this[method] = (value: any) => this.set(method, value)
    })
  }

  // base action
  get(key: string) {
    return this.store.get(key)
  }

  getOrCompute<T extends any>(key: string, fn: () => T): T {
    if (!this.has(key)) {
      this.set(key, fn())
    }
    return this.get(key)
  }

  protected set(key: string, val: any) {
    this.store.set(key, val)
    return this
  }

  delete(key: string) {
    return this.store.delete(key)
  }

  clear() {
    this.store.clear()
    return this
  }

  has(key: string) {
    return this.store.has(key)
  }

  isEmpty() {
    return !this.store.size
  }

  // clean undef empty arr obj
  clean(obj: Record<string, any>) {
    return Object.keys(obj).reduce<Record<string, any>>((acc, key) => {
      const value = obj[key]

      if (value === undefined) {
        return acc
      }

      if (Array.isArray(value) && !value.length) {
        return acc
      }

      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        !Object.keys(value).length
      ) {
        return acc
      }

      acc[key] = value

      return acc
    }, {})
  }

  // values
  protected order() {
    // to obj
    const names: string[] = []
    const entries = [...this.store].reduce<Record<string, any>>(
      (res, [key, value]) => {
        names.push(key)
        res[key] = value
        return res
      },
      {}
    )
    // to keys
    // to order
    const order = [...names]
    names.forEach((key) => {
      if (!entries[key]) return
      const { __before, __after } = entries[key]
      if (__before && order.includes(__before)) {
        order.splice(order.indexOf(key), 1)
        order.splice(order.indexOf(__before), 0, key)
      } else if (__after && order.includes(__after)) {
        order.splice(order.indexOf(key), 1)
        order.splice(order.indexOf(__after) + 1, 0, key)
      }
    })

    return { entries, order }
  }

  values() {
    const { entries, order } = this.order()
    return order.map((name) => entries[name])
  }

  entries() {
    const { entries, order } = this.order()
    if (!order.length) return undefined
    return entries
  }

  // merge base config
  mergeBase(obj: Record<string, any>, omit: string[] = []) {
    Object.keys(obj).forEach((key) => {
      if (omit.includes(key)) {
        return
      }

      const value = obj[key]

      if (!this.has(key)) {
        this.set(key, value)
      }
    })

    return this
  }
}

export type IChainedMap = InstanceType<typeof ChainedMap>

export default ChainedMap
