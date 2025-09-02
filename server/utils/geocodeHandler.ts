import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { assertName } from '../utils/route-helpers'

type RetryOptions = {
  retries?: number      // number of retries after the first attempt
}

export async function geocodeHandler(event: H3Event, opts: RetryOptions = {}) {
  const query = getQuery(event)
  const name = assertName(query.name as string)
  const count = query.count ? Number(query.count) : undefined
  const language = query.language as string | undefined

  const url = 'https://geocoding-api.open-meteo.com/v1/search'
  const maxRetries = opts.retries ?? 1 // default: 1 retry => 2 attempts total
  let lastErr: unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const data = await $fetch(url, { query: { name, count, language } })
      return data
    } catch (err) {
      lastErr = err
      // loop continues if we still have retries
    }
  }

  // Keep message consistent with your test expectation
  throw new Error('Failed to fetch geocoding data')
}