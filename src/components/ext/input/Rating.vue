<template>
  <div
    class="inline-flex items-center gap-1"
    role="radiogroup"
    :aria-label="ariaLabel"
    @mouseleave="hoverValue = null"
  >
    <button
      v-for="item in max"
      :key="item"
      type="button"
      :disabled="readonly"
      role="radio"
      :aria-checked="item <= modelValue"
      :aria-label="`${item} of ${max}`"
      class="disabled:cursor-default"
      :class="readonly ? '' : 'cursor-pointer'"
      @click="select(item)"
      @mouseenter="!readonly && (hoverValue = item)"
    >
      <svg
        :width="sizeMap[size]"
        :height="sizeMap[size]"
        viewBox="0 0 20 20"
        :fill="fillFor(item) ? 'currentColor' : 'none'"
        :class="fillFor(item) ? 'text-warning-500' : 'text-gray-300 dark:text-gray-700'"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85L10 1.5z"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface RatingProps {
  modelValue: number
  max?: number
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}

const props = withDefaults(defineProps<RatingProps>(), {
  max: 5,
  readonly: false,
  size: 'md',
  ariaLabel: 'Rating',
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const sizeMap = { sm: 16, md: 20, lg: 28 }
const hoverValue = ref<number | null>(null)

function fillFor(item: number): boolean {
  return item <= (hoverValue.value ?? props.modelValue)
}

function select(item: number) {
  if (props.readonly) return
  emit('update:modelValue', item === props.modelValue ? 0 : item)
}
</script>
