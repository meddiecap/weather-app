// stores/weather.ts
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Location } from '../types/Location'

type Row = Record<string, unknown>

function makeKey(loc: Pick<Location, 'lat' | 'lon'>): string {
    const lat = Number(loc.lat)
    const lon = Number(loc.lon)
    // Normalize to stable precision so "49.2" and "49.2000" map to the same key
  return `${lat.toFixed(4)},${lon.toFixed(4)}`
}

export const useWeatherStore = defineStore('weather', () => {
    const data: Record<string, Row> = reactive({})

    async function fetchWeather(location: Pick<Location, 'lat' | 'lon' | 'timezone'>) {
        const key = makeKey(location)
        if (data[key] !== undefined) return
        try {
            data[key] = await $fetch('/api/forecast', {
                query: {
                    lat: Number(location.lat),
                    lon: Number(location.lon),
                    // Use Open-Meteo field names with underscores
                    hourly: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,is_day',
                    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
                    current: 'temperature_2m,is_day,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,apparent_temperature,precipitation',
                    timezone: location.timezone || 'auto',
                },
            }) as unknown as Row
        } catch (e: unknown) {
            console.error('Error fetching weather for key:', key, e)
        }
    }

    function getData(loc: Location) {
        return data[makeKey(loc)] || null
    }

    return { data, fetchWeather, makeKey, getData }
}, {
    persist: true
})
