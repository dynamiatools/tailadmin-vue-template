# basic-app example

A minimal Vite + Vue 3 + Tailwind CSS 4 app that consumes `@dynamia-tools/tailadmin-vue` the
same way a real consumer project would — as a source dependency imported by path, no build step
in the package itself. It mirrors the entrypoint structure TailAdmin's own demo app uses
(`ThemeProvider` + `SidebarProvider` wrapping a router view), but only renders one dashboard
page pulling in a representative slice of components: full admin layout (sidebar + header),
`EcommerceMetrics`, `Alert`, `Button`, `Badge`, `BasicTableOne`.

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
npm run type-check    # vue-tsc against the package's actual .vue/.ts source
```

## What to check when validating a sync

- The dashboard renders with the expected TailAdmin styling (dark mode, colors, spacing) — if it
  looks unstyled, the `@source` directive in `src/style.css` isn't picking up the package's
  components (see comment there).
- Sidebar collapse/expand and the theme toggle in the header work — these exercise
  `useSidebar`/`useRTL` composables and localStorage-backed state.
- `npm run build` and `npm run type-check` both exit 0.
