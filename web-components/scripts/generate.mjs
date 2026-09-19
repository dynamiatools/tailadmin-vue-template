// Generates every `src/components/ta-*.ts` wrapper, `src/index.ts` (barrel), and
// `src/elements.ts` (HTMLElementTagNameMap augmentation) from the `entries` list below.
//
// Run after adding/removing a component: `node scripts/generate.mjs` from `web-components/`.
// See the README's "Adding a new component" section for the full recipe (this script only
// covers the wrapper + typing side — `demo/` needs its own manual entry, since sample props are
// an editorial choice this script can't make).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'components')

// Components that conditionally render <router-link> (directly, or via a child component that
// does — e.g. MonthlySale/MonthlyTarget render DropdownMenu). Vue's compiled render fn calls
// resolveComponent('router-link') unconditionally regardless of the v-if branch, so standalone
// (no vue-router) they need the plain-<a> fallback registered via configureApp, or they warn
// every render. Find new cases with:
//   grep -rl "router-link" ../src/components          # direct usage
//   grep -rl "DropdownMenu.vue\|Alert.vue\|PageBreadcrumb.vue" ../src/components  # indirect, via a child
const usesRouterLink = new Set(['alert', 'dropdown-menu', 'page-breadcrumb', 'monthly-sale', 'monthly-target'])

