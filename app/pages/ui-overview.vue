<!-- pages/ui-overview.vue -->
<script setup lang="ts">
// Simple overview page to showcase base UI components
const sections = [
  { title: "Buttons", route: "/buttons", description: "Primary styles, outlines, sizes, icons, loading." },
  { title: "Badges",  route: "/badges",  description: "Solid, outline, sizes, status indicators." },
  { title: "Cards",   route: "/cards",   description: "Basic, image-top, horizontal, glass." },
];
</script>

<template>
  <main class="min-h-dvh bg-base-100 text-base-content py-8">
    <header class="mb-8">
      <h1 class="text-3xl font-semibold">UI Overview</h1>
      <p class="text-base-content/70 mt-2">
        A quick internal catalog of your base UI built with DaisyUI + Tailwind v4.
      </p>
    </header>

    <!-- Quick links to dedicated pages -->
    <nav class="mb-10">
      <ul class="flex flex-wrap gap-3">
        <li v-for="s in sections" :key="s.title">
          <NuxtLink :to="s.route" class="btn btn-outline btn-primary">
            {{ s.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Cards with live previews -->
    <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Buttons preview -->
      <article class="card bg-base-100 shadow-sm ring-1 ring-base-300">
        <div class="card-body">
          <h2 class="card-title">Buttons</h2>
          <p class="text-sm text-base-content/70">{{ sections[0].description }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button class="btn btn-primary">Primary</button>
            <button class="btn btn-secondary">Secondary</button>
            <button class="btn btn-outline btn-primary">Outline</button>
            <button class="btn btn-ghost">Ghost</button>
            <button class="btn btn-primary btn-sm">Small</button>
            <button class="btn btn-primary" aria-busy="true">
              <span class="loading loading-spinner" aria-hidden="true" />
              Loading
            </button>
          </div>

          <div class="card-actions justify-end mt-6">
            <NuxtLink to="/buttons" class="btn btn-primary">See all</NuxtLink>
          </div>
        </div>
      </article>

      <!-- Badges preview -->
      <article class="card bg-base-100 shadow-sm ring-1 ring-base-300">
        <div class="card-body">
          <h2 class="card-title">Badges</h2>
          <p class="text-sm text-base-content/70">{{ sections[1].description }}</p>

          <div class="mt-4 flex flex-wrap gap-2">
            <span class="badge">Default</span>
            <span class="badge badge-primary">Primary</span>
            <span class="badge badge-secondary">Secondary</span>
            <span class="badge badge-outline badge-primary">Outline</span>
            <span class="badge badge-success gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Verified
            </span>
            <span class="badge badge-error">Error</span>
          </div>

          <div class="card-actions justify-end mt-6">
            <NuxtLink to="/ui-badges" class="btn btn-primary">See all</NuxtLink>
          </div>
        </div>
      </article>

      <!-- Cards preview -->
      <article class="card bg-base-100 shadow-sm ring-1 ring-base-300">
        <div class="card-body">
          <h2 class="card-title">Cards</h2>
          <p class="text-sm text-base-content/70">{{ sections[2].description }}</p>

          <div class="mt-4 grid gap-3">
            <!-- Mini basic card -->
            <div class="card bg-base-100 ring-1 ring-base-300">
              <div class="card-body p-4">
                <h3 class="font-medium">Basic</h3>
                <p class="text-sm text-base-content/70">Simple content with actions.</p>
                <div class="card-actions justify-end">
                  <button class="btn btn-sm btn-primary">Go</button>
                </div>
              </div>
            </div>

            <!-- Mini horizontal card -->
            <div class="card card-side bg-base-100 ring-1 ring-base-300">
              <figure class="w-24 shrink-0">
                <img src="https://picsum.photos/96/96" alt="thumb">
              </figure>
              <div class="card-body p-4">
                <h3 class="font-medium">Horizontal</h3>
                <p class="text-sm text-base-content/70">Image beside content.</p>
              </div>
            </div>
          </div>

          <div class="card-actions justify-end mt-6">
            <NuxtLink to="/ui-cards" class="btn btn-primary">See all</NuxtLink>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>
