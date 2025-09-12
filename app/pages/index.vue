<template>
  <div class="min-h-screen text-slate-900 dark:text-slate-100">
    <div class="container grid gap-6 lg:grid-cols-3">

      <!-- Card of 2 columns wide -->
      <Card class="col-span-2">
        <template #content>          
          <h2 class="card-title">Your location</h2>
          <div class="text-xs text-gray-500 flex-grow-0 mb-4">
            Location: {{ userLocationStore.location?.city }}, {{ userLocationStore.location?.countryCode }} ({{ userLocationStore.location?.lat }}, {{ userLocationStore.location?.lon }})
          </div>

          <!-- Current weather -->
           <current-weather v-if="userLocationStore.location" :location="userLocationStore.location" />
        </template>
      </Card> 

      <Card no-padding>
        <template #content>
          <static-map v-if="userLocationStore.location" 
            :lat="userLocationStore.location.lat"
            :lon="userLocationStore.location.lon"
          />
        </template>
      </Card>

      <Card class="col-span-3">
        <template #content>
          <todays-forecast v-if="userLocationStore.location" :location="userLocationStore.location" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue';
import { useUserLocationStore } from '~~/stores/userLocation';
import { useWeatherStore } from '~~/stores/weather';

const userLocationStore = useUserLocationStore()
const weatherStore = useWeatherStore()

// Fetch weather when user location is set
if (userLocationStore.location) {
  await weatherStore.fetchWeather({
    lat: userLocationStore.location.lat,
    lon: userLocationStore.location.lon,
    timezone: userLocationStore.location.timezone,
  })
}

</script>