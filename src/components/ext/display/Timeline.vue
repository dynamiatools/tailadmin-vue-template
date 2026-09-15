<template>
  <ol>
    <li v-for="(item, index) in items" :key="item.id" class="relative pb-6 last:pb-0 ltr:pl-6 rtl:pr-6">
      <span
        v-if="index !== items.length - 1"
        class="absolute top-3 bottom-0 w-px bg-gray-200 dark:bg-gray-700 ltr:left-[5px] rtl:right-[5px]"
      />
      <span
        class="absolute top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-gray-900 ltr:left-0 rtl:right-0"
        :class="item.color ? colorClasses[item.color] : colorClasses.neutral"
      />

      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-medium text-gray-800 dark:text-white/90">
          <slot name="title" :item="item">{{ item.title }}</slot>
        </p>
        <time class="shrink-0 text-xs text-gray-400 dark:text-gray-500">{{ item.timestamp }}</time>
      </div>
      <p v-if="item.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        <slot name="description" :item="item">{{ item.description }}</slot>
      </p>
    </li>
  </ol>
</template>

<script setup lang="ts">
export interface TimelineItem {
  id: string | number
  title: string
  description?: string
  timestamp: string
  color?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
}

defineProps<{
  items: TimelineItem[]
}>()

const colorClasses: Record<NonNullable<TimelineItem['color']>, string> = {
  success: 'bg-success-500',
  error: 'bg-error-500',
  warning: 'bg-warning-500',
  info: 'bg-blue-light-500',
  neutral: 'bg-gray-400',
}
</script>
