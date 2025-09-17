import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Location } from '../types/Location'

export const useUserLocationStore = defineStore('userLocation', () => {
  const location = ref<Location | null>(null)
  const loading = ref(false)
  const error = ref<unknown | null>(null)

  async function fetchLocation() {
    console.log("Fetching user location...")
    if (location.value || loading.value) return
    loading.value = true
    error.value = null
    try {
      console.log("Trying to fetch user location from /api/ip-location")
      location.value = await $fetch('/api/ip-location')
    } catch (e) {
      console.error("Error fetching user location:", e)
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { location, loading, error, fetchLocation }
}, {
    persist: true
})
