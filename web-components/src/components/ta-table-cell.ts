import { defineCustomElement } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import Component from '@dynamia-tools/tailadmin-vue/components/tables/TableCell.vue'

// shadowRoot: false — these components are styled with Tailwind utility classes, not
// component-scoped <style> blocks. Encapsulating them in a shadow root would isolate them
// from the host page's Tailwind stylesheet (@dynamia-tools/tailadmin-vue/style.css) and
// render them unstyled. Rendered into light DOM, they behave like any other Tailwind markup.
export const TableCellElement = defineCustomElement(Component, { shadowRoot: false })

if (typeof customElements !== 'undefined' && !customElements.get('ta-table-cell')) {
  customElements.define('ta-table-cell', TableCellElement)
}

// Derived structurally from the Vue SFC's own compiled type via `vue-component-type-helpers`
// (the Vue team's own package for exactly this) — never hand-maintained, never drifts. Backs
// this tag's entry in `elements.ts`'s HTMLElementTagNameMap augmentation, and also types the
// helpers package's `on()` for events (Vue folds each `defineEmits`/`defineModel` event into
// an `onEventName` handler prop here — see `on()`'s own doc comment for why that, and not this
// component's raw `$emit` type, is what `on()` reads from).
//
// Not derived from `InstanceType<typeof TableCellElement>` even though defineCustomElement's own
// typing looks like it should give this for free: across this package's build (declaration emit
// resolving the *value* `TableCellElement`'s type, not a lazy type alias), that conditional type
// collapses to `VueElementConstructor<unknown>` — losing the props entirely. Keeping
// `ComponentProps<typeof Component>` as a type alias (never assigned to a value) keeps it lazy,
// so it resolves correctly wherever it's actually used, including in a consumer's own project.
export type TableCellProps = ComponentProps<typeof Component>
