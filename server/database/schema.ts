import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// GeoNames location tables
export interface GeoLocationContinent {
  id: number;
  geonameid: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface GeoLocationCountry {
  id: number;
  geonameid: number;
  name: string;
  slug: string;
  iso2: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface GeoLocationCity {
  id: number;
  geonameid: number;
  country_id: number;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  timezone: string;
  created_at: string;
  updated_at: string;
}

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

export const geoLocationContinents = sqliteTable('geo_location_continents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  geonameid: integer('geonameid').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  created_at: integer('created_at').notNull(),
  updated_at: integer('updated_at').notNull(),
})

export const geoLocationCountries = sqliteTable('geo_location_countries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  geonameid: integer('geonameid').notNull().unique(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  iso2: text('iso2').notNull(),
  timezone: text('timezone').notNull(),
  created_at: integer('created_at').notNull(),
  updated_at: integer('updated_at').notNull(),
})

export const geoLocationCities = sqliteTable('geo_location_cities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  geonameid: integer('geonameid').notNull().unique(),
  country_id: integer('country_id').notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  timezone: text('timezone').notNull(),
  created_at: integer('created_at').notNull(),
  updated_at: integer('updated_at').notNull(),
  countryId: integer('country_id').references(() => geoLocationCountries.id).notNull(),
})