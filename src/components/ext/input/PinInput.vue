<template>
  <div class="flex gap-2" @paste="onPaste">
    <input
      v-for="(_, index) in length"
      :key="index"
      ref="inputRefs"
      :type="mask ? 'password' : type === 'numeric' ? 'tel' : 'text'"
      :inputmode="type === 'numeric' ? 'numeric' : 'text'"
      maxlength="1"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :class="[
        'dark:bg-gray-900 h-12 w-11 rounded-lg border bg-transparent text-center text-lg text-gray-800 shadow-theme-xs focus:outline-hidden focus:ring-3 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white/90',
        invalid
          ? 'border-error-500 focus:border-error-300 focus:ring-error-500/10 dark:border-error-500'
          : 'border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:focus:border-brand-800',
      ]"
      :value="digits[index] ?? ''"
      @input="(event) => onInput(index, event)"
      @keydown="(event) => onKeydown(index, event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface PinInputProps {
  modelValue: string
  length?: number
  type?: 'numeric' | 'alphanumeric'
  mask?: boolean
  disabled?: boolean
  invalid?: boolean
}

const props = withDefaults(defineProps<PinInputProps>(), {
  length: 6,
  type: 'numeric',
  mask: false,
  disabled: false,
  invalid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

const inputRefs = ref<HTMLInputElement[]>([])
const digits = computed(() => props.modelValue.split(''))

function sanitize(char: string): string {
  const numericOnly = /[0-9]/
  const alphanumeric = /[a-z0-9]/i
  const pattern = props.type === 'numeric' ? numericOnly : alphanumeric
  return pattern.test(char) ? char : ''
}

function setDigit(index: number, char: string) {
  const next = props.modelValue.split('')
  next[index] = char
  const value = next.join('').slice(0, props.length)
  emit('update:modelValue', value)
  if (value.length === props.length) emit('complete', value)
}

function onInput(index: number, event: Event) {
  const target = event.target as HTMLInputElement
  const char = sanitize(target.value.slice(-1))
  target.value = digits.value[index] ?? ''

  if (!char) return
  setDigit(index, char)
  if (index < props.length - 1) inputRefs.value[index + 1]?.focus()
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  } else if (event.key === 'ArrowRight' && index < props.length - 1) {
    inputRefs.value[index + 1]?.focus()
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') ?? ''
  const value = pasted
    .split('')
    .map(sanitize)
    .join('')
    .slice(0, props.length)
  emit('update:modelValue', value)
  if (value.length === props.length) emit('complete', value)
  inputRefs.value[Math.min(value.length, props.length - 1)]?.focus()
}
</script>
