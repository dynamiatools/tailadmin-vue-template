// Generates `demo/index.html` and `demo/src/main.ts` — one card per registered `ta-*` element,
// with sample data wired in. Unlike scripts/generate.mjs, this one needs editorial judgment per
// component (what sample props make sense to show) so it isn't meant to be blindly re-run after
// every change to `entries` in generate.mjs — add the new component's entry below by hand, then
// run `node scripts/generate-demo.mjs` from `web-components/`.
//
// Two hard-won rules this script encodes (see the package README's "Adding a new component"
// section for the full story):
//   1. A component with an array/object/function-typed required prop CANNOT be given sample
//      data via HTML attributes, and setting the property after the element already exists in
//      static HTML is too late (Vue's first render already ran and threw on the missing prop).
//      Mark it with a jsKey pointing into `jsPropsSource` below — it gets an empty placeholder
//      <div> in the HTML, and main.ts creates+configures+appends the real element instead.
//   2. A component that always renders its own full-viewport backdrop with no open/close prop
//      (ta-modal, ta-profile-modal) can't be demoed mounted inline at all. Mark it
//      `'skip:<reason>'` — it gets an explanatory card instead of a live instance.
//   3. A "controlled" component — one that reads `props.modelValue`/`props.items` directly for
//      rendering instead of local state — does nothing visible on interaction unless something
//      listens for its update event and writes the new value back onto the element (there's no
//      parent Vue app here to do that automatically). This was, in practice, most of what looked
//      "broken" the first time a human actually clicked around this demo. Mark it with
//      `opts.selfBind` — see that option's comment below.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const demoDir = path.join(root, 'demo')

