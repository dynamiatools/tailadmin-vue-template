// Vite/Vue scaffolds (`npm create vue@latest`) always ship a shim like this one; a consumer
// of @dynamia-tools/tailadmin-vue is expected to have it too, since vue-tsc needs it to type
// `.vue` files that aren't part of the local tsconfig `include` (e.g. the package's own
// components resolved from node_modules).
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
