<template>
  <div class="min-h-screen text-slate-900 dark:text-slate-100">
    <header class="container py-6 prose">
      <h1>The Weather Today</h1>
    </header>

    <main class="container grid gap-6 lg:grid-cols-3">

      <!-- Card of 2 columns wide -->
      <Card class="col-span-2" v-if="userLocationStore.location !== null">
        <template #content>          
          <h2 class="card-title">Your location</h2>
          <div class="text-xs text-gray-500 flex-grow-0 mb-4">
            Location: {{ userLocationStore.location.city }}, {{ userLocationStore.location.countryCode }} ({{ userLocationStore.location.lat }}, {{ userLocationStore.location.lon }})
          </div>

          <!-- Current weather -->
           <current-weather :location="userLocationStore.location" />
        </template>
      </Card> 

      <Card>
        <template #content>
          <location-search class="mb-3" @select="onLocationSelect" />
          <h2 class="card-title">Popular Locations</h2>
          <popular-locations />
        </template>
      </Card>

      <Card class="col-span-3" v-if="userLocationStore.location !== null">
        <template #content>
          <todays-forecast :location="userLocationStore.location" />
        </template>
      </Card>
    </main>
  </div>
</template>
<script setup lang="ts">
import LocationSearch from '~/components/LocationSearch.vue'
import { useLocationsStore } from '../../stores/locations'
import Card from '~/components/ui/Card.vue';
import { useUserLocationStore } from '~~/stores/userLocation';

const locationsStore = useLocationsStore()
const userLocationStore = useUserLocationStore()

const onLocationSelect = (location: Omit<Location, 'count' | 'date_added'>) => {
  locationsStore.addOrUpdate(location)
}
</script>