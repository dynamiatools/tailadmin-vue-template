import { describe, it, expect, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { defineComponent, h, markRaw, nextTick } from 'vue'
import TreeMenu from '../src/components/ext/navigation/TreeMenu.vue'
import type { TreeMenuItem } from '../src/components/ext/navigation/TreeMenu.vue'

enableAutoUnmount(afterEach)

// jsdom cannot navigate; anchors with an href would log "Not implemented: navigation".
document.addEventListener('click', (event) => event.preventDefault())

const items = (): TreeMenuItem[] => [
  {
    id: 'ventas', label: 'Ventas', icon: 'cart', children: [
      { id: 'clientes', label: 'Clientes', href: '/page/ventas/clientes' },
      { id: 'informes', label: 'Informes', children: [
        { id: 'diario', label: 'Diario', children: [{ id: 'detalle', label: 'Detalle' }] },
      ] },
    ],
  },
  { id: 'inventario', label: 'Inventario', icon: 'unknown', children: [{ id: 'productos', label: 'Productos' }] },
  { id: 'inicio', label: 'Inicio' },
]

const Cart = markRaw(defineComponent({ render: () => h('i', { 'data-icon': 'cart' }) }))
const Dflt = markRaw(defineComponent({ render: () => h('i', { 'data-icon': 'default' }) }))

const byId = (w: VueWrapper, id: string) => w.find(`[data-tm-id="${id}"]`)

describe('TreeMenu', () => {
  it('renders children lazily: collapsed branches are not in the DOM until opened', async () => {
    const w = mount(TreeMenu, { props: { items: items() } })
    expect(byId(w, 'ventas').exists()).toBe(true)
    expect(byId(w, 'clientes').exists()).toBe(false)
    await byId(w, 'ventas').trigger('click')
    expect(byId(w, 'clientes').exists()).toBe(true)
    expect(byId(w, 'ventas').attributes('aria-expanded')).toBe('true')
    // 3rd/4th level still not rendered
    expect(byId(w, 'diario').exists()).toBe(false)
  })

  it('expands the ancestors of a deep activeId (4 levels) and marks only the leaf as current', async () => {
    const w = mount(TreeMenu, { props: { items: items(), activeId: 'detalle' } })
    for (const id of ['ventas', 'informes', 'diario']) expect(byId(w, id).attributes('aria-expanded')).toBe('true')
    expect(byId(w, 'detalle').attributes('aria-current')).toBe('page')
    expect(byId(w, 'diario').attributes('aria-current')).toBeUndefined()
    // ancestors highlighted as active branch
    expect(byId(w, 'ventas').classes()).toContain('menu-item-active')
    expect(byId(w, 'inventario').classes()).toContain('menu-item-inactive')
    // changing activeId follows
    await w.setProps({ activeId: 'productos' })
    expect(byId(w, 'inventario').attributes('aria-expanded')).toBe('true')
    expect(byId(w, 'ventas').attributes('aria-expanded')).toBe('false')
  })

  it('accordion closes siblings (and their descendants); accordion=false keeps them', async () => {
    const w = mount(TreeMenu, { props: { items: items() } })
    await byId(w, 'ventas').trigger('click')
    await byId(w, 'inventario').trigger('click')
    expect(byId(w, 'ventas').attributes('aria-expanded')).toBe('false')
    expect(byId(w, 'inventario').attributes('aria-expanded')).toBe('true')

    const free = mount(TreeMenu, { props: { items: items(), accordion: false } })
    await byId(free, 'ventas').trigger('click')
    await byId(free, 'inventario').trigger('click')
    expect(byId(free, 'ventas').attributes('aria-expanded')).toBe('true')
    expect(byId(free, 'inventario').attributes('aria-expanded')).toBe('true')
  })

  it('collapsed subtree is inert + aria-hidden (not focusable) after closing', async () => {
    const w = mount(TreeMenu, { props: { items: items() } })
    await byId(w, 'ventas').trigger('click')
    await byId(w, 'ventas').trigger('click')
    const wrapper = byId(w, 'clientes').element.closest('[aria-hidden]')!
    expect(wrapper.hasAttribute('inert')).toBe(true)
    expect(wrapper.getAttribute('aria-hidden')).toBe('true')
  })

  it('emits select for leaves (link vs button) and lets the consumer preventDefault', async () => {
    const w = mount(TreeMenu, { props: { items: items(), activeId: 'clientes' } })
    const link = byId(w, 'clientes')
    expect(link.element.tagName).toBe('A')
    expect(link.attributes('href')).toBe('/page/ventas/clientes')
    await link.trigger('click')
    const [item, event] = w.emitted('select')![0] as [TreeMenuItem, MouseEvent]
    expect(item.id).toBe('clientes')
    expect(event).toBeInstanceOf(Event)
    // parent rows never emit select
    await byId(w, 'inventario').trigger('click')
    expect(w.emitted('select')).toHaveLength(1)
    expect(w.emitted('toggle')!.at(-1)![1]).toBe(true)
  })

  it('resolves string icons through iconMap, falls back to defaultIcon only on the top level', async () => {
    const w = mount(TreeMenu, { props: { items: items(), iconMap: { cart: Cart }, defaultIcon: Dflt } })
    expect(byId(w, 'ventas').find('[data-icon="cart"]').exists()).toBe(true)
    expect(byId(w, 'inventario').find('[data-icon="default"]').exists()).toBe(true) // unknown key
    expect(byId(w, 'inicio').find('[data-icon="default"]').exists()).toBe(true) // no icon
    await byId(w, 'ventas').trigger('click')
    expect(byId(w, 'clientes').find('[data-icon]').exists()).toBe(false) // nested: no default icon
  })

  it('supports #icon and #label slots (used through the recursive tree)', async () => {
    const w = mount(TreeMenu, {
      props: { items: items(), activeId: 'clientes' },
      slots: {
        icon: ({ item }: { item: TreeMenuItem }) => h('b', { class: 'ic' }, item.id as string),
        label: ({ item, level }: { item: TreeMenuItem; level: number }) => h('u', `${item.label}@${level}`),
      },
    })
    expect(byId(w, 'ventas').text()).toContain('Ventas@0')
    expect(byId(w, 'clientes').text()).toContain('Clientes@1')
    expect(byId(w, 'clientes').find('.ic').text()).toBe('clientes')
  })

  it('condensed: icon-only top level, no inline children, flyout opens on mouse hover in <body>', async () => {
    const w = mount(TreeMenu, { props: { items: items(), condensed: true, iconMap: { cart: Cart } }, attachTo: document.body })
    const top = byId(w, 'ventas')
    expect(top.find('span.sr-only').text()).toBe('Ventas')
    expect(top.attributes('title')).toBe('Ventas')
    expect(top.attributes('aria-haspopup')).toBe('true')
    expect(byId(w, 'clientes').exists()).toBe(false)

    await top.trigger('pointerenter', { pointerType: 'mouse' })
    const panel = document.body.querySelector('[role="group"][aria-label="Ventas"]') as HTMLElement
    expect(panel).toBeTruthy()
    expect(panel.querySelector('[data-tm-id="clientes"]')).toBeTruthy()
    expect(top.attributes('aria-expanded')).toBe('true')

    // selecting a leaf inside the flyout emits select and closes it
    ;(panel.querySelector('[data-tm-id="clientes"]') as HTMLElement).click()
    await nextTick()
    expect((w.emitted('select')![0][0] as TreeMenuItem).id).toBe('clientes')
    expect(document.body.querySelector('[role="group"]')).toBeNull()
  })

  it('condensed: touch/click toggles the flyout; deeper levels are inline accordions inside it; Escape closes', async () => {
    const w = mount(TreeMenu, { props: { items: items(), condensed: true }, attachTo: document.body })
    await byId(w, 'ventas').trigger('click')
    const panel = () => document.body.querySelector('[role="group"]') as HTMLElement | null
    expect(panel()).toBeTruthy()
    ;(panel()!.querySelector('[data-tm-id="informes"]') as HTMLElement).click()
    await nextTick()
    expect(panel()!.querySelector('[data-tm-id="diario"]')).toBeTruthy()

    panel()!.querySelector<HTMLElement>('[data-tm-id="informes"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await nextTick()
    expect(panel()).toBeNull()
  })

  it('condensed: flyout closes after the delay when the pointer leaves, unless it re-enters', async () => {
    const w = mount(TreeMenu, { props: { items: items(), condensed: true, flyoutCloseDelay: 20 }, attachTo: document.body })
    const top = byId(w, 'ventas')
    await top.trigger('pointerenter', { pointerType: 'mouse' })
    await top.trigger('pointerleave', { pointerType: 'mouse' })
    document.body.querySelector('[role="group"]')!.dispatchEvent(new Event('pointerenter'))
    await new Promise((r) => setTimeout(r, 40))
    expect(document.body.querySelector('[role="group"]')).toBeTruthy() // re-entered → stays

    document.body.querySelector('[role="group"]')!.dispatchEvent(new Event('pointerleave'))
    await new Promise((r) => setTimeout(r, 40))
    await nextTick()
    expect(document.body.querySelector('[role="group"]')).toBeNull()
  })

  it('toggling condensed off closes the flyout and restores inline rendering', async () => {
    const w = mount(TreeMenu, { props: { items: items(), condensed: true }, attachTo: document.body })
    await byId(w, 'ventas').trigger('click')
    await w.setProps({ condensed: false })
    expect(document.body.querySelector('[role="group"]')).toBeNull()
    expect(byId(w, 'ventas').find('span.sr-only').exists()).toBe(false)
  })

  it('keyboard: arrows move focus over visible rows only; Right/Left expand/collapse', async () => {
    const w = mount(TreeMenu, { props: { items: items() }, attachTo: document.body })
    const fire = (el: Element, key: string) => el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
    const ventas = byId(w, 'ventas').element as HTMLElement
    ventas.focus()
    fire(ventas, 'ArrowRight')
    await nextTick()
    expect(byId(w, 'ventas').attributes('aria-expanded')).toBe('true')
    fire(ventas, 'ArrowDown')
    expect(document.activeElement).toBe(byId(w, 'clientes').element)
    fire(document.activeElement!, 'End')
    expect(document.activeElement).toBe(byId(w, 'inicio').element)
    fire(document.activeElement!, 'Home')
    expect(document.activeElement).toBe(ventas)
    fire(ventas, 'ArrowLeft')
    await nextTick()
    expect(byId(w, 'ventas').attributes('aria-expanded')).toBe('false')
    // collapsed children (inert) are skipped by ArrowDown
    fire(ventas, 'ArrowDown')
    expect(document.activeElement).toBe(byId(w, 'inventario').element)
  })

  it('disabled rows do nothing', async () => {
    const w = mount(TreeMenu, { props: { items: [{ id: 'x', label: 'X', disabled: true }] } })
    await byId(w, 'x').trigger('click')
    expect(w.emitted('select')).toBeUndefined()
  })

  it('numeric ids work and items updates keep the open state', async () => {
    const mk = () => [{ id: 1, label: 'A', children: [{ id: 2, label: 'B' }] }]
    const w = mount(TreeMenu, { props: { items: mk(), activeId: 2 } })
    expect(byId(w, '1').attributes('aria-expanded')).toBe('true')
    await w.setProps({ items: mk() })
    expect(byId(w, '1').attributes('aria-expanded')).toBe('true')
  })
})
