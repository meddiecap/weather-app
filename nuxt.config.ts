import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['@nuxt/eslint', '@pinia/nuxt'],

  typescript: {
    strict: true
  },

  runtimeConfig: {
    public: {
      cacheTtl: 300 // Cache TTL in seconds (default: 5 minutes)
    }
  }
})