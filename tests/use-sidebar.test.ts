import { describe, it, expect, afterEach } from 'vitest'
import { mount, enableAutoUnmount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import SidebarProvider from '../src/components/layout/SidebarProvider.vue'
import { useSidebar } from '../src/composables/useSidebar'

enableAutoUnmount(afterEach)

function setWidth(px: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: px })
  window.dispatchEvent(new Event('resize'))
}

function mountProvider(props: { mobileBreakpoint?: number } = {}) {
  let ctx!: ReturnType<typeof useSidebar>
  const Probe = defineComponent({
    setup() {
      ctx = useSidebar()
      return () => h('i')
    },
  })
  const w = mount(SidebarProvider, { props, slots: { default: () => h(Probe) } })
  return { w, ctx: () => ctx }
}

describe('SidebarProvider / useSidebar', () => {
  it('keeps the historical 768px mobile breakpoint by default', async () => {
    setWidth(900)
    const { ctx } = mountProvider()
    expect(ctx().isMobile.value).toBe(false)
    setWidth(700)
    expect(ctx().isMobile.value).toBe(true)
  })

  it('mobileBreakpoint is configurable and reactive', async () => {
    setWidth(900)
    const { w, ctx } = mountProvider({ mobileBreakpoint: 992 })
    expect(ctx().isMobile.value).toBe(true)
    await w.setProps({ mobileBreakpoint: 768 })
    await nextTick()
    expect(ctx().isMobile.value).toBe(false)
  })

  it('leaving mobile closes the drawer; isExpanded is false while mobile (unchanged behaviour)', () => {
    setWidth(500)
    const { ctx } = mountProvider({ mobileBreakpoint: 992 })
    ctx().toggleSidebar() // mobile: toggles the drawer
    expect(ctx().isMobileOpen.value).toBe(true)
    expect(ctx().isExpanded.value).toBe(false)
    setWidth(1200)
    expect(ctx().isMobileOpen.value).toBe(false)
    expect(ctx().isExpanded.value).toBe(true)
  })
})
