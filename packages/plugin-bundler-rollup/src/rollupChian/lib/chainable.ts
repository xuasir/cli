class Chainable<T = any> {
  private parent

  constructor(parent?: T) {
    this.parent = parent
  }

  protected batch(handler: (self: this) => any) {
    if (handler) {
      handler(this)
    }
    return this
  }

  end() {
    return this.parent as T
  }
}

export default Chainable
