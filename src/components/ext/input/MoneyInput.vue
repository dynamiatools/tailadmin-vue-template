<template>
  <div>
    <label v-if="label" :for="inputId" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ label }}
    </label>
    <div class="relative">
      <span
        v-if="currencySymbol"
        class="absolute top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400 ltr:left-4 rtl:right-4"
      >
        {{ currencySymbol }}
      </span>
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        inputmode="decimal"
        :disabled="disabled"
        :placeholder="placeholder"
        :aria-invalid="invalid || undefined"
        :class="[
          'dark:bg-dark-900 h-11 w-full rounded-lg border bg-transparent py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:text-white/90 dark:placeholder:text-white/30',
          currencySymbol ? 'ltr:pl-10 rtl:pr-10 ltr:pr-4 rtl:pl-4' : 'px-4',
          invalid
            ? 'border-error-500 focus:border-error-300 focus:ring-error-500/10 dark:border-error-500'
            : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800',
          disabled ? 'cursor-not-allowed opacity-50' : '',
        ]"
        :value="displayValue"
        @input="onInput"
        @blur="onBlur"
        @focus="onFocus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

interface MoneyInputProps {
  modelValue?: number | null
  currency?: string
  locale?: string
  showCurrencySymbol?: boolean
  decimalPrecision?: number
  min?: number
  max?: number
  label?: string
  placeholder?: string
  disabled?: boolean
  invalid?: boolean
}

const props = withDefaults(defineProps<MoneyInputProps>(), {
  modelValue: null,
  currency: 'USD',
  locale: 'en-US',
  showCurrencySymbol: true,
  decimalPrecision: 2,
  min: undefined,
  max: undefined,
  label: '',
  placeholder: '0.00',
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputId = useId()
const inputRef = ref<HTMLInputElement | null>(null)
const isFocused = ref(false)

const numberFormatter = computed(
  () =>
    new Intl.NumberFormat(props.locale, {
      minimumFractionDigits: props.decimalPrecision,
      maximumFractionDigits: props.decimalPrecision,
    }),
)

const currencySymbol = computed(() => {
  if (!props.showCurrencySymbol) return ''
  try {
    const parts = new Intl.NumberFormat(props.locale, {
      style: 'currency',
      currency: props.currency,
    }).formatToParts(0)
    return parts.find((part) => part.type === 'currency')?.value ?? ''
  } catch {
    return ''
  }
})

const displayValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || Number.isNaN(props.modelValue)) {
    return ''
  }
  if (isFocused.value) return String(props.modelValue)
  return numberFormatter.value.format(props.modelValue)
})

function parseRawValue(raw: string): number | null {
  const normalized = raw.replace(/[^0-9.-]/g, '')
  if (normalized === '' || normalized === '-') return null
  const parsed = Number(normalized)
  return Number.isNaN(parsed) ? null : parsed
}

function clamp(value: number): number {
  let result = value
  if (props.min !== undefined) result = Math.max(props.min, result)
  if (props.max !== undefined) result = Math.min(props.max, result)
  return result
}

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const parsed = parseRawValue(raw)
  emit('update:modelValue', parsed === null ? null : parsed)
}

function onFocus() {
  isFocused.value = true
}

function onBlur() {
  isFocused.value = false
  if (props.modelValue !== null && props.modelValue !== undefined) {
    const rounded = Number(props.modelValue.toFixed(props.decimalPrecision))
    emit('update:modelValue', clamp(rounded))
  }
}

defineExpose({ inputRef })
</script>
