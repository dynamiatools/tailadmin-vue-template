# Syncing with upstream (TailAdmin Vue)

This repo starts from a clean copy of
[TailAdmin/vue-tailwind-admin-dashboard](https://github.com/TailAdmin/vue-tailwind-admin-dashboard)
(commit `6d5a3657c3d1562b2b8488c6f54886920b798326`, 2026-09-12), keeping only the reusable parts:
`src/components/`, `src/composables/`, `src/icons/`, `src/assets/main.css`,
`src/vue.shims.d.ts`, `src/index.d.ts`. No upstream git history is kept and there is no
automatic `git merge` — syncing is manual, whenever a fix or new component needs to be pulled
in.

## Local changes that don't come from upstream

When pulling in new changes, be careful not to overwrite these:

- **Relative imports instead of `@/` aliases**: several `layout/` components and `ui/Alert.vue`
  import via `@/composables/...` and `@/icons` in upstream. Here they were rewritten as relative
  paths (`../../composables/...`, etc.) because the package can't assume the consumer configured
  the `@` alias to point at `node_modules/@dynamia-tools/tailadmin-vue/src`. Check
  `git log` on new files coming from upstream for the same `@/` pattern.
- `package.json`, `README.md`, this file, `.github/workflows/`, `tsconfig.json`,
  `tsconfig.app.json`, `eslint.config.ts` are specific to this package, not upstream.
- `src/views/`, `src/router/`, `App.vue`, `main.ts`, `index.html` (the demo app) are not
  included.
- `dropzone` and `jsvectormap`/`vuevectormap` devDependencies are pinned to exact versions
  (not `^` ranges) because newer semver-compatible releases break the `@types/dropzone` typings
  and drop `jsvectormap`'s bundled shim compatibility. Keep them pinned unless you've verified
  `npm run type-check` passes with a newer version.
- **`SidebarWidget.vue` (the "Purchase Plan" / TailAdmin Pro upsell box) was removed**, along
  with its usage in `AppSidebar.vue`. This package is fully free/open-source, so there's nothing
  to upsell. If a future upstream sync touches `AppSidebar.vue`, don't reintroduce the
  `<SidebarWidget />` line.
- `npm run lint` currently fails on ~13 pre-existing upstream issues (missing `lang="ts"` on a
  few `<script>` blocks, a handful of unused imports) — reproducible on a clean upstream clone
  too, so it's not something introduced here. `lint` is intentionally not part of the CI/publish
  gate; only `type-check` is. Feel free to clean these up incrementally, but don't let them block
  a sync.

## Layout extension points (slots, props, emits) not present in upstream

The four layout components below expose extra slots/props/emits so consumers can swap out
pieces (their own sidebar, header, notifications, user menu) without forking the component.
Every addition defaults to upstream's original hardcoded markup/behavior, so this is additive
and backward compatible — don't let an upstream sync overwrite these without re-applying them.

- **`AdminLayout.vue`**: `#sidebar` and `#header` slots, defaulting to `<app-sidebar />` /
  `<app-header />`. The responsive margin (`xl:ms-[290px]`/`xl:ms-[90px]`, driven by
  `useSidebar()`) still applies regardless of what's slotted in, so a custom sidebar gets that
  behavior for free as long as it also drives `useSidebar()`'s `isExpanded`/`isHovered` state.
- **`AppSidebar.vue`**:
  - `menuGroups?: MenuGroup[]` prop (default: the original hardcoded demo data, now named
    `defaultMenuGroups` and exported). `MenuGroup`/`MenuItem`/`SubItem` are exported interfaces
    (declared in a plain `<script lang="ts">` block ahead of `<script setup>` — see note below).
  - `#sidebar-header` slot replacing the logo block, `#sidebar-footer` slot after `<nav>`
    (no default — empty by default, same as upstream had nothing there).
  - `activeItemClass?: string` / `inactiveItemClass?: string` props (default:
    `'menu-item-active'` / `'menu-item-inactive'`, upstream's original classes) applied to both
    the submenu toggle button and the direct-link menu item, for consumers who want a different
    active-state treatment (e.g. a left rail) without overriding CSS classes.
- **`AppHeader.vue`**: `#search`, `#notifications`, `#actions`, `#user-menu` slots. The first
  three default to `<SearchBar />` / `<NotificationMenu />` / nothing; `#user-menu` defaults to
  `<UserMenu />`. Hiding a default component is just passing an empty slot
  (`<template #search></template>`) — there are no separate `show-*` boolean props, to keep a
  single API for both hiding and replacing.
- **`NotificationMenu.vue`**: `notifications?: NotificationItem[]` prop (default: the original
  hardcoded "Terry Franci" demo data, now `defaultNotifications`, exported alongside the
  `NotificationItem` interface). `@item-click` (payload: the clicked `NotificationItem`) and
  `@view-all` emits replace the original `console.log(...)` handlers.
- **`UserMenu.vue`**: `name?`, `email?`, `avatarUrl?` props (defaults: the original hardcoded
  "Musharof Chowdhury" / `randomuser@pimjo.com` / `/images/user/owner.png`).
  `showLanguageSwitcher?: boolean` prop (default `true`) toggles the language submenu item.
  `@sign-out` emit replaces the original `console.log('Signing out...')` + `router-link
  to="/signin"` — the component no longer navigates on its own; the consumer decides what
  happens after sign-out.

**Why a plain `<script lang="ts">` block for exported types/data ahead of `<script setup>`**:
`defineProps()`'s default-value factory (or a destructure default) cannot reference a variable
declared inside the same `<script setup>` block — the Vue SFC compiler hoists the props
definition out of `setup()` and errors (`vue-tsc` doesn't catch this, only the Vite/Rollup
build does). Declaring the exported interfaces and the default data array/object in a preceding
plain `<script lang="ts">` block avoids that: both blocks compile into the same module scope, so
`<script setup>` can reference them directly, with no import needed within the same file. If you
add another prop with a non-primitive default (an array, object, or factory pulling in icons/
other data), follow this same two-block pattern rather than declaring the default inline in
`<script setup>`.

## Procedure to pull upstream changes

1. Add the remote once (if not already present):
   ```bash
   git remote add upstream https://github.com/TailAdmin/vue-tailwind-admin-dashboard.git
   ```
2. Fetch the latest:
   ```bash
   git fetch upstream
   ```
3. Check out upstream separately (or use a worktree) to diff folder by folder, since this repo
   doesn't share history with upstream:
   ```bash
   git worktree add /tmp/upstream-check upstream/main --detach
   diff -rq src/components /tmp/upstream-check/src/components
   diff -rq src/composables /tmp/upstream-check/src/composables
   diff -rq src/icons /tmp/upstream-check/src/icons
   diff src/assets/main.css /tmp/upstream-check/src/assets/main.css
   ```
4. Apply the relevant changes by hand (new components, fixes, style tweaks). For new components
   under `layout/` or anywhere else using the `@/...` pattern, rewrite the import to a relative
   path before committing (see previous section).
5. Run `npm run type-check` (and `npm run lint` if you're touching files it doesn't already flag).
6. Update the upstream reference commit in this document.
7. Bump `version` in `package.json` following this package's own CalVer scheme
   (`YY.MM.MICRO`, e.g. `26.9.0` → `26.9.1` for another release the same month, `26.10.0` for
   the first release in October; doesn't need to match TailAdmin's version) and note the
   relevant change in the PR.
8. On merge to `main`, create a GitHub Release tagged with the `package.json` `version` (a
   leading `v` is optional — the publish workflow strips it before comparing) and publish it —
   that's what triggers the npm publish workflow, not the tag push by itself.
