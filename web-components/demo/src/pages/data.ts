import '../style.css'
// ta-date-range-picker (vue-flatpickr-component) and ta-customer-demographic (jsvectormap)
// render unstyled/oversized without their library's own CSS — same imports
// examples/basic-app's main.ts carries for the same reason. Harmless to import on every page
// even when this category doesn't use them.
import 'flatpickr/dist/flatpickr.css'
import 'jsvectormap/dist/jsvectormap.css'

// Registers every `ta-*` custom element as a side effect, and makes every tag fully typed.
// Importing the whole barrel on every page (not just this category's tags) is deliberate:
// simpler than per-category subset imports, and registration is idempotent/cheap.
import '@dynamia-tools/tailadmin-vue-wc'
import '@dynamia-tools/tailadmin-vue-wc/elements'
import { mount, on } from '@dynamia-tools/tailadmin-vue-wc/helpers'
import { FolderIcon } from '@dynamia-tools/tailadmin-vue/icons'
import { reactive } from 'vue'

// Array/object/function-typed required props can't be passed as HTML attributes, and can't be
// patched onto an already-mounted element either: a custom element present in the static HTML
// upgrades (and does its first Vue render) the instant the page is parsed, before this deferred
// module runs — a required prop still undefined at that first render throws. `mount()` (from
// this package's own helpers, dogfooded here) creates each element, sets its properties, and
// only then appends it into its placeholder <div> from this page's HTML — see the package
// README's "Known limitations" section.
  {
    const el = mount('ta-data-grid', document.getElementById('demo-ta-data-grid')!, {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age', type: 'number' },
    ],
    modelValue: [
      { name: 'Ana', age: 30 },
      { name: 'Luis', age: 27 },
    ],
  })
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = mount('ta-data-table', document.getElementById('demo-ta-data-table')!, {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'age', label: 'Age' },
    ],
    rows: [{ name: 'Ana', age: 30 }],
  })
  }
  {
    const el = mount('ta-entity-autocomplete', document.getElementById('demo-ta-entity-autocomplete')!, {
    modelValue: null,
    search: async (query) => {
      const all = [
        { label: 'Ana García', value: 1 },
        { label: 'Luis Pérez', value: 2 },
        { label: 'Carla Méndez', value: 3 },
      ]
      const needle = query.trim().toLowerCase()
      return needle ? all.filter((p) => p.label.toLowerCase().includes(needle)) : all
    },
  })
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = mount('ta-entity-selector', document.getElementById('demo-ta-entity-selector')!, {
    items: [
      { label: 'Ana García', value: 1 },
      { label: 'Luis Pérez', value: 2 },
      { label: 'Carla Méndez', value: 3 },
    ],
    modelValue: null,
  })
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = mount('ta-item-selector', document.getElementById('demo-ta-item-selector')!, {
    items: [
      { label: 'Small', value: 's' },
      { label: 'Medium', value: 'm' },
      { label: 'Large', value: 'l' },
    ],
    modelValue: null,
  })
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = mount('ta-tree-table', document.getElementById('demo-ta-tree-table')!, {
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'role', label: 'Role' },
    ],
    nodes: [
      {
        id: 1,
        name: 'Engineering',
        role: 'Department',
        hasChildren: true,
        children: [
          { id: 11, name: 'Ana García', role: 'Engineer' },
          { id: 12, name: 'Luis Pérez', role: 'Engineer' },
        ],
      },
      {
        id: 2,
        name: 'Design',
        role: 'Department',
        hasChildren: true,
        children: [{ id: 21, name: 'Carla Méndez', role: 'Designer' }],
      },
    ],
  })
  }
