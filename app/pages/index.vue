<template>
  <div class="min-h-screen text-slate-900 dark:text-slate-100">
    <header class="container py-6">
      <h1 class="text-3xl font-semibold">WeatherApp</h1>
    </header>

    <main class="container grid gap-6 lg:grid-cols-3">
      <section class="glass dark:glass-dark rounded-[var(--radius-2xl)] p-4 shadow-[var(--shadow-elevation-2)]">
        <location-search @select="onLocationSelect" />

        <div v-if="selectedLocations.length" class="mt-4">
          <h2 class="text-xl mb-2">Selected Locations</h2>
          <ul>
            <li v-for="location in selectedLocations" :key="location.name">
              {{ location.name }} ({{ location.latitude }}, {{ location.longitude }})
            </li>
          </ul>
        </div>
      </section>

      <section class="rounded-[var(--radius-2xl)] p-4 shadow-[var(--shadow-elevation-1)] bg-surface dark:bg-slate-900">
        <h2 class="text-xl mb-2">Precipitation</h2>
        <div class="h-2 rounded-full bg-precip-rain/20">
          <div class="h-2 w-1/2 rounded-full bg-precip-rain" />
        </div>
      </section>

      <section class="rounded-[var(--radius-2xl)] p-4 shadow-[var(--shadow-elevation-1)] bg-surface-muted">
        <h2 class="text-xl mb-2">Wind</h2>
        <span class="inline-block px-2 py-1 rounded-md text-white bg-wind-breezy">Breezy</span>

        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Small</button>
        <button class="btn btn-outline" aria-label="Settings">⚙️</button>
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
import LocationSearch from '~/components/LocationSearch.vue'

const selectedLocations = ref<Array<{ name: string; latitude: number; longitude: number; country?: string }>>([])

const onLocationSelect = (location: { name: string; latitude: number; longitude: number; country?: string }) => {
  console.log('Selected location:', location)
  selectedLocations.value.push(location)
}
</script>