# User guide — layouts, slots & props, and the extended component library

Practical guide for consumers of `@dynamia-tools/tailadmin-vue`: how the layout system fits
together and how to customize it (§1–10), and how to use the 57 additional `components/ext/*`
components — data tables, inputs, media capture, navigation, scheduling, commerce (§11) — without
forking any component. Written for humans, but equally usable as reference by an AI assistant
wiring this package into a project.

If you just need install/import basics, see the [README](../README.md) first.

Want a working example instead of reading? [`examples/custom-app`](../examples/custom-app) is a
single page that uses every slot and prop covered below at once — clone it, `npm install && npm
run dev`, and read the page's own "what's customized here" panel alongside its source.

## 1. The moving pieces

A page built with this package is normally composed like this:

```
App.vue
└─ ThemeProvider          (dark mode, provides theme state)
   └─ SidebarProvider     (provides shared sidebar state via useSidebar())
      └─ RouterView
         └─ AdminLayout   (per authenticated page — wraps sidebar + header + content)
            └─ your page content
```

Unauthenticated pages (sign in/up, 404) use `FullScreenLayout` instead of `AdminLayout` — it's
just a `<slot>` with no chrome.

**`App.vue`** (once, at the root):

```vue
<script setup lang="ts">
import ThemeProvider from '@dynamia-tools/tailadmin-vue/components/layout/ThemeProvider.vue'
import SidebarProvider from '@dynamia-tools/tailadmin-vue/components/layout/SidebarProvider.vue'
</script>

<template>
  <ThemeProvider>
    <SidebarProvider>
      <RouterView />
    </SidebarProvider>
  </ThemeProvider>
</template>
```

**A regular page** wraps its content in `AdminLayout`:

```vue
<script setup lang="ts">
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
</script>

<template>
  <AdminLayout>
    <!-- your page content -->
  </AdminLayout>
</template>
```

**An auth page** uses `FullScreenLayout`:

```vue
<script setup lang="ts">
import FullScreenLayout from '@dynamia-tools/tailadmin-vue/components/layout/FullScreenLayout.vue'
</script>

<template>
  <FullScreenLayout>
    <!-- sign-in form, etc. -->
  </FullScreenLayout>
</template>
```

`SidebarProvider` and `ThemeProvider` are plain pass-through wrappers — you don't customize
those. Everything below is about `AdminLayout` and the components it renders by default:
`AppSidebar`, `AppHeader`, `NotificationMenu`, `UserMenu`.

## 2. Do you even need to customize the layout?

If TailAdmin's demo sidebar/header content is close enough and you just need real data
(your own menu, your own user, real notifications), **you often don't need slots at all** —
just pass props (see §4–6). Reach for slots (§3) only when you need to *replace* a whole piece
(a completely different sidebar component, a different header widget) rather than reconfigure
the default one.

## 3. `AdminLayout` — swapping the sidebar or header entirely

```vue
<template #sidebar>...</template>
<template #header>...</template>
```

Two slots, both optional, both default to the stock component if you don't provide them:

```vue
<template>
  <AdminLayout>
    <template #sidebar>
      <MyCustomSidebar />
    </template>
    <template #header>
      <MyCustomHeader />
    </template>

    <!-- page content -->
  </AdminLayout>
</template>
```

The important part: **the responsive content margin
(`xl:ms-[290px]` / `xl:ms-[90px]`) stays wired to `useSidebar()` regardless of what you slot
in.** So a fully custom sidebar still gets the correct page-content offset for free, *as long
as your custom sidebar also drives `useSidebar()`'s `isExpanded` / `isHovered` / `isMobileOpen`
state* the same way `AppSidebar` does. If your sidebar doesn't use `useSidebar()` at all (e.g.
fixed width, no collapse), the margin will stay at whatever the default state resolves to —
check `src/composables/useSidebar.ts` if you need the exact contract.

You do **not** need to slot the sidebar/header just to reskin them — see §4 and §5 first, most
customization (menu items, user info, header widgets) is a prop, not a slot.

## 4. `AppSidebar` — your own menu, header, and footer

### 4.1 Your own menu items (`menuGroups` prop)

