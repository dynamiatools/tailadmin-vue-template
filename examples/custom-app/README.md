# custom-app example

A single-page Vite + Vue 3 app showing every slot and color-affecting prop the layout
components expose — `AdminLayout`, `AppSidebar`, `AppHeader`, `NotificationMenu`, and
`UserMenu` — used together in one place: custom menu items, a custom sidebar header/footer, a
recolored sidebar and header, custom header actions, real notification data, and a custom user
menu with a wired-up `@sign-out` handler.

Unlike [`examples/basic-app`](../basic-app), this isn't a tour of every component in the
package — it's a focused reference for **"how do I make the layout mine?"**. See
[`docs/USER_GUIDE.md`](../../docs/USER_GUIDE.md) in the package root for the full explanation of
each slot/prop demonstrated here, and this example's own
[`src/views/CustomLayoutDemo.vue`](./src/views/CustomLayoutDemo.vue) for the annotated source —
the page itself also lists what's customized and why, plus a known gap (submenu item colors
aren't covered by `active-item-class`/`inactive-item-class`).

## Run it

```bash
cd examples/custom-app
npm install
npm run dev
```

`npm install` links `@dynamia-tools/tailadmin-vue` via the `file:../..` dependency in
`package.json`, so it always exercises the current state of the repo.

Other scripts:

```bash
npm run build        # production build
npm run type-check   # vue-tsc against the package's actual .vue/.ts source
```

## What to check

- Sidebar and header render with distinct custom colors (dark navy sidebar, indigo-tinted
  header) that survive toggling dark mode via the footer's theme button.
- Clicking a menu item updates which one shows as active (custom `active-item-class`).
- Clicking a notification, "View All Notifications", or "Sign out" in the user menu appends a
  line to the on-page event log — confirming the components' emits fire instead of navigating
  or logging to the console like upstream's originals did.
- `public/images/logo/` here only carries the package's default logo files. They're required
  even though `#sidebar-header` overrides the sidebar's logo block and this page never uses the
  default `UserMenu` avatar: `AppSidebar`'s default slot content and `AppHeader`'s always-visible
  mobile `HeaderLogo` still compile a static `<img src="/images/logo/...">` reference regardless
  of whether it's actually rendered, and current-generation Vite (Rolldown-based) fails the
  production build outright if that file is missing from `public/` — it doesn't just leave a
  broken `<img>` at runtime like older bundlers did. Avatars and notification icons, by contrast,
  are generated as inline SVG data URIs in the page itself (bound dynamically, so they're never
  statically compiled), which is why no `public/images/user/` is needed here.
