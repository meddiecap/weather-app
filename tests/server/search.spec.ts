import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest'


// 1) Provide minimal h3/Nitro shims so the route can be imported in Vitest
vi.mock('h3', () => ({
    getQuery: (e: any) => e._query || {},
}))


// 2) Shim useRuntimeConfig and defineCachedEventHandler to simulate Nitro caching
const map = new Map<string, any>()

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


// 3) Mock fetch used by ofetch
const mockJson = { results: [{ name: 'Berlin', latitude: 52.52, longitude: 13.405 }] }
const fetchSpy = vi.fn(async () =>
  new Response(JSON.stringify(mockJson), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
)
// @ts-ignore
global.fetch = fetchSpy


// Import after mocks so the route picks them up
import defineCachedEventHandler from '../../server/api/search.get'


function makeEvent(query: Record<string, any>) {
    return { req: { method: 'GET', headers: {} }, _query: query }
}


describe('/api/search', () => {
    beforeEach(() => { fetchSpy.mockClear(); map.clear() })

    it('returns geocoding result', async () => {
        const res = await (defineCachedEventHandler as any)(makeEvent({ name: 'Berlin' }))
        expect(res.results?.[0]?.name).toBe('Berlin')
        expect(fetchSpy).toHaveBeenCalledTimes(1)
    })


    it('serves from cache on second call with same query', async () => {
        await (defineCachedEventHandler as any)(makeEvent({ name: 'Berlin' }))
        await (defineCachedEventHandler as any)(makeEvent({ name: 'Berlin' }))
        expect(fetchSpy).toHaveBeenCalledTimes(1) // cache hit
    })


    it('throws on short name', async () => {
        // name too short
        await expect((defineCachedEventHandler as any)(makeEvent({ name: 'ab' }))).rejects.toThrow(/min length/i)
    })
})