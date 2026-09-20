<template>
  <nav ref="navEl" :aria-label="ariaLabel" @keydown="onKeydown">
    <ul class="flex flex-col gap-1">
      <TreeMenuItemRow v-for="item in items" :key="item.id" :item="item" :level="0" />
    </ul>

    <Teleport to="body">
      <div
        v-if="condensed && flyoutItem"
        ref="panelEl"
        role="group"
        :aria-label="flyoutItem.label"
        class="dark:bg-gray-900 shadow-theme-lg fixed z-99999 min-w-52 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-800"
        :style="panelStyle"
        @pointerenter="cancelCloseFlyout"
        @pointerleave="scheduleCloseFlyout"
        @keydown="onKeydown"
      >
        <p class="px-3 pt-1 pb-2 text-xs font-medium tracking-wide text-gray-400 uppercase dark:text-gray-500">
          {{ flyoutItem.label }}
        </p>
        <ul class="flex flex-col gap-1">
          <TreeMenuItemRow
            v-for="child in flyoutItem.children"
            :key="child.id"
            :item="child"
            :level="1"
            in-flyout
          />
        </ul>
      </div>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, useSlots, watch } from 'vue'
import { useRTL } from '../../../composables/useRTL'
import TreeMenuItemRow from './TreeMenuItemRow.vue'
import { TREE_MENU_KEY } from './treeMenuContext'
import type { TreeMenuContext } from './treeMenuContext'

export interface TreeMenuItem {
  id: string | number
  label: string
  /** A component, or a string key resolved through `iconMap` (falls back to `defaultIcon`). */
  icon?: object | string
  href?: string
  disabled?: boolean
  /** Small pill at the end of the row (hidden when condensed). */
  badge?: string | number
  children?: TreeMenuItem[]
  /** Anything the consumer wants back on `select` (e.g. the source navigation node). */
  data?: unknown
}

interface TreeMenuProps {
  items: TreeMenuItem[]
  /** Id of the active (leaf) item. Its ancestors are highlighted and expanded automatically. */
  activeId?: string | number | null
  /** Icon-only top level; children open in a flyout panel on hover/focus/click. */
  condensed?: boolean
  /** Opening an item closes its siblings. */
  accordion?: boolean
  /** Resolves string `icon` keys to components. */
  iconMap?: Record<string, object>
  /** Icon for top-level items that have none (or whose key is not in `iconMap`). */
  defaultIcon?: object
  ariaLabel?: string
  /** Milliseconds the flyout stays open after the pointer leaves it. */
  flyoutCloseDelay?: number
}

const props = withDefaults(defineProps<TreeMenuProps>(), {
  activeId: null,
  condensed: false,
  accordion: true,
  iconMap: () => ({}),
  defaultIcon: undefined,
  ariaLabel: 'Navigation',
  flyoutCloseDelay: 150,
})

const emit = defineEmits<{
  /** A leaf was activated. Call `event.preventDefault()` to handle navigation yourself. */
  select: [item: TreeMenuItem, event: MouseEvent]
  toggle: [item: TreeMenuItem, expanded: boolean]
}>()

defineSlots<{
  /** Replaces the icon of a row. */
  icon?: (props: { item: TreeMenuItem; active: boolean; level: number }) => unknown
  /** Replaces the label text of a row. */
  label?: (props: { item: TreeMenuItem; active: boolean; level: number }) => unknown
}>()

const slots = useSlots()
const { isRtl } = useRTL()

const navEl = ref<HTMLElement | null>(null)
const panelEl = ref<HTMLElement | null>(null)

const key = (id: string | number) => String(id)

const index = computed(() => {
  const byId = new Map<string, TreeMenuItem>()
  const ancestors = new Map<string, string[]>()
  const siblings = new Map<string, TreeMenuItem[]>()
  const walk = (list: TreeMenuItem[], path: string[]) => {
    for (const item of list) {
      const id = key(item.id)
      byId.set(id, item)
      ancestors.set(id, path)
      siblings.set(id, list)
      if (item.children?.length) walk(item.children, [...path, id])
    }
  }
  walk(props.items, [])
  return { byId, ancestors, siblings }
})

const activeKey = computed(() => (props.activeId === null || props.activeId === undefined ? null : key(props.activeId)))

const activeBranch = computed(() => {
  const id = activeKey.value
  const path = id ? index.value.ancestors.get(id) : undefined
  return id && path ? new Set([...path, id]) : new Set<string>()
})

// --- inline expansion -------------------------------------------------------------------

const openIds = ref(new Set<string>())

function removeWithDescendants(set: Set<string>, item: TreeMenuItem) {
  set.delete(key(item.id))
  item.children?.forEach((child) => removeWithDescendants(set, child))
}

function toggle(item: TreeMenuItem) {
  const id = key(item.id)
  const next = new Set(openIds.value)
  const expanded = !next.has(id)
  if (expanded) {
    if (props.accordion) {
      for (const sibling of index.value.siblings.get(id) ?? []) {
        if (key(sibling.id) !== id) removeWithDescendants(next, sibling)
      }
    }
    next.add(id)
  } else {
    removeWithDescendants(next, item)
  }
  openIds.value = next
  emit('toggle', item, expanded)
}

function expandToActive(exclusive: boolean) {
  const id = activeKey.value
  const path = id ? index.value.ancestors.get(id) : undefined
  if (!path) return
  openIds.value = exclusive ? new Set(path) : new Set([...openIds.value, ...path])
}

