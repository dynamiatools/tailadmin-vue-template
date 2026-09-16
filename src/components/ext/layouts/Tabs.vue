<template>
  <div>
    <div role="tablist" class="flex items-center gap-1 border-b border-gray-200 dark:border-gray-800">
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
        class="flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50"
        :class="
          modelValue === tab.id
            ? 'border-brand-500 text-brand-600 dark:text-brand-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
        "
        @click="select(tab)"
        @keydown="(event) => onKeydown(event, tab)"
      >
        <component :is="tab.icon" v-if="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
    </div>

    <div
      v-for="tab in tabs"
      :id="`panel-${tab.id}`"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="`tab-${tab.id}`"
      :hidden="modelValue !== tab.id"
      class="py-4"
    >
      <slot v-if="modelValue === tab.id" :name="`panel-${tab.id}`" :tab="tab">
        <slot :active="modelValue" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

export interface TabItem {
  id: string | number
  label: string
  icon?: object
  disabled?: boolean
}

interface TabsProps {
  tabs: TabItem[]
  modelValue: string | number
}

const props = defineProps<TabsProps>()

const emit = defineEmits<{
  'update:modelValue': [id: string | number]
}>()

const tabRefs = ref<HTMLButtonElement[]>([])

function select(tab: TabItem) {
  if (tab.disabled) return
  emit('update:modelValue', tab.id)
}

function onKeydown(event: KeyboardEvent, tab: TabItem) {
  if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
  event.preventDefault()
  const enabled = props.tabs.filter((t) => !t.disabled)
  const currentIndex = enabled.findIndex((t) => t.id === tab.id)
  const delta = event.key === 'ArrowRight' ? 1 : -1
  const next = enabled[(currentIndex + delta + enabled.length) % enabled.length]
  if (!next) return
  emit('update:modelValue', next.id)
  const index = props.tabs.findIndex((t) => t.id === next.id)
  tabRefs.value[index]?.focus()
}
</script>
