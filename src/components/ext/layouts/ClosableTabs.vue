<template>
  <div class="flex min-w-0 flex-col">
    <div class="flex items-stretch border-b border-gray-200 dark:border-gray-800">
      <div
        ref="listEl"
        role="tablist"
        aria-orientation="horizontal"
        class="no-scrollbar flex min-w-0 flex-1 items-stretch gap-1 overflow-x-auto"
      >
        <div
          v-for="tab in tabs"
          :key="tab.id"
          role="presentation"
          class="flex shrink-0 items-center border-b-2 transition"
          :class="
            modelValue === tab.id
              ? 'border-brand-500 text-brand-600 dark:text-brand-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          "
        >
          <button
            :id="`${uid}-tab-${tab.id}`"
            role="tab"
            type="button"
            :title="tab.title"
            :aria-selected="modelValue === tab.id"
            :aria-controls="`${uid}-panel-${tab.id}`"
            :tabindex="modelValue === tab.id ? 0 : -1"
            :disabled="tab.disabled"
            class="flex items-center gap-1.5 py-2.5 ps-3 text-sm font-medium whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50"
            :class="isClosable(tab) ? 'pe-1' : 'pe-3'"
            @click="select(tab)"
            @keydown="onKeydown($event, tab)"
            @mousedown.middle.prevent
            @auxclick.middle="onMiddleClick(tab)"
          >
            <slot name="tab-label" :tab="tab" :active="modelValue === tab.id">
              <component :is="tab.icon" v-if="tab.icon" class="h-4 w-4 shrink-0" />
              {{ tab.label }}
            </slot>
          </button>
          <!-- Not a tab stop: keyboard users close the focused tab with Delete. -->
          <button
            v-if="isClosable(tab)"
            type="button"
            tabindex="-1"
            class="me-1 ms-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-500 dark:hover:bg-white/10 dark:hover:text-gray-300"
            :aria-label="`${closeLabel} ${tab.label}`"
            @click.stop="close(tab)"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-1 ps-2">
        <slot name="actions" />
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <template v-for="tab in tabs" :key="tab.id">
        <div
          v-if="isMounted(tab.id)"
          v-show="modelValue === tab.id"
          :id="`${uid}-panel-${tab.id}`"
          role="tabpanel"
          :aria-labelledby="`${uid}-tab-${tab.id}`"
          class="py-4"
        >
          <slot :name="`panel-${tab.id}`" :tab="tab" :active="modelValue === tab.id">
            <slot :tab="tab" :active="modelValue === tab.id" />
          </slot>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, useId, watch } from 'vue'
import { useRTL } from '../../../composables/useRTL'

export interface ClosableTabItem {
  id: string | number
  label: string
  icon?: object
  /** Defaults to true. */
  closable?: boolean
  disabled?: boolean
  /** Native tooltip, e.g. the full title of a truncated label. */
  title?: string
}

interface ClosableTabsProps {
  tabs: ClosableTabItem[]
  /** Id of the active tab. */
  modelValue: string | number
  /**
   * Keep visited panels mounted (hidden) so their state survives switching tabs. When false,
   * only the active panel is mounted.
   */
  keepAlive?: boolean
  /** With `keepAlive`, the most panels kept mounted at once; the least recently active are unmounted first. */
  max?: number
  /** Prefix of the close buttons' accessible name ("Close <label>"). */
  closeLabel?: string
}

const props = withDefaults(defineProps<ClosableTabsProps>(), {
  keepAlive: true,
  max: undefined,
  closeLabel: 'Close',
})

const emit = defineEmits<{
  'update:modelValue': [id: string | number]
  /** The user asked to close a tab (× button, middle click or Delete). The parent removes it and picks the next active tab. */
  close: [id: string | number]
}>()

const uid = useId()
const { isRtl } = useRTL()
const listEl = ref<HTMLElement | null>(null)

const isClosable = (tab: ClosableTabItem) => tab.closable !== false

// --- panels kept mounted, least recently active first --------------------------------------

const order = ref<Array<string | number>>([])

function touch(id: string | number) {
  const next = [...order.value.filter((existing) => existing !== id), id]
  order.value = props.max && props.max > 0 ? next.slice(-props.max) : next
}

watch(
  () => props.modelValue,
  (id) => {
    if (props.tabs.some((tab) => tab.id === id)) touch(id)
    nextTick(() => listEl.value?.querySelector<HTMLElement>('[aria-selected="true"]')?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' }))
  },
  { immediate: true },
)

watch(
  () => props.tabs,
  (tabs) => {
    // If keyboard/mouse focus is inside the strip and its element disappears (the parent removed
    // that tab, now or after a confirmation), hand focus to the tab that took its place instead
    // of dropping it on <body>. Runs before the DOM patch, so the old DOM is still readable.
    const strip = listEl.value
    if (strip && strip.contains(document.activeElement)) {
      const position = Array.from(strip.children).findIndex((child) => child.contains(document.activeElement))
      nextTick(() => {
        if (!strip.contains(document.activeElement)) focusTab(Math.min(position, tabs.length - 1))
      })
    }

    const ids = new Set(tabs.map((tab) => tab.id))
    order.value = order.value.filter((id) => ids.has(id))
    if (ids.has(props.modelValue) && !order.value.includes(props.modelValue)) touch(props.modelValue)
  },
)

const isMounted = (id: string | number) => (props.keepAlive ? order.value.includes(id) : id === props.modelValue)

// --- interaction ---------------------------------------------------------------------------

function select(tab: ClosableTabItem) {
  if (!tab.disabled && tab.id !== props.modelValue) emit('update:modelValue', tab.id)
}

function close(tab: ClosableTabItem) {
  if (isClosable(tab)) emit('close', tab.id)
}

function onMiddleClick(tab: ClosableTabItem) {
  close(tab)
}

// DOM order equals `tabs` order (a v-for ref array does not guarantee that).
function focusTab(index: number) {
  listEl.value?.querySelectorAll<HTMLElement>('[role="tab"]')[index]?.focus()
}

function onKeydown(event: KeyboardEvent, tab: ClosableTabItem) {
  if (event.key === 'Delete' && isClosable(tab)) {
    event.preventDefault()
    close(tab) // focus is re-homed by the `tabs` watcher once the parent removes it
    return
  }

  const next = isRtl.value ? 'ArrowLeft' : 'ArrowRight'
  const prev = isRtl.value ? 'ArrowRight' : 'ArrowLeft'
  if (![next, prev, 'Home', 'End'].includes(event.key)) return
  event.preventDefault()

  const enabled = props.tabs.filter((t) => !t.disabled)
  const current = enabled.findIndex((t) => t.id === tab.id)
  let target: ClosableTabItem | undefined
  if (event.key === 'Home') target = enabled[0]
  else if (event.key === 'End') target = enabled[enabled.length - 1]
  else target = enabled[(current + (event.key === next ? 1 : -1) + enabled.length) % enabled.length]
  if (!target) return

  emit('update:modelValue', target.id)
  focusTab(props.tabs.findIndex((t) => t.id === target.id))
}
</script>
