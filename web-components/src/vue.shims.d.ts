// Same shim required by every consumer of @dynamia-tools/tailadmin-vue (see that package's
// docs/SYNC.md): vue-tsc needs this to type the .vue files it resolves from node_modules.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// jsvectormap ships no types of its own; CustomerDemographic.vue imports it transitively.
declare module 'jsvectormap'
