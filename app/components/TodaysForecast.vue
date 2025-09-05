<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWeatherIcon, windDirectionToCompass, windSpeedToBeaufort } from '../../app/utils/weather'

const props = defineProps<{
  location?: { name: string; lat: number; lon: number, timezone?: string }
}>()

const containerRef = ref(null)
const hours = ref<any[]>([])

// Swiper setup (keep as before)
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

async function fetchForecast() {
  // Use your API route for forecast
  const res = await $fetch('/api/forecast', {
    query: {
      lat: props.location?.lat,
      lon: props.location?.lon,
      hourly: 'temperature_2m,weathercode,windspeed_10m,winddirection_10m',
      timezone: props.location?.timezone,
      forecast_days: 2,
    },
  })

  // Get the current time in the forecast's timezone
  const tz = res.timezone
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

  // Find the index of the current hour in the forecast data
  const times: string[] = res.hourly.time
  let nowIdx = times.findIndex(t => t.startsWith(currentHourIso))
  if (nowIdx === -1) {
    // fallback: find the first hour >= current hour
    nowIdx = times.findIndex(t => t >= currentHourIso)
    if (nowIdx === -1) nowIdx = 0
  }
  const count = 24
  // Handle wrap-around if near the end of the array
  const get24 = (arr: any[]) => {
    if (nowIdx + count <= arr.length) return arr.slice(nowIdx, nowIdx + count)
    return arr.slice(nowIdx).concat(arr.slice(0, (nowIdx + count) % arr.length))
  }
  const temps = get24(res.hourly.temperature_2m)
  const codes = get24(res.hourly.weathercode)
  const windSpeeds = get24(res.hourly.windspeed_10m)
  const windDirs = get24(res.hourly.winddirection_10m)
  const times24 = get24(times)

  hours.value = times24.map((t: string, i: number) => ({
    original_time: t,
    time: i === 0 ? 'now' : t.slice(11, 16),
    temperature: Math.round(temps[i]),
    weather_code: codes[i],
    icon: getWeatherIcon(codes[i], true),
    winddirection: windDirs[i],
    winddirection_compass: windDirectionToCompass(windDirs[i]),
    windspeed: windSpeeds[i],
    beaufort: windSpeedToBeaufort(windSpeeds[i]),
  }))
}

onMounted(fetchForecast)
</script>

<template>
  <ClientOnly>
    <swiper-container ref="containerRef" :init="false" class="divide-x divide-gray-200">
      <swiper-slide v-for="(hour, idx) in hours" :key="idx">
        <div :data-original-time="hour.original_time">
          <div class="text-xl mb-6">{{ hour.temperature }} °C</div>
          <img :src="`/icons/weather_icons/static/${hour.icon}`" :data-weather-code="hour.weather_code" class="w-full">
          <div class="mb-3">{{ hour.time }}</div>
          <div class="mb-3">
            <i 
              :title="hour.winddirection_compass?.toLowerCase()"
              :class="`text-3xl wi wi-wind from-${hour.winddirection}-deg`" />
          </div>
          <div>
            <i 
              :title="`${hour.beaufort} on Beaufort Scale, ${hour.windspeed} km/h`"
              :class="`text-3xl wi wi-wind-beaufort-${hour.beaufort}`" />
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<style lang="css">
swiper-slide {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
