// import { ref } from 'vue'

// export function useSidebar() {
//   const isMobileOpen = ref(false)
//   const isDesktopOpen = ref(true)

//   const toggleSidebar = () => {
//     isDesktopOpen.value = !isDesktopOpen.value
//   }

//   const toggleMobileSidebar = () => {
//     isMobileOpen.value = !isMobileOpen.value
//   }

//   return {
//     isMobileOpen,
//     isDesktopOpen,
//     toggleSidebar,
//     toggleMobileSidebar,
//   }
// }

import { ref, computed, onMounted, onUnmounted, provide, inject, toValue, watch } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue' //

interface SidebarContextType {
  isExpanded: Ref<boolean>
  isMobileOpen: Ref<boolean>
  /** True while the viewport is narrower than the provider's `mobileBreakpoint` (default 768px). */
  isMobile: Ref<boolean>
  isHovered: Ref<boolean>
  activeItem: Ref<string | null>
  openSubmenu: Ref<string | null>
  toggleSidebar: () => void
  toggleMobileSidebar: () => void
  setIsHovered: (isHovered: boolean) => void
  setActiveItem: (item: string | null) => void
  toggleSubmenu: (item: string) => void
}

// package.json's "./composables/*" exports pattern must end in ".ts" (unlike "./icons",
// which points at a literal file). Without it, a consumer's `vue-tsc` fails to resolve
// `@dynamia-tools/tailadmin-vue/composables/useSidebar` ("Cannot find module ... or its
// corresponding type declarations") even though Vite/esbuild-style bundlers resolve it fine
// at runtime — don't drop the extension on a future edit to that map.
const SidebarSymbol = Symbol()

export interface SidebarProviderOptions {
  /**
   * Viewport width (px) under which the sidebar behaves as a mobile drawer. Defaults to 768,
   * the value this composable always used. Accepts a ref/getter so it can change at runtime.
   */
  mobileBreakpoint?: MaybeRefOrGetter<number>
}

export function useSidebarProvider(options: SidebarProviderOptions = {}) {
  const isExpanded = ref(true)
  const isMobileOpen = ref(false)
  const isMobile = ref(false)
  const isHovered = ref(false)
  const activeItem = ref<string | null>(null)
  const openSubmenu = ref<string | null>(null)

  const handleResize = () => {
    const mobile = window.innerWidth < (toValue(options.mobileBreakpoint) ?? 768)
    isMobile.value = mobile
    if (!mobile) {
      isMobileOpen.value = false
    }
  }

  watch(() => toValue(options.mobileBreakpoint), () => {
    if (typeof window !== 'undefined') handleResize()
  })

  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  const toggleSidebar = () => {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value
    } else {
      isExpanded.value = !isExpanded.value
    }
  }

  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  const setIsHovered = (value: boolean) => {
    isHovered.value = value
  }

  const setActiveItem = (item: string | null) => {
    activeItem.value = item
  }

  const toggleSubmenu = (item: string) => {
    openSubmenu.value = openSubmenu.value === item ? null : item
  }

  const context: SidebarContextType = {
    isExpanded: computed(() => (isMobile.value ? false : isExpanded.value)),
    isMobileOpen,
    isMobile,
    isHovered,
    activeItem,
    openSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
    setActiveItem,
    toggleSubmenu,
  }

  provide(SidebarSymbol, context)

  return context
}

export function useSidebar(): SidebarContextType {
  const context = inject<SidebarContextType>(SidebarSymbol)
  if (!context) {
    throw new Error(
      'useSidebar must be used within a component that has SidebarProvider as an ancestor',
    )
  }
  return context
}
