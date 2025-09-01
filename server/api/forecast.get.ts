import type { H3Event } from 'h3'
import { assertCoords, makeForecastKey } from '../utils/route-helpers'
import { forecastHandler } from '../utils/forecastHandler';

// ✅ Explicitly import Nuxt auto-imports so Vitest can mock them via `#imports`
import { defineCachedEventHandler, getQuery, useRuntimeConfig } from '#imports'

export default defineCachedEventHandler(forecastHandler, {
    maxAge: (() => {
        const cfg = useRuntimeConfig()
        return Number(cfg.cacheTtl?.forecast ?? 600) // seconds
    })(),
    getKey: (event: H3Event) => {
        const q = getQuery(event)
        const { lat, lon } = assertCoords(q.lat, q.lon)
        return makeForecastKey({
            lat, lon,
            hourly: q.hourly ? String(q.hourly) : undefined,
            daily: q.daily ? String(q.daily) : undefined,
            model: q.model ? String(q.model) : undefined,
            timezone: q.timezone ? String(q.timezone) : undefined,
        })
    }
})