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
const userLocation = useUserLocationStore()
await userLocation.fetchLocation()

// Example dark-mode toggle (add/remove 'dark' on <html>)
onMounted(() => {
  const html = document.documentElement
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark')
  }
})
</script>