// [relative path under root package's src/components/, tag name without the ta- prefix,
// PascalCase export identifier base (becomes `<Base>Element`/`<Base>Props`)]
const entries = [
  ['ui/Alert.vue', 'alert', 'Alert'],
  ['ui/Avatar.vue', 'avatar', 'Avatar'],
  ['ui/Badge.vue', 'badge', 'Badge'],
  ['ui/Button.vue', 'button', 'Button'],
  ['ui/Modal.vue', 'modal', 'Modal'],
  ['ui/YouTubeEmbed.vue', 'youtube-embed', 'YoutubeEmbed'],
  ['ui/images/ResponsiveImage.vue', 'responsive-image', 'ResponsiveImage'],
  ['ui/images/TwoColumnImageGrid.vue', 'two-column-image-grid', 'TwoColumnImageGrid'],
  ['ui/images/ThreeColumnImageGrid.vue', 'three-column-image-grid', 'ThreeColumnImageGrid'],

  ['common/ComponentCard.vue', 'component-card', 'ComponentCard'],
  ['common/CountDown.vue', 'countdown', 'Countdown'],
  ['common/DropdownMenu.vue', 'dropdown-menu', 'DropdownMenu'],
  ['common/PageBreadcrumb.vue', 'page-breadcrumb', 'PageBreadcrumb'],
  ['common/CommonGridShape.vue', 'common-grid-shape', 'CommonGridShape'],

  ['forms/FormElements/CheckboxInput.vue', 'checkbox-input', 'CheckboxInput'],
  ['forms/FormElements/DefaultInputs.vue', 'default-inputs', 'DefaultInputs'],
  ['forms/FormElements/Dropzone.vue', 'dropzone', 'Dropzone'],
  ['forms/FormElements/FileInput.vue', 'file-input', 'FileInput'],
  ['forms/FormElements/InputGroup.vue', 'input-group', 'InputGroup'],
  ['forms/FormElements/InputState.vue', 'input-state', 'InputState'],
  ['forms/FormElements/MultipleSelect.vue', 'multiple-select', 'MultipleSelect'],
  ['forms/FormElements/RadioInputs.vue', 'radio-inputs', 'RadioInputs'],
  ['forms/FormElements/SelectInput.vue', 'select-input', 'SelectInput'],
  ['forms/FormElements/TextArea.vue', 'text-area', 'TextArea'],
  ['forms/FormElements/ToggleSwitch.vue', 'toggle-switch', 'ToggleSwitch'],

  ['ext/layouts/EmptyState.vue', 'empty-state', 'EmptyState'],
  ['ext/layouts/MarkdownViewer.vue', 'markdown-viewer', 'MarkdownViewer'],
  ['ext/layouts/CTA.vue', 'cta', 'Cta'],
  ['ext/layouts/FAQAccordion.vue', 'faq-accordion', 'FaqAccordion'],
  ['ext/layouts/FeatureGrid.vue', 'feature-grid', 'FeatureGrid'],
  ['ext/layouts/Footer.vue', 'footer', 'Footer'],
  ['ext/layouts/Hero.vue', 'hero', 'Hero'],
  ['ext/layouts/Landing.vue', 'landing', 'Landing'],
  ['ext/layouts/LoginDialog.vue', 'login-dialog', 'LoginDialog'],
  ['ext/layouts/PricingTable.vue', 'pricing-table', 'PricingTable'],
  ['ext/layouts/Tabs.vue', 'tabs', 'Tabs'],
  ['ext/layouts/Testimonial.vue', 'testimonial', 'Testimonial'],
  ['ext/layouts/AuthSplit.vue', 'auth-split', 'AuthSplit'],
  ['ext/layouts/BorderLayout.vue', 'border-layout', 'BorderLayout'],
  ['ext/layouts/DocsLayout.vue', 'docs-layout', 'DocsLayout'],
  ['ext/layouts/MobileAppLayout.vue', 'mobile-app-layout', 'MobileAppLayout'],
  ['ext/layouts/Navbar.vue', 'navbar', 'Navbar'],

  ['ext/input/ColorPicker.vue', 'color-picker', 'ColorPicker'],
  ['ext/input/MoneyInput.vue', 'money-input', 'MoneyInput'],
  ['ext/input/NumericKeypad.vue', 'numeric-keypad', 'NumericKeypad'],
  ['ext/input/PaymentInput.vue', 'payment-input', 'PaymentInput'],
  ['ext/input/PinInput.vue', 'pin-input', 'PinInput'],
  ['ext/input/QuantityInput.vue', 'quantity-input', 'QuantityInput'],
  ['ext/input/Rating.vue', 'rating', 'Rating'],
  ['ext/input/ScannerInput.vue', 'scanner-input', 'ScannerInput'],

  ['ext/display/Map.vue', 'map', 'Map'],
  ['ext/display/PdfViewer.vue', 'pdf-viewer', 'PdfViewer'],
  ['ext/display/QrCode.vue', 'qr-code', 'QrCode'],
  ['ext/display/Status.vue', 'status', 'Status'],
  ['ext/display/Summary.vue', 'summary', 'Summary'],
  ['ext/display/Timeline.vue', 'timeline', 'Timeline'],

  ['ext/media/DropFileUploader.vue', 'drop-file-uploader', 'DropFileUploader'],
  ['ext/media/ImageCropper.vue', 'image-cropper', 'ImageCropper'],
  ['ext/media/SignaturePad.vue', 'signature-pad', 'SignaturePad'],
  ['ext/media/SoundPlayer.vue', 'sound-player', 'SoundPlayer'],
  ['ext/media/Webcam.vue', 'webcam', 'Webcam'],

  ['ext/navigation/CommandPalette.vue', 'command-palette', 'CommandPalette'],
  ['ext/navigation/Fab.vue', 'fab', 'Fab'],
  ['ext/navigation/Kanban.vue', 'kanban', 'Kanban'],
  ['ext/navigation/Menu.vue', 'menu', 'Menu'],

  ['ext/scheduling/Calendar.vue', 'calendar', 'Calendar'],
  ['ext/scheduling/DateRangePicker.vue', 'date-range-picker', 'DateRangePicker'],
  ['ext/scheduling/TimeSlotPicker.vue', 'time-slot-picker', 'TimeSlotPicker'],

  ['ext/commerce/Cart.vue', 'cart', 'Cart'],
  ['ext/commerce/ItemCard.vue', 'item-card', 'ItemCard'],
  ['ext/commerce/ItemGrid.vue', 'item-grid', 'ItemGrid'],
  ['ext/commerce/PrintPreview.vue', 'print-preview', 'PrintPreview'],
  ['ext/commerce/SelectionGrid.vue', 'selection-grid', 'SelectionGrid'],

  ['ext/data/DataGrid.vue', 'data-grid', 'DataGrid'],
  ['ext/data/DataTable.vue', 'data-table', 'DataTable'],
  ['ext/data/EntityAutocomplete.vue', 'entity-autocomplete', 'EntityAutocomplete'],
  ['ext/data/EntitySelector.vue', 'entity-selector', 'EntitySelector'],
  ['ext/data/ItemSelector.vue', 'item-selector', 'ItemSelector'],
  ['ext/data/TreeTable.vue', 'tree-table', 'TreeTable'],

  ['ext/utilities/LazyLoader.vue', 'lazy-loader', 'LazyLoader'],

  ['charts/BarChart/BarChartOne.vue', 'bar-chart-one', 'BarChartOne'],
  ['charts/LineChart/LineChartOne.vue', 'line-chart-one', 'LineChartOne'],

  ['ecommerce/EcommerceMetrics.vue', 'ecommerce-metrics', 'EcommerceMetrics'],
  ['ecommerce/MonthlyTarget.vue', 'monthly-target', 'MonthlyTarget'],
  ['ecommerce/MonthlySale.vue', 'monthly-sale', 'MonthlySale'],
  ['ecommerce/StatisticsChart.vue', 'statistics-chart', 'StatisticsChart'],
  ['ecommerce/CustomerDemographic.vue', 'customer-demographic', 'CustomerDemographic'],
  ['ecommerce/RecentOrders.vue', 'recent-orders', 'RecentOrders'],

  ['profile/ProfileCard.vue', 'profile-card', 'ProfileCard'],
  ['profile/PersonalInfoCard.vue', 'personal-info-card', 'PersonalInfoCard'],
  ['profile/AddressCard.vue', 'address-card', 'AddressCard'],
  ['profile/DangerZone.vue', 'danger-zone', 'DangerZone'],
  ['profile/Security.vue', 'security', 'Security'],
  ['profile/Modal.vue', 'profile-modal', 'ProfileModal'],

  ['tables/Table.vue', 'table', 'Table'],
  ['tables/TableHeader.vue', 'table-header', 'TableHeader'],
  ['tables/TableBody.vue', 'table-body', 'TableBody'],
  ['tables/TableRow.vue', 'table-row', 'TableRow'],
  ['tables/TableCell.vue', 'table-cell', 'TableCell'],
  ['tables/basic-tables/BasicTableOne.vue', 'basic-table-one', 'BasicTableOne'],
]

