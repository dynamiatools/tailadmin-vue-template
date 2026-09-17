import { defineCustomElement } from 'vue'
import Component from '@dynamia-tools/tailadmin-vue/components/ui/Alert.vue'
import { registerRouterLinkFallback } from '../router-link-fallback'

// shadowRoot: false — these components are styled with Tailwind utility classes, not
// component-scoped <style> blocks. Encapsulating them in a shadow root would isolate them
// from the host page's Tailwind stylesheet (@dynamia-tools/tailadmin-vue/style.css) and
// render them unstyled. Rendered into light DOM, they behave like any other Tailwind markup.
//
// configureApp: this component optionally renders <router-link>; standalone it has no
// vue-router, so we register a plain-<a> fallback under the same name.
// @ts-expect-error — vue-tsc TS2321 (excessive stack depth) comparing configureApp's type
// against this SFC's generated component options; harmless, the fallback registers fine at
// runtime (verified in web-components/demo).
export const AlertElement = defineCustomElement(Component, {
  shadowRoot: false,
  configureApp: registerRouterLinkFallback,
})

if (typeof customElements !== 'undefined' && !customElements.get('ta-alert')) {
  customElements.define('ta-alert', AlertElement)
}
