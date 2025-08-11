<script setup lang="ts">
// No logic needed for this demo page
</script>

<template>
  <main class="min-h-dvh bg-base-100 text-base-content p-6">
    <h1 class="text-2xl font-semibold mb-6">DaisyUI Buttons — Demo</h1>

    <!-- Solid buttons (theme-driven via your @plugin "daisyui/theme") -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Solid</h2>
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-primary">Primary</button>
        <button class="btn btn-secondary">Secondary</button>
        <button class="btn btn-accent">Accent</button>
        <button class="btn btn-info">Info</button>
        <button class="btn btn-success">Success</button>
        <button class="btn btn-warning">Warning</button>
        <button class="btn btn-error">Error</button>
      </div>
    </section>

    <!-- Outline variants -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Outline</h2>
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-outline">Default</button>
        <button class="btn btn-outline btn-primary">Primary</button>
        <button class="btn btn-outline btn-secondary">Secondary</button>
        <button class="btn btn-outline btn-accent">Accent</button>
        <button class="btn btn-outline btn-success">Success</button>
        <button class="btn btn-outline btn-warning">Warning</button>
        <button class="btn btn-outline btn-error">Error</button>
      </div>
    </section>

    <!-- Ghost / Link / Disabled -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Ghost · Link · Disabled</h2>
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-ghost">Ghost</button>
        <button class="btn btn-link">Link</button>
        <button class="btn" disabled>Disabled</button>
      </div>
    </section>

    <!-- Sizes -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Sizes</h2>
      <div class="flex flex-wrap items-center gap-3">
        <button class="btn btn-xs btn-primary">XS</button>
        <button class="btn btn-sm btn-primary">SM</button>
        <button class="btn btn-primary">Base</button>
        <button class="btn btn-lg btn-primary">LG</button>
        <button class="btn btn-xl btn-primary">XL</button>
      </div>
    </section>

    <!-- Shapes -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Shapes</h2>
      <div class="flex flex-wrap items-center gap-3">
        <button class="btn btn-primary rounded-none">Square corners</button>
        <button class="btn btn-primary">Rounded (theme radius)</button>
        <button class="btn btn-circle btn-primary" aria-label="Circle button">
          <!-- Icon-only circle -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v16m8-8H4"/>
          </svg>
        </button>
        <button class="btn btn-square btn-secondary" aria-label="Square button">
          <!-- Icon-only square -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 13l4 4L19 7"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- With icons -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">With icons</h2>
      <div class="flex flex-wrap gap-3">
        <button class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4v16m8-8H4"/>
          </svg>
          Add
        </button>

        <button class="btn btn-secondary">
          Download
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5"
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Loading / Busy -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Loading state</h2>
      <div class="flex flex-wrap items-center gap-3">
        <button class="btn btn-primary" aria-busy="true" aria-live="polite">
          <span class="loading loading-spinner" aria-hidden="true"></span>
          Saving…
        </button>
        <button class="btn btn-outline btn-secondary" aria-busy="true">
          <span class="loading loading-dots" aria-hidden="true"></span>
          Loading
        </button>
      </div>
    </section>

    <!-- Full width / Block -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Block / Full width</h2>
      <div class="max-w-md">
        <button class="btn btn-primary w-full mb-3">Continue</button>
        <button class="btn btn-outline btn-primary w-full">Back</button>
      </div>
    </section>
  </main>
</template>