// sanity: unique tags
const seen = new Set()
for (const [, tag] of entries) {
  if (seen.has(tag)) throw new Error(`duplicate tag: ${tag}`)
  seen.add(tag)
}

fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const manifestLines = []
for (const [srcPath, tag, exportBase] of entries) {
  const fileName = `ta-${tag}.ts`
  const exportName = `${exportBase}Element`
  const routerLinkImport = usesRouterLink.has(tag)
    ? `\nimport { registerRouterLinkFallback } from '../router-link-fallback'`
    : ''
  const routerLinkComment = usesRouterLink.has(tag)
    ? `\n//\n// configureApp: this component optionally renders <router-link>; standalone it has no\n// vue-router, so we register a plain-<a> fallback under the same name.`
    : ''
  // Alert.vue's own generated component-options type is deep enough that vue-tsc's structural
  // comparison of configureApp's signature against it blows its stack (TS2321). DropdownMenu
  // and PageBreadcrumb don't hit this — verified empirically, not a rule to generalize from. If
  // a future component hits the same TS2321 with configureApp, add it here.
  const tsExpectError =
    tag === 'alert'
      ? `\n// @ts-expect-error — vue-tsc TS2321 (excessive stack depth) comparing configureApp's type\n// against this SFC's generated component options; harmless, the fallback registers fine at\n// runtime (verified in web-components/demo).`
      : ''
  const defineOptions = usesRouterLink.has(tag)
    ? `{\n  shadowRoot: false,\n  configureApp: registerRouterLinkFallback,\n}`
    : `{ shadowRoot: false }`
  const propsName = `${exportBase}Props`
  const content = `import { defineCustomElement } from 'vue'
import type { ComponentProps } from 'vue-component-type-helpers'
import Component from '@dynamia-tools/tailadmin-vue/components/${srcPath}'${routerLinkImport}

// shadowRoot: false — these components are styled with Tailwind utility classes, not
// component-scoped <style> blocks. Encapsulating them in a shadow root would isolate them
// from the host page's Tailwind stylesheet (@dynamia-tools/tailadmin-vue/style.css) and
// render them unstyled. Rendered into light DOM, they behave like any other Tailwind markup.${routerLinkComment}${tsExpectError}
export const ${exportName} = defineCustomElement(Component, ${defineOptions})

if (typeof customElements !== 'undefined' && !customElements.get('ta-${tag}')) {
  customElements.define('ta-${tag}', ${exportName})
}

// Derived structurally from the Vue SFC's own compiled type via \`vue-component-type-helpers\`
// (the Vue team's own package for exactly this) — never hand-maintained, never drifts. Backs
// this tag's entry in \`elements.ts\`'s HTMLElementTagNameMap augmentation, and also types the
// helpers package's \`on()\` for events (Vue folds each \`defineEmits\`/\`defineModel\` event into
// an \`onEventName\` handler prop here — see \`on()\`'s own doc comment for why that, and not this
// component's raw \`$emit\` type, is what \`on()\` reads from).
//
// Not derived from \`InstanceType<typeof ${exportName}>\` even though defineCustomElement's own
// typing looks like it should give this for free: across this package's build (declaration emit
// resolving the *value* \`${exportName}\`'s type, not a lazy type alias), that conditional type
// collapses to \`VueElementConstructor<unknown>\` — losing the props entirely. Keeping
// \`ComponentProps<typeof Component>\` as a type alias (never assigned to a value) keeps it lazy,
// so it resolves correctly wherever it's actually used, including in a consumer's own project.
export type ${propsName} = ComponentProps<typeof Component>
`
  fs.writeFileSync(path.join(outDir, fileName), content)
  manifestLines.push({ fileName, exportName, propsName, tag: `ta-${tag}` })
}

