import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import path from 'node:path'

export default defineConfig({
  root: path.resolve(__dirname, '.'), // zorg dat root = weather-today
  test: {
    projects: [
      {
        test: {
          setupFiles: [
            path.resolve(__dirname, 'test/setup/db-mocks.ts'),
            path.resolve(__dirname, 'test/setup/global-mocks.ts'),
          ],
          name: 'unit',
          include: ['test/{e2e,unit}/*.{test,spec}.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          setupFiles: [
            path.resolve(__dirname, 'test/setup/db-mocks.ts'),
          ],
          name: 'nuxt',
          include: ['test/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})