# User guide — layouts, slots & props

Practical guide for consumers of `@dynamia-tools/tailadmin-vue`: how the layout system fits
together, and how to customize it (your own sidebar content, header actions, user menu, etc.)
without forking any component. Written for humans, but equally usable as reference by an
AI assistant wiring this package into a project.

If you just need install/import basics, see the [README](../README.md) first. This guide only
covers the layout system in depth.

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

## 5. `AppHeader` — search, notifications, actions, user menu

Four slots, each optional. Providing a slot **replaces** that piece; passing an **empty**
template hides it — there's no separate boolean prop to toggle visibility, one API does both:

```vue
<AppHeader>
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
`NotificationMenu`, no default content) and `#search` / `#notifications` / `#user-menu`
(replacing — each has a default component you override).

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
  and `Backdrop` all read from it; you don't need to pass state between them.
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
its default `#sidebar-header` content, and `AppHeader`'s always-rendered (not slotted) mobile
`HeaderLogo`, both still produce a static asset reference that a strict bundler will fail to
resolve at build time if the file is missing — even though it's never actually displayed. This
does **not** apply to props like `avatar-url`: a JS string default (`avatarUrl = '/images/...'`)
is never asset-url-transformed, only literal `src="..."` attributes in a template are. See
[`examples/custom-app`](../examples/custom-app) for a working example that overrides
`#sidebar-header` but still ships the three logo files for exactly this reason.

## Maintainers: keeping this in sync with upstream

This guide documents consumer-facing behavior only. The implementation notes (why an exported
type lives in a plain `<script>` block, what defaults to preserve on an upstream sync, the
sync procedure itself) are in [docs/SYNC.md](./SYNC.md) — read that before touching any of the
components mentioned here.
