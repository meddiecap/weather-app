<template>
  <div class="min-h-screen text-slate-900 dark:text-slate-100">
    <header class="container py-6 prose">
      <h1>The Weather Today</h1>
    </header>

    <main class="container grid gap-6 lg:grid-cols-3">

      <!-- Card of 2 columns wide -->
      <Card class="col-span-2">
        <template #content>          
          <h2 class="card-title">Current location: Vancouver, BC</h2>
          <p class="text-sm text-slate-500">49.2827, -123.1207</p>

          <!-- Current weather -->
           
        </template>
      </Card> 

      <Card>
        <template #content>
          <location-search @select="onLocationSelect" class="mb-3" />
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

const onLocationSelect = (location: { name: string; latitude: number; longitude: number; country?: string }) => {
  locationsStore.addOrUpdate(location)
}
</script>