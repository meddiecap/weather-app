export function assertName(name?: string) {
    if (!name) throw new Error('Query parameter "name" is required')
    const n = String(name).trim()
    if (n.length < 3) throw new Error('Query parameter "name" must have min length 3')
    return n
}


export function assertCoords(lat?: any, lon?: any) {
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
    return `search::${parts.join('|')}`
}


export function makeForecastKey(q: { lat: number; lon: number; hourly?: string; daily?: string; model?: string; timezone?: string }) {
    const parts = [
        `lat=${q.lat}`, `lon=${q.lon}`,
        q.hourly ? `hourly=${q.hourly}` : '',
        q.daily ? `daily=${q.daily}` : '',
        q.model ? `model=${q.model}` : '',
        q.timezone ? `tz=${q.timezone}` : ''
    ].filter(Boolean)
    return `forecast::${parts.join('|')}`
}