watch(activeKey, () => expandToActive(props.accordion), { immediate: true })
watch(() => props.items, () => expandToActive(false))

// --- flyout (condensed mode) ------------------------------------------------------------

const flyoutId = ref<string | null>(null)
const anchor = ref<{ top: number; left: number; right: number } | null>(null)
let flyoutTrigger: HTMLElement | null = null
let closeTimer: ReturnType<typeof setTimeout> | undefined

const flyoutItem = computed(() => (flyoutId.value ? index.value.byId.get(flyoutId.value) : undefined))

const panelStyle = computed(() => {
  const a = anchor.value
  if (!a) return {}
  return {
    top: `${a.top}px`,
    maxHeight: `calc(100vh - ${a.top}px - 8px)`,
    ...(isRtl.value ? { right: `${window.innerWidth - a.left}px` } : { left: `${a.right}px` }),
  }
})

function cancelCloseFlyout() {
  clearTimeout(closeTimer)
}

function closeFlyout(restoreFocus = false) {
  cancelCloseFlyout()
  flyoutId.value = null
  if (restoreFocus) flyoutTrigger?.focus()
}

function scheduleCloseFlyout() {
  cancelCloseFlyout()
  closeTimer = setTimeout(() => closeFlyout(), props.flyoutCloseDelay)
}

function openFlyout(item: TreeMenuItem, trigger: HTMLElement) {
  if (!props.condensed || !item.children?.length) return
  cancelCloseFlyout()
  const rect = trigger.getBoundingClientRect()
  anchor.value = { top: rect.top, left: rect.left, right: rect.right }
  flyoutTrigger = trigger
  flyoutId.value = key(item.id)
}

function toggleFlyout(item: TreeMenuItem, trigger: HTMLElement) {
  if (flyoutId.value === key(item.id)) closeFlyout()
  else openFlyout(item, trigger)
}

function select(item: TreeMenuItem, event: MouseEvent) {
  emit('select', item, event)
  closeFlyout()
}

// Close on outside interaction, page scroll and resize while a flyout is open (it is
// `position: fixed`, so it would otherwise stay detached from its trigger).
function onOutsidePointerDown(event: Event) {
  const target = event.target as Node
  if (panelEl.value?.contains(target) || navEl.value?.contains(target)) return
  closeFlyout()
}
const onViewportChange = () => closeFlyout()

watch(flyoutId, (id) => {
  const method = id ? 'addEventListener' : 'removeEventListener'
  document[method]('pointerdown', onOutsidePointerDown)
  window[method]('resize', onViewportChange)
  window[method]('scroll', onViewportChange, true)
})

watch(
  () => props.condensed,
  () => closeFlyout(),
)

onBeforeUnmount(() => {
  cancelCloseFlyout()
  document.removeEventListener('pointerdown', onOutsidePointerDown)
  window.removeEventListener('resize', onViewportChange)
  window.removeEventListener('scroll', onViewportChange, true)
})

// --- keyboard ---------------------------------------------------------------------------

function focusables(container: HTMLElement | null): HTMLElement[] {
  if (!container) return []
  return Array.from(container.querySelectorAll<HTMLElement>('[data-tm-item]')).filter((el) => !el.closest('[inert]'))
}

function onKeydown(event: KeyboardEvent) {
  const current = (event.target as HTMLElement).closest<HTMLElement>('[data-tm-item]')
  if (!current) return
  const inPanel = !!panelEl.value?.contains(current)
  const list = focusables(inPanel ? panelEl.value : navEl.value)
  const position = list.indexOf(current)
  const item = index.value.byId.get(current.dataset.tmId ?? '')
  let target: HTMLElement | undefined

  switch (event.key) {
    case 'ArrowDown':
      target = list[Math.min(position + 1, list.length - 1)]
      break
    case 'ArrowUp':
      target = list[Math.max(position - 1, 0)]
      break
    case 'Home':
      target = list[0]
      break
    case 'End':
      target = list[list.length - 1]
      break
    case 'ArrowRight':
    case 'ArrowLeft': {
      const opens = event.key === (isRtl.value ? 'ArrowLeft' : 'ArrowRight')
      if (!item?.children?.length) {
        if (!opens && inPanel) closeFlyout(true)
        break
      }
      if (props.condensed && !inPanel) {
        if (opens) {
          openFlyout(item, current)
          nextTick(() => focusables(panelEl.value)[0]?.focus())
        } else closeFlyout()
      } else if (opens !== openIds.value.has(key(item.id))) {
        toggle(item)
      }
      break
    }
    case 'Escape':
      if (flyoutId.value) closeFlyout(true)
      return
    default:
      return
  }
  event.preventDefault()
  target?.focus()
}

provide(TREE_MENU_KEY, {
  activeId: activeKey,
  activeBranch,
  condensed: computed(() => props.condensed),
  openIds: computed(() => openIds.value),
  flyoutId: computed(() => flyoutId.value),
  iconMap: computed(() => props.iconMap),
  defaultIcon: computed(() => props.defaultIcon),
  slots,
  toggle,
  select,
  openFlyout,
  toggleFlyout,
  scheduleCloseFlyout,
  cancelCloseFlyout,
} satisfies TreeMenuContext)
</script>
