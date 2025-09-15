import { defineEventHandler, getRouterParam } from 'h3'

export default defineEventHandler(async (event) => {
    const slug = getRouterParam(event, 'slug')
    if (!slug) return { error: 'Missing slug' }

    const db = hubDatabase()
    const row = await db.prepare('SELECT * FROM geo_locations').first()
    
    if (!row) return { error: 'Not found' }
    return row
})