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
    const el = mount('ta-payment-input', document.getElementById('demo-ta-payment-input')!, {
    modelValue: [{ method: 'card', amount: 50 }],
    total: 50,
    methods: [
      { label: 'Card', value: 'card' },
      { label: 'Cash', value: 'cash' },
    ],
  })
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }

// These elements are plain static tags in this page's HTML (simple string/number attributes
// were enough for their required props) but they're "controlled" components — see this script's
// file-level comment, rule 3 — so they still need `on()` wired by hand for interaction to do
// anything visible.
  {
    const el = document.getElementById('demo-ta-color-picker') as HTMLElementTagNameMap['ta-color-picker']
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = document.getElementById('demo-ta-numeric-keypad') as HTMLElementTagNameMap['ta-numeric-keypad']
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = document.getElementById('demo-ta-pin-input') as HTMLElementTagNameMap['ta-pin-input']
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = document.getElementById('demo-ta-quantity-input') as HTMLElementTagNameMap['ta-quantity-input']
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = document.getElementById('demo-ta-rating') as HTMLElementTagNameMap['ta-rating']
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
