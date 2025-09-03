<template>
  <div class="current-weather">
    <div v-if="pending">Loading...</div>
    <div v-else-if="error" class="text-red-500">Failed to load weather data.</div>
    <div v-else-if="weather">
      <div class="flex gap-4 divide-x divide-slate-300">
        <div class="flex w-1/2">
          <img :src="`/icons/weather_icons/static/${icon}`" alt="Weather icon">
          <div class="text-6xl">
            {{ weather.temperature_2m }}°C
          </div>
        </div>

        <div class="flex-grow pl-4">
          
          <dl class="divide-y divide-gray-100 dark:divide-white/10">
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Wind</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{ weather.wind_speed_10m }} km/h (Bft: {{ windBeaufort }}, {{ windCompass }})</dd>
            </div>
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Cloud cover</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{ weather.cloud_cover }}%</dd>
            </div>
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Precipitation</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{ weather.precipitation }} mm</dd>
            </div>
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Condition</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{ weather.weather_code }}</dd>
            </div>
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Daytime</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400">{{ weather.is_day ? 'Yes' : 'No' }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { windSpeedToBeaufort, windDirectionToCompass, getWeatherIcon } from '~/utils/weather'

// Hardcoded Berlin for now
const lat = 52.52
const lon = 13.405

const { data, pending, error } = await useFetch('/api/forecast', {
  query: {
    lat,
    lon,
    hourly: 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code,is_day',
    // You can add more params as needed
  },
  // server: false // Uncomment if you want client-side fetch only
})

const icon = computed(() =>
  weather.value ? getWeatherIcon(weather.value.weather_code, weather.value.is_day) : 'cloudy.svg'
)

const weather = computed(() => {
  if (!data.value || !data.value.hourly) return null
  // Get the latest value (last in array)
  const idx = data.value.hourly.time?.length - 1
  return {
    temperature_2m: data.value.hourly.temperature_2m?.[idx],
    precipitation: data.value.hourly.precipitation?.[idx],
    cloud_cover: data.value.hourly.cloud_cover?.[idx],
    wind_speed_10m: data.value.hourly.wind_speed_10m?.[idx],
    wind_direction_10m: data.value.hourly.wind_direction_10m?.[idx],
    weather_code: data.value.hourly.weather_code?.[idx],
    is_day: data.value.hourly.is_day?.[idx],
  }
})

const windBeaufort = computed(() =>
  weather.value?.wind_speed_10m != null ? windSpeedToBeaufort(weather.value.wind_speed_10m) : ''
)
const windCompass = computed(() =>
  weather.value?.wind_direction_10m != null ? windDirectionToCompass(weather.value.wind_direction_10m) : ''
)
</script>
