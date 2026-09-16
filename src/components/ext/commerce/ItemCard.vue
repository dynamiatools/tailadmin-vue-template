<template>
  <div
    class="dark:bg-gray-900 group flex flex-col overflow-hidden rounded-xl border bg-white transition"
    :class="[
      selected
        ? 'border-brand-500 ring-brand-500/20 ring-2'
        : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700',
      disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
    ]"
    @click="!disabled && emit('click')"
  >
    <slot name="image">
      <div class="aspect-square w-full bg-gray-100 dark:bg-white/5">
        <img v-if="image" :src="image" :alt="title" class="h-full w-full object-cover" />
      </div>
    </slot>

    <div class="flex flex-1 flex-col gap-1.5 p-3">
      <slot name="badge">
        <Status v-if="badge" :label="badge" :color="badgeColor" class="self-start" />
      </slot>

      <slot name="title">
        <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">{{ title }}</p>
      </slot>
      <p v-if="subtitle" class="truncate text-xs text-gray-400 dark:text-gray-500">{{ subtitle }}</p>

      <div class="mt-auto flex items-center justify-between gap-2 pt-1.5">
        <slot name="price">
          <span v-if="price !== undefined" class="text-sm font-semibold text-gray-800 dark:text-white/90">
            {{ formattedPrice }}
          </span>
        </slot>
        <div class="flex items-center gap-2" @click.stop>
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Status from '../display/Status.vue'

interface ItemCardProps {
  title: string
  subtitle?: string
  image?: string
  price?: number
  currency?: string
  locale?: string
  badge?: string
  badgeColor?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  selected?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<ItemCardProps>(), {
  subtitle: '',
  image: '',
  price: undefined,
  currency: 'USD',
  locale: 'en-US',
  badge: '',
  badgeColor: 'neutral',
  selected: false,
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

const formattedPrice = computed(() => {
  if (props.price === undefined) return ''
  return new Intl.NumberFormat(props.locale, { style: 'currency', currency: props.currency }).format(props.price)
})
</script>
