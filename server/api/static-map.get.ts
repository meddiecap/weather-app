import { getQuery } from 'h3'
import { $fetch } from 'ofetch'
import { join } from 'pathe'
import { promises as fs } from 'fs'

// Cache images for 1 week (in seconds)
const CACHE_TTL = 60 * 60 * 24 * 7

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const lat = query.lat
    const lon = query.lon
    const zoom = query.zoom ?? 9
    const width = query.width ?? 600
    const height = query.height ?? 400

    if (!lat || !lon) {
        event.res.statusCode = 400
        return 'Missing lat or lon'
    }

    const config = useRuntimeConfig()
    const accessToken = config.mapBoxAccessToken
    if (!accessToken) {
        event.res.statusCode = 500
        return 'Missing Mapbox access token'
    }

    // Compose Mapbox static image URL
    const marker = `pin-s+ff0000(${lon},${lat})`
    const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/${marker}/${lon},${lat},${zoom},0/${width}x${height}?access_token=${accessToken}`

    // Path in public/maps
    const publicDir = join(process.cwd(), 'public', 'maps')
    const publicFile = join(publicDir, `${lat}_${lon}_${zoom}_${width}x${height}.png`)

    // Fetch from Mapbox
    const buffer = await $fetch(mapboxUrl, { responseType: 'arrayBuffer' })
    const image = Buffer.from(buffer)
    // Also write to public/maps for direct serving
    try {
        await fs.mkdir(publicDir, { recursive: true })
        await fs.writeFile(publicFile, image)
    } catch (e) {
        // Ignore write errors
    }

    event.res.setHeader('Content-Type', 'image/png')
    return image
})
