<template>
  <div class="min-h-screen bg-grad-day dark:bg-grad-night text-slate-900 dark:text-slate-100">
    <header class="container py-6">
      <h1 class="text-3xl font-semibold">WeatherApp</h1>
    </header>

    <main class="container grid gap-6 lg:grid-cols-3">
      <section class="glass dark:glass-dark rounded-[var(--radius-2xl)] p-4 shadow-[var(--shadow-elevation-2)]">
        <h2 class="text-xl mb-2">Now</h2>
        <p class="inline-flex items-center gap-2 text-white bg-temp-warm rounded-[var(--radius-pill)] px-3 py-1">
          22°C · Warm
        </p>
        <p class="mt-3 text-slate-700 dark:text-slate-200">Light rain expected in 20 min.</p>
      </section>

      <section class="rounded-[var(--radius-2xl)] p-4 shadow-[var(--shadow-elevation-1)] bg-surface dark:bg-slate-900">
        <h2 class="text-xl mb-2">Precipitation</h2>
        <div class="h-2 rounded-full bg-precip-rain/20">
          <div class="h-2 w-1/2 rounded-full bg-precip-rain"></div>
        </div>
      </section>

      <section class="rounded-[var(--radius-2xl)] p-4 shadow-[var(--shadow-elevation-1)] bg-surface-muted">
        <h2 class="text-xl mb-2">Wind</h2>
        <span class="inline-block px-2 py-1 rounded-md text-white bg-wind-breezy">Breezy</span>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
// Example dark-mode toggle (add/remove 'dark' on <html>)
onMounted(() => {
  const html = document.documentElement
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.classList.add('dark')
  }
})
</script>