// [tag, htmlAttrs (string/number required props settable as plain attributes), jsKey?, opts?]
// opts.selfBind: prop names (or [prop, event] pairs) this component reads directly from its own
// props for rendering (props.modelValue, props.items, ...) rather than local state — these are
// "controlled" components that do nothing visible on interaction unless something listens for
// their update event and writes the new value back. `on()` + reassignment wires that loop by
// hand, since there's no parent Vue app to do it automatically. See this script's file-level
// comment for the story (every ✋-flagged component below was this exact bug).
// opts.html: extra raw HTML appended inside the card, after the element/placeholder.
const categories = {
  ui: {
    label: 'UI',
    tags: [
      ['ta-alert', { variant: 'success', title: 'It works', message: 'Rendered as a plain custom element.' }],
      ['ta-avatar', { src: '/images/user/user-01.jpg' }],
      ['ta-badge', { color: 'primary' }],
      ['ta-button', {}],
      [
        'ta-modal',
        {},
        'skip:always renders its backdrop+overlay unconditionally (no open/close prop) — meant to be wrapped in v-if by a parent, like LoginDialog does internally. Mounting it standalone would cover this whole page.',
      ],
      ['ta-youtube-embed', { 'video-id': 'dQw4w9WgXcQ' }],
      ['ta-responsive-image', {}],
      ['ta-two-column-image-grid', {}],
      ['ta-three-column-image-grid', {}],
    ],
  },
  common: {
    label: 'Common',
    tags: [
      ['ta-component-card', { title: 'Card title' }],
      ['ta-countdown', {}],
      ['ta-dropdown-menu', {}, 'dropdown-menu'],
      ['ta-page-breadcrumb', { 'page-title': 'Current page' }],
      ['ta-common-grid-shape', {}],
    ],
  },
  forms: {
    label: 'Form elements',
    tags: [
      ['ta-checkbox-input', {}],
      ['ta-default-inputs', {}],
      ['ta-dropzone', {}],
      ['ta-file-input', {}],
      ['ta-input-group', {}],
      ['ta-input-state', {}],
      ['ta-multiple-select', {}, 'multiple-select', { selfBind: ['modelValue'] }],
      ['ta-radio-inputs', {}],
      ['ta-select-input', {}],
      ['ta-text-area', {}],
      ['ta-toggle-switch', {}],
    ],
  },
  layouts: {
    label: 'Ext / layouts',
    tags: [
      ['ta-empty-state', { title: 'No results', description: 'Nothing to show yet.', 'action-label': 'Refresh' }],
      ['ta-markdown-viewer', { source: '# Hello\n\nRendered from **markdown**.' }],
      ['ta-cta', {}],
      ['ta-faq-accordion', {}, 'faq-accordion'],
      ['ta-feature-grid', {}, 'feature-grid'],
      ['ta-footer', {}],
      ['ta-hero', {}],
      ['ta-landing', {}],
      ['ta-login-dialog', {}],
      ['ta-pricing-table', {}, 'pricing-table'],
      ['ta-tabs', {}, 'tabs', { selfBind: ['modelValue'] }],
      ['ta-testimonial', {}, 'testimonial'],
      ['ta-auth-split', {}],
      ['ta-border-layout', {}],
      ['ta-docs-layout', {}, 'docs-layout'],
      ['ta-mobile-app-layout', {}, 'mobile-app-layout'],
      ['ta-navbar', {}],
    ],
  },
  input: {
    label: 'Ext / input',
    tags: [
      ['ta-color-picker', { 'model-value': '#465fff' }, undefined, { selfBind: ['modelValue'] }],
      ['ta-money-input', {}],
      ['ta-numeric-keypad', { 'model-value': '1234' }, undefined, { selfBind: ['modelValue'] }],
      ['ta-payment-input', {}, 'payment-input', { selfBind: ['modelValue'] }],
      ['ta-pin-input', { 'model-value': '' }, undefined, { selfBind: ['modelValue'] }],
      ['ta-quantity-input', { 'model-value': '1' }, undefined, { selfBind: ['modelValue'] }],
      ['ta-rating', { 'model-value': '3' }, undefined, { selfBind: ['modelValue'] }],
      ['ta-scanner-input', {}],
    ],
  },
  display: {
    label: 'Ext / display',
    tags: [
      ['ta-map', {}, 'map'],
      // src="" (or omitted with the source's `${props.src}#page=...` template-literal pattern)
      // is a real footgun for iframe/img/audio src bindings — an empty string resolves as a
      // same-document navigation, which in dev mode = the SPA fallback = this page embedding
      // itself recursively. Always give these a real (even if tiny/placeholder) file.
      ['ta-pdf-viewer', { src: '/sample.pdf' }],
      ['ta-qr-code', { value: 'https://dynamiasoluciones.com' }],
      ['ta-status', { label: 'Active' }],
      ['ta-summary', { label: 'Total', value: '1,204' }],
      ['ta-timeline', {}, 'timeline'],
    ],
  },
  media: {
    label: 'Ext / media',
    tags: [
      ['ta-drop-file-uploader', {}],
      ['ta-image-cropper', {}],
      ['ta-signature-pad', {}],
      ['ta-sound-player', {}],
      ['ta-webcam', {}],
    ],
  },
  navigation: {
    label: 'Ext / navigation',
    tags: [
      [
        'ta-command-palette',
        {},
        'command-palette',
        {
          selfBind: ['modelValue'],
          html: `<button type="button" id="open-demo-ta-command-palette" class="rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-600">Open command palette</button>`,
          js: `document.getElementById('open-demo-ta-command-palette')?.addEventListener('click', () => { el.modelValue = true })`,
        },
      ],
      ['ta-fab', {}, 'fab'],
      ['ta-kanban', {}, 'kanban', { selfBind: ['modelValue'] }],
      ['ta-menu', {}, 'menu'],
    ],
  },
  scheduling: {
    label: 'Ext / scheduling',
    tags: [
      ['ta-calendar', {}],
      ['ta-date-range-picker', {}, 'date-range-picker', { selfBind: ['modelValue'] }],
      ['ta-time-slot-picker', {}, 'time-slot-picker', { selfBind: ['modelValue'] }],
    ],
  },
  commerce: {
    label: 'Ext / commerce',
    tags: [
      ['ta-cart', {}, 'cart', { selfBind: [['items', 'update:items']] }],
      [
        'ta-item-card',
        {
          title: 'Wireless Headphones',
          subtitle: 'Over-ear, noise cancelling',
          image: '/images/product/product-01.jpg',
          price: '89.99',
          badge: 'New',
          'badge-color': 'success',
        },
      ],
      ['ta-item-grid', {}, 'item-grid'],
      ['ta-print-preview', { html: '<div style="font-family: sans-serif; padding: 24px;"><h1>Invoice #1024</h1><p>Widget x2 — $20.00</p><p>Shipping — $5.00</p><h2>Total: $25.00</h2></div>' }],
      ['ta-selection-grid', {}, 'selection-grid', { selfBind: ['modelValue'] }],
    ],
  },
  data: {
    label: 'Ext / data',
    tags: [
      ['ta-data-grid', {}, 'data-grid', { selfBind: ['modelValue'] }],
      ['ta-data-table', {}, 'data-table'],
      ['ta-entity-autocomplete', {}, 'entity-autocomplete', { selfBind: ['modelValue'] }],
      ['ta-entity-selector', {}, 'entity-selector', { selfBind: ['modelValue'] }],
      ['ta-item-selector', {}, 'item-selector', { selfBind: ['modelValue'] }],
      ['ta-tree-table', {}, 'tree-table'],
    ],
  },
  utilities: {
    label: 'Ext / utilities',
    tags: [['ta-lazy-loader', {}, 'lazy-loader']],
  },
  charts: {
    label: 'Charts',
    tags: [
      ['ta-bar-chart-one', {}],
      ['ta-line-chart-one', {}],
    ],
  },
  ecommerce: {
    label: 'Ecommerce',
    tags: [
      ['ta-ecommerce-metrics', {}],
      ['ta-monthly-target', {}],
      ['ta-monthly-sale', {}],
      ['ta-statistics-chart', {}],
      ['ta-customer-demographic', {}],
      ['ta-recent-orders', {}],
    ],
  },
  profile: {
    label: 'Profile',
    tags: [
      ['ta-profile-card', {}],
      ['ta-personal-info-card', {}],
      ['ta-address-card', {}],
      ['ta-danger-zone', {}],
      ['ta-security', {}],
      ['ta-profile-modal', {}, 'skip:same always-open backdrop as ta-modal — see its note above.'],
    ],
  },
  tables: {
    label: 'Tables',
    // Table/TableHeader/TableBody/TableRow/TableCell are pure slot-composition primitives (see
    // each file: a bare <table>/<thead>/<tbody>/<tr>/<td> wrapper with just a <slot/>) — blank
    // and meaningless shown alone, the way the other categories show one tag per card. Instead
    // this page gets exactly one worked example composing all five by nesting real markup
    // (avatars, badges) as light-DOM children — no mount() needed, defineCustomElement's default
    // slot works the same as Vue's for plain nested HTML — plus ta-basic-table-one as a second,
    // fully self-contained example.
    composedExample: true,
    tags: [['ta-basic-table-one', {}]],
  },
}

