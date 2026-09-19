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
    const el = mount('ta-faq-accordion', document.getElementById('demo-ta-faq-accordion')!, {
    items: [
      { question: 'What is this?', answer: 'A demo FAQ item rendered by ta-faq-accordion.' },
      { question: 'Does it work standalone?', answer: 'Yes — no Vue app needed on the host page.' },
    ],
  })
  }
  {
    const el = mount('ta-feature-grid', document.getElementById('demo-ta-feature-grid')!, {
    features: [
      { title: 'Fast', description: 'Loads quickly.', icon: FolderIcon },
      { title: 'Simple', description: 'Easy to use.', icon: FolderIcon },
      { title: 'Flexible', description: 'Fits many use cases.', icon: FolderIcon },
    ],
  })
  }
  {
    const el = mount('ta-pricing-table', document.getElementById('demo-ta-pricing-table')!, {
    plans: [
      { name: 'Basic', price: '$9', features: ['1 seat', 'Email support'] },
      { name: 'Pro', price: '$29', features: ['5 seats', 'Priority support'], highlighted: true },
    ],
  })
  }
  {
    const el = mount('ta-tabs', document.getElementById('demo-ta-tabs')!, {
    tabs: [
      { id: 'a', label: 'Tab A' },
      { id: 'b', label: 'Tab B' },
    ],
    modelValue: 'a',
  })
    on(el, 'update:modelValue', (v) => { el.modelValue = v })
  }
  {
    const el = mount('ta-testimonial', document.getElementById('demo-ta-testimonial')!, { items: [{ quote: 'Great library!', name: 'Jane Doe', role: 'Engineer' }] })
  }
  {
    const el = mount('ta-docs-layout', document.getElementById('demo-ta-docs-layout')!, {
    nav: [
      { id: 'intro', label: 'Introduction', depth: 0 },
      { id: 'usage', label: 'Usage', depth: 0 },
    ],
  })
  }
  {
    const el = mount('ta-mobile-app-layout', document.getElementById('demo-ta-mobile-app-layout')!, {
    items: [
      { id: 'home', label: 'Home', icon: FolderIcon },
      { id: 'profile', label: 'Profile', icon: FolderIcon },
    ],
  })
  }
