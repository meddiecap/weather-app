import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Location = {
    name: string
    latitude: number
    longitude: number
    country?: string
    count: number
    date_added: number
}

const MAX_LOCATIONS = 10

export const useLocationsStore = defineStore('locations', () => {
    // Load from localStorage if available
    const stored = typeof window !== 'undefined' ? localStorage.getItem('popularLocations') : null
    const locations = ref<Location[]>(stored ? JSON.parse(stored) : [])
    // Ensure loaded locations are sorted by count and date_added
    locations.value.sort((a, b) => b.count - a.count || b.date_added - a.date_added)

    // Save to localStorage
    const save = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('popularLocations', JSON.stringify(locations.value))
        }
    }

    // Add or update a location
    const addOrUpdate = (location: Omit<Location, 'count'>) => {
        const idx = locations.value.findIndex(
            l => l.name === location.name && l.latitude === location.latitude && l.longitude === location.longitude
        )
        if (idx !== -1) {
            if (locations.value[idx]) {
                locations.value[idx].count++
            }
        } else {
            if (locations.value.length >= MAX_LOCATIONS) {
                // Remove least popular (lowest count)
                const minCount = Math.min(...locations.value.map(l => l.count))
                const candidates = locations.value.filter(l => l.count === minCount)
                const oldest = candidates.reduce((a, b) => (a.date_added < b.date_added ? a : b))
                const removeIdx = locations.value.findIndex(l => l === oldest)
                locations.value.splice(removeIdx, 1)
            }
            locations.value.push({ ...location, count: 1, date_added: Date.now() })
        }
        // Sort by count descending
        locations.value.sort((a, b) => b.count - a.count || b.date_added - a.date_added)
        save()
    }

    // Optionally, expose a computed for sorted/popular locations
    const popularLocations = computed(() => locations.value)

    const remove = (location: { name: string; latitude: number; longitude: number }) => {
        locations.value = locations.value.filter(
            l => !(l.name === location.name && l.latitude === location.latitude && l.longitude === location.longitude)
        )
        save()
    }

    return { locations: popularLocations, addOrUpdate, remove }
})
