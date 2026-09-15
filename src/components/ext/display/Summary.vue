<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
    <div v-if="icon" class="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
      <component :is="icon" class="fill-gray-800 dark:fill-white/90" width="24" height="24" />
    </div>

    <div class="mt-5 flex items-end justify-between">
      <div>
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ label }}</span>
        <h4 class="mt-2 text-title-sm font-bold text-gray-800 dark:text-white/90">{{ value }}</h4>
        <p v-if="description" class="mt-1 text-sm text-gray-400 dark:text-gray-500">{{ description }}</p>
      </div>

      <span
        v-if="trend"
        class="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-medium"
        :class="
          trend.direction === 'up'
            ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
            : 'bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500'
        "
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="trend.direction === 'down' ? 'rotate-180' : ''"
        >
          <path
            d="M6 1.5L10.5 6.75H7.5V10.5H4.5V6.75H1.5L6 1.5Z"
            fill="currentColor"
          />
        </svg>
        {{ trend.value }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface SummaryTrend {
  direction: 'up' | 'down'
  value: string
}

interface SummaryProps {
  label: string
  value: string | number
  description?: string
  icon?: object
  trend?: SummaryTrend
}

withDefaults(defineProps<SummaryProps>(), {
  description: '',
  icon: undefined,
  trend: undefined,
})
</script>
