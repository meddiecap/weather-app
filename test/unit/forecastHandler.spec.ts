import { describe, it, expect, vi, beforeEach } from 'vitest'
import { forecastHandler } from '../../server/utils/forecastHandler'

// Mock h3 APIs used by the handler
vi.mock('h3', () => ({
    getQuery: (event: any) => event.getQuery(),
}))

// Mock global $fetch
vi.stubGlobal('$fetch', vi.fn())

const mockEvent = (query: Record<string, any> = {}) => ({ getQuery: () => query })

describe('forecastHandler', () => {
    let $fetch: any
    beforeEach(() => {
        vi.clearAllMocks()
        $fetch = (global as any).$fetch
    })

    it('proxies valid forecast requests', async () => {
        $fetch.mockResolvedValue({ hourly: {}, daily: {} })
        const event = mockEvent({ lat: '52.52', lon: '13.405' })
        const res = await forecastHandler(event as any)
        expect(res).toHaveProperty('hourly')
        expect(res).toHaveProperty('daily')
        expect($fetch).toHaveBeenCalled()
    })

    it('returns 400 when lat is missing', async () => {
        const event = mockEvent({ lon: '13.405' })
        await expect(forecastHandler(event as any)).rejects.toThrow(/lat/)
    })

    it('returns 400 when lon is missing', async () => {
        const event = mockEvent({ lat: '52.52' })
        await expect(forecastHandler(event as any)).rejects.toThrow(/lon/)
    })

    it('returns 400 when lat/lon are not numbers', async () => {
        const event = mockEvent({ lat: 'foo', lon: 'bar' })
        await expect(forecastHandler(event as any)).rejects.toThrow(/numbers/)
    })

    it('passes through custom query params', async () => {
        $fetch.mockResolvedValue({})
        const event = mockEvent({ lat: '1', lon: '2', hourly: 'temperature_2m', daily: 'precipitation_sum', timezone: 'Europe/Berlin' })
        await forecastHandler(event as any)
        expect($fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            query: expect.objectContaining({
                latitude: 1,
                longitude: 2,
                hourly: 'temperature_2m',
                daily: 'precipitation_sum',
                timezone: 'Europe/Berlin'
            })
        }))
    })
})