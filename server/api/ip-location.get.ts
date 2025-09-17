// server/api/geo.get.ts
import { getRequestIP } from 'h3'
import { ipLocationHandler } from '../utils/ipLocationHandler'

import { defineCachedEventHandler, getQuery } from '#imports'

export default defineCachedEventHandler(async (event) => {
    let ip = getRequestIP(event) || (getQuery(event).ip as string)
    
    // In DEV mode, default to a known IP for consistent testing
    if (process.env.NODE_ENV === 'development' && (!ip || ip === '::1' || ip === '127.0.0.1')) {
        ip = '8.8.8.8' // Use a public DNS server as a fallback
    }

    // Call your external service:
    const data = await ipLocationHandler(ip)
    console.log("IP (" + ip + ") location data:", data)
    return data
}, {
    maxAge: 60 * 60 * 24,  // seconds (24h)
    swr: true,             // serve stale while revalidating
    getKey: (event) => `geo:${getRequestIP(event) || getQuery(event).ip}`,
    base: 'cache'          // uses the 'cache' storage mount (see nuxt.config)
})