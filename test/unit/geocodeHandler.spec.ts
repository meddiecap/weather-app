import { describe, it, expect, vi, beforeEach } from 'vitest'
import { geocodeHandler } from '../../server/utils/geocodeHandler'

// Mock h3 APIs used by the handler
vi.mock('h3', () => ({
    getQuery: (event: any) => event.getQuery(),
    createError: (opts: any) => Object.assign(new Error(opts.statusMessage), { statusCode: opts.statusCode })
}))

// Mock global $fetch
vi.stubGlobal('$fetch', vi.fn())

const mockEvent = (query: Record<string, any> = {}) => ({ getQuery: () => query })

describe('geocodeHandler', () => {
    let $fetch: any
    beforeEach(() => {
        vi.clearAllMocks()
        $fetch = (global as any).$fetch
    })

    it('proxies valid geocoding requests', async () => {
        $fetch.mockResolvedValue({ results: [{ name: 'Berlin', latitude: 1, longitude: 2 }] })
        const event = mockEvent({ name: 'Berlin' })
        const res = await geocodeHandler(event as any)
        expect(res).toHaveProperty('results')
        expect(res.results[0].name).toBe('Berlin')
        expect($fetch).toHaveBeenCalled()
    })

    it('retries on error and eventually succeeds', async () => {
        $fetch
            .mockRejectedValueOnce(new Error('temporary error'))
            .mockResolvedValue({ results: [{ name: 'Berlin' }] })
        const event = mockEvent({ name: 'Berlin' })
        const res = await geocodeHandler(event as any)
        expect(res.results[0].name).toBe('Berlin')
        expect($fetch).toHaveBeenCalledTimes(2)
    })

    it('throws when all retries fail', async () => {
        $fetch.mockRejectedValue(new Error('Failed to fetch geocoding data'))
        const event = mockEvent({ name: 'Berlin' })
        await expect(geocodeHandler(event as any)).rejects.toThrow(/Failed to fetch geocoding data/)
    })

    it('returns 400 when name is missing', async () => {
        const event = mockEvent({})
        await expect(geocodeHandler(event as any)).rejects.toThrow(/Query parameter "name" is required/)
    })
})
