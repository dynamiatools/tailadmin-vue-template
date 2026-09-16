<template>
  <div>
    <label v-if="label" :for="inputId" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ label }}
    </label>
    <div
      :class="[
        'flex h-11 w-full items-stretch overflow-hidden rounded-lg border bg-transparent shadow-theme-xs',
        disabled || readonly ? 'opacity-50' : '',
        'border-gray-300 dark:border-gray-700',
      ]"
    >
      <button
        type="button"
        class="flex w-11 shrink-0 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-white/[0.03]"
        :disabled="disabled || readonly || isAtMin"
        aria-label="Decrease quantity"
        @click="decrement"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.25 6.00012C2.25 5.58591 2.58579 5.25012 3 5.25012H9.00034C9.41455 5.25012 9.75034 5.58591 9.75034 6.00012C9.75034 6.41433 9.41455 6.75012 9.00034 6.75012H3C2.58579 6.75012 2.25 6.41433 2.25 6.00012Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <input
        :id="inputId"
        type="text"
        inputmode="decimal"
        :disabled="disabled"
        :readonly="readonly"
        class="dark:bg-gray-900 w-full border-x border-gray-300 bg-transparent px-2 py-2.5 text-center text-sm text-gray-800 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
        :value="modelValue"
        @input="onInput"
        @blur="onBlur"
      />
      <button
        type="button"
        class="flex w-11 shrink-0 items-center justify-center text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:text-gray-400 dark:hover:bg-white/[0.03]"
        :disabled="disabled || readonly || isAtMax"
        aria-label="Increase quantity"
        @click="increment"
      >
        <PlusIcon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import PlusIcon from '../../../icons/PlusIcon.vue'

interface QuantityInputProps {
  modelValue: number
  min?: number
  max?: number
  step?: number
  allowDecimal?: boolean
  disabled?: boolean
  readonly?: boolean
  label?: string
}

const props = withDefaults(defineProps<QuantityInputProps>(), {
  min: 0,
  max: undefined,
  step: 1,
  allowDecimal: false,
  disabled: false,
  readonly: false,
  label: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const inputId = useId()

const isAtMin = computed(() => props.modelValue <= props.min)
const isAtMax = computed(() => props.max !== undefined && props.modelValue >= props.max)

function clamp(value: number): number {
  let result = value
  if (props.min !== undefined) result = Math.max(props.min, result)
  if (props.max !== undefined) result = Math.min(props.max, result)
  return props.allowDecimal ? result : Math.round(result)
}

function increment() {
  if (props.disabled || props.readonly || isAtMax.value) return
  emit('update:modelValue', clamp(props.modelValue + props.step))
}

function decrement() {
  if (props.disabled || props.readonly || isAtMin.value) return
  emit('update:modelValue', clamp(props.modelValue - props.step))
}

function onInput(event: Event) {
  const raw = (event.target as HTMLInputElement).value
  const pattern = props.allowDecimal ? /[^0-9.-]/g : /[^0-9-]/g
  const normalized = raw.replace(pattern, '')
  if (normalized === '' || normalized === '-') return
  const parsed = Number(normalized)
  if (!Number.isNaN(parsed)) {
    emit('update:modelValue', parsed)
  }
}

function onBlur() {
  emit('update:modelValue', clamp(props.modelValue))
}
</script>
