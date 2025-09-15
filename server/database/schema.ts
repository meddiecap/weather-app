import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const geoLocations = sqliteTable('geo_locations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
    open_weather_id: integer('open_weather_id').notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    lat: text('lat').notNull(),
    lon: text('lon').notNull(),
    country: text('country').notNull(),
    country_code: text('country_code').notNull(), // 2-letter ISO 3166-1 country code
    state: text('state').notNull(),
    timezone: text('timezone').notNull(),
    created_at: integer('created_at').notNull(),
    updated_at: integer('updated_at').notNull(),
})