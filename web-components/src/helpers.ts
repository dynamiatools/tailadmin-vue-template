/**
 * Runtime helpers for consuming `ta-*` custom elements outside Vue. Hand-written (not
 * generated) — this file doesn't need touching when new components are added; see
 * `elements.ts` and the per-component `*Props` type exports for the generated, per-component
 * typing story.
 */

/**
 * Creates a `ta-*` element, assigns its properties, and only then appends it to `container`.
 * Fully typed off `HTMLElementTagNameMap` (via `elements.ts`) when the tag is a known literal —
 * `mount('ta-cart', el, { items: [...] })` gets `items` checked and the return value typed as
 * `HTMLElementTagNameMap['ta-cart']`, same as `document.createElement` itself.
 *
 * The property-before-append order matters: a custom element already present in static HTML
 * upgrades (and Vue does its first render) the instant the page is parsed — before any deferred
 * script runs. A required prop that's still undefined at that first render throws (see the
 * package README's "Known limitations" and `web-components/demo`'s `main.ts` for the same
 * pattern applied by hand before this helper existed).
 */
export function mount<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  container: Element,
  props: Partial<HTMLElementTagNameMap[Tag]> = {},
): HTMLElementTagNameMap[Tag] {
  const el = document.createElement(tag)
  Object.assign(el as object, props)
  container.appendChild(el)
  return el
}

/**
 * Listens for a Vue-emitted event on a `ta-*` element. Vue's `defineCustomElement` dispatches
 * emits as native `CustomEvent`s whose `detail` is always an array of the emitted arguments
 * (even for a single argument) — this unwraps that array so the handler receives the emitted
 * arguments directly, the same shape they'd have inside the original Vue component's `emit()`
 * call. Returns an unsubscribe function.
 *
 * No explicit generic needed — `T` (the element's type) is inferred from `el` itself, which is
 * already fully typed once `elements.ts` is imported:
 *
 * ```ts
 * const cart = document.createElement('ta-cart') // already typed via elements.ts
 * on(cart, 'remove', (id) => { ... }) // id: string | number, inferred
 * ```
 *
 * How: Vue converts each `defineEmits`/`defineModel` event into an `onEventName` handler prop
 * (`remove` → `onRemove`, `update:items` → `onUpdate:items`) as part of the component's own
 * props type — the same mechanism that types `<Comp @remove="...">` in a template, and the same
 * type `elements.ts` already put on `T` (via `ComponentProps`, see each `ta-*.ts`'s own comment
 * for why this is more reliable here than the component's raw `$emit` type would be). This just
 * looks that handler prop up by name and reads its parameter types.
 *
 * (We tried making the props type an explicit generic instead of inferring it from `el` — e.g.
 * `on<CartProps>(el, 'remove', ...)`. It doesn't work: TypeScript only infers *unsupplied*
 * generic parameters from arguments when *none* of a call's type arguments are given explicitly;
 * providing the props type by hand blocks inference of the event-name parameter, which silently
 * degrades the handler to `unknown[]`. Inferring both from `el` and the event string sidesteps
 * that entirely — a plain `EventTarget`/`HTMLElement` still works, just untyped.)
 *
 * The event name isn't restricted to a known-valid union — passing one that doesn't exist on
 * the element's type just gives an untyped (`unknown[]`) handler rather than a compile error.
 */
export function on<T extends EventTarget, K extends string>(
  el: T,
  event: K,
  handler: (...args: EventArgsOf<T, K>) => void,
): () => void {
  const listener = (e: Event) => handler(...(((e as CustomEvent).detail ?? []) as EventArgsOf<T, K>))
  el.addEventListener(event, listener)
  return () => el.removeEventListener(event, listener)
}

type OnHandlerKey<K extends string> = `on${Capitalize<K>}`

type EventArgsOf<T, K extends string> = OnHandlerKey<K> extends keyof T
  ? NonNullable<T[OnHandlerKey<K>]> extends (...args: infer A) => unknown
    ? A
    : unknown[]
  : unknown[]

/**
 * `vue-component-type-helpers`'s `ComponentProps<T>` (used to type each `ta-*` element's
 * properties in `elements.ts`) derives from Vue's internal `$props`, which is `Readonly<...>` —
 * correct *inside* the Vue component, wrong for a custom element's public properties, which
 * are genuinely settable from JS (`el.items = [...]`). This strips that readonly-ness back off.
 */
export type Writable<T> = { -readonly [K in keyof T]: T[K] }

/**
 * Two-way binds a `ta-*` element's `modelValue` prop (or a custom prop/event pair) to a getter
 * and setter — the closest standalone equivalent of Vue's `v-model`. Sets the initial value
 * immediately, then calls `set` whenever the element emits its update event. Returns an
 * unsubscribe function.
 *
 * ```ts
 * let count = 1
 * const el = mount('ta-quantity-input', container, { modelValue: count })
 * bindModel(el, () => count, (v) => (count = v))
 * ```
 */
export function bindModel<T>(
  el: EventTarget,
  get: () => T,
  set: (value: T) => void,
  options?: { prop?: string; event?: string },
): () => void {
  const prop = options?.prop ?? 'modelValue'
  const event = options?.event ?? 'update:modelValue'
  ;(el as unknown as Record<string, unknown>)[prop] = get()
  const listener = (e: Event) => set((e as CustomEvent).detail?.[0])
  el.addEventListener(event, listener)
  return () => el.removeEventListener(event, listener)
}
