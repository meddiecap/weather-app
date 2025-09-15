
import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect, vi } from 'vitest'

// Mock $fetch globally for all tests in this file
vi.stubGlobal('$fetch', vi.fn(async () => {
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
    dev: true,
})

type Res = {
    hourly?: {
        time?: string[]
        temperature_2m?: number[]
    }
}

type ResFailed = {
    statusCode: number
    statusMessage?: string
    message: string
}

describe('/api/forecast', () => {
    it('returns forecast data for valid lat/lon', async () => {
        const res = <Res>await $fetch('/api/forecast', {
            query: { lat: '52.52', lon: '13.405', hourly: 'temperature_2m' }
        })
        expect(res).toHaveProperty('hourly')
        expect(res.hourly).toHaveProperty('time')
    })

    it('returns error for missing lat', async () => {
        const res = await $fetch<ResFailed>('/api/forecast', { query: { lon: '13.405' } })
        expect(res.statusCode).toBe(400)
        expect(res.message).toMatch(/lat/)
    })

    it('returns error for missing lon', async () => {
        const res = await $fetch<ResFailed>('/api/forecast', { query: { lat: '52.52' } })
        expect(res.statusCode).toBe(400)
        expect(res.message).toMatch(/lon/)
    })
})
