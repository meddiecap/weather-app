import type { H3Event } from 'h3'
import { getQuery } from 'h3';
import { assertName } from '../utils/route-helpers'
import { ofetch } from 'ofetch';

export async function geocodeHandler(event: H3Event) {
    const query = getQuery(event)
    const name = assertName(query.name as string)
    const count = query.count ? Number(query.count) : undefined
    const language = query.language as string | undefined

    const url = 'https://geocoding-api.open-meteo.com/v1/search'
    const data = await ofetch(url, { query: { name, count, language } })

    return data
}
