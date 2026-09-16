<template>
  <div>
    <div v-if="items.length === 0" class="py-8 text-center text-sm text-gray-400">
      <slot name="empty">Cart is empty.</slot>
    </div>

    <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
      <div v-for="item in items" :key="item.id" class="flex items-center gap-3 py-3">
        <div class="min-w-0 flex-1">
          <slot name="item" :item="item">
            <p class="truncate text-sm font-medium text-gray-800 dark:text-white/90">{{ item.label }}</p>
            <p class="text-xs text-gray-400">{{ formatCurrency(item.unitPrice) }}</p>
          </slot>
        </div>

        <QuantityInput
          class="w-32"
          :model-value="item.quantity"
          :min="0"
          @update:model-value="(quantity) => updateQuantity(item.id, quantity)"
        />

        <p class="w-24 shrink-0 text-right text-sm font-medium text-gray-800 dark:text-white/90">
          {{ formatCurrency(item.unitPrice * item.quantity) }}
        </p>

        <button
          type="button"
          class="hover:text-error-500 shrink-0 text-gray-400"
          aria-label="Remove item"
          @click="remove(item.id)"
        >
          ✕
        </button>
      </div>
    </div>

    <div
      v-if="items.length"
      class="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-sm font-semibold dark:border-gray-800"
    >
      <span class="text-gray-600 dark:text-gray-300">Total</span>
      <span class="text-gray-800 dark:text-white/90">{{ formatCurrency(total) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import QuantityInput from '../input/QuantityInput.vue'

export interface CartItem {
  id: string | number
  label: string
  unitPrice: number
  quantity: number
  [key: string]: unknown
}

interface CartProps {
  items: CartItem[]
  currency?: string
  locale?: string
}

const props = withDefaults(defineProps<CartProps>(), {
  currency: 'USD',
  locale: 'en-US',
})

const emit = defineEmits<{
  'update:items': [items: CartItem[]]
  remove: [id: string | number]
}>()

const total = computed(() => props.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))

const currencyFormatter = computed(
  () => new Intl.NumberFormat(props.locale, { style: 'currency', currency: props.currency }),
)

function formatCurrency(value: number): string {
  return currencyFormatter.value.format(value)
}

function updateQuantity(id: string | number, quantity: number) {
  if (quantity <= 0) {
    remove(id)
    return
  }
  emit(
    'update:items',
    props.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
  )
}

function remove(id: string | number) {
  emit(
    'update:items',
    props.items.filter((item) => item.id !== id),
  )
  emit('remove', id)
}
</script>
