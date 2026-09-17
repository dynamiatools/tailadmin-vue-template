import './style.css'
// ta-date-range-picker (vue-flatpickr-component) and ta-customer-demographic (jsvectormap)
// render unstyled/oversized without their library's own CSS — same imports
// examples/basic-app's main.ts carries for the same reason.
import 'flatpickr/dist/flatpickr.css'
import 'jsvectormap/dist/jsvectormap.css'

// Registers every `ta-*` custom element as a side effect.
import '@dynamia-tools/tailadmin-vue-wc'
import { FolderIcon } from '@dynamia-tools/tailadmin-vue/icons'

// Array/object/function-typed required props can't be passed as HTML attributes, and can't be
// patched onto an already-mounted element either: a custom element present in the static HTML
// upgrades (and does its first Vue render) the instant the page is parsed, before this deferred
// module runs — a required prop still undefined at that first render throws. So these elements
// are created here instead, with their properties set BEFORE they're appended to the DOM (see
// index.html's empty <div id="demo-ta-*"> placeholders and the package README's "Known
// limitations" section).
const complex: [containerId: string, tag: string, props: Record<string, unknown>][] = [
  ['demo-ta-multiple-select', 'ta-multiple-select', { options: [
    { id: 1, name: 'Option A' },
    { id: 2, name: 'Option B' },
    { id: 3, name: 'Option C' },
  ] }],
  ['demo-ta-faq-accordion', 'ta-faq-accordion', {
    items: [
      { question: 'What is this?', answer: 'A demo FAQ item rendered by ta-faq-accordion.' },
      { question: 'Does it work standalone?', answer: 'Yes — no Vue app needed on the host page.' },
    ],
  }],
  ['demo-ta-feature-grid', 'ta-feature-grid', {
    features: [
      { title: 'Fast', description: 'Loads quickly.', icon: FolderIcon },
      { title: 'Simple', description: 'Easy to use.', icon: FolderIcon },
      { title: 'Flexible', description: 'Fits many use cases.', icon: FolderIcon },
    ],
  }],
  ['demo-ta-pricing-table', 'ta-pricing-table', {
    plans: [
      { name: 'Basic', price: '$9', features: ['1 seat', 'Email support'] },
      { name: 'Pro', price: '$29', features: ['5 seats', 'Priority support'], highlighted: true },
    ],
  }],
  ['demo-ta-tabs', 'ta-tabs', {
    tabs: [
      { id: 'a', label: 'Tab A' },
      { id: 'b', label: 'Tab B' },
    ],
    modelValue: 'a',
  }],
  ['demo-ta-testimonial', 'ta-testimonial', { items: [{ quote: 'Great library!', name: 'Jane Doe', role: 'Engineer' }] }],
  ['demo-ta-docs-layout', 'ta-docs-layout', {
    nav: [
      { id: 'intro', label: 'Introduction', depth: 0 },
      { id: 'usage', label: 'Usage', depth: 0 },
    ],
  }],
  ['demo-ta-mobile-app-layout', 'ta-mobile-app-layout', {
    items: [
      { id: 'home', label: 'Home', icon: FolderIcon },
      { id: 'profile', label: 'Profile', icon: FolderIcon },
    ],
  }],
  ['demo-ta-payment-input', 'ta-payment-input', {
    modelValue: [{ method: 'card', amount: 50 }],
    total: 50,
    methods: [
      { label: 'Card', value: 'card' },
      { label: 'Cash', value: 'cash' },
    ],
  }],
  ['demo-ta-command-palette', 'ta-command-palette', {
    modelValue: false,
    commands: [
      { id: 'open', label: 'Open file' },
      { id: 'save', label: 'Save' },
    ],
  }],
  ['demo-ta-fab', 'ta-fab', { icon: FolderIcon }],
  ['demo-ta-kanban', 'ta-kanban', {
    modelValue: [
      { id: 'todo', title: 'To do', items: [{ id: 1, title: 'Write demo' }] },
      { id: 'doing', title: 'Doing', items: [{ id: 2, title: 'Wire props' }] },
      { id: 'done', title: 'Done', items: [] },
    ],
  }],
  ['demo-ta-menu', 'ta-menu', {
    items: [
      { id: 'home', label: 'Home', icon: FolderIcon },
      { id: 'settings', label: 'Settings', icon: FolderIcon },
    ],
  }],
  ['demo-ta-date-range-picker', 'ta-date-range-picker', { modelValue: null }],
  ['demo-ta-time-slot-picker', 'ta-time-slot-picker', {
    slots: [
      { value: '09:00', label: '9:00 AM' },
      { value: '10:00', label: '10:00 AM' },
    ],
    modelValue: null,
  }],
  ['demo-ta-cart', 'ta-cart', { items: [{ id: 1, label: 'Widget', unitPrice: 10, quantity: 2 }] }],
  ['demo-ta-item-grid', 'ta-item-grid', {
    items: [
      { id: 1, title: 'Item A' },
      { id: 2, title: 'Item B' },
    ],
  }],
  ['demo-ta-selection-grid', 'ta-selection-grid', {
    items: [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
    ],
    modelValue: [],
  }],
  ['demo-ta-data-grid', 'ta-data-grid', {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ],
    modelValue: [{ name: 'Ana', age: 30 }],
  }],
  ['demo-ta-data-table', 'ta-data-table', {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ],
    rows: [{ name: 'Ana', age: 30 }],
  }],
  ['demo-ta-entity-autocomplete', 'ta-entity-autocomplete', { modelValue: null, search: async () => [] }],
  ['demo-ta-entity-selector', 'ta-entity-selector', { items: [], modelValue: null }],
  ['demo-ta-item-selector', 'ta-item-selector', { items: [], modelValue: null }],
  ['demo-ta-tree-table', 'ta-tree-table', {
    columns: [{ key: 'name', label: 'Name' }],
    nodes: [{ id: 1, name: 'Root' }],
  }],
  ['demo-ta-lazy-loader', 'ta-lazy-loader', { loader: async () => 'Loaded content' }],
]

for (const [containerId, tag, props] of complex) {
  const container = document.getElementById(containerId)
  if (!container) continue
  const el = document.createElement(tag)
  Object.assign(el, props)
  container.appendChild(el)
}
