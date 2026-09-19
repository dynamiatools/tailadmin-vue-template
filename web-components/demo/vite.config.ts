import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readdirSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

// Multi-page demo: index.html (links) + one pages/<category>.html per category. Dev mode needs
// no config for this (Vite serves any .html file directly) — this only matters for `vite build`,
// which needs every HTML entry listed explicitly.
const pagesDir = fileURLToPath(new URL('./pages', import.meta.url))
const pageInputs = Object.fromEntries(
  readdirSync(pagesDir)
    .filter((file) => file.endsWith('.html'))
    .map((file) => [`pages/${file.replace(/\.html$/, '')}`, `${pagesDir}/${file}`]),
)

// A few wrapped components (ResponsiveImage, TwoColumnImageGrid, CommonGridShape,
// CustomerDemographic, ...) import demo/placeholder images by root-relative path
// ('/images/...'). Those are meant to resolve as runtime URLs against the host page's own
// origin, not be bundled — external() in the package's own vite.config.ts only affects `vite
// build`, so dev mode needs the same treatment here.
function externalizeImagePaths(): Plugin {
  return {
    name: 'externalize-image-paths',
    resolveId(id) {
      if (id.startsWith('/images/')) return { id, external: true }
    },
  }
}

export default defineConfig({
  // vue(): each page's script imports an icon directly from @dynamia-tools/tailadmin-vue/icons
  // (raw source, per that package's "no build step" model) for props like `ta-fab`'s required
  // `icon` object — Vite needs the plugin to parse the .vue files that barrel pulls in.
  plugins: [externalizeImagePaths(), vue()],
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        ...pageInputs,
      },
    },
  },
})
