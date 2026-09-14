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
- `npm run lint` currently fails on ~13 pre-existing upstream issues (missing `lang="ts"` on a
  few `<script>` blocks, a handful of unused imports) — reproducible on a clean upstream clone
  too, so it's not something introduced here. `lint` is intentionally not part of the CI/publish
  gate; only `type-check` is. Feel free to clean these up incrementally, but don't let them block
  a sync.

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
8. On merge to `main`, tag `vX.Y.Z` to trigger the npm publish.
