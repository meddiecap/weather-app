
import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect, vi } from 'vitest'

// Mock $fetch globally for all tests in this file
vi.stubGlobal('$fetch', vi.fn(async (url, opts) => {
    // You can customize the response based on the URL or query if needed
    return {
        hourly: {
            time: ['2025-08-31T00:00'],
            temperature_2m: [19.3]
        }
    }
}))

await setup({
    server: true,
    browser: false,
})

type Res = {
    hourly?: {
        time?: string[]
    }
}

describe('/api/forecast', () => {
    it('returns forecast data for valid lat/lon', async () => {
        const res = <Res> await $fetch('/api/forecast', {
            query: { lat: '52.52', lon: '13.405', hourly: 'temperature_2m' }
        })
        expect(res).toHaveProperty('hourly')
        expect(res.hourly).toHaveProperty('time')
    })

    it('returns error for missing lat', async () => {
        await expect(
            $fetch('/api/forecast', { query: { lon: '13.405' } })
        ).rejects.toThrow(/lat/)
    })

    it('returns error for missing lon', async () => {
        await expect(
            $fetch('/api/forecast', { query: { lat: '52.52' } })
        ).rejects.toThrow(/lon/)
    })
})