const indexContent =
  manifestLines
    .map(({ fileName, exportName }) => `export { ${exportName} } from './components/${fileName.replace(/\.ts$/, '')}'`)
    .join('\n') + '\n'
fs.writeFileSync(path.join(path.dirname(outDir), 'index.ts'), indexContent)

// elements.ts: global HTMLElementTagNameMap augmentation, one line per tag, so
// `document.createElement('ta-alert')` / `querySelector('ta-alert')` / `mount(...)` are all
// fully typed with that component's real props. `Writable<...>` (from `./helpers`) strips the
// `readonly` that `ComponentProps` inherits from Vue's internal `$props` — correct inside the
// Vue component, wrong here: these properties are genuinely settable (`el.items = [...]`).
const elementsContent = `// GENERATED by scripts/generate.mjs — do not hand-edit. See the README's
// "Adding a new component" section.
// Global ambient module: importing this file anywhere (even \`import '@dynamia-tools/tailadmin-vue-wc/elements'\`
// for its side effect only) makes every \`ta-*\` tag fully typed in \`document.createElement\`,
// \`querySelector\`, and this package's \`mount()\` helper.
import type { Writable } from './helpers'
${manifestLines.map(({ fileName, propsName }) => `import type { ${propsName} } from './components/${fileName.replace(/\.ts$/, '')}'`).join('\n')}

declare global {
  interface HTMLElementTagNameMap {
${manifestLines.map(({ propsName, tag }) => `    '${tag}': HTMLElement & Writable<${propsName}>`).join('\n')}
  }
}

export {}
`
fs.writeFileSync(path.join(path.dirname(outDir), 'elements.ts'), elementsContent)

console.log(`Generated ${entries.length} wrapper files + index.ts + elements.ts.`)
