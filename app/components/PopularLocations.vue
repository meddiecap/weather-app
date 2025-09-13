<template>
  <div class="popular-locations">
    <ul>
      <li v-for="location in locations" :key="location.id" class="flex items-center justify-between py-1">
        <NuxtLink
          :to="`/weather/${encodeURIComponent(location.name)}?lat=${location.lat}&lon=${location.lon}`"
          class="flex-1 hover:underline"
        >
          {{ location.name }} ({{ location.lat }}, {{ location.lon }})
          <span class="ml-2 text-xs text-gray-500">x{{ location.count }}</span>
        </NuxtLink>
        <button
          class="ml-2 btn btn-xs btn-soft btn-error"
          aria-label="Remove from popular locations"
          @click.prevent="remove(location.id)"
        >
          <Icon name="uil:trash" />
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useLocationsStore } from '../../stores/locations'
import { storeToRefs } from 'pinia'

const locationsStore = useLocationsStore()
const { locations } = storeToRefs(locationsStore)

function remove(id: number) {
  locationsStore.remove(id)
}
</script>

<style scoped>
.popular-locations ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
