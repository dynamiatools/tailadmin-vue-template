<template>
  <div ref="rootRef" class="relative">
    <button
      type="button"
      :disabled="disabled"
      class="dark:bg-dark-900 flex h-11 w-full items-center justify-between rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-left text-sm text-gray-800 shadow-theme-xs disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90"
      @click="open = !open"
    >
      <span :class="selectedLabels ? '' : 'text-gray-400 dark:text-white/30'">
        {{ selectedLabels || placeholder }}
      </span>
      <ChevronDownIcon :class="['text-gray-500 transition-transform dark:text-gray-400', open ? 'rotate-180' : '']" />
    </button>

    <div
      v-if="open"
      class="dark:bg-dark-900 absolute z-30 mt-1.5 w-full rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-700"
    >
      <div v-if="searchable" class="border-b border-gray-100 p-2 dark:border-gray-800">
        <input
          v-model="query"
          type="text"
          :placeholder="searchPlaceholder"
          class="h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm text-gray-800 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
          @click.stop
        />
      </div>
      <ul class="max-h-60 overflow-y-auto py-1" role="listbox">
        <li v-if="filteredItems.length === 0" class="px-4 py-2 text-sm text-gray-400">
          <slot name="empty">No results found.</slot>
        </li>
        <li
          v-for="item in filteredItems"
          :key="valueOf(item) as PropertyKey"
          role="option"
          :aria-selected="isSelected(item)"
          class="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-white/[0.03]"
          :class="isSelected(item) ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'"
          @click="selectItem(item)"
        >
          <slot name="item" :item="item">{{ labelOf(item) }}</slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import ChevronDownIcon from '../../../icons/ChevronDownIcon.vue'

interface EntitySelectorProps {
  items: T[]
  modelValue: unknown
  multiple?: boolean
  labelKey?: string
  valueKey?: string
  searchable?: boolean
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<EntitySelectorProps>(), {
  multiple: false,
  labelKey: 'label',
  valueKey: 'value',
  searchable: true,
  placeholder: 'Select…',
  searchPlaceholder: 'Search…',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

const rootRef = ref<HTMLElement | null>(null)
const open = ref(false)
const query = ref('')

function labelOf(item: T): string {
  return String(item[props.labelKey as keyof T] ?? '')
}

function valueOf(item: T): unknown {
  return item[props.valueKey as keyof T]
}

const filteredItems = computed(() => {
  if (!props.searchable || !query.value.trim()) return props.items
  const needle = query.value.trim().toLowerCase()
  return props.items.filter((item) => labelOf(item).toLowerCase().includes(needle))
})

function isSelected(item: T): boolean {
  const value = valueOf(item)
  return props.multiple
    ? Array.isArray(props.modelValue) && (props.modelValue as unknown[]).includes(value)
    : props.modelValue === value
}

function selectItem(item: T) {
  const value = valueOf(item)
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : []
    const index = current.indexOf(value)
    if (index >= 0) current.splice(index, 1)
    else current.push(value)
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', value)
    open.value = false
  }
}

const selectedLabels = computed(() => {
  if (props.multiple) {
    const selected = props.items.filter((item) => isSelected(item))
    return selected.map((item) => labelOf(item)).join(', ')
  }
  const match = props.items.find((item) => valueOf(item) === props.modelValue)
  return match ? labelOf(match) : ''
})

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>
