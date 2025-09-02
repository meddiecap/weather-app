import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect, vi } from 'vitest'

// Mock $fetch globally for all tests in this file
vi.stubGlobal('$fetch', vi.fn(async () => {
  // You can customize the response based on the URL or query if needed
  return {
    results: [
      { name: 'Berlin', latitude: 52.52, longitude: 13.405 }
    ]
  }
}))

await setup({
  server: true,
  browser: false,
})

describe('/api/search', () => {
  it('returns geocoding data for valid name', async () => {
    const res = await $fetch('/api/search', {
      query: { name: 'Berlin' }
    })
    expect(res).toHaveProperty('results')
    expect(res.results[0].name).toBe('Berlin')
  })

  it('returns error for missing name', async () => {
    await expect(
      $fetch('/api/search', { query: {} })
    ).rejects.toThrow(/name/)
  })
})
