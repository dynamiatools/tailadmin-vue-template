<template>
  <div class="grid gap-2" :style="{ gridTemplateColumns: `repeat(auto-fill, minmax(${minCellWidth}px, 1fr))` }">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :disabled="item.status === 'unavailable'"
      class="dark:bg-gray-900 flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border p-2 text-center text-xs font-medium transition disabled:cursor-not-allowed"
      :class="cellClasses(item)"
      @click="select(item)"
    >
      <slot :item="item" :selected="isSelected(item)">
        {{ item.label }}
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface SelectionGridItem {
  id: string | number
  label: string
  status?: 'available' | 'unavailable'
  [key: string]: unknown
}

interface SelectionGridProps {
  items: SelectionGridItem[]
  modelValue: (string | number)[]
  multiple?: boolean
  minCellWidth?: number
}

const props = withDefaults(defineProps<SelectionGridProps>(), {
  multiple: false,
  minCellWidth: 90,
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[]]
}>()

function isSelected(item: SelectionGridItem): boolean {
  return props.modelValue.includes(item.id)
}

function cellClasses(item: SelectionGridItem): string {
  if (item.status === 'unavailable') {
    return 'border-gray-200 bg-gray-50 text-gray-300 dark:border-gray-800 dark:bg-white/[0.02] dark:text-gray-700'
  }
  if (isSelected(item)) {
    return 'border-brand-500 bg-brand-50 text-brand-600 ring-brand-500/20 ring-2 dark:bg-brand-500/10 dark:text-brand-400'
  }
  return 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
}

function select(item: SelectionGridItem) {
  if (item.status === 'unavailable') return

  if (props.multiple) {
    const next = isSelected(item)
      ? props.modelValue.filter((id) => id !== item.id)
      : [...props.modelValue, item.id]
    emit('update:modelValue', next)
  } else {
    emit('update:modelValue', isSelected(item) ? [] : [item.id])
  }
}
</script>
