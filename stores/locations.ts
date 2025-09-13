import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Location } from '~~/types/Location'

const MAX_LOCATIONS = 10

export const useLocationsStore = defineStore('locations', () => {
    const locations = ref<Location[]>([])

    const addOrUpdate = (location: Omit<Location, 'count' | 'date_added'>) => {
        const idx = locations.value.findIndex(
            l => l.name === location.name && l.lat === location.lat && l.lon === location.lon
        )
        if (idx !== -1) {
            if (locations.value[idx]) {
                locations.value[idx].count++
            }
        } else {
            if (locations.value.length >= MAX_LOCATIONS) {
                const minCount = Math.min(...locations.value.map(l => l.count))
                const candidates = locations.value.filter(l => l.count === minCount)
                const oldest = candidates.reduce((a, b) => (a.date_added < b.date_added ? a : b))
                const removeIdx = locations.value.findIndex(l => l === oldest)
                locations.value.splice(removeIdx, 1)
            }
            locations.value.push({ ...location, count: 1, date_added: Date.now() })
        }
        locations.value.sort((a, b) => b.count - a.count || b.date_added - a.date_added)
    }

    const remove = (id: number) => {
        locations.value = locations.value.filter(l => l.id !== id)
    }

    return { locations: locations, addOrUpdate, remove }
}, {
    persist: {
        storage: localStorage,
    }
})
