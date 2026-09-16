<template>
  <div class="w-full max-w-xs select-none">
    <div
      class="dark:bg-gray-900 mb-3 h-12 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-right text-lg text-gray-800 dark:border-gray-700 dark:text-white/90"
    >
      {{ modelValue || placeholder }}
    </div>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="key in keys"
        :key="key"
        type="button"
        :disabled="disabled"
        class="dark:bg-gray-900 flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-lg font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:hover:bg-white/[0.03]"
        @click="pressKey(key)"
      >
        {{ key }}
      </button>
      <button
        type="button"
        :disabled="disabled || !allowDecimal"
        class="dark:bg-gray-900 flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-lg font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:hover:bg-white/[0.03]"
        @click="pressKey('.')"
      >
        .
      </button>
      <button
        type="button"
        :disabled="disabled"
        class="dark:bg-gray-900 flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-lg font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:hover:bg-white/[0.03]"
        @click="pressKey('0')"
      >
        0
      </button>
      <button
        type="button"
        :disabled="disabled || modelValue.length === 0"
        class="dark:bg-gray-900 flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:hover:bg-white/[0.03]"
        aria-label="Backspace"
        @click="backspace"
      >
        ⌫
      </button>
    </div>
    <div :class="['mt-2 grid gap-2', allowNegative ? 'grid-cols-3' : 'grid-cols-2']">
      <button
        type="button"
        :disabled="disabled || modelValue.length === 0"
        class="flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        @click="clear"
      >
        Clear
      </button>
      <button
        v-if="allowNegative"
        type="button"
        :disabled="disabled"
        class="flex h-11 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        aria-label="Toggle sign"
        @click="toggleSign"
      >
        +/-
      </button>
      <button
        type="button"
        :disabled="disabled || modelValue.length === 0"
        class="bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 flex h-11 items-center justify-center rounded-lg text-sm font-medium text-white disabled:cursor-not-allowed"
        @click="submit"
      >
        Enter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface NumericKeypadProps {
  modelValue: string
  allowDecimal?: boolean
  allowNegative?: boolean
  maxLength?: number
  disabled?: boolean
  placeholder?: string
}

const props = withDefaults(defineProps<NumericKeypadProps>(), {
  allowDecimal: true,
  allowNegative: false,
  maxLength: undefined,
  disabled: false,
  placeholder: '0',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [value: string]
  clear: []
}>()

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function pressKey(key: string) {
  if (props.disabled) return
  if (key === '.' && (!props.allowDecimal || props.modelValue.includes('.'))) return
  if (props.maxLength !== undefined && props.modelValue.length >= props.maxLength) return
  emit('update:modelValue', props.modelValue + key)
}

function backspace() {
  if (props.disabled || props.modelValue.length === 0) return
  emit('update:modelValue', props.modelValue.slice(0, -1))
}

function clear() {
  if (props.disabled) return
  emit('update:modelValue', '')
  emit('clear')
}

function submit() {
  if (props.disabled) return
  emit('submit', props.modelValue)
}

function toggleSign() {
  if (props.disabled) return
  emit('update:modelValue', props.modelValue.startsWith('-') ? props.modelValue.slice(1) : `-${props.modelValue}`)
}
</script>
