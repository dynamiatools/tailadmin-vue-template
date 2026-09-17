import { defineCustomElement } from 'vue'
import Component from '@dynamia-tools/tailadmin-vue/components/ext/data/EntitySelector.vue'

// shadowRoot: false — these components are styled with Tailwind utility classes, not
// component-scoped <style> blocks. Encapsulating them in a shadow root would isolate them
// from the host page's Tailwind stylesheet (@dynamia-tools/tailadmin-vue/style.css) and
// render them unstyled. Rendered into light DOM, they behave like any other Tailwind markup.
export const EntitySelectorElement = defineCustomElement(Component, { shadowRoot: false })

if (typeof customElements !== 'undefined' && !customElements.get('ta-entity-selector')) {
  customElements.define('ta-entity-selector', EntitySelectorElement)
}
