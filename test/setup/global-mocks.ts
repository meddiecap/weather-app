global.localStorage = {
  state: {},
  setItem(key: string, item: string) {
    this.state[key] = item
  },
  getItem(key: string) { 
    return this.state[key]
  },
  removeItem(key: string) {
    const { [key]: removed, ...rest } = this.state
    this.state = rest
  },
  clear() {
    this.state = {}
  },
  get length() {
    return Object.keys(this.state).length
  },
  key(index: number) {
    return Object.keys(this.state)[index] || null
  }
}