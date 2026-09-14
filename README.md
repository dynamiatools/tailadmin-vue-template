# @dynamia-tools/tailadmin-vue

UI components, layouts and composables from
[TailAdmin Vue](https://github.com/TailAdmin/vue-tailwind-admin-dashboard) (Vue 3 + Tailwind CSS
4), published as **raw, unbuilt source** so they can be imported directly into any Dynamia
project without re-cloning the template every time.

This is not a full fork of the demo app: only the reusable parts are published
(`components/`, `composables/`, `icons/`, theme CSS). The demo's example views and router are
not part of this package.

## Why source, no build step

`.vue`/`.ts` files are published as-is, with no bundle or generated `.d.ts`. The consuming
project's own bundler (Vite) compiles the components, exactly as if they lived in the repo
itself. This avoids maintaining a separate build/public API surface and lets consumers import a
single component without pulling in the rest.

## Requirements in the consuming project

- Vue `^3.5`
- Vue Router `^4` (used by layout components: sidebar, header)
- Tailwind CSS `^4`, configured to scan `node_modules/@dynamia-tools/tailadmin-vue/src/**/*.vue`
- Vite (or any bundler that resolves relative `.vue`/`.ts` imports via npm `exports`)

Optional dependencies depending on which components you use (declared as optional
`peerDependencies` — install only what you need): `apexcharts` + `vue3-apexcharts` (charts),
`fullcalendar` + `@fullcalendar/vue3` (calendar), `leaflet` (maps), `jsvectormap` +
`vuevectormap` (vector maps), `flatpickr` + `vue-flatpickr-component` (date picker), `swiper`
(carousels), `vuedraggable` (drag & drop), `dropzone` (upload), `simplebar-vue` (scrollbars),
`floating-vue` + `@floating-ui/vue` (tooltips/popovers), `lucide-vue-next` (icons),
`temporal-polyfill`.

## Install

```bash
npm install @dynamia-tools/tailadmin-vue
```

## Usage

Import the theme CSS once in your entrypoint:

```ts
// main.ts
import '@dynamia-tools/tailadmin-vue/style.css'
```

Import components directly from their source path:

```vue
<script setup lang="ts">
import Button from '@dynamia-tools/tailadmin-vue/components/ui/button/Button.vue'
import Alert from '@dynamia-tools/tailadmin-vue/components/ui/Alert.vue'
</script>
```

Composables and icons:

```ts
import { useSidebar } from '@dynamia-tools/tailadmin-vue/composables/useSidebar'
import { BoxCubeIcon } from '@dynamia-tools/tailadmin-vue/icons'
```

Browse `src/components/` in this repo (or in `node_modules` once installed) to see everything
available: `ui/`, `forms/`, `tables/`, `charts/`, `layout/`, `common/`, `profile/`, `ecommerce/`.
See [`examples/basic-app`](./examples/basic-app) for a working Vite app wired up against this
package — layout, icons, composables and a handful of components rendering end to end.

### Static image assets

A few core layout components (`AppSidebar`, `AppHeader`'s `UserMenu`/`NotificationMenu`)
reference images by absolute path (`/images/logo/*.svg`, `/images/user/*`) instead of importing
them as modules — same as upstream. This package ships that minimal set under `public/`; copy it
into your own project's `public/` directory:

```bash
cp -r node_modules/@dynamia-tools/tailadmin-vue/public/images ./public/
```

Other components (`ProfileCard`, ecommerce widgets, product/country demo data, etc.) reference
additional `/images/...` paths that are **not** bundled here — those are upstream's own demo
placeholder content, not shipped to keep the package light. If you use one of those components
as-is, provide matching files at those paths or adapt the component to your own image props/URLs.

## Versioning

This package uses [CalVer](https://calver.org) (`YY.MM.MICRO`), independent of TailAdmin's own
version numbers — e.g. `26.9.0` is the first release published in September 2026. It makes it
easy to tell at a glance how recently a given release was synced with upstream.

## Syncing with upstream

This package does not git-fork/merge from TailAdmin — it is synced manually when needed,
preserving local changes (relative imports instead of `@/` aliases, `package.json`, `exports`,
this README). See [docs/SYNC.md](./docs/SYNC.md) for the procedure.

## License and attribution

MIT, same as the original project. Original components by [TailAdmin](https://tailadmin.com)
([original repo](https://github.com/TailAdmin/vue-tailwind-admin-dashboard)). See
[LICENSE](./LICENSE).

## Publishing (maintainers)

Publishing to npm runs via GitHub Actions when a **GitHub Release is published**, tagged
`vX.Y.Z` matching the `package.json` `version` (a tag push alone doesn't trigger it — publishing
a release does). Requires the `NPM_TOKEN` secret configured on the repo.
