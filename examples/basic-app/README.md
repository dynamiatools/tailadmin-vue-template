# basic-app example

A Vite + Vue 3 + Tailwind CSS 4 app that consumes `@dynamia-tools/tailadmin-vue` the same way a
real consumer project would — as a source dependency imported by path, no build step in the
package itself. It mirrors TailAdmin's own demo app: the same entrypoint structure
(`ThemeProvider` + `SidebarProvider` wrapping a router view) and, other than the "Purchase Plan"
upsell (removed — this package is fully free/open-source), the same sidebar navigation and pages.

Every page the sidebar links to has real content, matching upstream's own demo — **except
"Blank Page"**, which is upstream's own intentionally-minimal page template (`views/BlankPage.vue`),
not a stand-in for something unimplemented.

A floating **brand color picker** (bottom-right, on every page) lets you pick any hex color and
re-theme the whole app instantly — see `src/lib/brandColor.ts` for how (short version: Tailwind
v4 compiles color utilities to `var(--color-brand-*)`, so overriding those custom properties at
runtime is enough, no rebuild).

Use this to sanity-check a change before publishing: if this app builds, type-checks and renders
correctly, the package's exports, relative imports and Tailwind scanning are all working.

## Run it

```bash
cd examples/basic-app
npm install
npm run dev
```

`npm install` links `@dynamia-tools/tailadmin-vue` via the `file:../..` dependency in
`package.json`, so it always exercises the current state of the repo (no need to publish or pack
first).

Other scripts:

```bash
npm run build        # production build — catches anything vite dev's HMR would hide
npm run type-check   # vue-tsc against the package's actual .vue/.ts source
```

## What to check when validating a sync

- The dashboard renders with the expected TailAdmin styling (dark mode, colors, spacing) — if it
  looks unstyled, the `@source` directive in `src/style.css` isn't picking up the package's
  components (see comment there).
- Sidebar collapse/expand and the theme toggle in the header work — these exercise
  `useSidebar`/`useRTL` composables and localStorage-backed state.
- The brand color picker actually re-themes the app (sidebar highlight, buttons, badges, etc.).
- `npm run build` and `npm run type-check` both exit 0.

## Assets

`public/images/` here holds every image these pages reference (logo, avatars, product photos,
country flags, the 404 illustration...). Unlike the package's own `public/` (which ships only
the handful needed by core layout components), this example's `public/` is free to carry
whatever upstream demo assets make the full page set look right — none of it gets published to
npm. See the root [README's "Static image assets" section](../../README.md#static-image-assets)
for what the package itself ships and why.
