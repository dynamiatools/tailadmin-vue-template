# @dynamia-tools/tailadmin-vue-wc

Standalone [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
(custom elements) built from the standalone components of
[`@dynamia-tools/tailadmin-vue`](..), for use on pages that don't run Vue — plain HTML, React,
or any other framework.

Every component here is compiled with Vue's [`defineCustomElement`](https://vuejs.org/guide/extras/web-components.html#building-custom-elements-with-vue).
This package only wraps components that don't depend on shared app-level context (sidebar
state, theme provider, router). `layout/*` (`AdminLayout`, `AppHeader`, `AppSidebar`,
`SidebarProvider`, `ThemeProvider`, etc.) is out of scope — those only make sense composed
inside a full Vue app, see the root package's README.

## Install

```bash
npm install @dynamia-tools/tailadmin-vue-wc vue
```

Also install the root package's stylesheet — these elements render Tailwind utility classes,
not scoped CSS, so they need it loaded on the host page (see "No shadow DOM" below):

```html
<link rel="stylesheet" href="node_modules/@dynamia-tools/tailadmin-vue/style.css" />
```

In practice you'll run that CSS through your own Tailwind v4 build (same `@source` pointer as
`examples/basic-app/src/style.css` in the root repo), not serve it raw.

Some components need one of the root package's *optional* peer dependencies (charts need
`apexcharts` + `vue3-apexcharts`, the map needs `leaflet`, QR codes need `qrcode`, etc.) — see
this package's `peerDependenciesMeta` or the root README's peer-dependency table. Only install
what the specific components you use require.

## Usage

Each component is its own subpath export, registered as a side effect on import:

```html
<script type="module">
  import '@dynamia-tools/tailadmin-vue-wc/ta-alert'
</script>

<ta-alert variant="success" title="Saved" message="Your changes were saved."></ta-alert>
```

Or import everything at once from the package root (registers all ~100 elements — larger,
only worth it if you're using most of them):

```js
import '@dynamia-tools/tailadmin-vue-wc'
```

Props map to attributes the same way Vue's `defineCustomElement` always does: strings/booleans
work as plain HTML attributes (kebab-case, e.g. `action-label`), objects/arrays need to be set
as DOM properties from JS (`el.items = [...]`) rather than attributes.

See `demo/` in this package for a working example (`npm install && npm run dev` inside
`demo/`) — it's this package's equivalent of the root repo's `examples/basic-app`: exercise any
change through it before considering it done.

## Known limitations

- **No shadow DOM.** Elements render into light DOM (`shadowRoot: false`) on purpose — these
  components are styled with global Tailwind utility classes, not component-scoped `<style>`
  blocks, so shadow DOM would isolate them from the host page's stylesheet and they'd render
  unstyled. This means no style encapsulation: the host page's global CSS can affect these
  elements, same as any other markup on the page.
- **`title` prop vs. native `title` attribute.** Several components (`ta-alert`,
  `ta-empty-state`, `ta-component-card`, and others) have a `title` prop. `HTMLElement.title`
  is a native DOM property (browser tooltip on hover) that Vue's custom element wrapper
  overwrites — functionally the prop still works, but you'll also get a native tooltip
  showing the same text on hover, and Vue logs a dev-mode warning about the conflict.
- **`<router-link>` without vue-router.** `ta-alert`, `ta-dropdown-menu`, and
  `ta-page-breadcrumb` optionally render `<router-link>` (only when their `showLink`/link props
  are used). Standalone there's no router, so each of these registers a minimal `<a>` fallback
  under the same name via `configureApp` — it renders a real link, just without router
  integration (no client-side navigation, no active-route styling).
- **`/images/...` root-relative assets.** A few components (`ta-responsive-image`,
  `ta-two-column-image-grid`, `ta-three-column-image-grid`, `ta-common-grid-shape`,
  `ta-customer-demographic`) reference demo images at root-relative paths. These are left as
  runtime URLs (not bundled) — the host page needs to serve matching files itself, same as any
  consumer of the root package's example-only images (see its README's "Static image assets"
  section).
- **`TreeTable`/`Menu` internal children.** `ta-tree-table` and `ta-menu` are the only elements
  exposed for their families — `TreeTableRow` and `MenuItemRow` are internal-only and aren't
  meaningful as standalone elements.

## Build

```bash
npm install
npm run build       # vite build — one entry per component under dist/components/, plus dist/index.js
npm run type-check   # vue-tsc --build
```

## Versioning

Versioned independently from the root `@dynamia-tools/tailadmin-vue` package — this package
only changes when components are added/removed/fixed here, not on every root package release.