// Sample data for every component whose required props aren't plain strings/numbers. Add an
// entry here (keyed by the jsKey used above) when a new component needs one.
const jsPropsSource = {
  'multiple-select': `{ options: [\n    { id: 1, name: 'Option A' },\n    { id: 2, name: 'Option B' },\n    { id: 3, name: 'Option C' },\n  ] }`,
  'faq-accordion': `{\n    items: [\n      { question: 'What is this?', answer: 'A demo FAQ item rendered by ta-faq-accordion.' },\n      { question: 'Does it work standalone?', answer: 'Yes — no Vue app needed on the host page.' },\n    ],\n  }`,
  'feature-grid': `{\n    features: [\n      { title: 'Fast', description: 'Loads quickly.', icon: FolderIcon },\n      { title: 'Simple', description: 'Easy to use.', icon: FolderIcon },\n      { title: 'Flexible', description: 'Fits many use cases.', icon: FolderIcon },\n    ],\n  }`,
  'pricing-table': `{\n    plans: [\n      { name: 'Basic', price: '$9', features: ['1 seat', 'Email support'] },\n      { name: 'Pro', price: '$29', features: ['5 seats', 'Priority support'], highlighted: true },\n    ],\n  }`,
  tabs: `{\n    tabs: [\n      { id: 'a', label: 'Tab A' },\n      { id: 'b', label: 'Tab B' },\n    ],\n    modelValue: 'a',\n  }`,
  testimonial: `{ items: [{ quote: 'Great library!', name: 'Jane Doe', role: 'Engineer' }] }`,
  'docs-layout': `{\n    nav: [\n      { id: 'intro', label: 'Introduction', depth: 0 },\n      { id: 'usage', label: 'Usage', depth: 0 },\n    ],\n  }`,
  'mobile-app-layout': `{\n    items: [\n      { id: 'home', label: 'Home', icon: FolderIcon },\n      { id: 'profile', label: 'Profile', icon: FolderIcon },\n    ],\n  }`,
  'payment-input': `{\n    modelValue: [{ method: 'card', amount: 50 }],\n    total: 50,\n    methods: [\n      { label: 'Card', value: 'card' },\n      { label: 'Cash', value: 'cash' },\n    ],\n  }`,
  'command-palette': `{\n    modelValue: false,\n    commands: [\n      { id: 'open', label: 'Open file', category: 'File' },\n      { id: 'save', label: 'Save file', category: 'File' },\n      { id: 'theme', label: 'Toggle dark mode', category: 'View' },\n      { id: 'search', label: 'Search components', category: 'View' },\n    ],\n  }`,
  fab: `{ icon: FolderIcon }`,
  // Nested `children` demonstrate the submenu rendering MenuItemRow supports — items without
  // children render as plain links, items with children get an expand/collapse toggle.
  menu: `{\n    items: [\n      { id: 'home', label: 'Home', icon: FolderIcon },\n      {\n        id: 'settings',\n        label: 'Settings',\n        icon: FolderIcon,\n        children: [\n          { id: 'settings-profile', label: 'Profile' },\n          { id: 'settings-billing', label: 'Billing' },\n        ],\n      },\n      {\n        id: 'reports',\n        label: 'Reports',\n        icon: FolderIcon,\n        children: [\n          { id: 'reports-sales', label: 'Sales' },\n          { id: 'reports-inventory', label: 'Inventory' },\n        ],\n      },\n    ],\n  }`,
  // menuItems: DropdownMenuItem[] — one plain button item, one `to` item exercising the
  // <router-link> fallback ta-dropdown-menu registers via configureApp (see ta-dropdown-menu.ts).
  'dropdown-menu': `{\n    menuItems: [\n      { label: 'Edit', onClick: () => alert('Edit clicked') },\n      { label: 'Duplicate', onClick: () => alert('Duplicate clicked') },\n      { label: 'View profile', to: '#' },\n      { label: 'Delete', onClick: () => alert('Delete clicked') },\n    ],\n  }`,
  // Bogotá — Leaflet's own OSM tile fetches still need real network access from the browser to
  // show actual map imagery; center/markers at least give a meaningful view when they load.
  map: `{\n    center: [4.711, -74.0721],\n    zoom: 12,\n    markers: [\n      { lat: 4.711, lng: -74.0721, label: 'Bogotá', popup: 'Bogotá, Colombia' },\n      { lat: 4.65, lng: -74.1, popup: 'Fontibón' },\n    ],\n  }`,
  timeline: `{\n    items: [\n      { id: 1, title: 'Order placed', timestamp: '2026-09-10 09:00', color: 'info' },\n      { id: 2, title: 'Payment confirmed', timestamp: '2026-09-10 09:05', color: 'success' },\n      { id: 3, title: 'Shipped', description: 'Carrier picked up the package.', timestamp: '2026-09-11 14:20', color: 'warning' },\n    ],\n  }`,
  'date-range-picker': `{ modelValue: null }`,
  'time-slot-picker': `{\n    slots: [\n      { value: '09:00', label: '9:00 AM' },\n      { value: '10:00', label: '10:00 AM' },\n    ],\n    modelValue: null,\n  }`,
  cart: `{ items: [{ id: 1, label: 'Widget', unitPrice: 10, quantity: 2 }] }`,
  'item-grid': `{\n    items: [\n      { id: 1, title: 'Wireless Headphones', price: 89.99, image: '/images/product/product-01.jpg' },\n      { id: 2, title: 'Smart Watch', price: 129.0, image: '/images/product/product-02.jpg' },\n      { id: 3, title: 'Camera', price: 249.5, image: '/images/product/product-03.jpg' },\n    ],\n  }`,
  'selection-grid': `{\n    items: [\n      { id: 1, label: 'A' },\n      { id: 2, label: 'B' },\n    ],\n    modelValue: [],\n  }`,
  'data-grid': `{\n    columns: [\n      { key: 'name', label: 'Name' },\n      { key: 'age', label: 'Age', type: 'number' },\n    ],\n    modelValue: [\n      { name: 'Ana', age: 30 },\n      { name: 'Luis', age: 27 },\n    ],\n  }`,
  'data-table': `{\n    columns: [\n      { key: 'name', label: 'Name' },\n      { key: 'age', label: 'Age' },\n    ],\n    rows: [{ name: 'Ana', age: 30 }],\n  }`,
  // A tiny in-memory "backend" so typing actually returns filtered results instead of always [].
  'entity-autocomplete': `{\n    modelValue: null,\n    search: async (query) => {\n      const all = [\n        { label: 'Ana García', value: 1 },\n        { label: 'Luis Pérez', value: 2 },\n        { label: 'Carla Méndez', value: 3 },\n      ]\n      const needle = query.trim().toLowerCase()\n      return needle ? all.filter((p) => p.label.toLowerCase().includes(needle)) : all\n    },\n  }`,
  'entity-selector': `{\n    items: [\n      { label: 'Ana García', value: 1 },\n      { label: 'Luis Pérez', value: 2 },\n      { label: 'Carla Méndez', value: 3 },\n    ],\n    modelValue: null,\n  }`,
  'item-selector': `{\n    items: [\n      { label: 'Small', value: 's' },\n      { label: 'Medium', value: 'm' },\n      { label: 'Large', value: 'l' },\n    ],\n    modelValue: null,\n  }`,
  // hasChildren + a nested children array (not the lazy loadChildren prop) is enough for
  // TreeTable to render the expand/collapse toggle with real rows underneath.
  'tree-table': `{\n    columns: [\n      { key: 'name', label: 'Name' },\n      { key: 'role', label: 'Role' },\n    ],\n    nodes: [\n      {\n        id: 1,\n        name: 'Engineering',\n        role: 'Department',\n        hasChildren: true,\n        children: [\n          { id: 11, name: 'Ana García', role: 'Engineer' },\n          { id: 12, name: 'Luis Pérez', role: 'Engineer' },\n        ],\n      },\n      {\n        id: 2,\n        name: 'Design',\n        role: 'Department',\n        hasChildren: true,\n        children: [{ id: 21, name: 'Carla Méndez', role: 'Designer' }],\n      },\n    ],\n  }`,
  'lazy-loader': `{ loader: async () => 'Loaded content' }`,
  // reactive(): vuedraggable's cross-column drag mutates `column.items` *in place* (splice, not
  // a full array replace + emit), so it needs actual Vue reactivity on the array to re-render —
  // a plain array/object assigned via `el.modelValue = [...]` is never wrapped in reactive() by
  // defineCustomElement (see the "Kanban" note in scripts/generate-demo.mjs's own... this file's
  // header comment). Every other component here works around the same underlying fact by fully
  // *replacing* the prop on every change (see selfBind) instead of mutating nested fields.
  kanban: `{\n    modelValue: reactive([\n      { id: 'todo', title: 'To do', items: [{ id: 1, title: 'Write demo' }, { id: 2, title: 'Fix bugs' }] },\n      { id: 'doing', title: 'Doing', items: [{ id: 3, title: 'Wire props' }] },\n      { id: 'done', title: 'Done', items: [] },\n    ]),\n  }`,
}

