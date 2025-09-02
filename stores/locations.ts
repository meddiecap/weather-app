import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Location = {
  name: string
  latitude: number
  longitude: number
  country?: string
  count: number
}

const MAX_LOCATIONS = 10

export const useLocationsStore = defineStore('locations', () => {
  // Load from localStorage if available
  const stored = typeof window !== 'undefined' ? localStorage.getItem('popularLocations') : null
  const locations = ref<Location[]>(stored ? JSON.parse(stored) : [])

  function save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('popularLocations', JSON.stringify(locations.value))
    }
  }

  function addOrUpdate(location: Omit<Location, 'count'>) {
    const idx = locations.value.findIndex(
      l => l.name === location.name && l.latitude === location.latitude && l.longitude === location.longitude
    )
    if (idx !== -1) {
      locations.value[idx].count++
    } else {
      if (locations.value.length >= MAX_LOCATIONS) {
        // Remove least popular (lowest count)
        const minCount = Math.min(...locations.value.map(l => l.count))
        const minIdx = locations.value.findIndex(l => l.count === minCount)
        locations.value.splice(minIdx, 1)
      }
      locations.value.push({ ...location, count: 1 })
    }
    // Sort by count descending
    locations.value.sort((a, b) => b.count - a.count)
    save()
  }

  // Optionally, expose a computed for sorted/popular locations
  const popularLocations = computed(() => locations.value)

  return { locations: popularLocations, addOrUpdate }
})
