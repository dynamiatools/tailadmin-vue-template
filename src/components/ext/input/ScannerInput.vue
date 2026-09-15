<template>
  <div>
    <label v-if="label" :for="inputId" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="inputId"
        ref="inputRef"
        type="text"
        :disabled="disabled"
        :placeholder="placeholder"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
        :value="modelValue"
        @input="onInput"
        @keydown="onKeydown"
        @blur="onBlur"
      />
      <span
        v-if="listening"
        class="absolute top-1/2 -translate-y-1/2 text-xs text-success-600 dark:text-success-500 ltr:right-4 rtl:left-4"
      >
        listening…
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useId } from 'vue'

interface ScannerInputProps {
  modelValue?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  autoFocus?: boolean
  clearOnScan?: boolean
  refocusAfterScan?: boolean
  /** Max ms between keystrokes to still be treated as a scanner burst. */
  scanIntervalMs?: number
  /** Min characters required before Enter is treated as a completed scan. */
  minLength?: number
}

const props = withDefaults(defineProps<ScannerInputProps>(), {
  modelValue: '',
  label: '',
  placeholder: 'Scan or type a code…',
  disabled: false,
  autoFocus: true,
  clearOnScan: true,
  refocusAfterScan: true,
  scanIntervalMs: 50,
  minLength: 1,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  scan: [value: string]
}>()

const inputId = useId()
const inputRef = ref<HTMLInputElement | null>(null)
const listening = ref(false)
let lastKeyTime = 0

onMounted(() => {
  if (props.autoFocus) inputRef.value?.focus()
})

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function onKeydown(event: KeyboardEvent) {
  const now = performance.now()
  const delta = now - lastKeyTime
  lastKeyTime = now
  listening.value = delta < props.scanIntervalMs

  if (event.key === 'Enter') {
    event.preventDefault()
    const value = props.modelValue.trim()
    listening.value = false
    if (value.length >= props.minLength) {
      emit('scan', value)
      if (props.clearOnScan) emit('update:modelValue', '')
    }
    if (props.refocusAfterScan) inputRef.value?.focus()
  }
}

function onBlur() {
  listening.value = false
}

defineExpose({ focus: () => inputRef.value?.focus() })
</script>
