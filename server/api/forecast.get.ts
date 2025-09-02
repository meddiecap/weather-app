import type { H3Event } from 'h3'
import { assertCoords, makeForecastKey } from '../utils/route-helpers'
import { forecastHandler } from '../utils/forecastHandler';

// ✅ Explicitly import Nuxt auto-imports so Vitest can mock them via `#imports`
import { defineCachedEventHandler, getQuery, useRuntimeConfig } from '#imports'

export default defineCachedEventHandler(async (event) => {
    try {
        return await forecastHandler(event)
    } catch (err: any) {
        if (err instanceof Error ) {
            // Parameter validation error
            return createError({ statusCode: 400, statusMessage: err.message })
        }
        throw err
    }
}, {
    maxAge: (() => {
        const cfg = useRuntimeConfig()
        return Number(cfg.cacheTtl?.forecast ?? 600) // seconds
    })(),
    getKey: (event: H3Event) => {
        const q = getQuery(event)
        return makeForecastKey({
            lat: q.lat ? String(q.lat) : undefined,
            lon: q.lon ? String(q.lon) : undefined,
            hourly: q.hourly ? String(q.hourly) : undefined,
            daily: q.daily ? String(q.daily) : undefined,
            model: q.model ? String(q.model) : undefined,
            timezone: q.timezone ? String(q.timezone) : undefined,
        })
    },
    staleMaxAge: 60,
    swr: true
})