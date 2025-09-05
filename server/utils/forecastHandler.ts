import type { H3Event } from 'h3'
import { getQuery } from 'h3';
import { assertCoords } from '../utils/route-helpers'

export async function forecastHandler(event: H3Event) {
    const q = getQuery(event)
    const { lat, lon } = assertCoords(q.lat as string | number | undefined, q.lon as string | number | undefined)

    const hourly = (q.hourly as string) ?? undefined
    const daily = (q.daily as string) ?? undefined
    const current = (q.current as string) ?? undefined
    const timezone = (q.timezone as string) ?? 'auto'

    const url = 'https://api.open-meteo.com/v1/forecast'
    const data = await $fetch(url, {
        query: { latitude: lat, longitude: lon, hourly, daily, current, timezone }
    })
    
    return data
}
