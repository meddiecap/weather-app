import { describe, it, expect, vi, beforeEach } from 'vitest'


vi.mock('h3', () => ({
    getQuery: (e: any) => e._query || {},
}))


const map = new Map<string, any>()
// @ts-ignore
global.useRuntimeConfig = () => ({ cacheTtl: { search: 60, forecast: 600 } })
// @ts-ignore
global.defineCachedEventHandler = (fn: any, opts: any) => {
    return async (event: any) => {
        const key = opts?.getKey ? opts.getKey(event) : '__'
        if (map.has(key)) return map.get(key)
        const res = await fn(event)
        map.set(key, res)
        return res
    }
}

vi.mock('#imports', () => ({
    getQuery: (e: any) => e._query || {},
    useRuntimeConfig: () => ({ cacheTtl: { search: 60, forecast: 600 } }),
    defineCachedEventHandler: (fn: any, opts: any) => {
        return async (event: any) => {
            const key = opts?.getKey ? opts.getKey(event) : '__'
            if (map.has(key)) return map.get(key)
            const res = await fn(event)
            map.set(key, res)
            return res
        }
    }
}))


// Mock the network behind ofetch
const mockForecast = { hourly: { time: ['2025-08-31T00:00'], temperature_2m: [19.3] } }
const fetchSpy = vi.fn(async () =>
  new Response(JSON.stringify(mockForecast), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
)
// @ts-ignore
global.fetch = fetchSpy


import handler from '../../server/api/forecast.get'


function makeEvent(query: Record<string, any>) {
    return { req: { method: 'GET', headers: {} }, _query: query }
}


describe('/api/forecast', () => {
    beforeEach(() => { fetchSpy.mockClear(); map.clear() })


    it('requires lat & lon', async () => {
        await expect((handler as any)(makeEvent({}))).rejects.toThrow(/lat/i)
    })


    it('returns hourly data and caches subsequent identical call', async () => {
        const q = { lat: '52.52', lon: '13.405', hourly: 'temperature_2m' }
        const a = await (handler as any)(makeEvent(q))
        expect(a.hourly.temperature_2m[0]).toBe(19.3)
        expect(fetchSpy).toHaveBeenCalledTimes(1)


        const b = await (handler as any)(makeEvent(q))
        expect(b.hourly.temperature_2m[0]).toBe(19.3)
        expect(fetchSpy).toHaveBeenCalledTimes(1) // cache hit
    })
})