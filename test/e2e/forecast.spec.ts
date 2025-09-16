
import { setup, $fetch } from '@nuxt/test-utils/e2e'
import { describe, it, expect } from 'vitest'


type ResFailed = {
    statusCode: number
    statusMessage: string
}

describe('/api/forecast', async () => {

    await setup({
        server: true,
        dev: true, // <-- required
    });

    it('returns error for missing lat', async () => {
        let data: ResFailed
    
        // Simulate a request to the forecast API without the 'lat' parameter
        // It seems that in "e2e" tests, $fetch throws on HTTP errors, unlike in local tests.
        // We need to catch the error and extract the response data from it.
        try {
            data = await $fetch<ResFailed>('/api/forecast', { query: { lon: '13.405' } })
        } catch (err: unknown) {
            data = err.data || err.response?._data || err.response?.data || err
        }
    
        expect(data.statusCode).toBe(400)
        expect(data.statusMessage).toMatch(/lat/)
    })

    it('returns error for missing lon', async () => {
        let data: ResFailed

        // Simulate a request to the forecast API without the 'lon' parameter
        // It seems that in "e2e" tests, $fetch throws on HTTP errors, unlike in local tests.
        // We need to catch the error and extract the response data from it.
        try {
            data = await $fetch<ResFailed>('/api/forecast', { query: { lat: '52.52' } })
        } catch (err: unknown) {
            data = err.data || err.response?._data || err.response?.data || err
        }

        expect(data.statusCode).toBe(400)
        expect(data.statusMessage).toMatch(/lon/)

    })
})
