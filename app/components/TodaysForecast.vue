<script setup lang="ts">
import { ref } from 'vue'
import { getWeatherIcon, windDirectionToCompass, windSpeedToBeaufort } from '../../app/utils/weather'
import type { Location } from '~~/types/Location'
import type { HourForecast } from '~~/types/HourForecast'
import type { HourlyWeather } from '~~/types/WeatherData'
import { useWeatherStore } from '~~/stores/weather'

const props = defineProps<{
  location: Location
}>()

const containerRef = ref(null)
const hours = ref<HourForecast[]>([])
const minTemp = ref<number>(0)
const maxTemp = ref<number>(0)

const weatherStore = useWeatherStore()
const weatherKey = computed(() => weatherStore.makeKey(props.location))
const weather = computed(() => weatherStore.data[weatherKey.value])

// Get the current time in the forecast's timezone
const tz = weather.value?.timezone as string
const formatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: tz,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
})

// Format: YYYY-MM-DDTHH:00
const parts = formatter.formatToParts(new Date())
const year = parts.find(p => p.type === 'year')?.value
const month = parts.find(p => p.type === 'month')?.value
const day = parts.find(p => p.type === 'day')?.value
const hour = parts.find(p => p.type === 'hour')?.value
const currentHourIso = `${year}-${month}-${day}T${hour}:00`

// Swiper setup
useSwiper(containerRef, {
  slidesPerView: 4,
  spaceBetween: 0,
  grabCursor: true,
  breakpoints: {
    640: { slidesPerView: 4, spaceBetween: 0 },
    768: { slidesPerView: 6, spaceBetween: 0 },
    1024: { slidesPerView: 8, spaceBetween: 0 },
  },
})

// Find the index of the current hour in the forecast data
const times: string[] = (weather.value?.hourly as { time: string[] })?.time

const nowIdx: number = (() => {
  let idx = times.findIndex(t => t.startsWith(currentHourIso))
  if (idx === -1) {
    // fallback: find the first hour >= current hour
    idx = times.findIndex(t => t >= currentHourIso)
  }
  return idx
})()

const count = 24
// Get 24 hours of data starting from nowIdx, no not wrap around.
// Allow any array, not just specific types in Linter
/* eslint-disable @typescript-eslint/no-explicit-any */
const get24 = (arr: any[]): any[] => {
  return arr.slice(nowIdx, nowIdx + count)
}

if (weather.value) {
  const hourly = weather.value.hourly as HourlyWeather
  const temps = get24(hourly.temperature_2m)
  const codes = get24(hourly.weather_code)
  const windSpeeds = get24(hourly.wind_speed_10m)
  const windDirs = get24(hourly.wind_direction_10m)
  const isDay = get24(hourly.is_day)
  const times24 = get24(times)

  minTemp.value = Math.min(...temps)
  maxTemp.value = Math.max(...temps)

  hours.value = times24.map((t: string, i: number) => ({
    original_time: t,
    time: i === 0 ? 'now' : t.slice(11, 16),
    temperature: Math.round(temps[i]),
    weather_code: codes[i],
    icon: getWeatherIcon(codes[i], isDay[i] === 1),
    winddirection: windDirs[i],
    winddirection_compass: windDirectionToCompass(windDirs[i]) ?? '',
    windspeed: windSpeeds[i],
    beaufort: windSpeedToBeaufort(windSpeeds[i]),
  }))
}

</script>

<template>
  <div class="swiper-wrapper">
    <div class="swiper-wrapper__inner">
      <ClientOnly>
        <swiper-container ref="containerRef" :init="false" class="divide-x divide-gray-200">
          <swiper-slide v-for="(data, idx) in hours" :key="idx">
            <div :data-original-time="data.original_time" class="w-full flex flex-col items-center">
              <div class="text-xl mb-6">{{ data.temperature }} °C</div>
              <img 
                :src="`/icons/weather_icons/static/${data.icon}`" :data-weather-code="data.weather_code"
                class="w-4/6">
              <div class="mb-3">{{ data.time }}</div>
              <div class="mb-3">
                <i 
                  :title="data.winddirection_compass?.toLowerCase()"
                  :class="`text-3xl wi wi-wind from-${data.winddirection}-deg`" />
              </div>
              <div class="mb-6">
                <i 
                  :title="`${data.beaufort} on Beaufort Scale, ${data.windspeed} km/h`"
                  :class="`text-3xl wi wi-wind-beaufort-${data.beaufort}`" />
              </div>

              
              <div class="temperature-graph flex w-full">
                <SvgTemperatureLine
                  :min-temp="minTemp"
                  :max-temp="maxTemp"
                  :start-temp="idx > 0 ? hours[idx - 1]?.temperature as number : data.temperature"
                  :end-temp="data.temperature"
                  :circle-x="100"
                />

                <SvgTemperatureLine
                  :min-temp="minTemp"
                  :max-temp="maxTemp"
                  :start-temp="data.temperature"
                  :end-temp="idx < hours.length - 1 ? hours[idx + 1]?.temperature as number : data.temperature"
                  :circle-x="0"
                />
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>
  </div>
</template>

<style lang="css" scoped>
/* START: Important for Swiper to prevent infinite width */
.swiper-wrapper {
  display: grid;
}

.swiper-wrapper__inner {
  width: 100%;
  max-width: 100%;
  min-width: 0;
}

/* END: Important for Swiper to prevent infinite width */

swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

swiper-slide:first-child {
  border-left-width: 1px;
}
</style>