```vue
<script setup lang="ts">
import AppSidebar from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import type { MenuGroup } from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import { GridIcon, UserCircleIcon } from '@dynamia-tools/tailadmin-vue/icons'

const menuGroups: MenuGroup[] = [
  {
    title: 'Main',
    items: [
      { icon: GridIcon, name: 'Overview', path: '/' },
      {
        icon: UserCircleIcon,
        name: 'Customers',
        subItems: [
          { name: 'All customers', path: '/customers' },
          { name: 'Segments', path: '/customers/segments', new: true },
        ],
      },
    ],
  },
]
</script>

<template>
  <AppSidebar :menu-groups="menuGroups" />
</template>
```

`MenuGroup` / `MenuItem` / `SubItem` are exported types — import them for full type-checking on
your own data. Leaving `menu-groups` unset keeps TailAdmin's demo menu (Dashboard, Calendar,
Forms, Tables, Charts, etc.) — handy while you're wiring up the rest of the layout and haven't
built your real nav yet.

### 4.2 Logo / org switcher (`#sidebar-header` slot)

Replaces the logo block entirely — no default markup leaks through once you provide the slot:

```vue
<AppSidebar>
  <template #sidebar-header>
    <OrgSwitcher />
  </template>
</AppSidebar>
```

### 4.3 Footer content (`#sidebar-footer` slot)

Empty by default (upstream had nothing here). Renders right after the `<nav>`, inside the
scrollable sidebar body:

```vue
<AppSidebar>
  <template #sidebar-footer>
    <EnvironmentToggle />
    <ThemeAndLanguagePicker />
    <LogoutButton />
  </template>
</AppSidebar>
```

### 4.4 Active-item styling (`activeItemClass` / `inactiveItemClass`)

Default: `'menu-item-active'` / `'menu-item-inactive'` (upstream's solid-background treatment,
defined in the shipped theme CSS). Override with your own utility classes if you want a
different active-state visual (e.g. a left accent rail) — no need to fight the default CSS with
`!important`:

```vue
<AppSidebar
  active-item-class="border-s-2 border-brand-500 bg-brand-50 dark:bg-brand-500/10"
  inactive-item-class="text-gray-500 dark:text-gray-400"
/>
```

This only changes the class applied to the menu item's root element — it doesn't change the
icon color classes (`menu-item-icon-active`/`-inactive`), which stay as upstream defines them in
the theme CSS. If you need those to change too, override the corresponding CSS classes globally
rather than through a prop.

## 5. `AppHeader` — logo, search, notifications, actions, user menu

Five slots, each optional. Providing a slot **replaces** that piece; passing an **empty**
template hides it — there's no separate boolean prop to toggle visibility, one API does both:

```vue
<AppHeader>
  <!-- replace the mobile-only brand mark (hidden at xl and above) -->
  <template #logo>
    <MyMobileLogo />
  </template>

  <!-- replace the search bar -->
  <template #search>
    <MyCommandPalette />
  </template>

  <!-- hide notifications entirely -->
  <template #notifications></template>

  <!-- add something next to the notification bell (doesn't replace it) -->
  <template #actions>
    <EnvironmentBadge />
    <LanguagePicker />
  </template>

  <!-- replace the user menu -->
  <template #user-menu>
    <MyUserMenu />
  </template>
</AppHeader>
```

Note the difference between `#actions` (additive — renders *alongside* `ThemeToggler` and
`NotificationMenu`, no default content) and `#logo` / `#search` / `#notifications` /
`#user-menu` (replacing — each has a default component you override).

## 6. `NotificationMenu` — real notifications instead of demo data

```vue
<script setup lang="ts">
import NotificationMenu from '@dynamia-tools/tailadmin-vue/components/layout/header/NotificationMenu.vue'
import type { NotificationItem } from '@dynamia-tools/tailadmin-vue/components/layout/header/NotificationMenu.vue'

const notifications: NotificationItem[] = await fetchNotifications()

function onItemClick(notification: NotificationItem) {
  router.push(`/notifications/${notification.id}`)
}
</script>

<template>
  <NotificationMenu
    :notifications="notifications"
    @item-click="onItemClick"
    @view-all="router.push('/notifications')"
  />
</template>
```

Leaving `notifications` unset shows the "Terry Franci" demo data — fine for a first look, not
meant to ship to production as-is. `@item-click` and `@view-all` replace what used to be
`console.log(...)` calls upstream — wire them to your own routing/API.

## 7. `UserMenu` — real user, real sign-out

