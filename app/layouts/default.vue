<!-- layouts/default.vue -->
<script setup lang="ts">
import LocationSearch from '~/components/LocationSearch.vue'
</script>

<template>
  <div>
    <!-- Skip link for better accessibility -->
    <a href="#main" class="sr-only focus:not-sr-only focus:btn focus:btn-ghost focus:absolute focus:top-2 focus:left-2">
      Skip to content
    </a>

    <div class="min-h-dvh bg-grad-day dark:bg-grad-night text-base-content">
      <!-- Header / Navbar -->
      <header class="sticky top-0 z-40 border-b border-base-300">
        <div class="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="navbar-start">
            <div class="dropdown">
              <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li><NuxtLink to="/" class="btn btn-ghost btn-sm">Home</NuxtLink></li>
                <li>
                  <a>UI</a>
                  <ul class="p-2">
                    <li><NuxtLink to="/ui-overview" class="btn btn-ghost btn-sm">Overview</NuxtLink></li>
                    <li><NuxtLink to="/buttons" class="btn btn-ghost btn-sm">Buttons</NuxtLink></li>
                    <li><NuxtLink to="/badges" class="btn btn-ghost btn-sm">Badges</NuxtLink></li>
                    <li><NuxtLink to="/cards" class="btn btn-ghost btn-sm">Cards</NuxtLink></li>
                  </ul>
                </li>
              </ul>
              <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
              </div>
            </div>
            <NuxtLink to="/" class="font-semibold tracking-tight text-lg">
              The Weather Today
            </NuxtLink>
          </div>
          <div class="navbar-center hidden lg:flex">
            <ul class="menu menu-horizontal px-1">      
              <li><NuxtLink to="/" class="btn btn-ghost btn-sm">Home</NuxtLink></li>
              <li>
                <details>
                  <summary>UI</summary>
                  <ul class="p-2">
                    <li><NuxtLink to="/ui-overview" class="btn btn-ghost btn-sm">Overview</NuxtLink></li>
                    <li><NuxtLink to="/buttons" class="btn btn-ghost btn-sm">Buttons</NuxtLink></li>
                    <li><NuxtLink to="/badges" class="btn btn-ghost btn-sm">Badges</NuxtLink></li>
                    <li><NuxtLink to="/cards" class="btn btn-ghost btn-sm">Cards</NuxtLink></li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
          <div class="navbar-end">
            <ClientOnly>
              <location-search />
            </ClientOnly>
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
