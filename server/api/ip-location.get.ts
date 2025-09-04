// server/api/geo.get.ts
import { getRequestIP } from 'h3'

export default defineCachedEventHandler(async (event) => {
    const ip = getRequestIP(event) || (getQuery(event).ip as string)
    // Call your external service:
    const data = await $fetch(`http://ip-api.com/json/${ip}`)
    return data
}, {
    maxAge: 60 * 60 * 24,  // seconds (24h)
    swr: true,             // serve stale while revalidating
    getKey: (event) => `geo:${getRequestIP(event) || getQuery(event).ip}`,
    base: 'cache'          // uses the 'cache' storage mount (see nuxt.config)
})