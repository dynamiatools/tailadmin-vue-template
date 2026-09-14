# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`@dynamia-tools/tailadmin-vue` — the reusable half of
[TailAdmin Vue](https://github.com/TailAdmin/vue-tailwind-admin-dashboard) (Vue 3 + Tailwind CSS
4), published to npm as **raw, unbuilt source**. Not a fork with shared git history, not a
bundled library — `src/components/`, `src/composables/`, `src/icons/`, and the theme CSS get
published as-is and imported directly by consumers via the `exports` map in `package.json`. No
build step, no `dist/`.

`src/views/`, `src/router/`, `App.vue`, `main.ts` and `index.html` from upstream's demo app are
intentionally **not** part of this repo — only the reusable pieces.

## Commands

```bash
npm install          # root
npm run type-check   # vue-tsc --build — the only CI/publish gate, keep it green
npm run lint          # eslint . --fix — NOT CI-gated, has ~13 pre-existing upstream issues
                       # (missing lang="ts" on a few <script> blocks, some unused imports).
                       # Don't try to fix these as a drive-by; see docs/SYNC.md.
npm run format        # prettier --write src/
```

`examples/basic-app/` is a separate npm project (its own `package.json`, consumes the root
package via `"@dynamia-tools/tailadmin-vue": "file:../.."`):

```bash
cd examples/basic-app
npm install   # re-links the file: dependency — run this after changing root src/ or package.json
npm run dev
npm run build
npm run type-check
```

There is no test suite. Validate changes by running `type-check` (root and example) and
`examples/basic-app`'s `build` + `dev`.

## Architecture

**Two-project layout, one repo:**
- Root (`src/`, `package.json`) — the published package.
- `examples/basic-app/` — a working Vite app that consumes the root package like a real
  consumer would. It's the closest thing to a test suite: if it type-checks, builds, and renders
  without console errors, the package's `exports`, relative imports, and Tailwind asset scanning
  are all working. **Always exercise a change through this example before considering it done.**
  See `examples/basic-app/README.md` for what to check.

**No shared git history with upstream.** The repo started from a one-time copy of upstream's
`src/components|composables|icons|assets/main.css` (see `docs/SYNC.md` for the reference commit
and full sync procedure). Pulling in upstream changes is a manual, deliberate diff-and-apply
process — there's no `git merge` to run.

**Deviations from upstream to preserve on every sync** (documented in detail in
`docs/SYNC.md` — read it before touching anything below):
- A handful of files import via the `@/...` alias in upstream (`layout/AdminLayout.vue`,
  `AppHeader.vue`, `AppSidebar.vue`, `Backdrop.vue`, `SidebarProvider.vue`,
  `layout/header/UserMenu.vue`, `ui/Alert.vue`). Here they're rewritten to relative imports,
  because a consumer can't be assumed to have `@` aliased to this package's `src/`. Any new file
  pulled from upstream using `@/...` needs the same treatment.
- `SidebarWidget.vue` (TailAdmin's "Purchase Plan" upsell box) was **deleted**, along with its
  usage in `AppSidebar.vue`. This package is free/OSS — don't reintroduce it on a sync.
- `dropzone`, `jsvectormap`, `vuevectormap` devDependencies are pinned to **exact** versions
  (not `^`), because newer semver-compatible releases silently break `@types/dropzone`'s typings
  or drop `jsvectormap`'s shim compatibility.
- Ambient declarations `src/vue.shims.d.ts` (`declare module '*.vue'`) and `src/index.d.ts`
  (`declare module 'jsvectormap'`) exist because vue-tsc needs them for this package's own
  type-check — and separately, **any consumer needs the equivalent shims in their own repo**
  (see the `examples/basic-app/src/vue.shims.d.ts` copy and its comment) since ambient `.d.ts`
  files don't propagate across a package boundary.

**`exports` map**: subpath exports like `"./components/*"` only match multi-segment paths — a
bare barrel import needs its own exact key too (e.g. `"./icons"` alongside `"./icons/*"`, added
after `import { X } from '.../icons'` broke type-check in the example). Adding a new
top-level exported directory needs the same double-entry treatment if anything imports its
barrel file directly.

**Static image assets are split on purpose**:
- Root `public/` ships only what core layout components need to not break a consumer's build —
  logo files and the header's mock user avatars. Kept deliberately small.
- `examples/basic-app/public/` ships everything every page in the example references (avatars,
  product photos, country flags, the 404 illustration, etc.) — none of it ships to npm.
- When adding/changing a component that references `/images/...`, audit it against both: does a
  *default* consumer need this image (→ root `public/`), or is it example-only demo content (→
  example's `public/` only)? Don't assume — check what's already documented in the README's
  "Static image assets" section for the reasoning.

**Versioning**: CalVer (`YY.MM.MICRO`), independent of upstream's own version number — see the
README's "Versioning" section. Bump it on every change that gets published.

**Publishing**: `.github/workflows/publish.yml` triggers only on a **GitHub Release being
published** (not on a bare tag push), and verifies the release tag (`vX.Y.Z`) matches
`package.json`'s `version` before running `npm publish`. `.github/workflows/ci.yml` runs
`type-check` on push/PR to `main`.

## Where things are documented

- `README.md` — user-facing: install, usage, requirements, peer deps, image-asset policy,
  versioning, publishing.
- `docs/SYNC.md` — the manual upstream-sync procedure and the full list of local deviations to
  preserve. Read before pulling in any upstream change.
- `examples/basic-app/README.md` — what the example covers and what to check after changes.
