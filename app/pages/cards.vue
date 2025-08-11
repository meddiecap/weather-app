<!-- pages/ui-cards.vue -->
<script setup lang="ts">
// No logic needed for this UI showcase
</script>

<template>
  <main class="min-h-dvh bg-base-100 text-base-content p-6">
    <h1 class="text-2xl font-semibold mb-6">DaisyUI Cards — Demo</h1>

    <div class="card bg-base-100 w-96 shadow-sm">
      <figure>
        <img
            src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
            alt="Shoes" />
      </figure>
      <div class="card-body">
        <h2 class="card-title">Card Title</h2>
        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Buy Now</button>
        </div>
      </div>
    </div>

    <!-- Basic card -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Basic</h2>
      <div class="card w-96 bg-base-100 shadow-xl">
        <figure>
          <img src="https://picsum.photos/400/200" alt="Random image" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">Basic Card</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Accept</button>
            <button class="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Image on top -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Image top</h2>
      <div class="card w-96 bg-base-100 shadow-lg">
        <figure>
          <img src="https://picsum.photos/400/180" alt="Image top" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">Card Title</h2>
          <p>
            This is a simple example with an image at the top and actions below.
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-outline btn-primary">More info</button>
          </div>
        </div>
      </div>
    </section>

    <!-- With badge -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">With badge</h2>
      <div class="card w-96 bg-base-100 shadow-lg relative">
        <div class="badge badge-secondary absolute top-4 right-4">NEW</div>
        <div class="card-body">
          <h2 class="card-title">Special Card</h2>
          <p>
            This card includes a badge in the top-right corner to highlight status.
          </p>
        </div>
      </div>
    </section>

    <!-- Horizontal layout -->
    <section class="mb-8">
      <h2 class="text-lg font-medium mb-3">Horizontal</h2>
      <div class="card card-side bg-base-100 shadow-xl w-full max-w-3xl">
        <figure>
          <img src="https://picsum.photos/200/200" alt="Side image" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">Horizontal Card</h2>
          <p>
            The <code>card-side</code> class places the image beside the content.
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Details</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Glass effect -->
    <section>
      <h2 class="text-lg font-medium mb-3">Glass effect</h2>
      <div class="card w-96 glass">
        <figure>
          <img src="https://picsum.photos/400/200" alt="Glass card" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">Glass Card</h2>
          <p>
            Using the <code>glass</code> class creates a frosted-glass look that blends with backgrounds.
          </p>
          <div class="card-actions justify-end">
            <button class="btn btn-primary">Explore</button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
