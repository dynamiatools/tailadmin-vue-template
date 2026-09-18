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
    const el = mount('ta-map', document.getElementById('demo-ta-map')!, {
    center: [4.711, -74.0721],
    zoom: 12,
    markers: [
      { lat: 4.711, lng: -74.0721, label: 'Bogotá', popup: 'Bogotá, Colombia' },
      { lat: 4.65, lng: -74.1, popup: 'Fontibón' },
    ],
  })
  }
  {
    const el = mount('ta-timeline', document.getElementById('demo-ta-timeline')!, {
    items: [
      { id: 1, title: 'Order placed', timestamp: '2026-09-10 09:00', color: 'info' },
      { id: 2, title: 'Payment confirmed', timestamp: '2026-09-10 09:05', color: 'success' },
      { id: 3, title: 'Shipped', description: 'Carrier picked up the package.', timestamp: '2026-09-11 14:20', color: 'warning' },
    ],
  })
  }
