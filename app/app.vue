<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useUserLocationStore } from '../stores/userLocation'

useHead({
  htmlAttrs: {
    'data-theme': 'bumblebee',
  },
});

// Get the user location based on IP and store it
console.log("App mounted, fetching user location...")
const userLocation = useUserLocationStore()
console.log("User location store:", userLocation)
await userLocation.fetchLocation()

// Example dark-mode toggle (add/remove 'dark' on <html>)
onMounted(() => {
  const html = document.documentElement
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark')
  }
})
</script>
