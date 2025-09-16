import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'

type ResFailed = {
  statusCode: number
  statusMessage: string
}

describe('/api/search', async () => {
  await setup({
    server: true,
    dev: true,
  })

  it('returns 400 for missing name', async () => {
    let data: ResFailed

    // Simulate a request to the search API without the 'name' parameter
    // It seems that in "e2e" tests, $fetch throws on HTTP errors, unlike in local tests.
    // We need to catch the error and extract the response data from it.
    try {
      data = await $fetch<ResFailed>('/api/search', { query: { } })
    } catch (err: unknown) {
      data = err.data || err.response?._data || err.response?.data || err
    }

    expect(data.statusCode).toBe(400)
    expect(data.statusMessage).toMatch(/name/)
  })
})