```vue
<script setup lang="ts">
import UserMenu from '@dynamia-tools/tailadmin-vue/components/layout/header/UserMenu.vue'

const { name, email, avatarUrl } = useCurrentUser()

function handleSignOut() {
  auth.signOut()
  router.push('/signin')
}
</script>

<template>
  <UserMenu
    :name="name"
    :email="email"
    :avatar-url="avatarUrl"
    :show-language-switcher="false"
    @sign-out="handleSignOut"
  />
</template>
```

- `name` / `email` / `avatar-url` default to the "Musharof Chowdhury" demo identity.
- `show-language-switcher` (default `true`) hides the built-in language submenu — turn it off
  if your app has its own language picker (e.g. via `#actions` on `AppHeader`, §5) to avoid
  showing two.
- `@sign-out` replaces upstream's hardcoded `console.log('Signing out...')` + forced navigation
  to `/signin`. **The component does not navigate on its own anymore** — you decide what
  "signed out" means for your app (clear a token, redirect, call an API) in the handler.

## 8. Putting it together: a project-local `AppShell.vue`

The idiomatic way to use all of the above without repeating the same slot wiring on every page:
wrap `AdminLayout` once in your own project and use *that* everywhere instead of importing
`AdminLayout` directly.

```vue
<!-- src/components/AppShell.vue (your project, not this package) -->
<script setup lang="ts">
import AdminLayout from '@dynamia-tools/tailadmin-vue/components/layout/AdminLayout.vue'
import AppSidebar from '@dynamia-tools/tailadmin-vue/components/layout/AppSidebar.vue'
import AppHeader from '@dynamia-tools/tailadmin-vue/components/layout/AppHeader.vue'
import UserMenu from '@dynamia-tools/tailadmin-vue/components/layout/header/UserMenu.vue'
import NotificationMenu from '@dynamia-tools/tailadmin-vue/components/layout/header/NotificationMenu.vue'

import { menuGroups } from '../nav/menu'
import { useCurrentUser } from '../auth/useCurrentUser'
import { useNotifications } from '../notifications/useNotifications'
import OrgSwitcher from './OrgSwitcher.vue'
import EnvironmentToggle from './EnvironmentToggle.vue'

const user = useCurrentUser()
const { items: notifications, markSeen } = useNotifications()
</script>

<template>
  <AdminLayout>
    <template #sidebar>
      <AppSidebar :menu-groups="menuGroups">
        <template #sidebar-header>
          <OrgSwitcher />
        </template>
        <template #sidebar-footer>
          <EnvironmentToggle />
        </template>
      </AppSidebar>
    </template>

    <template #header>
      <AppHeader>
        <template #notifications>
          <NotificationMenu :notifications="notifications" @item-click="markSeen" />
        </template>
        <template #user-menu>
          <UserMenu
            :name="user.name"
            :email="user.email"
            :avatar-url="user.avatarUrl"
            :show-language-switcher="false"
            @sign-out="user.signOut"
          />
        </template>
      </AppHeader>
    </template>

    <slot />
  </AdminLayout>
</template>
```

Then every page becomes:

```vue
<template>
  <AppShell>
    <!-- page content -->
  </AppShell>
</template>
```

One place to update when your nav, user shape, or notification source changes — pages stay
unaware of the wiring.

## 9. Things that are still shared global state, not props

Some behavior isn't exposed as a prop because it's already reactive global state via
composables, shared across every layout piece automatically:

