<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">

useHead({
  htmlAttrs: {
    'data-theme': 'bumblebee',
  },
});

// Example dark-mode toggle (add/remove 'dark' on <html>)
onMounted(() => {
  const html = document.documentElement
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark')
  }
})
</script>
