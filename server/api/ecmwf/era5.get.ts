// Nuxt 4 / Nitro route: fetch ERA5-Land NetCDF for a Vancouver bbox (or user-provided),
// by delegating the actual download to a tiny Python helper using cdsapi.
// Returns the NetCDF as a file download. Consider increasing serverless timeouts if needed.

// Lint ignores this file for now
/* eslint-disable */

import { defineEventHandler, getQuery, setHeader } from 'h3'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promises as fs } from 'node:fs'

function toList(v?: string | string[], fallback?: string[]) {
  if (!v) return fallback
  if (Array.isArray(v)) return v
  return v.split(',').map(s => s.trim()).filter(Boolean)
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event)

  // Default Vancouver bbox: N, W, S, E  (roughly Metro Vancouver)
  const N = q.n ? Number(q.n) : 49.6
  const W = q.w ? Number(q.w) : -123.4
  const S = q.s ? Number(q.s) : 49.0
  const E = q.e ? Number(q.e) : -122.5

  // Date/time selection (small slice by default)
  const year = (q.year as string) || '2024'
  const month = toList(q.month as string, ['06'])
  const day = toList(q.day as string, ['01','02'])
  const time = toList(q.time as string, ['00:00','06:00','12:00','18:00'])

  // Variables & grid
  const variables = toList(q.vars as string, ['2m_temperature','total_precipitation'])
  const grid = [0.25, 0.25]

  // Where to save the file
  const outName = `era5_${year}_${month.join('-')}_${N}_${W}_${S}_${E}.nc`.replace(/[^\w.\-]+/g, '_')
  const target = join(tmpdir(), outName)

  // Build JSON payload for the Python helper
  const payload = {
    dataset: 'reanalysis-era5-land',
    variables,
    year,
    month,
    day,
    time,
    area: [N, W, S, E],
    grid,
    target
  }

  // Call the Python helper (scripts/fetch_era5.py) via stdin
  const py = spawn('python3', ['scripts/fetch_era5.py'], {
    env: {
      ...process.env, // Ensure CDSAPI_URL and CDSAPI_KEY are available
    },
    stdio: ['pipe', 'pipe', 'pipe']
  })

  const result = await new Promise<{ ok: boolean; target?: string; error?: string }>((resolve) => {
    let out = ''
    let err = ''
    py.stdout.on('data', (d) => (out += d.toString()))
    py.stderr.on('data', (d) => (err += d.toString()))
    py.on('close', (code) => {
      if (code === 0) {
        try {
          resolve(JSON.parse(out))
        } catch (e) {
          resolve({ ok: false, error: 'Failed to parse Python output' })
        }
      } else {
        resolve({ ok: false, error: err || `Python exited with code ${code}` })
      }
    })
    py.stdin.write(JSON.stringify(payload))
    py.stdin.end()
  })

  if (!result.ok || !(result.target && await fileExists(result.target))) {
    return {
      ok: false,
      message: 'Failed to fetch ERA5 subset',
      error: result.error || 'Unknown error'
    }
  }

  // Stream the NetCDF back to the client
  const buf = await fs.readFile(result.target)
  setHeader(event, 'Content-Type', 'application/netcdf')
  setHeader(event, 'Content-Disposition', `attachment; filename="${outName}"`)
  return buf
})

async function fileExists(p: string) {
  try { await fs.access(p); return true } catch { return false }
}
