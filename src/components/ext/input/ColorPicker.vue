<template>
  <div>
    <label v-if="label" :for="inputId" class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
      {{ label }}
    </label>
    <div class="flex items-center gap-3">
      <label
        :for="inputId"
        class="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700"
        :style="{ backgroundColor: modelValue }"
      >
        <input
          :id="inputId"
          type="color"
          :disabled="disabled"
          class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          :value="modelValue"
          @input="onColorInput"
        />
      </label>

      <input
        v-if="showTextInput"
        type="text"
        :disabled="disabled"
        class="dark:bg-dark-900 h-11 w-32 rounded-lg border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 shadow-theme-xs uppercase focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
        :value="modelValue"
        @change="onTextInput"
      />
    </div>

    <div v-if="presets.length" class="mt-3 flex flex-wrap gap-2">
      <button
        v-for="preset in presets"
        :key="preset"
        type="button"
        :disabled="disabled"
        class="h-6 w-6 rounded-full border border-gray-300 dark:border-gray-700"
        :class="{ 'ring-brand-500 ring-2 ring-offset-2 dark:ring-offset-gray-900': isSelected(preset) }"
        :style="{ backgroundColor: preset }"
        :aria-label="preset"
        @click="select(preset)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'

interface ColorPickerProps {
  modelValue: string
  label?: string
  presets?: string[]
  showTextInput?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ColorPickerProps>(), {
  label: '',
  presets: () => [],
  showTextInput: true,
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = useId()
const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function isSelected(preset: string): boolean {
  return preset.toLowerCase() === props.modelValue.toLowerCase()
}

function select(color: string) {
  if (props.disabled) return
  emit('update:modelValue', color)
}

function onColorInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function onTextInput(event: Event) {
  const value = (event.target as HTMLInputElement).value.trim()
  if (HEX_COLOR.test(value)) {
    emit('update:modelValue', value)
  }
}
</script>
