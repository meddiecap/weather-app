import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Location } from '../types/Location'

export const useUserLocationStore = defineStore('userLocation', () => {
  const location = ref<Location | null>(null)
  const loading = ref(false)
  const error = ref<unknown | null>(null)

  async function fetchLocation() {
    if (location.value || loading.value) return
    loading.value = true
    error.value = null
    try {
      const { data } = await useFetch<Location>('/api/ip-location')
      location.value = data.value ?? null
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { location, loading, error, fetchLocation }
}, {
    persist: true
})
