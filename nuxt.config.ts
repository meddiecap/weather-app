import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  nitro: {
    experimental: {
      openAPI: true // Enable server API documentation in NuxtHub
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  hub: {
    blob: true,
    database: true
  },

  modules: [
    '@nuxt/eslint',
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
    '@nuxt/image',
    '@nuxthub/core'
  ],

  typescript: {
    strict: true
  },
  
  runtimeConfig: {
    cacheTtl: {
      search: 30,       // default 30s
      forecast: 600,    // default 10m
    },
    mapBoxAccessToken: process.env.MAPBOX_ACCESS_TOKEN || '',
    public: {
      // optionally expose for client hints, but server uses private config above
      cacheTtl: 600,
    }
  }
})