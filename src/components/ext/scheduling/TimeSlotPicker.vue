<template>
  <div
    class="grid gap-2"
    :style="{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }"
    role="radiogroup"
  >
    <button
      v-for="slot in slots"
      :key="slot.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === slot.value"
      :disabled="disabled || slot.available === false"
      class="dark:bg-gray-900 rounded-lg border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40"
      :class="
        modelValue === slot.value
          ? 'border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400'
          : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-300 dark:hover:border-gray-600'
      "
      @click="select(slot)"
    >
      <slot name="default" :option="slot">{{ slot.label }}</slot>
    </button>
  </div>
</template>

<script setup lang="ts">
export interface TimeSlotOption {
  value: string
  label: string
  available?: boolean
}

interface TimeSlotPickerProps {
  slots: TimeSlotOption[]
  modelValue: string | null
  columns?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<TimeSlotPickerProps>(), {
  columns: 4,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

function select(slot: TimeSlotOption) {
  if (props.disabled || slot.available === false) return
  emit('update:modelValue', props.modelValue === slot.value ? null : slot.value)
}
</script>
