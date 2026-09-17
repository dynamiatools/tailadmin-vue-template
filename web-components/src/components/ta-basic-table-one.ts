import { defineCustomElement } from 'vue'
import Component from '@dynamia-tools/tailadmin-vue/components/tables/basic-tables/BasicTableOne.vue'

// shadowRoot: false — these components are styled with Tailwind utility classes, not
// component-scoped <style> blocks. Encapsulating them in a shadow root would isolate them
// from the host page's Tailwind stylesheet (@dynamia-tools/tailadmin-vue/style.css) and
// render them unstyled. Rendered into light DOM, they behave like any other Tailwind markup.
export const BasicTableOneElement = defineCustomElement(Component, { shadowRoot: false })

if (typeof customElements !== 'undefined' && !customElements.get('ta-basic-table-one')) {
  customElements.define('ta-basic-table-one', BasicTableOneElement)
}
