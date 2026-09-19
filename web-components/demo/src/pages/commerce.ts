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
    const el = mount('ta-cart', document.getElementById('demo-ta-cart')!, { items: [{ id: 1, label: 'Widget', unitPrice: 10, quantity: 2 }] })
    on(el, 'update:items', (v) => { el.items = v })
  }
  {
    const el = mount('ta-item-grid', document.getElementById('demo-ta-item-grid')!, {
    items: [
      { id: 1, title: 'Wireless Headphones', price: 89.99, image: '/images/product/product-01.jpg' },
      { id: 2, title: 'Smart Watch', price: 129.0, image: '/images/product/product-02.jpg' },
      { id: 3, title: 'Camera', price: 249.5, image: '/images/product/product-03.jpg' },
    ],
  })
  }
  {
    const el = mount('ta-selection-grid', document.getElementById('demo-ta-selection-grid')!, {
    items: [
      { id: 1, label: 'A' },
      { id: 2, label: 'B' },
    ],
    modelValue: [],
  })
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
