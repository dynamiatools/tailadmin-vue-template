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
`examples/basic-app/src/style.css` in the root repo), not serve it raw. If you don't have a
Tailwind build at all, use the prebuilt `@dynamia-tools/tailadmin-vue-wc/style.css` instead (see
"Use without Node or npm" below).

Some components need one of the root package's *optional* peer dependencies (charts need
`apexcharts` + `vue3-apexcharts`, the map needs `leaflet`, QR codes need `qrcode`, etc.) — see
this package's `peerDependenciesMeta` or the root README's peer-dependency table. Only install
what the specific components you use require.

## Usage

Each component is its own module, registered as a side effect on import. From plain HTML,
straight off the CDN (the import map is what lets the elements find `vue` — see "Use without
Node or npm" below for the full page):

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@dynamia-tools/tailadmin-vue-wc@26.9.6/dist/style.css" />
<script type="importmap">
  { "imports": { "vue": "https://cdn.jsdelivr.net/npm/vue@3.5/dist/vue.esm-browser.prod.js" } }
</script>
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/@dynamia-tools/tailadmin-vue-wc@26.9.6/dist/components/ta-alert.js'
</script>

<ta-alert variant="success" title="Saved" message="Your changes were saved."></ta-alert>
```

With a bundler (Vite, webpack, …) after `npm install`, use the package's subpath exports instead:

```js
import '@dynamia-tools/tailadmin-vue-wc/ta-alert'   // one element
import '@dynamia-tools/tailadmin-vue-wc'            // all ~100 — larger, only if you use most
```

(CDN URLs use the real file path, `dist/components/ta-alert.js`; the short `/ta-alert` form only
exists in the `exports` map, which browsers and CDNs don't read. The all-in-one barrel isn't
usable without a bundler — see the limitation under "Use without Node or npm".)

Props map to attributes the same way Vue's `defineCustomElement` always does: strings/booleans
work as plain HTML attributes (kebab-case, e.g. `action-label`), objects/arrays need to be set
as DOM properties from JS (`el.items = [...]`) rather than attributes.

See `demo/` in this package for a working example (`npm install && npm run dev` inside
`demo/`) — it's this package's equivalent of the root repo's `examples/basic-app`: exercise any
change through it before considering it done. It's split one HTML page per category
(`demo/index.html` just links to `pages/<category>.html`) rather than one giant page — with
~100 live elements, fixed-position ones (`ta-fab`, `ta-mobile-app-layout`) and full-viewport
ones (`ta-modal`) made anything past the first screen unreachable/untestable on a single page.

## Use without Node or npm (plain HTML + CDN)

No bundler, no Tailwind build, no `package.json` — a static `.html` file is enough. Three
pieces, all served from a CDN (jsDelivr here; any host that serves the npm tarball's files works):

1. **The stylesheet** — `dist/style.css`, a *prebuilt* Tailwind stylesheet with every utility
   the components use (~134 KB, ~20 KB gzipped). This is what replaces the Tailwind build step
   described under "Install" above.
2. **Vue** — the elements are compiled against `vue` as an external bare import, so the page
   needs an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
   that tells the browser where to find it.
3. **The element modules** — one per component, imported for their registration side effect.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TailAdmin web components, no build</title>

  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@dynamia-tools/tailadmin-vue-wc@26.9.6/dist/style.css" />

  <!-- Must come before any <script type="module"> that imports 'vue' (directly or not) -->
  <script type="importmap">
    { "imports": { "vue": "https://cdn.jsdelivr.net/npm/vue@3.5/dist/vue.esm-browser.prod.js" } }
  </script>
</head>
<body class="p-6">
  <ta-alert variant="success" title="Saved" message="Your changes were saved."></ta-alert>
  <ta-button id="save">Save</ta-button>
  <div id="cart"></div>

  <script type="module">
    const CDN = 'https://cdn.jsdelivr.net/npm/@dynamia-tools/tailadmin-vue-wc@26.9.6/dist'

    // One import per element you use — importing a component registers its <ta-*> tag.
    await Promise.all([
      import(`${CDN}/components/ta-alert.js`),
      import(`${CDN}/components/ta-button.js`),
      import(`${CDN}/components/ta-cart.js`),
    ])
    const { mount, on } = await import(`${CDN}/helpers.js`)

    // Object/array props must be set as DOM properties, not attributes. `mount()` assigns them
    // *before* attaching the element (see "Helpers" below for why that order matters).
    const cart = mount('ta-cart', document.getElementById('cart'), {
      items: [{ id: 1, label: 'Widget', unitPrice: 10, quantity: 2 }],
    })
    on(cart, 'remove', (id) => { cart.items = cart.items.filter((i) => i.id !== id) })

    document.getElementById('save').addEventListener('click', () => console.log('clicked'))
  </script>
</body>
</html>
```

Notes:

- **Pin the version** (`@26.9.6`) in every URL, including `vue@3.5`. `@latest`/unpinned URLs make
  a page change behavior when a new release ships, and jsDelivr caches unpinned ones for a while.
- **Don't import the barrel** (`dist/index.js`) without a bundler — see the limitation below.
  Import `components/ta-*.js` individually; the browser only downloads the chunks each one needs.
- **Custom tags are safe to write in HTML before the scripts run**, but any element with a
  *required* object/array prop (like `ta-cart`'s `items`) throws on its first render if that prop
  is still undefined. Create those from JS with `mount()` as above rather than writing the tag in
  the markup.
- **Optional peer libraries work the same way** — map their bare specifier in the import map.
  Components that use one (`ta-qr-code` → `qrcode`, the charts → `apexcharts` +
  `vue3-apexcharts`, `ta-date-range-picker` → `flatpickr` + `vue-flatpickr-component`, …) need it
  listed there, e.g. via [esm.sh](https://esm.sh) with `?external=vue` so it shares the same Vue
  instance as the elements:

  ```html
  <script type="importmap">
    {
      "imports": {
        "vue": "https://cdn.jsdelivr.net/npm/vue@3.5/dist/vue.esm-browser.prod.js",
        "qrcode": "https://esm.sh/qrcode@1.5.4"
      }
    }
  </script>
  ```

  Libraries that render Vue components (`vue3-apexcharts`, `vue-flatpickr-component`,
  `vuedraggable`) *must* be loaded with `?external=vue`,
  otherwise they bring their own Vue copy and the two won't interoperate.
- **Dark mode** works the same as anywhere else: toggle a `dark` class on `<html>`.
- **Self-hosting instead of a CDN**: `npm pack @dynamia-tools/tailadmin-vue-wc` (or download the
  tarball from the npm registry), unzip it, and serve `package/dist/` from your own server —
  the URLs above become relative paths. Nothing needs Node at runtime.
- **The stylesheet `@import`s the Outfit font from Google Fonts** (same as the root package's
  CSS). Self-hosting the font and removing that `@import` line is fine if that matters for
  your privacy/CSP setup.

**Limitation — `ta-calendar`, `ta-map`, `ta-dropzone` need a bundler.** Their modules
`import '<peer>/…css'` (FullCalendar, Leaflet, Dropzone stylesheets), which browsers can't
resolve natively, so loading them without a build step fails — and so does the barrel
`dist/index.js` that pulls all of them in. Every other element works as shown above. If you need
those three from plain HTML, load the peer library's own stylesheet with a `<link>` and use its
UMD/CDN build directly instead of the wrapped element.

## Events

Vue's `emit()` calls become native `CustomEvent`s dispatched on the element — no wrapper needed,
`defineCustomElement` handles this. Two things are *not* like normal DOM events:

- The event name is dispatched exactly as declared — `update:modelValue` fires literally under
  that name, not some kebab-cased variant.
- `event.detail` is always an **array** of the emitted arguments, even for a single argument.

```html
<div id="cart"></div>
<script type="module">
  const CDN = 'https://cdn.jsdelivr.net/npm/@dynamia-tools/tailadmin-vue-wc@26.9.6/dist'
  await import(`${CDN}/components/ta-cart.js`)
  const { mount } = await import(`${CDN}/helpers.js`)

  // ta-cart's `items` is required, so create it with its props already set (see "Helpers").
  const cart = mount('ta-cart', document.getElementById('cart'), {
    items: [{ id: 1, label: 'Widget', unitPrice: 10, quantity: 2 }],
  })
  cart.addEventListener('remove', (e) => {
    const id = e.detail[0] // detail is always an array
    cart.items = cart.items.filter((i) => i.id !== id)
  })
</script>
```

(Needs the same `<link>` stylesheet and `vue` import map as in "Usage" above.)

`v-model`-style components (`defineModel`, or a manual `modelValue`/`update:modelValue` pair)
don't get automatic two-way binding outside Vue — listen for the update event and reassign the
property yourself, as above. See "TypeScript" below for a typed shortcut (`on()`/`bindModel()`).

## Dark mode

The root package's dark mode is class-based: Tailwind v4's `@custom-variant dark (&:is(.dark
*))` (in `main.css`) means any `dark:` utility activates when an ancestor has a `.dark` class.
That CSS is already compiled into `@dynamia-tools/tailadmin-vue/style.css` — nothing extra to do
per component.

`shadowRoot: false` (see "No shadow DOM" below) is what makes this work with zero friction: since
these elements render in light DOM, `.dark *` reaches all the way through the tree with no shadow
boundary in the way. A shadow-DOM version of this package would need each element to solve dark
mode on its own.

What's *not* included: `ThemeProvider`/`ThemeToggler` (`layout/*`) are out of scope for this
package (they depend on shared app-level context), so there's no built-in toggle. Replicate the
minimum yourself:

```js
document.documentElement.classList.toggle('dark')
localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light')
```

## TypeScript: typed elements, props, and events

Import `@dynamia-tools/tailadmin-vue-wc/elements` once (even just for its side effect) to get
every `ta-*` tag fully typed in `document.createElement`, `document.querySelector`, and this
package's own `mount()`/`on()` helpers — no per-component setup needed on your end:

```ts
import '@dynamia-tools/tailadmin-vue-wc/elements'

const cart = document.createElement('ta-cart') // typed: HTMLElement & CartProps
cart.items = [{ id: 1, label: 'Widget', unitPrice: 10, quantity: 2 }] // checked
cart.doesNotExist = 1 // compile error
```

### Helpers (`@dynamia-tools/tailadmin-vue-wc/helpers`)

- **`mount(tag, container, props)`** — creates the element, assigns `props`, *then* appends it.
  Order matters: an element already sitting in static HTML upgrades (and Vue does its first
  render) the instant the page is parsed, before any deferred script runs — a required prop
  that's still undefined at that point throws (see "Known limitations" and `demo/src/main.ts`,
  which uses this helper for exactly that reason).

  ```ts
  import { mount } from '@dynamia-tools/tailadmin-vue-wc/helpers'
  const cart = mount('ta-cart', document.body, { items: [], currency: 'USD' }) // fully typed
  ```

- **`on(el, event, handler)`** — listens for a Vue-emitted event and unwraps `detail` into
  normal handler arguments. No generic to pass: the element's own type (from `elements.ts`)
  already carries enough information to type the handler automatically.

  ```ts
  import { on } from '@dynamia-tools/tailadmin-vue-wc/helpers'
  on(cart, 'remove', (id) => { ... }) // id: string | number, inferred
  ```

  An event name that doesn't exist on the element just falls back to an untyped `unknown[]`
  handler rather than a compile error — and a plain `HTMLElement` (not typed via `elements.ts`)
  works too, just without argument types.

- **`bindModel(el, get, set, options?)`** — the closest standalone equivalent of `v-model`: sets
  the element's `modelValue` (or a custom `{ prop, event }` pair) from `get()` once, then calls
  `set()` on every update event.

  ```ts
  import { bindModel } from '@dynamia-tools/tailadmin-vue-wc/helpers'
  let qty = 1
  bindModel(quantityEl, () => qty, (v) => (qty = v))
  ```

### Per-component types

Every `ta-*.ts` wrapper also exports a `<Name>Props` type (e.g. `CartProps` from `ta-cart`),
derived from the original Vue component via [`vue-component-type-helpers`](https://www.npmjs.com/package/vue-component-type-helpers)
(the Vue team's own package for this) — never hand-maintained, so it can't drift from the actual
component. It's what backs `elements.ts` and `on()`'s inference; import it directly if you need
to type a variable yourself.

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
- **`<router-link>` without vue-router.** `ta-alert`, `ta-dropdown-menu`, `ta-page-breadcrumb`,
  and (via `DropdownMenu` as a child) `ta-monthly-sale`/`ta-monthly-target` optionally render
  `<router-link>`. Standalone there's no router, so each of these registers a minimal `<a>`
  fallback under the same name via `configureApp` — it renders a real link, just without router
  integration (no client-side navigation, no active-route styling).
- **`ta-modal`/`ta-profile-modal` always render open.** `ui/Modal.vue` and `profile/Modal.vue`
  have no open/close prop — they always render their full-viewport backdrop, and rely on a
  *parent* wrapping them in `v-if` (like `LoginDialog` does internally, which is why
  `ta-login-dialog` is fine standalone). Mounting either of these two directly covers the whole
  page; `demo/`'s cards for them are explanatory only, not live instances.
- **`/images/...` root-relative assets.** A few components (`ta-responsive-image`,
  `ta-two-column-image-grid`, `ta-three-column-image-grid`, `ta-common-grid-shape`,
  `ta-customer-demographic`) reference demo images at root-relative paths. These are left as
  runtime URLs (not bundled) — the host page needs to serve matching files itself, same as any
  consumer of the root package's example-only images (see its README's "Static image assets"
  section).
- **`TreeTable`/`Menu` internal children.** `ta-tree-table` and `ta-menu` are the only elements
  exposed for their families — `TreeTableRow` and `MenuItemRow` are internal-only and aren't
  meaningful as standalone elements.
- **Controlled components need `on()` wired by hand.** `ta-cart`, `ta-color-picker`,
  `ta-payment-input`, `ta-numeric-keypad`, `ta-pin-input`, `ta-quantity-input`, `ta-rating`,
  `ta-tabs`, `ta-selection-grid`, `ta-data-grid`, `ta-entity-autocomplete`, `ta-entity-selector`,
  `ta-item-selector`, `ta-date-range-picker`, `ta-time-slot-picker`, `ta-kanban`, and
  `ta-multiple-select` all read `props.modelValue`/`props.items` directly for rendering instead
  of local state — clicking/typing on them does nothing visible unless you listen for their
  update event and write the new value back onto the element (`on(el, 'update:modelValue', (v)
  => (el.modelValue = v))`, or the `bindModel()` helper). This is standard Vue "controlled
  component" behavior; there's just no parent Vue app here to close the loop automatically. See
  `demo/src/pages/*.ts` for every one of these wired up as a working example.
- **`ta-kanban` needs a `reactive()`-wrapped array.** Cross-column drag mutates `column.items` in
  place (a splice, not a full array replace + emit), which needs real Vue reactivity to
  re-render — a plain array assigned via `el.modelValue = [...]` is never wrapped in `reactive()`
  by `defineCustomElement`. Wrap the initial value yourself: `el.modelValue =
  reactive([...columns])` (see `demo/src/pages/navigation.ts`).
- **Composing `ta-table` + header/body/row/cell needs `display: contents` on every wrapper
  except `ta-table` itself.** A browser's table layout algorithm requires `<tr>` to be a direct
  child of `<table>`/`<tbody>`/`<thead>` and `<td>`/`<th>` a direct child of `<tr>`; an unstyled
  custom element defaults to `display: inline`, so e.g. `<ta-table-row>` (wrapping a real `<tr>`
  one level deeper) breaks that. Use a CSS rule keyed by tag name — `ta-table-row { display:
  contents }` — not a `style="..."` attribute on the tag: since none of these components declare
  `style`/`class` as a prop, Vue's attrs-fallthrough would copy an inline style down onto the
  real `<tr>`/`<td>` too, collapsing their box as well (see `demo/src/pages/tables.html`'s own
  `<style>` block, and `scripts/generate-demo.mjs`'s comment above `composedTableHtml`, for the
  full mechanism).

## Adding a new component

Everything under `src/components/`, `src/index.ts`, and `src/elements.ts` is generated —
**don't hand-edit those files**, edit the generator and re-run it. Only `src/helpers.ts`,
`src/router-link-fallback.ts`, and the `scripts/` themselves are hand-written.

1. Decide the component is standalone (see the root README's "no shared context" rule at the
   top of this file) and pick a `ta-*` tag name (kebab-case, collision-checked automatically).
2. Add its entry to the `entries` array in `scripts/generate.mjs`: `[path under the root
   package's src/components/, tag suffix, PascalCase export base]`.
3. Check whether it (or a component it renders as a child, like `DropdownMenu` inside
   `MonthlySale`) uses `<router-link>` — the grep commands for both cases are in that script's
   comment above `usesRouterLink`. Add its tag suffix to that set if so.
4. Run `npm run generate` (`node scripts/generate.mjs`) from `web-components/`. This regenerates
   *every* wrapper, `index.ts`, and `elements.ts` — safe to do any time, it's fully deterministic
   from the `entries` list.
5. Run `npm run build && npm run type-check`. If `configureApp`'s type triggers vue-tsc's
   TS2321 (excessive stack depth) the way `Alert.vue` did, add the tag to the `tsExpectError`
   branch in the script (see its comment) rather than suppressing it ad hoc in the generated file.
6. Add it to `demo/`: pick a category in `scripts/generate-demo.mjs`'s `categories` object, and
   either give it plain HTML attributes (string/number required props) or a `jsKey` pointing to
   a new entry in `jsPropsSource` (array/object/function required props — see that script's
   top-of-file comment for the two failure modes this avoids). Run `npm run generate:demo`, then
   `cd demo && npm run dev` and actually look at it — a demo entry that silently throws is worse
   than no entry.
7. Update this README's component lists/tables if you added a new category, and the root
   package's own docs if the underlying Vue component itself needs anything (nothing in this
   package's scope should require changing the root component).

## Build

```bash
npm install
npm run generate     # regenerate src/components/*.ts, index.ts, elements.ts (see above)
npm run build         # vite build, vue-tsc emits .d.ts into dist/, then build:css compiles dist/style.css
npm run type-check   # vue-tsc --build (no emit)
```

## Versioning

Same [CalVer](https://calver.org) version as the root `@dynamia-tools/tailadmin-vue` package
(`YY.MM.MICRO`) — **always identical**, never independent. Every release publishes both packages
under the same number, so `@dynamia-tools/tailadmin-vue-wc@26.9.6` is built from exactly the
components in `@dynamia-tools/tailadmin-vue@26.9.6`. This package's version is bumped whenever the
root's is, even if nothing here changed.

## Publishing (maintainers)

One GitHub Release publishes **both** packages: `.github/workflows/publish.yml` runs on the
release tag `vX.Y.Z`. A first `verify` job checks — **before anything is published** — that the
tag equals *both* `package.json` versions and that neither version already exists on npm. Then
`publish` ships the root package and `publish-wc` (`needs: publish`) type-checks, builds and ships
this one; each also checks that the tarball `npm publish` will upload is exactly
`<name>@<tag version>`. Requires the `NPM_TOKEN` secret.

To release, bump `version` in **both** `package.json` files (root and `web-components/`, plus
their lockfiles — `npm version <X.Y.Z> --no-git-tag-version` in each directory does it, though
it reformats the file, so check the diff) and the pinned `@X.Y.Z` in this README's CDN URLs
(`grep -rn "tailadmin-vue-wc@" README.md`), merge, then:

```bash
gh release create vX.Y.Z --title "X.Y.Z" --notes "..."
```

`@dynamia-tools/tailadmin-vue` is an *optional peer* dependency (types only — the shipped
`.d.ts` files reference its `.vue` components; the runtime code is bundled), and a `file:..`
devDependency for local development. Never move it back into `dependencies`: a `file:` spec
published to npm can't be installed by consumers.
