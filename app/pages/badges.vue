<script setup lang="ts">
// UI showcase only
</script>

<template>
  <main class="min-h-dvh bg-base-100 text-base-content p-6">
    <h1 class="text-2xl font-semibold mb-6">DaisyUI Badges — Demo</h1>

    <!-- Solid badges -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Solid</h2>
      <div class="flex flex-wrap gap-2">
        <span class="badge">Default</span>
        <span class="badge badge-neutral">Neutral</span>
        <span class="badge badge-primary">Primary</span>
        <span class="badge badge-secondary">Secondary</span>
        <span class="badge badge-accent">Accent</span>
        <span class="badge badge-info">Info</span>
        <span class="badge badge-success">Success</span>
        <span class="badge badge-warning">Warning</span>
        <span class="badge badge-error">Error</span>
      </div>
    </section>

    <!-- Outline badges -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Outline</h2>
      <div class="flex flex-wrap gap-2">
        <span class="badge badge-outline">Default</span>
        <span class="badge badge-outline badge-primary">Primary</span>
        <span class="badge badge-outline badge-secondary">Secondary</span>
        <span class="badge badge-outline badge-accent">Accent</span>
        <span class="badge badge-outline badge-success">Success</span>
        <span class="badge badge-outline badge-warning">Warning</span>
        <span class="badge badge-outline badge-error">Error</span>
      </div>
    </section>

    <!-- Sizes -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Sizes</h2>
      <div class="flex flex-wrap items-center gap-2">
        <span class="badge badge-xs badge-primary">XS</span>
        <span class="badge badge-sm badge-primary">SM</span>
        <span class="badge badge-primary">Base</span>
        <span class="badge badge-lg badge-primary">LG</span>
      </div>
    </section>

    <!-- With icons -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">With icons</h2>
      <div class="flex flex-wrap items-center gap-2">
        <span class="badge badge-secondary gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New
        </span>

        <span class="badge badge-success gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Verified
        </span>

        <span class="badge badge-warning gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z"/>
          </svg>
          Attention
        </span>
      </div>
    </section>

    <!-- As status / indicator -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Status / Indicator</h2>
      <div class="flex flex-wrap items-center gap-6">
        <!-- Simple dot + label -->
        <div class="flex items-center gap-2">
          <span class="badge badge-xs badge-success"></span>
          <span class="text-sm">Online</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge badge-xs badge-warning"></span>
          <span class="text-sm">Degraded</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="badge badge-xs badge-error"></span>
          <span class="text-sm">Offline</span>
        </div>

        <!-- As a counter -->
        <div class="relative">
          <button class="btn btn-primary">Inbox</button>
          <span class="badge badge-error absolute -top-2 -right-2">7</span>
        </div>
      </div>
    </section>

    <!-- In text / inline -->
    <section>
      <h2 class="text-lg font-medium mb-3">Inline</h2>
      <p class="leading-relaxed">
        Your plan: <span class="badge badge-secondary align-middle">Pro</span>
        · Status: <span class="badge badge-success align-middle">Active</span>
        · Quota: <span class="badge badge-outline align-middle">85%</span>
      </p>
    </section>
  </main>
</template>
