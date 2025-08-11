<!-- layouts/default.vue -->
<script setup lang="ts">
// Nothing special here; this layout wraps all pages by default.
</script>

<template>
  <div>
    <!-- Skip link for better accessibility -->
    <a href="#main" class="sr-only focus:not-sr-only focus:btn focus:btn-ghost focus:absolute focus:top-2 focus:left-2">
      Skip to content
    </a>

    <div class="min-h-dvh bg-grad-day text-base-content">
      <!-- Header / Navbar -->
      <header class="sticky top-0 z-40 border-b border-base-300 bg-base-100/80 backdrop-blur">
        <div class="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="navbar-start">
            <NuxtLink to="/" class="font-semibold tracking-tight text-lg">
              WeatherApp
            </NuxtLink>
          </div>

          <div class="navbar-center hidden md:flex">
            <nav class="menu menu-horizontal gap-1">
              <NuxtLink to="/ui-overview" class="btn btn-ghost btn-sm">Overview</NuxtLink>
              <NuxtLink to="/buttons" class="btn btn-ghost btn-sm">Buttons</NuxtLink>
              <NuxtLink to="/badges" class="btn btn-ghost btn-sm">Badges</NuxtLink>
              <NuxtLink to="/cards" class="btn btn-ghost btn-sm">Cards</NuxtLink>
              <!-- Add more demo pages here -->
            </nav>
          </div>

          <div class="navbar-end">
            <!-- Example placeholder for future actions -->
            <button class="btn btn-ghost btn-sm" aria-label="User menu">
              <span class="i">☰</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main id="main" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="border-t border-base-300 bg-base-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-base-content/70">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p>© {{ new Date().getFullYear() }} WeatherApp UI Kit</p>
            <nav class="flex gap-3">
              <NuxtLink to="/ui-overview" class="link link-hover">Overview</NuxtLink>
              <NuxtLink to="/buttons" class="link link-hover">Buttons</NuxtLink>
              <NuxtLink to="/badges" class="link link-hover">Badges</NuxtLink>
              <NuxtLink to="/cards" class="link link-hover">Cards</NuxtLink>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
/* No extra CSS needed; DaisyUI + Tailwind handle the styling */
</style>
