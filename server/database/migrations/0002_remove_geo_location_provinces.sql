-- Migration: Remove geo_location_provinces table
-- Drops the geo_location_provinces table and removes its foreign key from geo_location_cities

-- Migration: Remove geo_location_provinces table and province_id from geo_location_cities

DROP TABLE IF EXISTS geo_location_provinces;

-- SQLite does not support DROP COLUMN directly, so we must recreate geo_location_cities
-- 1. Rename the old table
ALTER TABLE geo_location_cities RENAME TO geo_location_cities_old;

-- 2. Create the new table without province_id
CREATE TABLE geo_location_cities (
	id INTEGER PRIMARY KEY,
	geonameid INTEGER,
	country_id INTEGER,
	name TEXT,
	slug TEXT,
	latitude REAL,
	longitude REAL,
	timezone TEXT,
	created_at TEXT,
	updated_at TEXT,
	FOREIGN KEY(country_id) REFERENCES geo_location_countries(id)
);

-- 3. Copy data from old table to new table (excluding province_id)
INSERT INTO geo_location_cities (
	id, geonameid, country_id, name, slug, latitude, longitude, timezone, created_at, updated_at
) SELECT
	id, geonameid, country_id, name, slug, latitude, longitude, timezone, created_at, updated_at
FROM geo_location_cities_old;

-- 4. Drop the old table
DROP TABLE geo_location_cities_old;
