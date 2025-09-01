import type { H3Event } from 'h3'
import { makeSearchKey } from '../utils/route-helpers'
import { geocodeHandler } from '../utils/geocodeHandler';

// ✅ Explicitly import Nuxt auto-imports so Vitest can mock them via `#imports`
import { defineCachedEventHandler, getQuery, useRuntimeConfig } from '#imports'

export default defineCachedEventHandler(geocodeHandler, {
    maxAge: (() => {
        const cfg = useRuntimeConfig()
        return Number(cfg.cacheTtl?.search ?? 30) // seconds
    })(),
    getKey: (event: H3Event) => {
        const q = getQuery(event)
        return makeSearchKey({
            name: String(q.name ?? ''),
            language: q.language ? String(q.language) : undefined,
            count: q.count ? Number(q.count) : undefined,
        })
    }
})