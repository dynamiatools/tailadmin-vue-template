import { describe, it, expect, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import ClosableTabs from '../src/components/ext/layouts/ClosableTabs.vue'
import type { ClosableTabItem } from '../src/components/ext/layouts/ClosableTabs.vue'

enableAutoUnmount(afterEach)

const tabs = (): ClosableTabItem[] => [
  { id: 'home', label: 'Panel de Control', closable: false },
  { id: 'a', label: 'Clientes' },
  { id: 'b', label: 'Facturas' },
  { id: 'c', label: 'Informes' },
]

/** Panel content that counts how many times it is (re)mounted and keeps local state. */
function harness(mounts: Record<string, number>) {
  const Panel = defineComponent({
    props: { id: { type: String, required: true } },
    setup(p) {
      const typed = ref('')
      onMounted(() => (mounts[p.id] = (mounts[p.id] ?? 0) + 1))
      onUnmounted(() => (mounts[p.id] = (mounts[p.id] ?? 0) - 1000)) // negative marks an unmount
      return () => h('input', { 'data-panel': p.id, value: typed.value, onInput: (e: Event) => (typed.value = (e.target as HTMLInputElement).value) })
    },
  })
  return { Panel, slot: ({ tab }: { tab: ClosableTabItem }) => h(Panel, { id: String(tab.id) }) }
}

const tab = (w: VueWrapper, id: string) => w.find(`[role="tab"][id$="-tab-${id}"]`)
const panels = (w: VueWrapper) => w.findAll('[role="tabpanel"]')

describe('ClosableTabs', () => {
  it('mounts panels lazily and keeps visited ones mounted (state survives switching)', async () => {
    const mounts: Record<string, number> = {}
    const { slot } = harness(mounts)
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'home' }, slots: { default: slot }, attachTo: document.body })
    expect(panels(w)).toHaveLength(1)

    await w.setProps({ modelValue: 'a' })
    ;(w.find('[data-panel="a"]').element as HTMLInputElement).value = 'draft'
    w.find('[data-panel="a"]').trigger('input')
    await w.setProps({ modelValue: 'b' })
    await w.setProps({ modelValue: 'a' })

    expect(mounts).toEqual({ home: 1, a: 1, b: 1 }) // `a` was NOT remounted
    expect((w.find('[data-panel="a"]').element as HTMLInputElement).value).toBe('draft')
    const visible = panels(w).filter((p) => p.isVisible())
    expect(visible).toHaveLength(1)
    expect(visible[0].find('[data-panel="a"]').exists()).toBe(true)
  })

  it('max unmounts the least recently active panels first', async () => {
    const mounts: Record<string, number> = {}
    const { slot } = harness(mounts)
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'home', max: 2 }, slots: { default: slot }, attachTo: document.body })
    await w.setProps({ modelValue: 'a' })
    await w.setProps({ modelValue: 'b' }) // home is now the LRU → unmounted
    expect(w.find('[data-panel="home"]').exists()).toBe(false)
    expect(w.find('[data-panel="a"]').exists()).toBe(true)
    await w.setProps({ modelValue: 'home' }) // remounts (state lost by design), evicts `a`
    expect(w.find('[data-panel="home"]').exists()).toBe(true)
    expect(w.find('[data-panel="a"]').exists()).toBe(false)
    expect(w.find('[data-panel="b"]').exists()).toBe(true)
  })

  it('max shrinking at runtime trims the mounted panels right away', async () => {
    const { slot } = harness({})
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'home' }, slots: { default: slot }, attachTo: document.body })
    await w.setProps({ modelValue: 'a' })
    await w.setProps({ modelValue: 'b' })
    expect(panels(w)).toHaveLength(3)
    await w.setProps({ max: 1 })
    expect(panels(w)).toHaveLength(1)
    expect(w.find('[data-panel="b"]').exists()).toBe(true) // the active one always survives
  })

  it('tabs mutated in place (splice/push) are tracked like a replaced array', async () => {
    const { slot } = harness({})
    const list = reactive(tabs())
    const w = mount(ClosableTabs, { props: { tabs: list, modelValue: 'a' }, slots: { default: slot }, attachTo: document.body })
    expect(w.find('[data-panel="a"]').exists()).toBe(true)

    await w.setProps({ modelValue: 'home' })
    list.splice(1, 1) // remove `a` in place
    await nextTick()
    list.splice(1, 0, { id: 'a', label: 'Clientes' }) // re-added: must not resurrect its old panel
    await nextTick()
    expect(w.find('[data-panel="a"]').exists()).toBe(false)
  })

  it('keepAlive=false mounts only the active panel', async () => {
    const mounts: Record<string, number> = {}
    const { slot } = harness(mounts)
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'a', keepAlive: false }, slots: { default: slot }, attachTo: document.body })
    await w.setProps({ modelValue: 'b' })
    expect(panels(w)).toHaveLength(1)
    expect(w.find('[data-panel="a"]').exists()).toBe(false)
  })

  it('unmounts the panel of a tab removed by the parent', async () => {
    const mounts: Record<string, number> = {}
    const { slot } = harness(mounts)
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'a' }, slots: { default: slot }, attachTo: document.body })
    await w.setProps({ modelValue: 'b' })
    await w.setProps({ tabs: tabs().filter((t) => t.id !== 'a') })
    expect(w.find('[data-panel="a"]').exists()).toBe(false)
    expect(tab(w, 'a').exists()).toBe(false)
    expect(w.find('[data-panel="b"]').exists()).toBe(true)
  })

  it('named panel-<id> slot wins over the default slot', async () => {
    const w = mount(ClosableTabs, {
      props: { tabs: tabs(), modelValue: 'a' },
      slots: { 'panel-a': () => h('p', 'specific'), default: () => h('p', 'generic') },
    })
    expect(w.text()).toContain('specific')
    expect(w.text()).not.toContain('generic')
  })

  it('close: × button, middle click and Delete emit `close`; non-closable tabs offer none', async () => {
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'a' }, attachTo: document.body })
    // "home" has no × button
    expect(tab(w, 'home').element.parentElement!.querySelectorAll('button')).toHaveLength(1)
    await w.find('button[aria-label="Close Clientes"]').trigger('click')
    expect(w.emitted('close')![0]).toEqual(['a'])
    expect(w.emitted('update:modelValue')).toBeUndefined() // × click must not also select the tab

    await tab(w, 'b').trigger('auxclick', { button: 1 })
    expect(w.emitted('close')![1]).toEqual(['b'])

    await tab(w, 'c').trigger('keydown', { key: 'Delete' })
    expect(w.emitted('close')![2]).toEqual(['c'])

    await tab(w, 'home').trigger('keydown', { key: 'Delete' })
    await tab(w, 'home').trigger('auxclick', { button: 1 })
    expect(w.emitted('close')).toHaveLength(3)
  })

  it('closeLabel customises the accessible name of the × buttons', () => {
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'a', closeLabel: 'Cerrar' } })
    expect(w.find('button[aria-label="Cerrar Clientes"]').exists()).toBe(true)
  })

  it('a11y: roving tabindex, aria-selected/controls/labelledby wiring', () => {
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'a' }, slots: { default: () => h('i') } })
    expect(tab(w, 'a').attributes('aria-selected')).toBe('true')
    expect(tab(w, 'a').attributes('tabindex')).toBe('0')
    expect(tab(w, 'b').attributes('tabindex')).toBe('-1')
    const panel = panels(w)[0]
    expect(tab(w, 'a').attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tab(w, 'a').attributes('id'))
    expect(w.find('[role="tablist"]').exists()).toBe(true)
  })

  it('keyboard: arrows wrap and skip disabled tabs; Home/End; focus follows', async () => {
    const list = tabs()
    list[2].disabled = true // b
    const w = mount(ClosableTabs, { props: { tabs: list, modelValue: 'a' }, attachTo: document.body })
    const press = async (id: string, key: string) => tab(w, id).trigger('keydown', { key })
    await press('a', 'ArrowRight')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['c']) // skipped disabled `b`
    await press('c', 'ArrowRight')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['home']) // wraps
    await press('home', 'End')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['c'])
    await press('c', 'Home')
    expect(w.emitted('update:modelValue')!.at(-1)).toEqual(['home'])
  })

  it('Delete keeps keyboard focus inside the strip once the parent removes the tab', async () => {
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'b' }, attachTo: document.body })
    ;(tab(w, 'b').element as HTMLElement).focus()
    await tab(w, 'b').trigger('keydown', { key: 'Delete' })
    await w.setProps({ tabs: tabs().filter((t) => t.id !== 'b'), modelValue: 'c' })
    await nextTick()
    expect(document.activeElement).toBe(tab(w, 'c').element)
  })

  it('renders the #actions slot next to the strip', () => {
    const w = mount(ClosableTabs, { props: { tabs: tabs(), modelValue: 'a' }, slots: { actions: () => h('button', { id: 'refresh' }, 'r') } })
    expect(w.find('#refresh').exists()).toBe(true)
  })
})
