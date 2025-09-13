import { createHash } from 'crypto';

export function assertName(name?: string) {
    if (!name) throw new Error('Query parameter "name" is required')
    const n = String(name).trim()
    if (n.length < 3) throw new Error('Query parameter "name" must have min length 3')
    return n
}


export function assertCoords(lat?: string | number, lon?: string | number) {
    if (lat === undefined) throw new Error('Query parameter "lat" is required')
    if (lon === undefined) throw new Error('Query parameter "lon" is required')
    const la = Number(lat), lo = Number(lon)
    if (Number.isNaN(la) || Number.isNaN(lo)) throw new Error('lat/lon must be numbers')
    return { lat: la, lon: lo }
}


export function makeSearchKey(q: { name: string; language?: string; count?: number }) {
    const parts = [
        `name=${q.name.trim().toLowerCase()}`,
        q.language ? `language=${q.language}` : '',
        q.count ? `count=${q.count}` : '',
    ].filter(Boolean)

    const hash = createHash('sha256').update(parts.join('|')).digest('hex')

    return `search::${hash}`
}


export function makeForecastKey(q: { lat?: string; lon?: string; current?: string; hourly?: string; daily?: string; model?: string; timezone?: string }) {
    const parts = [
        `lat=${q.lat}`, `lon=${q.lon}`,
        q.current ? `current=${q.current}` : '',
        q.hourly ? `hourly=${q.hourly}` : '',
        q.daily ? `daily=${q.daily}` : '',
        q.model ? `model=${q.model}` : '',
        q.timezone ? `tz=${q.timezone}` : ''
    ].filter(Boolean)

    // create a hash of the key parts to ensure the cache key is not too long
    // especially when many hourly/daily fields are requested
    // This also helps to avoid issues with special characters in the cache key.
    const hash = createHash('sha256').update(parts.join('|')).digest('hex')
    
    return `forecast::${hash}`
}