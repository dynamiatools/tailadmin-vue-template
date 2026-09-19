import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

const componentsDir = fileURLToPath(new URL('./src/components', import.meta.url))

// One entry per web component so consumers can import/load only what they use,
// plus the barrel `index.ts` that re-exports every element class.
const entries = Object.fromEntries(
  readdirSync(componentsDir)
    .filter((file) => file.endsWith('.ts'))
    .map((file) => [`components/${file.replace(/\.ts$/, '')}`, `${componentsDir}/${file}`]),
)
entries.index = fileURLToPath(new URL('./src/index.ts', import.meta.url))
entries.elements = fileURLToPath(new URL('./src/elements.ts', import.meta.url))
entries.helpers = fileURLToPath(new URL('./src/helpers.ts', import.meta.url))

// Mirrors the root package's optional peerDependencies: components that use these
// libs (charts, maps, calendar, QR, markdown, drag&drop, etc.) must not bundle them —
// consumers install only what the specific web components they use require.
const optionalPeerDeps = [
  '@floating-ui/vue',
  '@fullcalendar/vue3',
  'apexcharts',
  'vue3-apexcharts',
  'dompurify',
  'dropzone',
  'flatpickr',
  'vue-flatpickr-component',
  'floating-vue',
  'fullcalendar',
  'jsvectormap',
  'vuevectormap',
  'leaflet',
  'lucide-vue-next',
  'marked',
  'qrcode',
  'simplebar-vue',
  'swiper',
  'temporal-polyfill',
  'vuedraggable',
]

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: entries,
      formats: ['es'],
    },
    rollupOptions: {
      // 'vue' is a peer dep; root-relative '/images/...' imports are asset paths the
      // consuming app must serve itself (see root README's "Static image assets" policy) —
      // left as runtime URLs instead of bundled.
      external: (id) =>
        id === 'vue' ||
        id.startsWith('/images/') ||
        optionalPeerDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
    },
  },
})
