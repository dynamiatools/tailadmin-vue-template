<template>
  <span :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-medium', colorClasses]">
    <component :is="icon" v-if="icon" class="h-3.5 w-3.5" />
    <span v-else-if="showDot" :class="['h-1.5 w-1.5 rounded-full', dotClasses]" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type StatusColor = 'success' | 'error' | 'warning' | 'info' | 'neutral'

interface StatusProps {
  label: string
  color?: StatusColor
  icon?: object
  showDot?: boolean
}

const props = withDefaults(defineProps<StatusProps>(), {
  color: 'neutral',
  icon: undefined,
  showDot: true,
})

const colorStyles: Record<StatusColor, { pill: string; dot: string }> = {
  success: {
    pill: 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500',
    dot: 'bg-success-500',
  },
  error: {
    pill: 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500',
    dot: 'bg-error-500',
  },
  warning: {
    pill: 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-orange-400',
    dot: 'bg-warning-500',
  },
  info: {
    pill: 'bg-blue-light-50 text-blue-light-500 dark:bg-blue-light-500/15 dark:text-blue-light-500',
    dot: 'bg-blue-light-500',
  },
  neutral: {
    pill: 'bg-gray-100 text-gray-700 dark:bg-white/5 dark:text-white/80',
    dot: 'bg-gray-400',
  },
}

const colorClasses = computed(() => colorStyles[props.color].pill)
const dotClasses = computed(() => colorStyles[props.color].dot)
</script>
