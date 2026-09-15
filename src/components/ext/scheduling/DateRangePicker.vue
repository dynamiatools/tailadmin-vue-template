<template>
  <div>
    <label v-if="label" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ label }}
    </label>
    <div v-if="presets.length" class="mb-2 flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset.label"
        type="button"
        class="rounded-lg border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        @click="applyPreset(preset)"
      >
        {{ preset.label }}
      </button>
    </div>
    <div class="relative">
      <flatPickr
        v-model="rangeText"
        :config="flatpickrConfig"
        :placeholder="placeholder"
        :disabled="disabled"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import flatPickr from 'vue-flatpickr-component'

export interface DateRangePreset {
  label: string
  range: [Date, Date]
}

interface DateRangePickerProps {
  modelValue: [string, string] | null
  label?: string
  placeholder?: string
  minDate?: string | Date
  maxDate?: string | Date
  disabledDates?: (string | Date)[]
  presets?: DateRangePreset[]
  dateFormat?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<DateRangePickerProps>(), {
  label: '',
  placeholder: 'Select a date range',
  minDate: undefined,
  maxDate: undefined,
  disabledDates: () => [],
  presets: () => [],
  dateFormat: 'Y-m-d',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: [string, string] | null]
}>()

const flatpickrConfig = computed(() => ({
  mode: 'range' as const,
  dateFormat: props.dateFormat,
  minDate: props.minDate,
  maxDate: props.maxDate,
  disable: props.disabledDates,
  onChange: (selectedDates: Date[]) => {
    if (selectedDates.length === 2) {
      emit('update:modelValue', [format(selectedDates[0]), format(selectedDates[1])])
    } else if (selectedDates.length === 0) {
      emit('update:modelValue', null)
    }
  },
}))

const rangeText = computed({
  get: () => (props.modelValue ? props.modelValue.join(' to ') : ''),
  set: () => {
    // flatpickr drives changes through onChange; this setter only exists to
    // satisfy vue-flatpickr-component's v-model contract.
  },
})

function format(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function applyPreset(preset: DateRangePreset) {
  emit('update:modelValue', [format(preset.range[0]), format(preset.range[1])])
}
</script>
