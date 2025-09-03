<template>
  <div class="popular-locations">
    <ul>
      <li v-for="location in locations" :key="location.name + location.latitude + location.longitude" class="flex items-center justify-between py-1">
        <NuxtLink
          :to="`/weather/${encodeURIComponent(location.name)}?lat=${location.latitude}&lon=${location.longitude}`"
          class="flex-1 hover:underline"
        >
          {{ location.name }} ({{ location.latitude }}, {{ location.longitude }})
          <span class="ml-2 text-xs text-gray-500">x{{ location.count }}</span>
        </NuxtLink>
        <button
          class="ml-2 btn btn-xs btn-soft btn-error"
          aria-label="Remove from popular locations"
          @click.prevent="remove(location)"
        >
          <Icon name="uil:trash" />
        </button>
      </li>
    </ul>
    <div v-if="!locations.length" class="text-gray-400">No popular locations yet.</div>
  </div>
</template>

<script setup lang="ts">
import { useLocationsStore } from '../../stores/locations'
import { storeToRefs } from 'pinia'

const locationsStore = useLocationsStore()
const { locations } = storeToRefs(locationsStore)

function remove(location: { name: string; latitude: number; longitude: number }) {
  locationsStore.remove(location)
}
</script>

<style scoped>
.popular-locations ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
