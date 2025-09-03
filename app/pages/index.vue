<template>
  <div class="min-h-screen text-slate-900 dark:text-slate-100">
    <header class="container py-6 prose">
      <h1>The Weather Today</h1>
    </header>

    <main class="container grid gap-6 lg:grid-cols-3">

      <!-- Card of 2 columns wide -->
      <Card class="col-span-2">
        <template #content>          
          <h2 class="card-title">Your location</h2>
          <div class="text-xs text-gray-500 flex-grow-0 mb-4">Location: Berlin (52.52, 13.405)</div>

          <!-- Current weather -->
           <current-weather />
        </template>
      </Card> 

      <Card>
        <template #content>
          <location-search class="mb-3" @select="onLocationSelect" />
          <h2 class="card-title">Popular Locations</h2>
          <popular-locations />
        </template>
      </Card>
    </main>
  </div>
</template>
<script setup lang="ts">
import LocationSearch from '~/components/LocationSearch.vue'
import { useLocationsStore } from '../../stores/locations'
import Card from '~/components/ui/Card.vue';

const locationsStore = useLocationsStore()

const onLocationSelect = (location: { name: string; latitude: number; longitude: number; country?: string; date_added: number }) => {
  locationsStore.addOrUpdate(location)
}
</script>