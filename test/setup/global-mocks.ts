import { vi } from 'vitest'

interface LocalStorageMock {
  state: Record<string, string>
  setItem(key: string, item: string): void
  getItem(key: string): string | null
  removeItem(key: string): void
  clear(): void
  readonly length: number
  key(index: number): string | null
}

const localStorageMock: LocalStorageMock = {
  state: {},
  setItem(key: string, item: string) {
    this.state[key] = item
  },
  getItem(key: string) {
    return Object.prototype.hasOwnProperty.call(this.state, key) ? this.state[key] : null
  },
  removeItem(key: string) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete this.state[key]
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

vi.stubGlobal('localStorage', localStorageMock)