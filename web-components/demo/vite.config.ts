import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'

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
  // vue(): main.ts imports an icon directly from @dynamia-tools/tailadmin-vue/icons (raw
  // source, per that package's "no build step" model) to demo props like `ta-fab`'s required
  // `icon` object — Vite needs the plugin to parse the .vue files that barrel pulls in.
  plugins: [externalizeImagePaths(), vue()],
})
