#!/usr/bin/env python3
# Fetch a small ERA5-Land subset to NetCDF using CDS API.
# Requirements: pip install cdsapi

import os, sys, json
import cdsapi
from dotenv import load_dotenv
load_dotenv()

def main():
    # Read arguments via stdin (JSON) for simplicity
    payload = json.loads('{"year":"2024","month":["06"],"day":["01","02"]}')

    # Required inputs with defaults
    dataset = payload.get("dataset", "reanalysis-era5-land")
    variables = payload.get("variables", ["2m_temperature", "total_precipitation"])
    year = payload.get("year", "2024")
    month = payload.get("month", ["06"])   # list or str
    day = payload.get("day", ["01","02"])  # list or str
    time = payload.get("time", ["00:00","06:00","12:00","18:00"])  # list or str
    area = payload.get("area", [49.6, -123.4, 49.0, -122.5])  # N, W, S, E (Vancouver region)
    grid = payload.get("grid", [0.25, 0.25])
    target = payload.get("target", "era5_subset.nc")

    # CDS client reads URL/key from env or ~/.cdsapirc
    # You can also pass url/key explicitly: cdsapi.Client(url=os.getenv("CDSAPI_URL"), key=os.getenv("CDSAPI_KEY"))
    c = cdsapi.Client(url=os.getenv("CDSAPI_URL"), key=os.getenv("CDSAPI_KEY"))

    request = {
        "variable": variables,
        "year": year,
        "month": month,
        "day": day,
        "time": time,
        "format": "netcdf",
        "area": area,   # Order matters: North, West, South, East
        "grid": grid
    }

    c.retrieve(dataset, request, target)
    print(json.dumps({"ok": True, "target": target}))

if __name__ == "__main__":
    main()
