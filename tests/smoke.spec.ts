// Simple smoke test to verify CI runs
import { describe, it, expect } from 'vitest'

describe('smoke', () => {
    it('runs a basic assertion', () => {
        expect(1 + 1).toBe(2)
    })
})