- **Sidebar expand/collapse/mobile state** — `useSidebar()` (from
  `@dynamia-tools/tailadmin-vue/composables/useSidebar`). `AppSidebar`, `AdminLayout`'s margin,
  and `Backdrop` all read from it; you don't need to pass state between them. It also exposes
  `isMobile` (viewport narrower than the provider's breakpoint), and the breakpoint is configurable:
  `<SidebarProvider :mobile-breakpoint="992">` (default `768`, the historical value; also accepts a
  ref/getter through `useSidebarProvider({ mobileBreakpoint })`). **This only moves the state
  flags** (`isMobile`, when `isMobileOpen` is reset): `AdminLayout`, `AppSidebar` and `AppHeader`
  still switch their *layout* at the `xl` CSS breakpoint (1280px), and `Backdrop` hides at `lg`.
  Use it when you build your own sidebar/header on top of `useSidebar()`.
- **Dark mode** — handled by `ThemeProvider` + `ThemeToggler`; see those if you need to read or
  force the current theme from your own code.
- **RTL** — `useRTL()` (from `@dynamia-tools/tailadmin-vue/composables/useRTL`), currently
  toggled from within `UserMenu`'s language submenu. If you set `show-language-switcher="false"`
  and build your own language picker, call `setRTL(true|false)` from `useRTL()` yourself when
  the user picks an RTL language.

## 10. Static assets reminder

`AppSidebar`'s default logo and `UserMenu`'s default avatar reference `/images/logo/*.svg` and
`/images/user/owner.png`. If you use those defaults (rather than overriding `avatar-url` or
`#sidebar-header`), copy the package's `public/images` into your own project — see the
README's ["Static image assets"](../README.md#static-image-assets) section.

**Gotcha with a bundler that statically resolves template asset URLs (e.g. current-generation
Vite/Rolldown):** overriding `#sidebar-header` doesn't remove the need for
`public/images/logo/*.svg` to exist. A component's default slot content is compiled into its
render function regardless of whether a consumer overrides that slot — Vue compiles both branches
once, then picks one at runtime. So `AppSidebar`'s literal `<img src="/images/logo/logo.svg">` in
its default `#sidebar-header` content, and `AppHeader`'s default `#logo` content
(`HeaderLogo`), both still produce a static asset reference that a strict bundler will fail to
resolve at build time if the file is missing — even if you override that slot. This
does **not** apply to props like `avatar-url`: a JS string default (`avatarUrl = '/images/...'`)
is never asset-url-transformed, only literal `src="..."` attributes in a template are. See
[`examples/custom-app`](../examples/custom-app) for a working example that overrides
`#sidebar-header` but still ships the three logo files for exactly this reason.

## 11. Extended component library (`components/ext`)

Everything above (§1–10) is about the base TailAdmin layout. This section covers a separate,
larger set of components — **57 of them**, under `src/components/ext/<category>/` — added on top
of the base template for building real features (data grids, checkout flows, OTP forms, camera
capture, maps…) rather than just a demo dashboard.

### 11.1 Ground rules

These hold for every component in `components/ext`, not just the ones shown below:

- **Domain-agnostic.** `EntitySelector`, not `CustomerSelector`; `SelectionGrid`, not
  `SeatPicker`. They take generic data (`items`, `columns`, `nodes`) and describe *what they do*,
  never *where they're used* — the same `ItemGrid` works for products, resources, or services.
- **Props for configuration, slots for structural overrides.** A cell renderer, a custom item
  template, a loading/error state — those are slots. Everything else (`multiple`, `disabled`,
  `min`, `max`, currency, locale…) is a prop.
- **`v-model` where it makes sense**, following normal Vue conventions — plain `v-model` for a
  single value (`MoneyInput`, `ColorPicker`, `PinInput`), `v-model:selected` where the component
  also exposes other events (`ItemGrid`), `defineModel` where the whole bound object is mutated
  in place (`Kanban`'s `v-model` over its `columns` array).
- **Named TypeScript exports live alongside the component.** Every column/item/entry shape used
  by a prop (`DataTableColumn`, `TreeNode`, `KanbanColumn`, `ItemGridEntry`, `MapMarker`…) is
  exported from the same `.vue` file as a named `interface` — import it with the component:

  ```ts
  import DataTable from '@dynamia-tools/tailadmin-vue/components/ext/data/DataTable.vue'
  import type { DataTableColumn } from '@dynamia-tools/tailadmin-vue/components/ext/data/DataTable.vue'
  ```
- **Dark mode and accessibility are not optional** — every component works in both themes and
  uses semantic roles/`aria-*` where applicable (listboxes, radiogroups, live regions).
- **No unnecessary dependencies.** Most of `components/ext` is zero-dependency (native
  `<canvas>`, `<audio>`, Fullscreen API, `IntersectionObserver`-free lazy loading, hand-rolled
  dropdowns). A handful of components reach for an existing **optional** peer dependency instead
  of reinventing something a mature library already does well — see §11.4.

### 11.2 Catalog

Import path: `@dynamia-tools/tailadmin-vue/components/ext/<category>/<Component>.vue`.

**Data** — `src/components/ext/data/`

| Component | What it does |
| --- | --- |
| `DataTable` | Sortable, selectable table with pagination, built on the existing `Table`/`TableRow`/`TableCell` system. |
| `DataGrid` | Click-to-edit inline grid, same underlying table system. |
| `TreeTable` | Unlimited-depth hierarchical table with per-node lazy loading, selection, custom cell slots. |
| `EntitySelector` | Dropdown selector with inline search, over a local `items` array. Generic over the item shape. |
| `EntityAutocomplete` | Debounced remote search selector — you provide a `search(query)` async function. |
| `ItemSelector` | Visual grid selector for simple values or complex objects (label/value/image keys). |

**Input** — `src/components/ext/input/`

| Component | What it does |
| --- | --- |
| `MoneyInput` | Currency-aware numeric input with locale formatting and min/max clamping. |
| `QuantityInput` | Stepper with increment/decrement buttons, step, min/max, optional decimals. |
| `PinInput` | Segmented PIN/OTP input — auto-advance, backspace navigation, full-code paste. |
| `NumericKeypad` | Touch-friendly visual numeric keypad, composes a string value. |
| `ScannerInput` | Text input tuned for barcode/identifier scanners (fast-keystroke detection, Enter-to-scan). |
| `PaymentInput` | One or more payment entries (method + amount) against a total; composes `MoneyInput`. |
| `Rating` | Star rating, interactive or read-only. |
| `ColorPicker` | Native color input + hex field + preset swatches. |

**Media** — `src/components/ext/media/`

| Component | What it does |
| --- | --- |
| `Webcam` | Camera preview, capture-to-PNG, device selection, permission/error handling. |
| `ImageCropper` | Pan/zoom/rotate an image in a fixed viewport, export the crop as a PNG data URL. |
| `SignaturePad` | Canvas signature capture (pointer events), undo per stroke, export as PNG. |
| `DropFileUploader` | Drag-and-drop + browse uploader with previews, validation, progress, retry — backend-agnostic. |
| `SoundPlayer` | `<audio>`-backed playback, visible controls or an invisible/headless mode for UI sound effects. |

**Display** — `src/components/ext/display/`

| Component | What it does |
| --- | --- |
| `Summary` | Labeled metric block with an optional icon and up/down trend badge. |
| `Status` | Semantic status pill (label + color + dot or icon). |
| `Timeline` | Chronological event list with a connecting line and per-item color. |
| `PdfViewer` | PDF preview via the browser's native renderer — page nav, zoom, fullscreen, download. |
| `QrCode` | Generates and renders a QR code from configurable content (needs `qrcode`, see §11.4). |
| `Map` | Interactive map — markers, popups, click-to-select — via Leaflet + OpenStreetMap tiles, no API key (needs `leaflet`, see §11.4). |

**Navigation** — `src/components/ext/navigation/`

| Component | What it does |
| --- | --- |
| `CommandPalette` | Cmd+K-style search/command overlay — local or remote filtering, categories, keyboard nav. |
| `Fab` | Floating action button, single action or an expandable action menu. |
| `Kanban` | Drag-and-drop board across configurable columns (needs `vuedraggable`, see §11.4). |
| `Menu` | Generic, router-agnostic menu list — vertical or horizontal, nested/collapsible items. |
| `TreeMenu` | Sidebar-style navigation tree: unlimited depth, accordion, active-branch auto-expand, **condensed mode** (icons only) with a hover/focus/click **flyout**, icons by string key (`icon-map`), keyboard navigation. Router-agnostic (`@select` gives you the event to `preventDefault()`). |

**Scheduling** — `src/components/ext/scheduling/`

| Component | What it does |
| --- | --- |
| `Calendar` | Thin wrapper around `@fullcalendar/vue3` — month/week/day views, selectable ranges. |
| `DateRangePicker` | Range picker built on `vue-flatpickr-component`, with optional quick-select presets. |
| `TimeSlotPicker` | Grid of selectable time slots with a per-slot unavailable state. |

**Commerce** — `src/components/ext/commerce/`

| Component | What it does |
| --- | --- |
| `Cart` | Selected items with quantity editing (composes `QuantityInput`), subtotals, and a running total. |
| `ItemCard` | Single product/resource card — image, badge (composes `Status`), price, actions slot. |
| `ItemGrid` | Responsive grid of `ItemCard`s with loading/empty states and selection. |
| `SelectionGrid` | Grid selection with a first-class unavailable/disabled cell state — good for seat/table maps. |
| `PrintPreview` | Previews a URL or raw HTML, then triggers the browser's native print dialog. |

**Utilities** — `src/components/ext/utilities/`

| Component | What it does |
| --- | --- |
| `LazyLoader` | Generic async data wrapper — loading/error/retry/reload via scoped slots, optional param-keyed reload and in-memory cache. |

**Layouts** — `src/components/ext/layouts/`

Page shells and marketing sections for building standard public websites and applications on
top of the base admin template. Sections are domain-agnostic building blocks (props for data,
slots for structural override); shells compose them or provide their own structural regions.

| Component | What it does |
| --- | --- |
| `Hero` | Marketing hero section — eyebrow, title, subtitle, optional image, `actions` slot. |
| `CTA` | Call-to-action banner, solid or outline variant. |
| `Navbar` | Sticky marketing navbar with responsive mobile menu; `logo`/`actions` slots. |
| `Footer` | Multi-column marketing footer with `brand`/`social`/`newsletter`/`copyright` slots. |
| `FeatureGrid` | Responsive 2/3/4-column grid of icon + title + description feature cards. |
| `PricingTable` | Plan comparison cards with a highlighted tier and `@select` event. |
| `Testimonial` | Customer quote cards. |
| `FAQAccordion` | Collapsible question/answer list. |
| `Landing` | Ordering shell composing the sections above via named slots (`navbar`, `hero`, `features`, `testimonials`, `pricing`, `faq`, `cta`, `footer`, default). |
| `MobileAppLayout` | Header + scrollable content + bottom tab bar shell for mobile-style views. |
| `BorderLayout` | Header/left/center/right/footer regions; stacks on narrow viewports, row layout at `lg`. |
| `DocsLayout` | Sidebar nav (composes `Menu`) + prose column + table of contents, for documentation pages. |
| `AuthSplit` | Split-screen auth shell — brand panel (`brand` slot or `image`) + centered form column (default slot). |
| `Tabs` | Tab list with keyboard navigation (arrow keys); `top`/`bottom`/`left`/`right` position. |
| `ClosableTabs` | Workspace-style tabs: close with ×, middle click or Delete; `#actions` slot; visited panels stay mounted (state survives switching) with an optional `max` (least recently active are unmounted first). The parent owns the tab list. |
| `LoginDialog` | Modal sign-in form (`v-model`, `@submit`) with `social`/`footer` slots. |
| `EmptyState` | Placeholder for empty/no-data states — icon slot, title/description, optional action. |
| `MarkdownViewer` | Renders Markdown to sanitized HTML (needs `marked` + `dompurify`, see §11.4). |

### 11.3 Worked examples

**A selectable, sortable `DataTable` with a custom cell:**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@dynamia-tools/tailadmin-vue/components/ext/data/DataTable.vue'
import type { DataTableColumn } from '@dynamia-tools/tailadmin-vue/components/ext/data/DataTable.vue'

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status' },
]
const rows = ref([{ id: 1, name: 'Ada Lovelace', status: 'active' }])
const selected = ref<Record<string, unknown>[]>([])
</script>

<template>
  <DataTable
    :columns="columns"
    :rows="rows"
    selectable
    :selected="selected"
    @update:selected="(newSelected) => (selected = newSelected)"
  >
    <template #cell-status="{ value }">
      <span class="text-success-600">{{ value }}</span>
    </template>
  </DataTable>
</template>
```

Every cell gets a `cell-<columnKey>` scoped slot (`{ row, value }`); a `loading`, `empty`, and
`actions` slot are also available. Sorting is controlled, not automatic — listen for
`@sort-change="{ key, direction }"` and re-sort/re-fetch `rows` yourself (mirrors how
`EntityAutocomplete`'s `search` prop stays backend-agnostic instead of assuming an in-memory
array).

**`PinInput` for an OTP form:**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import PinInput from '@dynamia-tools/tailadmin-vue/components/ext/input/PinInput.vue'

const code = ref('')
async function onComplete(value: string) {
  await verifyOtp(value)
}
</script>

<template>
  <PinInput v-model="code" :length="6" @complete="onComplete" />
</template>
```

**Cross-component composition** — several `ext` components are built on top of others rather
than duplicating behavior: `Cart` composes `QuantityInput` for its per-item stepper, `ItemCard`
composes `Status` for its badge, `PaymentInput` composes `MoneyInput` per entry. `Menu` doesn't
invent new styling either — it reuses the same `menu-item`/`menu-item-active`/`menu-item-icon-*`
CSS utilities `AppSidebar` already defines in `main.css`, so a standalone `Menu` (e.g. inside a
settings panel) looks consistent with the sidebar without any extra theming.

**`TreeMenu` as a data-driven sidebar (with a router):**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TreeMenu from '@dynamia-tools/tailadmin-vue/components/ext/navigation/TreeMenu.vue'
import type { TreeMenuItem } from '@dynamia-tools/tailadmin-vue/components/ext/navigation/TreeMenu.vue'
import { GridIcon, UserGroupIcon } from '@dynamia-tools/tailadmin-vue/icons'

const props = defineProps<{ items: TreeMenuItem[]; condensed: boolean }>()
const route = useRoute()
const router = useRouter()

// Strings in `icon` (e.g. from an API) are resolved here; unknown keys fall back to `default-icon`.
const icons = { home: GridIcon, people: UserGroupIcon }
const activeId = computed(() => route.path) // ids can be anything unique, e.g. the route path

function onSelect(item: TreeMenuItem, event: MouseEvent) {
  event.preventDefault() // you own navigation
  router.push(item.id as string)
}
</script>

<template>
  <TreeMenu :items="props.items" :active-id="activeId" :condensed="props.condensed" :icon-map="icons" :default-icon="GridIcon" @select="onSelect" />
</template>
```

Ids must be unique across the whole tree (they drive expansion and the active branch). The
active leaf's ancestors are highlighted and expanded automatically. In condensed mode the flyout
is teleported to `<body>` with `position: fixed`, so a scrolling sidebar does not clip it; it
closes on outside click, `Esc`, scroll and resize. `#icon` / `#label` slots (`{ item, active, level }`)
replace a row's icon or text, e.g. to render a Font Awesome `<i>`. Rows use the same
`menu-item*` utilities as `AppSidebar`, so `TreeMenu` looks consistent with it.

**`ClosableTabs` with `max` panels kept alive:**

```vue
<ClosableTabs v-model="active" :tabs="tabs" :max="5" @close="close">
  <template #actions><button @click="closeAll">Close all</button></template>
  <template #default="{ tab }"><MyScreen :id="tab.id" /></template>
</ClosableTabs>
```

`ClosableTabs` never edits `tabs`: on `@close` remove the tab and pick what becomes active
(typically the neighbour). Panels are kept mounted with `v-show` (not Vue's `<KeepAlive>`), so
components inside are *not* deactivated/reactivated — they keep running while hidden; use the
`active` slot prop to pause work if needed. Once more than `max` panels have been visited, the least
recently active one is unmounted and remounts fresh when revisited. Keyboard: arrows/Home/End move
between tabs, Delete closes the focused one (× buttons are deliberately not tab stops).

### 11.4 Optional peer dependencies

A few `ext` components reach for an existing optional peer dependency instead of a bespoke
implementation — install only the ones you actually use, same as the base template's optional
deps (see the [README](../README.md#requirements-in-the-consuming-project)):

| Component | Needs |
| --- | --- |
| `Calendar` | `@fullcalendar/vue3` + `fullcalendar` |
| `DateRangePicker` | `flatpickr` + `vue-flatpickr-component` |
| `Kanban` | `vuedraggable` |
| `Map` | `leaflet` (+ `@types/leaflet` in dev, for TypeScript) |
| `QrCode` | `qrcode` (+ `@types/qrcode` in dev) |
| `MarkdownViewer` | `marked` + `dompurify` (both ship their own types) |

Everything else in `components/ext` has no additional dependency beyond `vue` itself.

### 11.5 Live demos

Every component in this section has a working, interactive demo in
[`examples/basic-app/src/views/ext/`](../examples/basic-app/src/views/ext) — one page per
category (`ExtData.vue`, `ExtInput.vue`, `ExtMedia.vue`, `ExtDisplay.vue`, `ExtLayouts.vue`,
`ExtNavigation.vue`, `ExtScheduling.vue`, `ExtCommerce.vue`, `ExtUtilities.vue`), reachable from
the "Ext Components" sidebar group when running that example app (`cd examples/basic-app && npm
install && npm run dev`). Reading a demo page alongside the component's own source is the
fastest way to see a full prop/slot/event surface in use.

## Maintainers: keeping this in sync with upstream

This guide documents consumer-facing behavior only. The implementation notes (why an exported
type lives in a plain `<script>` block, what defaults to preserve on an upstream sync, the
sync procedure itself) are in [docs/SYNC.md](./SYNC.md) — read that before touching any of the
components mentioned here.
