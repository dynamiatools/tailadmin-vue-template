<template>
  <div ref="rootRef" class="relative">
    <div class="relative">
      <input
        v-model="query"
        type="text"
        :disabled="disabled"
        :placeholder="placeholder"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        @focus="open = true"
        @input="onQueryInput"
      />
      <button
        v-if="modelValue && !disabled"
        type="button"
        class="absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ltr:right-4 rtl:left-4 dark:hover:text-gray-300"
        aria-label="Clear selection"
        @click="clear"
      >
        ✕
      </button>
    </div>

    <div
      v-if="open && (query.trim().length >= minChars || loading || error)"
      class="dark:bg-dark-900 absolute z-30 mt-1.5 w-full rounded-lg border border-gray-200 bg-white shadow-theme-lg dark:border-gray-700"
    >
      <div v-if="loading" class="px-4 py-3 text-sm text-gray-400">
        <slot name="loading">Searching…</slot>
      </div>
      <div v-else-if="error" class="text-error-600 dark:text-error-500 px-4 py-3 text-sm">
        <slot name="error">{{ error }}</slot>
      </div>
      <ul v-else class="max-h-60 overflow-y-auto py-1" role="listbox">
        <li v-if="results.length === 0" class="px-4 py-2 text-sm text-gray-400">
          <slot name="empty">No results found.</slot>
        </li>
        <li
          v-for="item in results"
          :key="valueOf(item as T) as PropertyKey"
          role="option"
          class="cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/[0.03]"
          @click="select(item as T)"
        >
          <slot name="item" :item="item">{{ labelOf(item as T) }}</slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface EntityAutocompleteProps {
  modelValue: T | null
  search: (query: string) => Promise<T[]>
  labelKey?: string
  valueKey?: string
  debounceMs?: number
  minChars?: number
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<EntityAutocompleteProps>(), {
  labelKey: 'label',
  valueKey: 'value',
  debounceMs: 300,
  minChars: 2,
  placeholder: 'Search…',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: T | null]
  select: [value: T]
}>()

const rootRef = ref<HTMLElement | null>(null)
const query = ref(props.modelValue ? labelOf(props.modelValue) : '')
const results = ref<T[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const open = ref(false)
let debounceTimer: ReturnType<typeof setTimeout> | undefined

function labelOf(item: T): string {
  return String(item[props.labelKey as keyof T] ?? '')
}

function valueOf(item: T): unknown {
  return item[props.valueKey as keyof T]
}

function onQueryInput() {
  if (props.modelValue) emit('update:modelValue', null)
  open.value = true

  if (debounceTimer) clearTimeout(debounceTimer)
  if (query.value.trim().length < props.minChars) {
    results.value = []
    return
  }
  debounceTimer = setTimeout(runSearch, props.debounceMs)
}

async function runSearch() {
  loading.value = true
  error.value = null
  try {
    results.value = await props.search(query.value.trim())
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Search failed'
    results.value = []
  } finally {
    loading.value = false
  }
}

function select(item: T) {
  emit('update:modelValue', item)
  emit('select', item)
  query.value = labelOf(item)
  open.value = false
}

function clear() {
  emit('update:modelValue', null)
  query.value = ''
  results.value = []
}

watch(
  () => props.modelValue,
  (value) => {
    query.value = value ? labelOf(value) : query.value
  },
)

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>