function escapeAttr(v) {
  return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

// Normalizes opts.selfBind entries to [prop, event] pairs — a bare string 'modelValue' expands
// to the usual Vue convention ['modelValue', 'update:modelValue'].
function normalizeSelfBind(selfBind = []) {
  return selfBind.map((entry) => (Array.isArray(entry) ? entry : [entry, `update:${entry}`]))
}

// Table/TableHeader/TableBody/TableRow/TableCell composed by nesting real light-DOM children —
// no mount() needed, defineCustomElement's default slot works the same as Vue's for plain nested
// HTML. Reuses the same /images/user/* files ta-basic-table-one's own default data references.
//
// The <style> block below (display: contents on every wrapper except <ta-table> itself) is NOT
// optional decoration — without it the table renders broken (rows/cells lose column alignment,
// everything runs together). Cause: a browser's table layout algorithm requires <tr> to be a
// direct child of <table>/<tbody>/<thead> and <td>/<th> a direct child of <tr>. An unstyled
// custom element defaults to `display: inline`, so e.g. <ta-table-row> (wrapping a real <tr> one
// level deeper) sits between them as a box the layout algorithm doesn't recognize as part of the
// table — each bare <tr> ends up establishing its own anonymous single-row table instead of
// joining the real one. This is a structural fact about composing table primitives as custom
// elements, not a demo-only workaround — see the package README's "Known limitations" section.
//
// It's a <style> rule keyed by tag name, not a `style="..."` attribute on each tag: Vue forwards
// non-prop attributes set on a custom element (attrs fallthrough) onto its own template's root
// element, since none of these components declare `style`/`class` as a prop. An inline
// `style="display: contents"` attribute on <ta-table-row> would land on the wrapper AND get
// copied onto the real <tr> inside it — collapsing the row's own box too, which is exactly what
// must NOT happen (<tr> needs to keep `display: table-row`; only the outer custom-element
// wrapper's box should disappear). A same-selector CSS rule only ever matches the outer tag.
const composedTableHtml = `      <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800 sm:col-span-2">
        <style>
          ta-table-header, ta-table-body, ta-table-row, ta-table-cell { display: contents; }
        </style>
        <p class="mb-2 font-mono text-xs text-gray-400">&lt;ta-table&gt; + header/body/row/cell (composed)</p>
        <ta-table>
          <ta-table-header>
            <ta-table-row is-header="true">
              <ta-table-cell is-header="true">User</ta-table-cell>
              <ta-table-cell is-header="true">Role</ta-table-cell>
              <ta-table-cell is-header="true">Status</ta-table-cell>
            </ta-table-row>
          </ta-table-header>
          <ta-table-body>
            <ta-table-row>
              <ta-table-cell>
                <div class="flex items-center gap-3">
                  <img src="/images/user/user-17.jpg" alt="" class="h-8 w-8 rounded-full object-cover" />
                  <span class="text-gray-800 dark:text-white/90">Lindsey Curtis</span>
                </div>
              </ta-table-cell>
              <ta-table-cell>Web Designer</ta-table-cell>
              <ta-table-cell><ta-badge color="success">Active</ta-badge></ta-table-cell>
            </ta-table-row>
            <ta-table-row>
              <ta-table-cell>
                <div class="flex items-center gap-3">
                  <img src="/images/user/user-18.jpg" alt="" class="h-8 w-8 rounded-full object-cover" />
                  <span class="text-gray-800 dark:text-white/90">Kaiya George</span>
                </div>
              </ta-table-cell>
              <ta-table-cell>Project Manager</ta-table-cell>
              <ta-table-cell><ta-badge color="warning">Pending</ta-badge></ta-table-cell>
            </ta-table-row>
            <ta-table-row>
              <ta-table-cell>
                <div class="flex items-center gap-3">
                  <img src="/images/user/user-19.jpg" alt="" class="h-8 w-8 rounded-full object-cover" />
                  <span class="text-gray-800 dark:text-white/90">Zain Geidt</span>
                </div>
              </ta-table-cell>
              <ta-table-cell>Content Writer</ta-table-cell>
              <ta-table-cell><ta-badge color="error">Cancelled</ta-badge></ta-table-cell>
            </ta-table-row>
          </ta-table-body>
        </ta-table>
      </div>
`

// One HTML page + one main.ts per category (not one giant page) — ~100 live custom elements on
// a single page made it hard to test any one of them (scroll, the fixed-position ones like
// ta-fab/ta-mobile-app-layout fighting over screen corners, etc). `index.html` is just a list of
// links to `pages/<category>.html`.
//
// Components with array/object/function-typed required props can't be configured via HTML
// attributes, AND can't be patched after the fact either: a custom element already present in
// the static HTML upgrades (and Vue does its first render) the instant the page is parsed —
// before any deferred <script type="module"> runs — so a required prop that's still undefined
// at that first render throws. Those get an empty placeholder <div> here; the page's own script
// mounts the real element (via the package's own `mount()` helper) with its properties already set.
const pagesDir = path.join(demoDir, 'pages')
const srcPagesDir = path.join(demoDir, 'src', 'pages')
fs.rmSync(pagesDir, { recursive: true, force: true })
fs.rmSync(srcPagesDir, { recursive: true, force: true })
fs.mkdirSync(pagesDir, { recursive: true })
fs.mkdirSync(srcPagesDir, { recursive: true })

let total = 0
const pageLinks = []

for (const [key, { label, tags, composedExample }] of Object.entries(categories)) {
  let cardsHtml = ''
  const complexTags = [] // [tag, id, jsKey, selfBind] — needs mount()
  const bindTags = [] // [tag, id, selfBind] — plain attrs, just needs post-mount wiring
  for (const [tag, attrs, jsKey, opts] of tags) {
    total++
    const id = `demo-${tag}`
    const selfBind = normalizeSelfBind(opts?.selfBind)
    const extraHtml = opts?.html ? `\n        ${opts.html}` : ''
    if (jsKey && jsKey.startsWith('skip:')) {
      const note = jsKey.slice('skip:'.length)
      cardsHtml += `      <div class="rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-700">\n        <p class="mb-2 font-mono text-xs text-gray-400">&lt;${tag}&gt;</p>\n        <p class="text-xs text-gray-500 dark:text-gray-400">Not mounted here: ${escapeAttr(note)}</p>\n      </div>\n`
      continue
    }
    if (jsKey) {
      complexTags.push([tag, id, jsKey, selfBind, opts?.js])
      cardsHtml += `      <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">\n        <p class="mb-2 font-mono text-xs text-gray-400">&lt;${tag}&gt;</p>\n        <div id="${id}"></div>${extraHtml}\n      </div>\n`
      continue
    }
    if (selfBind.length || opts?.js) bindTags.push([tag, id, selfBind, opts?.js])
    const attrStr = Object.entries(attrs)
      .map(([k, v]) => ` ${k}="${escapeAttr(v)}"`)
      .join('')
    cardsHtml += `      <div class="rounded-lg border border-gray-200 p-4 dark:border-gray-800">\n        <p class="mb-2 font-mono text-xs text-gray-400">&lt;${tag}&gt;</p>\n        <${tag} id="${id}"${attrStr}></${tag}>${extraHtml}\n      </div>\n`
  }
  if (composedExample) cardsHtml += composedTableHtml

  const pageHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${label} — tailadmin-vue-wc demo</title>
  </head>
  <body class="bg-gray-50 dark:bg-gray-900">
    <main class="mx-auto flex max-w-5xl flex-col gap-6 p-8">
      <a href="../index.html" class="text-sm text-brand-600 hover:underline">&larr; All categories</a>
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white">${label}</h1>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
${cardsHtml}      </div>
    </main>

    <script type="module" src="../src/pages/${key}.ts"></script>
  </body>
</html>
`
  fs.writeFileSync(path.join(pagesDir, `${key}.html`), pageHtml)

  // selfBind lines: `on(el, event, (v) => { el.prop = v })` for each [prop, event] pair — the
  // hand-wired equivalent of what a parent Vue app's v-model would do automatically.
  const selfBindLines = (bindPairs) => bindPairs.map(([prop, event]) => `    on(el, '${event}', (v) => { el.${prop} = v })`).join('\n')

  const complexEntries = complexTags
    .map(([tag, id, jsKey, selfBind, js]) => {
      const lines = [`  {`, `    const el = mount('${tag}', document.getElementById('${id}')!, ${jsPropsSource[jsKey]})`]
      if (selfBind.length) lines.push(selfBindLines(selfBind))
      if (js) lines.push(`    ${js}`)
      lines.push(`  }`)
      return lines.join('\n')
    })
    .join('\n')

  const bindEntries = bindTags
    .map(([tag, id, selfBind, js]) => {
      const lines = [`  {`, `    const el = document.getElementById('${id}') as HTMLElementTagNameMap['${tag}']`]
      if (selfBind.length) lines.push(selfBindLines(selfBind))
      if (js) lines.push(`    ${js}`)
      lines.push(`  }`)
      return lines.join('\n')
    })
    .join('\n')

  const pageTs = `import '../style.css'
// ta-date-range-picker (vue-flatpickr-component) and ta-customer-demographic (jsvectormap)
// render unstyled/oversized without their library's own CSS — same imports
// examples/basic-app's main.ts carries for the same reason. Harmless to import on every page
// even when this category doesn't use them.
import 'flatpickr/dist/flatpickr.css'
import 'jsvectormap/dist/jsvectormap.css'

// Registers every \`ta-*\` custom element as a side effect, and makes every tag fully typed.
// Importing the whole barrel on every page (not just this category's tags) is deliberate:
// simpler than per-category subset imports, and registration is idempotent/cheap.
import '@dynamia-tools/tailadmin-vue-wc'
import '@dynamia-tools/tailadmin-vue-wc/elements'
import { mount, on } from '@dynamia-tools/tailadmin-vue-wc/helpers'
import { FolderIcon } from '@dynamia-tools/tailadmin-vue/icons'
import { reactive } from 'vue'
${complexEntries ? `
// Array/object/function-typed required props can't be passed as HTML attributes, and can't be
// patched onto an already-mounted element either: a custom element present in the static HTML
// upgrades (and does its first Vue render) the instant the page is parsed, before this deferred
// module runs — a required prop still undefined at that first render throws. \`mount()\` (from
// this package's own helpers, dogfooded here) creates each element, sets its properties, and
// only then appends it into its placeholder <div> from this page's HTML — see the package
// README's "Known limitations" section.
${complexEntries}
` : ''}${bindEntries ? `
// These elements are plain static tags in this page's HTML (simple string/number attributes
// were enough for their required props) but they're "controlled" components — see this script's
// file-level comment, rule 3 — so they still need \`on()\` wired by hand for interaction to do
// anything visible.
${bindEntries}
` : ''}`

  fs.writeFileSync(path.join(srcPagesDir, `${key}.ts`), pageTs)
  pageLinks.push({ key, label, count: tags.length })
}

console.log(`Wrote ${pageLinks.length} category pages, ${total} elements total.`)

const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>tailadmin-vue-wc demo</title>
    <!-- No page script here (just links), but Vite still needs a module reference to run this
         through the CSS pipeline (Tailwind's @source/@import chain) — a plain <link> to a raw
         .css file skips that. -->
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body class="bg-gray-50 dark:bg-gray-900">
    <main class="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <div>
        <h1 class="text-xl font-semibold text-gray-800 dark:text-white">Web Components demo</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          All ${total} standalone elements from @dynamia-tools/tailadmin-vue-wc, one category per page so
          each one is actually testable (fixed-position components like ta-fab, full-page ones like
          ta-modal, etc. don't fight for the same screen). Components with array/object/function-typed
          required props are mounted via the package's own \`mount()\` helper with sample data — see the
          "Known limitations" section of the package README for why that can't be done via plain HTML
          attributes.
        </p>
      </div>
      <ul class="flex flex-col divide-y divide-gray-200 rounded-lg border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
${pageLinks
  .map(
    ({ key, label, count }) =>
      `        <li><a class="flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5" href="pages/${key}.html"><span class="text-gray-800 dark:text-white/90">${label}</span><span class="text-xs text-gray-400">${count}</span></a></li>`,
  )
  .join('\n')}
      </ul>
    </main>
  </body>
</html>
`

fs.writeFileSync(path.join(demoDir, 'index.html'), indexHtml)
console.log(`Wrote index.html with links to ${pageLinks.length} category pages.`)
