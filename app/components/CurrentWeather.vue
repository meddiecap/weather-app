<template>
  <div class="current-weather">
    <div v-if="weather">
      <div class="flex gap-4 divide-x divide-slate-300">
        <div class="flex w-1/2 gap-4">
          <img class="w-30" :src="`/icons/weather_icons/static/${icon}`" alt="Weather icon">
          <div class="text-7xl">
            {{ weather.current.temperature_2m }}°C
          </div>
        </div>

        <div class="flex-grow pl-4">

          <dl class="divide-y divide-gray-100 dark:divide-white/10">
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Wind</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400 text-right">{{
                windCompass }} {{ weather.current.wind_speed_10m }} km/h (Bft: {{ windBeaufort }})</dd>
            </div>
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Cloud cover</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400 text-right">{{
                weather.current.cloud_cover }}%</dd>
            </div>
            <div class="sm:grid sm:grid-cols-3 sm:gap-2 sm:px-0">
              <dt class="text-sm/6 font-medium text-gray-900 dark:text-gray-100">Precipitation</dt>
              <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0 dark:text-gray-400 text-right">{{
                weather.current.precipitation }} mm</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeatherStore } from '~~/stores/weather'
import { windSpeedToBeaufort, windDirectionToCompass, getWeatherIcon } from '~/utils/weather'
import type { Location } from '~~/types/Location'

const props = defineProps<{
  location: Location
}>()

const weatherStore = useWeatherStore()
const weatherKey = computed(() => weatherStore.makeKey(props.location))

const weather = computed(() => weatherStore.data[weatherKey.value])

const icon = computed(() =>
  weather.value ? getWeatherIcon(weather.value.current.weather_code, weather.value.current.is_day) : 'cloudy.svg'
)
const windBeaufort = computed(() =>
  weather.value?.current.wind_speed_10m != null ? windSpeedToBeaufort(weather.value.current.wind_speed_10m) : ''
)
const windCompass = computed(() =>
  weather.value?.current.wind_direction_10m != null ? windDirectionToCompass(weather.value.current.wind_direction_10m) : ''
)
</script>
