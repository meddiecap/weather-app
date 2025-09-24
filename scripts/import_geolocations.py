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
        iso2 TEXT UNIQUE,
        timezone TEXT,
        neighbours TEXT,
        created_at TEXT,
        updated_at TEXT
    );

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
    """)
    print("Database schema created.")
    conn.commit()

# ====== Import functions ======
def import_countries(conn, filepath):
    """Import data from a GeoNames TXT file into SQLite (filtered)."""
    cur = conn.cursor()

    with open(filepath, encoding="utf-8") as f:
        reader = csv.reader(f, delimiter="\t")

        for row in reader:
            if not row or row[0].startswith('#'):
                continue

            try:
                iso2 = row[0]
                name = row[4]
                geonameid = int(row[16])
                neighbours = row[17]  # Comma-separated list of ISO2 codes
            except (IndexError, ValueError):
                # Ongeldige rij
                continue

            slug = slugify(name)
            created_at = now()
            # updated_at kun je kiezen: je kunt created_at gebruiken of een andere timestamp. 
            # countryInfo.txt heeft geen modification date kolom.
            updated_at = created_at

            # Timezone is niet aanwezig in countryInfo.txt → we zetten NULL of leeg
            timezone = None

            # Insert of update
            cur.execute("""
                INSERT INTO geo_location_countries
                (geonameid, name, slug, iso2, timezone, neighbours, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(iso2) DO UPDATE SET
                    name=excluded.name,
                    slug=excluded.slug,
                    geonameid=excluded.geonameid,
                    neighbours=excluded.neighbours,
                    updated_at=excluded.updated_at
            """, (geonameid, name, slug, iso2, timezone, neighbours, created_at, updated_at))

    conn.commit()


def import_cities(conn, filepath):
    """Import data from a GeoNames TXT file into SQLite (filtered)."""
    cur = conn.cursor()

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

            '''
            Only the following feature codes are imported (cities, towns, villages):
            See: https://download.geonames.org/export/dump/featureCodes_en.txt
            P.PPL	 populated placea city, town, village, or other agglomeration of buildings where people live and work
            P.PPLA	 seat of a first-order administrative division seat of a first-order administrative division (PPLC takes precedence over PPLA)
            P.PPLA2	 seat of a second-order administrative division seat of a second-order administrative division
            P.PPLA3	 seat of a third-order administrative division seat of a third-order administrative division
            P.PPLA4	 seat of a fourth-order administrative division seat of a fourth-order administrative division
            P.PPLA5	 seat of a fifth-order administrative division seat of a fifth-order administrative division
            P.PPLC	 capital of a political entity capital of a political entity designated as an independent state
            P.PPLG	 seat of government of a political entity
            P.PPLCD	 capital of a dependency or special area capital or administrative center of a dependent political territory or area of special sovereignty
            P.PPLCH	 historical capital of a political entity a former capital of a political entity
            P.PPLF	 farm village a populated place where the population is largely engaged in agricultural activities                        	
            '''

            if fcode in ("PPL", "PPLA", "PPLA2", "PPLA3", "PPLA4", "PPLA5", "PPLC", "PPLG", "PPLCD", "PPLCH", "PPLF"):  # City
                cities.append((
                    "city", geonameid, name, slug, country, lat, lon, timezone, created, updated
                ))

    # Insert in dependency order    
    if cities:
        batch_size = 50000
        for i in range(0, len(cities), batch_size):
            batch = cities[i:i+batch_size]
            insert_batch(cur, batch)
            conn.commit()
            line_count += len(batch)
            print(f"Imported {line_count} cities...")

def insert_batch(cur, batch):
    """Insert a batch into the right tables."""
    
    # get all countries in a lookup dict
    cur.execute("SELECT id, iso2 FROM geo_location_countries")
    country_lookup = {iso2: id for id, iso2 in cur.fetchall()}

    for entry in batch:    
        if entry[0] == "city":
            _, geonameid, name, slug, country, lat, lon, tz, created, updated = entry
            country_id = country_lookup.get(country) if country_lookup else None

            cur.execute("""
                INSERT OR IGNORE INTO geo_location_cities
                (geonameid, country_id, name, slug, latitude, longitude, timezone, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (geonameid, country_id, name, slug, lat, lon, tz, created, updated))


# ====== Main ======

if __name__ == "__main__":

    conn = sqlite3.connect(DB_NAME)
    create_schema(conn)

    import_countries(conn, ".data/countries.txt")
    import_cities(conn, ".data/cities5000.txt")

    # Close connection
    conn.close()

    print("Done.")
