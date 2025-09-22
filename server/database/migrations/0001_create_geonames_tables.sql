-- Migration: Create geo_location tables for geonames import
-- Drops existing tables if present, then creates fresh schema

CREATE TABLE geo_location_continents (
    id INTEGER PRIMARY KEY,
    geonameid INTEGER,
    name TEXT,
    slug TEXT UNIQUE,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE geo_location_countries (
    id INTEGER PRIMARY KEY,
    geonameid INTEGER,
    name TEXT,
    slug TEXT UNIQUE,
    iso2 TEXT,
    timezone TEXT,
    created_at TEXT,
    updated_at TEXT
);

CREATE TABLE geo_location_provinces (
    id INTEGER PRIMARY KEY,
    geonameid INTEGER,
    country_id INTEGER,
    name TEXT,
    slug TEXT,
    timezone TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY(country_id) REFERENCES geo_location_countries(id)
);

CREATE TABLE geo_location_cities (
    id INTEGER PRIMARY KEY,
    geonameid INTEGER,
    province_id INTEGER,
    country_id INTEGER,
    name TEXT,
    slug TEXT,
    latitude REAL,
    longitude REAL,
    timezone TEXT,
    created_at TEXT,
    updated_at TEXT,
    FOREIGN KEY(country_id) REFERENCES geo_location_countries(id),
    FOREIGN KEY(province_id) REFERENCES geo_location_provinces(id)
);
