<template>
  <div :class="rootClasses">
    <div
      role="tablist"
      :aria-orientation="isVertical ? 'vertical' : 'horizontal'"
      :class="[
        isVertical ? 'flex shrink-0 flex-col gap-1' : 'flex items-center gap-1',
        position === 'top' ? 'border-b border-gray-200 dark:border-gray-800' : '',
        position === 'bottom' ? 'border-t border-gray-200 dark:border-gray-800' : '',
        position === 'left' ? 'border-r border-gray-200 pr-1 dark:border-gray-800' : '',
        position === 'right' ? 'order-2 border-l border-gray-200 pl-1 dark:border-gray-800' : '',
      ]"
    >
      <button
        v-for="tab in tabs"
        :id="`tab-${tab.id}`"
        :key="tab.id"
        ref="tabRefs"
        role="tab"
        type="button"
        :aria-selected="modelValue === tab.id"
        :aria-controls="`panel-${tab.id}`"
        :tabindex="modelValue === tab.id ? 0 : -1"
        :disabled="tab.disabled"
        class="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
        :class="tabClasses(tab)"
        @click="select(tab)"
        @keydown="(event) => onKeydown(event, tab)"
      >
        <component :is="tab.icon" v-if="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
    </div>

    <div :class="isVertical ? 'min-w-0 flex-1' : ''">
      <div
        v-for="tab in tabs"
        :id="`panel-${tab.id}`"
        :key="tab.id"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.id}`"
        :hidden="modelValue !== tab.id"
        class="py-4"
        :class="isVertical ? 'py-0' : ''"
      >
        <slot v-if="modelValue === tab.id" :name="`panel-${tab.id}`" :tab="tab">
          <slot :active="modelValue" />
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface TabItem {
  id: string | number
  label: string
  icon?: object
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  modelValue: string | number
  /** Where the tab bar sits relative to the panels. top/bottom => horizontal tabs, left/right => vertical tabs. */
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<TabsProps>(), {
  position: 'top',
})

const emit = defineEmits<{
  'update:modelValue': [id: string | number]
}>()

const tabRefs = ref<HTMLButtonElement[]>([])
const isVertical = computed(() => props.position === 'left' || props.position === 'right')
const rootClasses = computed(() => {
  if (isVertical.value) return 'flex gap-4'
  return props.position === 'bottom' ? 'flex flex-col-reverse' : 'flex flex-col'
})

function tabClasses(tab: TabItem): string {
  const active = props.modelValue === tab.id
  if (isVertical.value) {
    const side = props.position === 'left' ? 'border-r' : 'border-l'
    return active
      ? `${side}-2 border-brand-500 text-brand-600 dark:text-brand-400`
      : `${side}-2 border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300`
  }
  const side = props.position === 'bottom' ? 'border-t-2' : 'border-b-2'
  return active
    ? `${side} border-brand-500 text-brand-600 dark:text-brand-400`
    : `${side} border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300`
}

function select(tab: TabItem) {
  if (tab.disabled) return
  emit('update:modelValue', tab.id)
}

function onKeydown(event: KeyboardEvent, tab: TabItem) {
  const nextKey = isVertical.value ? 'ArrowDown' : 'ArrowRight'
  const prevKey = isVertical.value ? 'ArrowUp' : 'ArrowLeft'
  if (event.key !== nextKey && event.key !== prevKey) return
  event.preventDefault()

  const enabled = props.tabs.filter((t) => !t.disabled)
  const currentIndex = enabled.findIndex((t) => t.id === tab.id)
  const delta = event.key === nextKey ? 1 : -1
  const next = enabled[(currentIndex + delta + enabled.length) % enabled.length]
  if (!next) return
  emit('update:modelValue', next.id)
  const index = props.tabs.findIndex((t) => t.id === next.id)
  tabRefs.value[index]?.focus()
}
</script>
