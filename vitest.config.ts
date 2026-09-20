import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Component/composable tests, run with `npm test`. They mount the real .vue sources under jsdom.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/**/*.test.ts'],
  },
})
