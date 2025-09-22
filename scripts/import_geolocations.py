from io import StringIO
import sqlite3
import csv
import datetime
import re
import requests

DB_NAME = "geonames.sqlite"

# ====== Helpers ======

def slugify(name: str) -> str:
    """Convert a name into a slug for URLs."""
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9]+', '-', slug)
    slug = slug.strip('-')
    return slug

def now():
    return datetime.datetime.utcnow().isoformat(sep=' ', timespec='seconds')

def build_country_to_continent_map(url="https://download.geonames.org/export/dump/countryInfo.txt"):
    """
    Download countryInfo.txt en bouw een dict { country_code: continent_code }
    """
    response = requests.get(url)
    response.raise_for_status()
    
    # GeoNames countryInfo.txt heeft commentaarregels met #
    data = StringIO(response.text)
    reader = csv.reader(data, delimiter='\t')
    
    mapping = {}
    for row in reader:
        if not row or row[0].startswith('#'):
            continue
        iso2 = row[0]        # 2-letter ISO
        continent = row[8]   # Continent code (AF, EU, AS, NA, SA, OC, AN)
        mapping[iso2] = continent
    
    return mapping

def get_continent_by_country_code(country_code, mapping):
    """
    Get continent code (AF, EU, etc.) of a country (e.g. 'NL', 'AD').
    """        
    return mapping.get(country_code.upper())

# ====== Database setup ======

def create_schema(conn):
    cur = conn.cursor()
    cur.executescript("""
    DROP TABLE IF EXISTS geo_location_continents;
    DROP TABLE IF EXISTS geo_location_countries;
    DROP TABLE IF EXISTS geo_location_provinces;
    DROP TABLE IF EXISTS geo_location_cities;

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
    """)
    print("Database schema created.")
    conn.commit()

# ====== Import functions ======

def import_file(conn, filepath):
    """Import data from a GeoNames TXT file into SQLite (filtered)."""
    cur = conn.cursor()

    countries = []
    provinces = []
    cities = []
    line_count = 0

    country_to_continent = build_country_to_continent_map()
    print(f"Loaded {len(country_to_continent)} country to continent mappings.")

    with open(filepath, encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")

        for row in reader:
            if not row or len(row) < 19:
                continue

            geonameid = int(row[0])
            name = row[1]
            lat = row[4]
            lon = row[5]
            fcode = row[7]
            country = row[8]
            admin1 = row[10]
            timezone = row[17]
            moddate = row[18]

            slug = slugify(name)
            created = now()
            updated = moddate

            # skip entries outside EU and North America
            if not get_continent_by_country_code(country, country_to_continent) in ("EU", "NA"):
                continue

            if fcode == "PCLI":  # Country (Only EU and North America)
                countries.append((
                    "country", geonameid, name, slug, country, timezone, created, updated
                ))
            elif fcode == "ADM1":  # Province
                provinces.append((
                    "province", geonameid, name, slug, country, timezone, created, updated
                ))
            elif fcode in ("PPL", "PPLA", "PPLC"):  # City
                cities.append((
                    "city", geonameid, name, slug, country, admin1, lat, lon, timezone, created, updated
                ))

    # Insert in dependency order
    if countries:
        insert_batch(cur, countries)
        conn.commit()
        line_count += len(countries)
        print(f"Imported {line_count} countries...")
        # Build country_code -> country_id lookup
        cur.execute("SELECT id, iso2 FROM geo_location_countries")
        country_lookup = {row[1]: row[0] for row in cur.fetchall()}

    if provinces:
        insert_batch(cur, provinces)
        conn.commit()
        line_count += len(provinces)
        print(f"Imported {line_count} provinces...")

        # Build (country_id, province_geonameid) -> province_id lookup
        cur.execute("SELECT id, country_id, geonameid FROM geo_location_provinces")
        province_lookup = {(row[1], str(row[2])): row[0] for row in cur.fetchall()}

    
    if cities:
        batch_size = 50000
        for i in range(0, len(cities), batch_size):
            batch = cities[i:i+batch_size]
            insert_batch(cur, batch, country_lookup, province_lookup)
            conn.commit()
            line_count += len(batch)
            print(f"Imported {line_count} cities...")

def insert_batch(cur, batch, country_lookup = None, province_lookup = None):
    """Insert a batch into the right tables."""
    for entry in batch:
        if entry[0] == "country":
            _, geonameid, name, slug, iso2, tz, created, updated = entry
            cur.execute("""
                INSERT OR IGNORE INTO geo_location_countries
                (geonameid, name, slug, iso2, timezone, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (geonameid, name, slug, iso2, tz, created, updated))
    

        elif entry[0] == "province":
            _, geonameid, name, slug, country, tz, created, updated = entry
            # Lookup country_id
            cur.execute("SELECT id FROM geo_location_countries WHERE iso2=?", (country,))
            country_id = cur.fetchone()
            country_id = country_id[0] if country_id else None
            cur.execute("""
                INSERT OR IGNORE INTO geo_location_provinces
                (geonameid, country_id, name, slug, timezone, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (geonameid, country_id, name, slug, tz, created, updated))

        elif entry[0] == "city":
            _, geonameid, name, slug, country, admin1, lat, lon, tz, created, updated = entry
            country_id = country_lookup.get(country) if country_lookup else None
            prov_id = province_lookup.get((country_id, admin1)) if province_lookup else None

            cur.execute("""
                INSERT OR IGNORE INTO geo_location_cities
                (geonameid, province_id, country_id, name, slug, latitude, longitude, timezone, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (geonameid, prov_id, country_id, name, slug, lat, lon, tz, created, updated))


# ====== Main ======

if __name__ == "__main__":

    conn = sqlite3.connect(DB_NAME)
    create_schema(conn)

    import_file(conn, ".data/allCountries.txt")

    # Close connection
    conn.close()

    print("Done.")
