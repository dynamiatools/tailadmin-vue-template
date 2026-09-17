import { h, defineComponent } from 'vue'

// A handful of components (Alert, DropdownMenu, PageBreadcrumb) use <router-link> because
// they're normally rendered inside a vue-router app. As standalone custom elements there's no
// router, so we register this plain <a> stand-in as "router-link" on each element's internal
// app instance — it accepts the same `to` prop and avoids the "Failed to resolve component"
// warning plus a broken/no-op link.
export const RouterLinkFallback = defineComponent({
  name: 'RouterLinkFallback',
  props: { to: { type: [String, Object], default: '#' } },
  setup(props, { slots }) {
    return () => h('a', { href: typeof props.to === 'string' ? props.to : '#' }, slots.default?.())
  },
})

// Typed as `any` on purpose: defineCustomElement's `configureApp` generic is derived from the
// wrapped component's own (deeply nested) options type. Any narrower annotation here makes
// vue-tsc's structural comparison blow its stack (TS2321) once this is reused across ~100
// generated wrapper files, each instantiating the generic differently.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerRouterLinkFallback(app: any) {
  app.component('router-link', RouterLinkFallback)
}
