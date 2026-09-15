<template>
  <div
    class="grid gap-3"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
    role="listbox"
    :aria-multiselectable="multiple"
  >
    <button
      v-for="item in items"
      :key="valueOf(item) as PropertyKey"
      type="button"
      role="option"
      :aria-selected="isSelected(item)"
      :disabled="disabled"
      class="dark:bg-dark-900 flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition disabled:cursor-not-allowed disabled:opacity-50"
      :class="
        isSelected(item)
          ? 'border-brand-500 ring-brand-500/20 bg-brand-50 ring-2 dark:bg-brand-500/10'
          : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
      "
      @click="select(item)"
    >
      <slot name="item" :item="item" :selected="isSelected(item)">
        <img
          v-if="imageKey && imageOf(item)"
          :src="imageOf(item)"
          :alt="labelOf(item)"
          class="h-12 w-12 rounded-md object-cover"
        />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ labelOf(item) }}</span>
      </slot>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
interface ItemSelectorProps {
  items: T[]
  modelValue: unknown
  multiple?: boolean
  labelKey?: string
  valueKey?: string
  imageKey?: string
  columns?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<ItemSelectorProps>(), {
  multiple: false,
  labelKey: 'label',
  valueKey: 'value',
  imageKey: undefined,
  columns: 3,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
}>()

function labelOf(item: T): string {
  return String(item[props.labelKey as keyof T] ?? '')
}

function valueOf(item: T): unknown {
  return item[props.valueKey as keyof T]
}

function imageOf(item: T): string {
  return props.imageKey ? String(item[props.imageKey as keyof T] ?? '') : ''
}

function isSelected(item: T): boolean {
  const value = valueOf(item)
  return props.multiple
    ? Array.isArray(props.modelValue) && (props.modelValue as unknown[]).includes(value)
    : props.modelValue === value
}

function select(item: T) {
  const value = valueOf(item)
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : []
    const index = current.indexOf(value)
    if (index >= 0) current.splice(index, 1)
    else current.push(value)
    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', isSelected(item) ? null : value)
  }
}
</script>
